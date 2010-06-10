var sys = require('sys'),
	Buffer = require('buffer').Buffer,
	startFrame = new Buffer([0]),
	endFrame = new Buffer([255]),
	clients = {},
	clientCount = 0;

exports.broadcast = function(msg) {
	if ( typeof msg === "object" ) {
		msg = JSON.stringify(msg);
	}
	for(var id in clients) {
		clients[id].write(msg);
	}
};

exports.listen = function(server) {
	server.addListener('upgrade', function(req, socket, head) {
		if ( req.headers.upgrade && req.headers.upgrade.toLowerCase() === "websocket" ) {

			sys.log("WebSocket Upgrade");

			var clientId = clientCount++,
				origin = req.headers.origin,
				location = "ws://" + req.headers.host + "/",
				reply = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n"
					+ "Upgrade: WebSocket\r\n"
					+ "Connection: Upgrade\r\n"
					+ "WebSocket-Origin: "+origin+"\r\n"
					+ "WebSocket-Location: "+location+"\r\n"
					+ "\r\n";

			socket.setTimeout(0);
			socket.write(reply, "utf8");
			socket.flush();

			var connection = {
				socket: socket,
				clientId: clientId,
				write: function(data) {
					socket.write(startFrame, "binary");
					socket.write(data, "utf8");
					socket.write(endFrame, "binary");
					socket.flush();
				}
			};
			clients[clientId] = connection;
			
			var msg = "";

			socket.addListener('error', function(err) {
				sys.log("WebSocker error: " + err);
			});

			socket.addListener('data', function(chunk) {
				sys.puts(chunk);
				var offset = 0;
				for (var i = 0; i < chunk.length; i++) {
					if ( chunk[i] === 0 && msg === "" ) {
						offset = i+1;
					}
					if ( chunk[i] === 255 ) {
						msg += chunk.toString('utf8', offset, i);
						sys.log(msg);
						server.emit("message", msg, connection);
						msg = "";
						offset = i+1;						
					}
				}
				msg += chunk.toString('utf8', offset, chunk.length);
			});
		
			socket.addListener('close', function() {
				sys.log("WebSocket Closed");
				delete clients[clientId];
				server.emit('wsclose');
			});
			
			sys.log("WebSocket Handshake");
		}
	});
};

