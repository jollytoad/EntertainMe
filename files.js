jQuery(function($) {
	var cgi = 'cgi-bin/';
	
	function load() {
		var list = this,
			path = $(list).closest('[data-val]').attr('data-val') || "",
			id = $(list).closest('.files').attr('id');
		
		$.get(cgi+'list.sh?' + path, function(data) {
			$(list).empty();

			$.each(data.split(/\r?\n/), function(i, line) {
				if ( line ) {
					var li = $('<li/>', { 'data-val': path+line, 'data-title': line }).appendTo(list);
					$('<a/>', { href: '#'+id+'|'+path+line, text: line }).appendTo(li);
				
					if ( /\/$/.test(line) ) {
						li.addClass('dir').append('<ul/>');
					} else {
						li.addClass('file play');
						
					}
				}
			});
		});
	}

	$('.files > ul > li.dir > a').live('click', function(event) {
		$(this).next('ul').each(load);
	});

	$('.files').append('<ul/>');

	$('.files > ul').each(load);

});

