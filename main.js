/*** Main UI Setup ***/
jQuery(function($) {
	$('#tabs').tabs();
});


/*** Info/Controls UI Agent ***/
(function($) {

	$(document)
		// Now playing indicator
		.bind('playing', function(event, msg) {
			if ( msg && msg.title ) {
				$('#nowplaying').text(msg.title);
			}
		})
		.bind('stopped', function(event) {
			$('#nowplaying').text('');
		})
		
		.ready(function() {
			// Stop button
			$('#stop').bind('click', function() {
				$(document).trigger('stop');
			});
		});

})(jQuery);


/*** Click-n-Trigger Agent ***/
(function($) {

	$('a, :button').live('click', function() {
		var type = $(this).closest('[data-trigger]').attr('data-trigger');
		if ( type ) {
			$(this).trigger(type);
		}
	});

})(jQuery);


/*** Content Loading Agent ***/
(function($) {

	$('.load').live('load', function(event) {
		$('> .content', this).each(function() {
			var content = this,
				cgi = $('#cgibin').attr('content'),
				msg = {
					action: $(event.target).closest('[data-load]').attr('data-load'),
					val: $(event.target).closest('[data-val]').attr('data-val')
				};

			$.get(cgi + msg.action + '?' + msg.val, function(data) {
				msg.data = data;
				$(content).empty().trigger('loaded', [ msg ]);
			}, 'text');
		});
	});
	
	// Perform initial load
	$(document).ready(function() {
		$('.load').trigger('load');
	});

})(jQuery);


/*** Play/Stop Agent - launch/kill media players ***/
(function($) {

	$(document)
		.bind('play', function(event) {
			var cgi = $('#cgibin').attr('content'),
				msg = {
					action: $(event.target).closest('[data-play]').attr('data-play'),
					val: $(event.target).closest('[data-val]').attr('data-val') || "",
					title: $(event.target).closest('[data-title]').attr('data-title')
				};

			$(document)
				.one('stopped', function() {
					$.post(cgi + msg.action + '?' + msg.val, function(data) {
						msg.data = data;
						$(document).trigger('playing', [ msg ]);
					});
				})
				.trigger('stop');
		})

		.bind('stop', function(event) {
			var cgi = $('#cgibin').attr('content');

			$.post(cgi+'stop.sh', function() {
				$(document).trigger('stopped');
			});
		});

})(jQuery);

