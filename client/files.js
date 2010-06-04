/*** File Browser Populator Agent - parse directory listing and generate markup ***/
(function($) {

	$('.file-browser .content').live('loaded', function(event, msg) {
		var content = this,
			id = $(content).closest('.ui-tabs-panel').attr('id');

		$.each(msg.data.files, function(name, info) {
			var url = msg.data.path + '/' + name,
				title = name
					.replace(/[\*\|@=>\/]+$/, '') // Strip file type character from end of name
					.replace(/_[a-z0-9]{8}_(default|signed)\.(mp4|mov|flv)$/, '') // Strip iplayer info
					.replace(/_/g, ' ') // Replace underscores
					.replace(/[^A-Za-z0-9]*$/, ''), // Strip spurious characters from end of name

				li = $('<li/>', {
					'data-trigger': info.dir ? 'load' : 'play',
					'data-load': url,
					'data-title': title,
					'class': info.dir ? 'dir load' : 'file play'
				}).appendTo(content);

			$('<a/>', {
				href: '/#'+id+'|'+url,
				text: title
			}).appendTo(li);

			if ( info.dir ) {
				li.append('<ul class="content"/>');
			}
			
			if ( info.file && info.mime ) {
				li.attr('data-mime', info.mime);
			}
		});

		$(content).trigger('updated');
	});

})(jQuery);


/*** File Moving Agent ***/
(function($) {

	function basename(path) {
		var parts = path.split("/");
		return parts[parts.length-1];
	}

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
				srcPath = $(item).closest('[data-load]').attr('data-load'),
				dstPath = $(origin).closest('[data-dest]').attr('data-dest');
			
			dstPath += basename(srcPath);

			console.log('move: ', srcPath, ' -> ', dstPath);

			if ( srcPath && dstPath ) {
				$(item).addClass('lock');
				
				$.ajax({
					type: 'MOVE',
					url: srcPath,
					beforeSend: function(xhr) {
						xhr.setRequestHeader('Destination', dstPath);
					},
					success: function() {
						$(item).addClass('gone');
					}
				});
			}
		});

})(jQuery);

