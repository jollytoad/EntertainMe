(function($) {

	$(document)
		.bind('playing', function(event, msg) {
			if ( msg.data && /^music/.test(msg.action) ) {
				var lines = msg.data.split(/\r?\n/),
					msg = {
						title: lines[1]
					};

				if ( /pause/.test(lines[2]) ) {
					msg.title += " (Paused)";
				}

				$(document).trigger('playing', [ msg ]);
			}
		})
		
		.bind('mpc', function(event) {
			var cgi = $('#cgibin').attr('content'),
				msg = {
					action: 'music-cmd.sh',
					cmd: $(event.target).closest('[data-cmd]').attr('data-cmd') || 'current'
				};

			$.post(cgi + msg.action + '?' + msg.cmd, function(data) {
				msg.data = data;
				$(document).trigger('playing', [ msg ]);
			});
		});

	$('#music .content').live('loaded', function(event, msg) {
		var content = this;

		$.each(msg.data, function(i, data) {
			$('<li/>', { 'data-val': data.playlist, 'class': 'playlist play' })
				.append(
					$('<a/>', { href: '#music|'+data.playlist, text: data.playlist })
				)
				.appendTo(content);
		});

		$(content).trigger('updated');
	});

})(jQuery);

