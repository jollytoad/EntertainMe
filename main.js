jQuery(function($) {
	var cgi = 'cgi-bin/';

	$('#tabs').tabs();
	
	$('#stop').bind('click', function() {
		$(document).trigger('stop');
	});

	$('li.play > a').live('click', function(event) {
		$(this).trigger('play');
	});

	$(document)
		.bind('play', function(event) {
			var action = $(event.target).closest('[data-play]').attr('data-play'),
				query = $(event.target).closest('[data-val]').attr('data-val'),
				title = $(event.target).closest('[data-title]').attr('data-title');

			$(document)
				.one('stopped', function() {
					$.post(cgi + action + '?' + query);
					$('#nowplaying').text(title);
				})
				.trigger('stop');
		})

		.bind('stop', function(event) {
			$.post(cgi+'stop.sh', function() {
				$(document).trigger('stopped');
			});
			$('#nowplaying').text("");
		})

		.bind('keyup', function(event) {
			var num = event.keyCode - 48;
			if ( num >= 0 && num <= 9 ) {
				$('#tabs > .ui-tabs-nav > li:eq(' + num +') > a').click();
			}
		})

		.bind('keydown.key:left', function(event) {
			event.preventDefault();
			$('#tabs > ul > li.ui-state-active').prev().find('a').click();
		})

		.bind('keydown.key:right', function(event) {
			event.preventDefault();
			$('#tabs > ul > li.ui-state-active').next().find('a').click();		
		})

		.bind('keydown.key:down', function(event) {
			var all = $('#tabs > .ui-tabs-panel:visible :focusable'),
				i = all.index(document.activeElement);
			
			all.eq(i >= 0 ? i+1 % all.length : 0).focus();

			event.preventDefault();
		})

		.bind('keydown.key:up', function(event) {
			var all = $('#tabs > .ui-tabs-panel:visible :focusable'),
				i = all.index(document.activeElement);
			
			all.eq(i >= 0 ? i-1 : -1).focus();
			
			event.preventDefault();
		});

});

