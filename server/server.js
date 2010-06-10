require.paths.unshift(__dirname);

var server = require('http').createServer(),
	plugin = require('plugin-router'),
	ws = require('websocket'),
	root = require('path').dirname(__dirname);

server.addListener('request', function(req, res) {
	req.root = root;

	// Redirect "/" internally
	if ( req.url === "/" ) {
		req.url = "/client/index.html";
    }

    plugin.requestHandler.apply(this, arguments);
});

server.addListener('message', plugin.messageHandler);

ws.listen(server);
server.listen(8088);

