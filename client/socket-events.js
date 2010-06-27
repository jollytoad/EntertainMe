(function($) {
	
	function open() {
		console.log("Opening Web Socket");

		var ws = new WebSocket("ws://" + location.host + "/");

		ws.addEventListener('open', function() {
			console.log("WebSocket open.");
			$(document).trigger('socketReady', [ ws ]);
		});

		ws.addEventListener('message', function(msg) {
			console.log( "WebSocket message: ", msg);
			var data = JSON.parse(msg.data);
			if ( data && data.event ) {
				$(data.target || document).trigger(data.event, data.args);
			}
		});

		ws.addEventListener('close', function() {
			console.log("WebSocket closed.");
			window.setTimeout(open, 5000);
		});
	}

	$(function() {
		window.setTimeout(open, 0);
	})

})(jQuery);

