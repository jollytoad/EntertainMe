/*** File Browser Populator Agent - parse directory listing and generate markup ***/
(function($) {

	$('.file-browser .content').live('loaded', function(event, msg) {
		var content = this,
			id = $(content).closest('.ui-tabs-panel').attr('id');

		$.each(msg.data.split(/\r?\n/), function(i, line) {
			if ( line ) {
				var isDir = /\/$/.test(line),
					li = $('<li/>', {
						'data-trigger': isDir ? 'load' : 'play',
						'data-val': msg.val+line,
						'data-title': line,
						'class': isDir ? 'dir load' : 'file play'
					}).appendTo(content);
			
				$('<input type="checkbox" class="nonav"/>').appendTo(li);
				$('<a/>', { href: '#'+id+'|'+msg.val+line, text: line }).appendTo(li);

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

	$('.file-browser').live('move', function(event) {
		var cgi = $('#cgibin').attr('content'),
			srcPath = $(event.target).closest('[data-val]').attr('data-val'),
			dstPath = $(event.target).closest('[data-dest]').attr('data-dest'),
			checked = $(':checked', this),
			count = checked.size();
		
		checked.each(function() {
			var src = $(this).closest('[data-val]').attr('data-val'),
				dst = src.replace(srcPath, dstPath);

			if ( src && dst ) {
				$.post(cgi + 'file-move.sh?' + src + ';' + dst, function() {
					count--;
					// Refresh the lists after all moves have completed
					if ( count === 0 ) {
						window.setTimeout(function() {
							$(".file-browser[data-val="+srcPath+"], .file-browser[data-val="+dstPath+"]").trigger('load');
						}, 0);
					}
				});
			} else {
				count--;
			}
		});
	});

})(jQuery);

