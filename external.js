(function($) {

	$(document)
		
		.bind('eject', function(event) {
			var cgi = $('#cgibin').attr('content');
			$.post(cgi + 'eject.sh');
		});

})(jQuery);

