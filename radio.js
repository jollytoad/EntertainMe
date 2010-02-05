jQuery(function($) {
	var cgi = 'cgi-bin/';

	var list = $('<ul/>').appendTo('#radio').get(0);

	function load() {
		$(list).empty();

		$.get(cgi+'radio-list.sh', function(data) {
			$.each(data.split(/\r?\n/), function(i, line) {
				var p = line.split("|");
				if ( /radio/.test(p[0]) && /^[a-z_]+$/.test(p[1]) ) {

					$('<li/>', { 'data-val': p[1], 'data-title': p[2], 'class': 'play' })
						.append(
							$('<a/>', { href: '#radio|'+p[1] })
								.append($('<img/>', { src: p[3] }))
								.append($('<span/>', { text: p[2] }))
						)
						.appendTo(list);
				}
			});
		}, 'text');
	}

	load();
});

