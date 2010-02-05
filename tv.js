jQuery(function($) {
	var cgi = 'cgi-bin/';
	
	function load( list ) {
		var path = $(list).closest('[data-val]').attr('data-val') || "";
		
		$.get(cgi+'list.sh?' + path, function(data) {
			$(list).empty();

			$.each(data.split(/\r?\n/), function(i, line) {
				if ( line ) {
					var li = $('<li/>', { 'data-val': path+line, 'data-title': line }).appendTo(list);
					$('<a/>', { href: '#tv|'+path+line, text: line }).appendTo(li);
				
					if ( /\/$/.test(line) ) {
						li.addClass('dir').append('<ul/>');
					} else {
						li.addClass('play');
						
					}
				}
			});
		});
	}

	var list = $('<ul/>').appendTo('#tv')[0];
	
	$('li.dir > a', list).live('click', function(event) {
		load($(this).next('ul'));
		return false;
	});

	load(list);

});

