var createServer = require("http").createServer,
	readFile = require("fs").readFile,
	sys = require("sys"),
	url = require("url"),
	dirname = require("path").dirname,
	mime = require("./mime");

DEBUG = false;

var fu = exports;

var NOT_FOUND = "Not Found\n";

function notFound(req, res) {
  res.writeHead(404, { "Content-Type": "text/plain"
                     , "Content-Length": NOT_FOUND.length
                     });
  res.end(NOT_FOUND);
}

var httpMap = {};

fu.http = function (method, path, handler) {
	method = method.toUpperCase();
	if ( !httpMap[method] ) {
		httpMap[method] = {};
	}
	httpMap[method][path] = handler;
};

fu.get = function (path, handler) {
	fu.http('GET', path, handler);
	fu.http('HEAD', path, handler);
};
fu.post = function (path, handler) {
	fu.http('POST', path, handler);
};

var server = createServer(function (req, res) {
	sys.puts(req.method + " " + req.url);
	if ( httpMap[req.method] ) {
		var fullpath = url.parse(req.url).pathname,
			path = fullpath,
			handler;
		
		do {
		   	handler = httpMap[req.method][path];
		   	if (!handler) {
			   	path = dirname(path);
			   	if (!path || path == "/") {
			   		handler = notFound;
			   	}
			}
		} while(!handler);

		res.simpleText = function (code, body) {
			res.writeHead(code, {
				"Content-Type": "text/plain",
		        "Content-Length": body.length
			});
			res.end(body);
		};

		res.simpleJSON = function (code, obj) {
			var body = JSON.stringify(obj);
		 	res.writeHead(code, {
		 		"Content-Type": "application/json",
		        "Content-Length": body.length
		    });
		    res.end(body);
		};

		handler(req, res, fullpath.slice(path.length));
	}
});

fu.listen = function (port, host) {
  server.listen(port, host);
  sys.puts("Server at http://" + (host || "127.0.0.1") + ":" + port.toString() + "/");
};

fu.close = function () { server.close(); };

function extname (path) {
  var index = path.lastIndexOf(".");
  return index < 0 ? "" : path.substring(index);
}

fu.staticHandler = function (filename) {
  var body, headers;
  var content_type = mime.lookup(filename);

  function loadResponseData(callback) {
    if (body && headers && !DEBUG) {
      callback();
      return;
    }

    sys.puts("loading " + filename + "...");
    readFile(filename, function (err, data) {
      if (err) {
        sys.puts("Error loading " + filename);
      } else {
        body = data;
        headers = { "Content-Type": content_type
                  , "Content-Length": body.length
                  };
        if (!DEBUG) headers["Cache-Control"] = "public";
        sys.puts("static file " + filename + " loaded");
        callback();
      }
    });
  }

  return function (req, res) {
    loadResponseData(function () {
      res.writeHead(200, headers);
      res.end(body);
    });
  }
};

fu.staticFiles = function(map) {
	for(path in map) {
		if ( map.hasOwnProperty(path) ) {
			fu.get(path, fu.staticHandler(map[path]));
		}
	}
};

