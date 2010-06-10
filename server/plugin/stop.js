var media = require('media');

exports.POST = function(req, res) {

	media.stop();
	res.simpleText(200, "Stopped");

};

