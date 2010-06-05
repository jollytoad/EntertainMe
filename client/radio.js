/*** Radio List Populator Agent - parse list of radio stations from get_iplayer and generate markup ***/
(function($) {

	$('#radio').live('load', function(event) {
		console.log('load live radio');
	});

	$('#radio .content').live('loaded', function(event, msg) {
		var content = this;

		$.each(msg.data.split(/\r?\n/), function(i, line) {
			var p = line.split("|");
			if ( /radio/.test(p[0]) && /^[a-z_]+$/.test(p[1]) ) {

				$('<li/>', { 'data-val': 'liveradio;'+p[1], 'data-title': p[2], 'class': 'play' })
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

	$('#radio-comedy .content').live('loaded', function(event, msg) {
		var content = this;
console.log(msg.data);
		$.each(msg.data.split(/\r?\n/), function(i, line) {
			// radio|<pid>|<name>|<episode>|<channel>|<thumbnail>|<desc>
			var p = line.split("|");
			if ( /radio/.test(p[0]) ) {

				$('<li/>', { 'data-val': 'radio;'+p[1], 'data-title': p[2]+' - '+p[3], 'class': 'play' })
					.append(
						$('<a/>', { href: '#radio-comedy|'+p[1] })
							.append($('<img/>', { src: p[5] }))
							.append($('<span/>', { text: p[2], 'class': 'series' }))
							.append($('<span/>', { text: p[3], 'class': 'episode' }))
							.append($('<span/>', { text: p[4], 'class': 'channel' }))
							.append($('<span/>', { text: p[6], 'class': 'desc' }))
					)
					.appendTo(content);
			}
		});

		$(content).trigger('updated');
	});

})(jQuery);

