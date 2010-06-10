var sys = require('sys'),
	http = require('http'),
	url = require('url');

exports.request = function(req, res) {
	var remoteUrl = url.parse(req.parsedUrl.query);
	
	sys.puts('PROXY REQUEST: ' + req.method + ' ' + remoteUrl.href);

//	sys.puts('client: ' + (remoteUrl.port || "80") + ' ' + remoteUrl.hostname);
	var client = http.createClient(remoteUrl.port || "80", remoteUrl.hostname);
	
	// Set the correct host in the headers before passing into remote request
	req.headers.host = remoteUrl.hostname;

//	sys.puts('request: ' + req.method + ' ' + (remoteUrl.pathname || "") + (remoteUrl.search || ""));
//	sys.puts('headers: ' + JSON.stringify(req.headers));
	var request = client.request(req.method, (remoteUrl.pathname || "") + (remoteUrl.search || ""), req.headers);
	
	req.addListener('data', function(chunk) {
		request.write(chunk);
	});

	req.addListener('end', function() {
		request.end();
	});

	request.addListener('response', function (response) {
//		sys.puts('STATUS: ' + response.statusCode);
//		sys.puts('HEADERS: ' + JSON.stringify(response.headers));
		
		res.writeHead(response.statusCode, response.headers);

		response.addListener('data', function (chunk) {
			res.write(chunk);
		});

		response.addListener('end', function() {
			res.end();
		});
	});
};

