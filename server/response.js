// Extend the ServerResponse prototype with simple response methods

var proto = require('http').ServerResponse.prototype;

proto.simpleResponse = function(code, body, contentType, encoding, headers) {
	this.writeHead(code, (headers || []).concat(
                       [ ["Content-Type", contentType],
                         ["Content-Length", body.length]
                       ]));
	this.write(body, encoding);
	this.end();
}

proto.notFound = function(message) {
	this.simpleText(404, (message || "Not Found\n") + "");
};

// Performs an HTTP 302 redirect
proto.redirect = function redirect(location) {
	this.writeHead(302, {"Location": location});
	this.end();
};

proto.simpleText = function (code, body, headers) {
	this.simpleResponse(code, body, "text/plain", "utf8", headers);
};

proto.simpleHtml = function (code, body, headers) {
	this.simpleResponse(code, body, "text/html", "utf8", headers);
};

proto.simpleJson = function (code, json, headers) {
	this.simpleResponse(code, JSON.stringify(json), "application/json", "utf8", headers);
};
    
