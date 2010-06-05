var sys = require('sys'),
	fs = require('fs');

exports.PUT = function(req, res) {
	var data = "";
	
	if ( req.splitPath[2] === "stations" ) {
		sys.puts('Write stations');
		
		var file = fs.createWriteStream(req.root + '/cache/liveradio-stations.json');

		req.addListener('data', function(chunk) {
			file.write(chunk);
		});
		
		req.addListener('end', function() {
			file.end();
			res.writeHead(201);
			res.end();
		});
	}
};

exports.GET = function(req, res) {
	if ( /^stations(.json)?$/.test(req.splitPath[2]) ) {
		res.readFile(req.root + '/cache/liveradio-stations.json');
	}
};

