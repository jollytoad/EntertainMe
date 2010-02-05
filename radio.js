/*** Radio List Populator Agent - parse list of radio stations from get_iplayer and generate markup ***/
(function($) {

	$('#radio .content').live('loaded', function(event, msg) {
		var content = this;

		$.each(msg.data.split(/\r?\n/), function(i, line) {
			var p = line.split("|");
			if ( /radio/.test(p[0]) && /^[a-z_]+$/.test(p[1]) ) {

				$('<li/>', { 'data-val': p[1], 'data-title': p[2], 'class': 'play' })
					.append(
						$('<a/>', { href: '#radio|'+p[1] })
							.append($('<img/>', { src: p[3] }))
							.append($('<span/>', { text: p[2] }))
					)
					.appendTo(content);
			}
		});

		$(content).trigger('updated');
	});

})(jQuery);

