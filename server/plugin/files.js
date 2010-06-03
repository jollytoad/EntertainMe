var sys = require('sys'),
	fs = require('fs'),
	mime = require('../mime'),
	media = require('../media');

exports.GET = function(req, res) {
	var pathname = req.splitPath.slice(1).join('/');
	
	sys.puts("file listing: " + pathname);
	
	fs.readdir(pathname, function(error, files) {
		if (error) {
			sys.puts(error);
			res.simpleJson(/ENOENT/.test(error) ? 404 : 500, error);
			return;
		}
		
		var fileMap = {},
			remaining = files.length,
			i = remaining;
		
		function done() {
			res.simpleJson(200, { path: '/'+pathname, files: fileMap });
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
			})(files[i], pathname + "/" + files[i]);
		}		
	});
};

exports.POST = function(req, res) {
	var query = req.parsedUrl.query,
		pathname = req.splitPath.slice(1).join('/');
	
	if (query === 'play') {
		sys.puts('play: ' + pathname);
		
		media.play(pathname, function(player) {
			res.simpleText(200, player.playerName);
		});
	}
};

