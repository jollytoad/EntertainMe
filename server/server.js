var server = require('./ws').createServer(),
	pluginRequestHandler = require('./plugin-router').requestHandler,
	root = require('path').dirname(__dirname);

server.addListener('request', function(req, res) {
	req.root = root;

	// Redirect "/" internally
	if ( req.url === "/" ) {
		req.url = "/client/index.html";
    }

    pluginRequestHandler.apply(this, arguments);
});

server.listen(8088);

