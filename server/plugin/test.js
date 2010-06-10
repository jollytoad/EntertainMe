var sys = require('sys'),
	ws = require('websocket');

exports.message = function() {
	sys.log("Test Plugin: message");
};

exports.test = function() {
	sys.log("Test Plugin: test");
};

exports.broadcast = function(data) {
	sys.log("Test Plugin: broadcast");
	ws.broadcast(JSON.stringify(data));
};

