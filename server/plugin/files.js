var sys = require('sys'),
	fs = require('fs'),
	mime = require('mime'),
	media = require('media');

exports.GET = function(req, res) {
	var abspath = req.root + req.parsedUrl.pathname;
	
	sys.puts("file listing: " + abspath);
	
	fs.readdir(abspath, function(error, files) {
		if (error) {
			sys.puts(error);
			res.simpleJson(/ENOENT/.test(error) ? 404 : 500, error);
			return;
		}
		
		var fileMap = {},
			remaining = files.length,
			i = remaining;
		
		function done() {
			res.simpleJson(200, { path: req.parsedUrl.pathname, files: fileMap });
		}
		
		if (!i) {
			done();
			return;
		}

		while (i--) {
			(function(filename, fullpath) {
				fs.stat(fullpath, function(err, stats) {
					var info = {};
					
					if ( stats.isFile() ) {
						info.file = true;
						info.mime = mime.lookup(filename);
					} else if ( stats.isDirectory() ) {
						info.dir = true;
					}
					
					fileMap[filename] = info;
					
					if (!(--remaining)) {
						done();
					}
				});
			})(files[i], abspath + "/" + files[i]);
		}		
	});
};

exports.POST = function(req, res) {
	var query = req.parsedUrl.query,
		abspath = req.root + req.parsedUrl.pathname;
	
	if (query === 'play') {
		sys.puts('play: ' + abspath);
		
		media.play(abspath, function(player) {
			res.simpleText(200, player.playerName);
		});
	}
};

exports.MOVE = function(req, res) {
	var srcpath = req.root + req.parsedUrl.pathname,
		dstpath = req.root + req.headers.destination;

	sys.puts('move: ' + srcpath + ' -> ' + dstpath);

	if ( /\.\./.test(srcpath) || /\.\./.test(dstpath) || !/^\/files\/[^\/]+\/.+/.test(req.headers.destination) || srcpath === dstpath ) {
		sys.puts("Forbidden");
		res.writeHead(403);
		res.end();
	} else {		
		fs.rename(srcpath, dstpath, function(err) {
			if (err) {
				sys.puts(err);
				if ( /ENOENT/.test(err) ) res.notFound();
				else res.simpleText(403, err);
			} else {
				res.writeHead(201, [ ["Location", req.headers.destination] ]);
				res.end();
			}
		});
	}
};

