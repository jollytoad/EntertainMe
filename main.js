/*** Main UI Setup ***/
jQuery(function($) {
	$('#tabs').tabs();
});


/*** Info/Controls UI Agent ***/
(function($) {

	$(document)
		// Now playing indicator
		.bind('playing', function(event, title, val) {
			$('#nowplaying').text(title);
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

	$('[data-trigger] a').live('click', function() {
		$(this).trigger($(this).closest('[data-trigger]').attr('data-trigger'));
	});

})(jQuery);


/*** Content Loading Agent ***/
(function($) {

	$('.load').live('load', function(event) {
		$('.content', this).each(function() {
			var content = this,
				cgi = $('#cgibin').attr('content'),
				action = $(event.target).closest('[data-load]').attr('data-load'),
				val = $(event.target).closest('[data-val]').attr('data-val');

			$.get(cgi + action + '?' + val, function(data) {
				$(content).empty().trigger('loaded', [ data, val ]);
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
				action = $(event.target).closest('[data-play]').attr('data-play'),
				val = $(event.target).closest('[data-val]').attr('data-val'),
				title = $(event.target).closest('[data-title]').attr('data-title');

			$(document)
				.one('stopped', function() {
					$.post(cgi + action + '?' + val, function() {
						$(document).trigger('playing', [ title, val ]);
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


/*** Keyboard Navigation Agent ***/
(function($) {

	$(document)
		.bind('keyup', function(event) {
			var kc = $.ui.keyCode,
				num = event.keyCode - 48;

			if ( num >= 0 && num <= 9 ) {
				$('#tabs > .ui-tabs-nav > li:eq(' + num +') > a').click();
			}

			switch (event.keyCode) {
				case kc.LEFT:
				case kc.RIGHT:
					event.preventDefault();
					$('#tabs > ul > li.ui-state-active')[event.keyCode === kc.LEFT ? 'prev' : 'next']().find('a').click();
					break;
				
				case kc.UP:
				case kc.DOWN:
					event.preventDefault();
					var all = $('#tabs > .ui-tabs-panel:visible :focusable'),
						i = all.index(document.activeElement);
						
					if ( event.keyCode === kc.UP ) {
						all.eq(i >= 0 ? i-1 : -1).focus();
					} else {
						all.eq(i >= 0 ? (i+1) % all.length : 0).focus();
					}
					break;
			}
		});

})(jQuery);

