var mpc = require("mpd-client").connect("192.168.1.102"),
	sys = require("sys");

function mpdCmdHandler(sideEffect) {
	return function(req, res) {
		var cmdName = req.splitPath[2],
			cmd = mpc[cmdName];

		sys.puts("MPD: " + cmdName);
	
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

exports.GET = mpdCmdHandler(false);
exports.POST = mpdCmdHandler(true);

