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


/*** Tabpanel Keyboard Shortcuts Agent ***/
(function($) {

	$(document)
		.bind('keydown', function(event) {
			var num = event.keyCode - 48;

			if ( num >= 1 && num <= 9 ) {
				$('#tabs > .ui-tabs-nav > li:eq(' + (num-1) +') > a').click();
			}
		})
		
		.ready(function() {
			// Prepend numbers to tab text
			$('#tabs > ul > li > a').prepend(function(i) {
				return (i+1) + ': ';
			});
		});

})(jQuery);


/*** Keyboard Navigation Agent ***/
(function($) {

	$(document)
		.bind('keydown', function(event) {
			var kc = $.ui.keyCode;

			switch (event.keyCode) {
				case kc.LEFT:
				case kc.RIGHT:
					event.preventDefault();
					$('#tabs > ul > li.ui-state-active')[event.keyCode === kc.LEFT ? 'prev' : 'next']().find('a').click();
					break;
				
				case kc.UP:
				case kc.DOWN:
					event.preventDefault();
					var all = $('#tabs > .ui-tabs-panel:visible :focusable:not(.nonav)'),
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


/*** Keyboard Item Selection Agent ***/
(function($) {

	$(document)
		.bind('keydown', function(event) {
			if ( event.keyCode === $.ui.keyCode.INSERT ) {
				$(document.activeElement).closest('li').find(':checkbox').click();
			}
		});

})(jQuery);


/*** Keyboard Shortcut Agent ***/
(function($) {

	$(document)
		.bind('keydown', function(event) {
			var combo = $.keys.combo(event);
			if ( combo && $('[data-key='+combo+']:visible').click().size() > 0 ) {
				event.preventDefault();
			}
		});

})(jQuery);

