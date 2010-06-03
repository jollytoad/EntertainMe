var fs = require('fs'),
	path = require('path'),
	mime = require('../mime'),
	sys = require('sys');

exports.GET = function(req, res) {
	var filename = req.splitPath.slice(2).join("/"),
		pathname = req.root + "/client/" + filename,
		contentType = mime.lookup(filename),
		encoding = /^text/.test(contentType) ? 'utf8' : 'binary';

	sys.log(pathname);
	
	fs.readFile(pathname, encoding, function (err, data) {
		if (err) {
			sys.log(err);
			res.notFound(err);
		} else {
			res.simpleResponse(200, data, contentType, encoding);
		}
	});
};

