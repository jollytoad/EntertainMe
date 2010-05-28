var router = require("./node-router"),
	fu = router.getServer(),
	mime = require("./mime"),
	fs = require("fs"),
    sys = require("sys"),
    path = require("path"),
    url = require("url"),
    childProcess = require("child_process"),
    media = require("./media"),
    mpc = require("./mpd").connect("192.168.1.102");

var player;

fu.get("/", router.staticHandler('client/index.html'));
fu.get(/^\/client\/.+$/, router.staticDirHandler('.', '/'));

fu.get(/^\/(files\/.*)$/, function(req, res, pathname) {
	
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
			})(files[i], path.join(pathname, files[i]));
		}		
	});
});

fu.post(/^\/(files\/.*)$/, function(req, res, fullname) {
	var query = url.parse(req.url).query;
	
	if (query === 'play') {
		sys.puts('play: ' + fullname);
		
		player = media.play(fullname, function(player) {
			res.simpleText(200, player.playerName);
		});
	}
});

function mpdCmdHandler(sideEffect) {
	return function(req, res, cmdName) {
		sys.puts("MPD: " + cmdName);
		var cmd = mpc[cmdName];
	
		if ( cmd && cmd.hasSideEffect === sideEffect ) {
			cmd(function(error, msg) {
				if ( error ) {
					sys.puts(error);
					res.simpleJson(500, error);
				} else {
					res.simpleJson(200, msg);
				}
			});
		} else {
			res.notFound();
		}
	};
}

fu.get(/^\/mpd\/(.*)$/, mpdCmdHandler(false));
fu.post(/^\/mpd\/(.*)$/, mpdCmdHandler(true));

fu.post('/stop', function(req, res) {
	media.stop(player);
	res.simpleText(200, "Stopped");
});

fu.listen(8088);

