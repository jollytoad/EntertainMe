/*global jQuery, document */

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

	$('a, :button').live('click', function(event) {
		var o = $(this).closest('[data-trigger]'),
			type = o.attr('data-trigger');

		if ( type ) {			
			if ( o.hasClass('target-active') ) {
				$(document.activeElement).not('.lock').trigger(type, [ this ]);
			} else {
				$(this).trigger(type);
			}
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

			$.get(msg.action + '?' + msg.val, function(data) {
				msg.data = data;
				$(content).empty().trigger('loaded', [ msg ]);
			});
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
					action: $(event.target).closest('[data-load]').attr('data-load'),
					title: $(event.target).closest('[data-title]').attr('data-title')
				};

			$(document)
				.one('stopped', function() {
					$.post(msg.action + '?play', function(data) {
						msg.data = data;
						$(document).trigger('playing', [ msg ]);
					});
				})
				.trigger('stop');
		})

		.bind('stop', function(event) {
			var cgi = $('#cgibin').attr('content');

			$.post('/stop', function() {
				$(document).trigger('stopped');
			});
		});

})(jQuery);

/*** Ask whether TV programme should be archived after watching ***/
/*
jQuery(function($) {
	$('#tv')
		.bind('play', function(event) {
			var cgi = $('#cgibin').attr('content'),
				dialog = $('#tv-archive-dialog'),
				src = $(event.target).closest('[data-val]').attr('data-val') || "",
				title = $(event.target).closest('[data-title]').attr('data-title'),
				dst = src.replace('TV/', 'Archive/');

			function done() {
				dialog.unbind('keydown').dialog('close');
			}

			function archive() {
				$.post(cgi + 'file-archive.sh?' + src + ';' + dst, function() {
					$("#tv, #archive").trigger('load');
				});
				done();
			}

			$('.name', dialog).text(title);

			dialog
				.dialog({
					resizable: false,
					height: 140,
					modal: true,
					overlay: {
						backgroundColor: '#000',
						opacity: 0.5
					},
					buttons: {
						'Yes': archive,
						'No': done
					}
				})
				.bind('keydown.key:enter', archive);
		});
})(jQuery);
*/

