var sys = require('sys'),
	parse = require('url').parse;

require('response');

exports.pluginPath = 'plugin/';

exports.plugins = {};

exports.log = function(req, msg) {
	sys.puts(req.method + " " + req.url);
};

function getHandler(pluginName, methodName, fallback) {
	var plugin;

	if ( pluginName ) {
		// Lookup loaded plugin
		plugin = exports.plugins[pluginName];
		
		if ( plugin === undefined ) {
			try {
				// Attempt to load plugin module
				exports.plugins[pluginName] = plugin = require(exports.pluginPath + pluginName);
			} catch (e) {
				// Record false for unfound module, so we don't attempt to load it again
				exports.plugins[pluginName] = false;
			}
		}
	}
	
sys.log("plugin: " + exports.pluginPath + pluginName + " " + (plugin ? 'found' : 'unknown'));
	
		// Check for the HTTP method as a function in the plugin
	if ( plugin ) {
		return plugin[methodName] || plugin[fallback];
	}
}

exports.requestHandler = function(req, res) {
	req.parsedUrl = parse(req.url);
	req.splitPath = req.parsedUrl.pathname.split('/');
	req.pluginName = req.splitPath[1];

	exports.log(req);

	var handler = getHandler(req.pluginName, req.method, 'request');
	if ( handler ) {
		handler(req, res);
		return;
	}
	res.notFound();
};

exports.messageHandler = function(msg, conn) {
	sys.log("WS MSG: " + msg);
	var data;
	try {
		data = JSON.parse(msg);
	} catch (e) {
		sys.log("Invalid JSON message: " + msg);
	}
	
	if ( data && data.cmd ) {
		sys.log("Cmd: " + data.cmd);
		var splitCmd = data.cmd.split('.'),
			handler = getHandler(splitCmd[0], splitCmd[1], 'message');
		
		if ( handler ) {
			handler(data, conn);
		}
	}
};

