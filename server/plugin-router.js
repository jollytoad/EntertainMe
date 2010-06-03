var sys = require('sys'),
	parse = require('url').parse;

require('./response');

exports.pluginPath = './plugin/';

exports.plugins = {};

exports.log = function(req) {
	sys.puts(req.method + " " + req.url);
};

exports.requestHandler = function(req, res) {
	var url = parse(req.url),
		path = url.pathname.split('/'),
		pluginName = path[1];

	exports.log(req);

	if ( pluginName ) {
		// Lookup loaded plugin
		var plugin = exports.plugins[pluginName];
		
		if ( plugin === undefined ) {
			try {
				// Attempt to load plugin module
				exports.plugins[pluginName] = plugin = require(exports.pluginPath + pluginName);
			} catch (e) {
				// Record false for unfound module, so we don't attempt to load it again
				exports.plugins[pluginName] = false;
			}
		}

		// Check for the HTTP method as a function in the plugin
		if ( plugin && plugin[req.method] ) {
			req.parsedUrl = url;
			req.splitPath = path;
			plugin[req.method](req, res);
			return;
		}
	}
	res.notFound();
};

