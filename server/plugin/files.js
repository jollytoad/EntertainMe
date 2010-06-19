var sys = require('sys'),
	fs = require('fs'),
	mime = require('mime'),
	media = require('media');

function Item(title, path, list) {
	this.title = title;
	if ( path ) {
		this.path = path;
	}
	if ( list ) {
		this.list = list;
	}
	this._items = {};
	this._items.toJSON = function() {}; // Prevent _items from being serialized in JSON
}

Item.prototype.add = function(item) {
	if ( !Array.isArray(this.list) ) {
		this.list = [];
	}
	this.list.push(item);
	this._items[item.title] = item;
};

Item.prototype.get = function(title) {
	var item = this._items[title];
	if ( !item ) {
		item = new Item(title);
		this.add(item);
	}
	return item;
};

function subdivide(title) {
	var i = title.indexOf("Series");
	return i > 0 ? [ title.slice(0,i), title.slice(i) ] : [ title ];
}

exports.GET = function(req, res) {
	var relpath = req.parsedUrl.pathname,
		abspath = req.root + relpath;
	
	sys.puts("file listing: " + abspath);
	
	fs.readdir(abspath, function(error, files) {
		if (error) {
			sys.puts(error);
			res.simpleJson(/ENOENT/.test(error) ? 404 : 500, error);
			return;
		}
		
		var root = new Item(mime.title(relpath), relpath, []),
			remaining = files.length,
			i = remaining;
		
		function done() {
			res.simpleJson(200, root);
		}
		
		if (!i) {
			done();
			return;
		}

		while (i--) {
			(function(filename) {
				fs.stat(abspath+"/"+filename, function(err, stats) {
					var item = root,
						title = mime.title(filename);
					
					if ( title ) {
						if ( stats.isDirectory() ) {
							subdivide(title).forEach(function(subtitle) {
								item = item.get(subtitle);
							});
							item.list = true;
						}
					
						if ( stats.isFile() ) {
							item = item.get(title);
							item.mime = mime.lookup(filename);
						}
					
						item.path = relpath + "/" + filename;

						if ( item.title !== title ) {
							item.fullTitle = title;
						}
					}

					if (!(--remaining)) {
						done();
					}
				});
			})(files[i]);
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

