var net = require("net");
var sys = require("sys");

exports.connect = function(host, port) {
	var stream,
		encoding = "UTF8",
		queue = [];
	
	function next() {
		if ( queue.length ) {
			queue.shift()();
		}
	}
	
	function send(cmd, callback) {
		queue.push(function() {
			var version,
				response = "";

			function write() {
				sys.puts("mpd send: " + cmd);
				stream.write(cmd+"\n", encoding);
			}
			
			if ( stream ) {
				write();
			} else {
				stream = net.createConnection(port || 6600, host);
				stream.setEncoding(encoding);
			
				stream.addListener("data", function(data) {
					var m;
					sys.puts("mpd recv: " + data.replace(/\n/g, "\\n"));

					if ( stream.mpdVersion ) {
						m = /^(OK|ACK)(.*)$/m.exec(data);
						if ( m ) {
							sys.puts("mpd end of response");
							response += data.slice(0, m.index);
							callback(m[1] == "ACK" && m[2].trim, response, stream.mpdVersion);
							next();
						} else {
							sys.puts("mpd awaiting more data");
							response += data;
						}
					} else {
						m = /^OK MPD (.+)$/m.exec(data);
						if ( !m ) {
							throw "Unexpected MPD response: " + data;
						}
						stream.mpdVersion = m[1];
						write();
					}
				});
		
				stream.addListener("close", function(data) {
					stream = undefined;
					next();
				});
			}
			return stream;
		});
		
		if ( queue.length === 1 ) {
			next();
		}
	}
		
	var cmds = {
		send: send
	};
	
	function cmd(name, hasSideEffect, process) {
		cmds[name] = process ?
			function(callback) {
				send(name, function(error, response) {
					callback(error, error ? response : process(response));
				});
			} :
			function(callback) {
				send(name, callback);
			};
		cmds[name].hasSideEffect = hasSideEffect;
	}
	
	cmd("close", true);
	cmd("kill", true);
	cmd("ping", false);

	cmd("outputs", false);
	cmd("enableoutput", true);
	cmd("disableoutput", true);
	
	cmd("listplaylists", false, function(res) {
		return res.trim()
			.split("\n")
			.map(function(line) {
				var m = /^playlist: (.+)$/.exec(line);
				return m && m[1];
			})
			.filter(function(x) { return x; });
	});

	return cmds;
};

