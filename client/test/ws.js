(function($) {

	$(document).bind('socketReady', function(event, ws) {
		console.log("Socket Ready");
		ws.send(JSON.stringify({ cmd: 'test' }));
		ws.send(JSON.stringify({ cmd: 'test.test' }));
		ws.send(JSON.stringify({ cmd: 'test.broadcast', blah: "Blah" }));
	});

})(jQuery);

