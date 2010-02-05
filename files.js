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
			
				$('<a/>', { href: '#'+id+'|'+msg.val+line, text: line }).appendTo(li);

				if ( isDir ) {
					li.append('<ul class="content"/>');
				}
			}
		});

		$(content).trigger('updated');
	});

})(jQuery);

