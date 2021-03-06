/*** File Browser Populator Agent - parse directory listing and generate markup ***/
(function($) {

	$('.file-browser .content').live('loaded', function(event, msg) {
		var content = this,
			id = $(content).closest('.ui-tabs-panel').attr('id');

		$.each(msg.data.split(/\r?\n/), function(i, line) {
			if ( line ) {
				var isDir = /\/$/.test(line),
					clean = line.replace(/[\*\|@=>]+$/, ''),

					title = line
						.replace(/[\*\|@=>\/]+$/, '') // Strip file type character from end of name
						.replace(/_[a-z0-9]{8}_(default|signed)\.(mp4|mov|flv)$/, '') // Strip iplayer info
						.replace(/_/g, ' ') // Replace underscores
						.replace(/[^A-Za-z0-9]*$/, ''), // Strip spurious characters from end of name

					li = $('<li/>', {
						'data-trigger': isDir ? 'load' : 'play',
						'data-val': msg.val+clean,
						'data-title': title,
						'class': isDir ? 'dir load' : 'file play'
					}).appendTo(content);

				$('<a/>', {
					href: '#'+id+'|'+msg.val+clean,
					text: title
				}).appendTo(li);

				if ( isDir ) {
					li.append('<ul class="content"/>');
				}
			}
		});

		$(content).trigger('updated');
	});

})(jQuery);


/*** File Moving Agent ***/
(function($) {

	$('.file-browser')
		.live('archive', function(event, origin) {
			var cgi = $('#cgibin').attr('content'),
				item = event.target,
				srcPath = $(origin).closest('[data-val]').attr('data-val'),
				dstPath = $(origin).closest('[data-dest]').attr('data-dest'),
				src = $(item).closest('[data-val]').attr('data-val') || "",
				dst = src.replace(srcPath, dstPath);

//			console.log('archive: ', src, ' -> ', dst);

			if ( src && dst ) {
				$(item).addClass('lock');
				$.post(cgi + 'file-archive.sh?' + src + ';' + dst, function() {
					$(item).addClass('gone');
//					$(".file-browser[data-val="+srcPath+"], .file-browser[data-val="+dstPath+"]").trigger('load');
				});
			}
		})

		.live('move', function(event, origin) {
			var cgi = $('#cgibin').attr('content'),
				item = event.target,
				srcPath = $(origin).closest('[data-val]').attr('data-val'),
				dstPath = $(origin).closest('[data-dest]').attr('data-dest'),
				src = $(item).closest('[data-val]').attr('data-val');

//			console.log('move: ', src, ' -> ', dstPath);

			if ( src && dstPath ) {
				$(item).addClass('lock');
				$.post(cgi + 'file-move.sh?' + src + ';' + dstPath, function() {
					$(item).addClass('gone');
//					$(".file-browser[data-val="+srcPath+"], .file-browser[data-val="+dstPath+"]").trigger('load');
				});
			}
		});

})(jQuery);

