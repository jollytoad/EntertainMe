HOST = null; // localhost
PORT = 8088;

var fu = require("./fu"),
	mime = require("./mime"),
	fs = require("fs"),
    sys = require("sys"),
    path = require("path"),
    url = require("url"),
    media = require("./media");

var playing;

fu.listen(PORT, HOST);

fu.staticFiles({
	"/":                "client.html",
	"/tree":			"file-browser.html",
	"/main.css":        "main.css",
	"/main.js":         "main.js",
	"/client.js":		"client.js",
	"/keys.js":         "keys.js",
	"/files.js":        "files.js",
	"/radio.js":        "radio.js",
	"/music.js":        "music.js",
	"/external.js":     "external.js",
	"/jquery.js":       "ext/jquery-1.4.1.min.js",
	"/jquery.tmpl.js":  "ext/jquery.tmpl.js",
	"/jquery-ui.css":   "ext/jquery-ui.css",
	"/jquery-ui.js":    "ext/jquery-ui.min.js",
	"/jquery.keys.js":  "ext/jquery.keys.js",
	"/config.json":     "config.json"
});

fu.get("/files", function(req, res, dir) {
	var basedir = "files"+dir;
	
	sys.puts("file listing: " + basedir);
	
	fs.readdir(basedir, function(err, files) {
		if (err) {
			sys.puts(err);
			res.simpleJSON(/ENOENT/.test(err) ? 404 : 500, { error: err });
			return;
		}
		
		var fileMap = {},
			remaining = files.length,
			i = remaining;
		
		function done() {
			res.simpleJSON(200, { baseUrl: '/'+basedir, dir: dir, files: fileMap });
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
			})(files[i], path.join(basedir, files[i]));
		}		
	});
});

fu.post("/files", function(req, res, file) {
	var query = url.parse(req.url).query,
		fullname = "files" + file;
	
	if (query === 'play') {
		sys.puts('play: ' + fullname);
		
		playing = media.play(fullname);
	}
});

fu.post('/stop', function(req, res) {
	media.stop(playing);
	res.simpleText(200, "Stopped");
});

