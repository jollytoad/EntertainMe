jQuery(function($) {
	var cgi = 'cgi-bin/';
	
	function loadDir( list ) {
		var path = $(list).closest('[data-path]').attr('data-path') || "";
		
		$.get(cgi+'list.sh?' + path, function(data) {
			$(list).empty();

			$.each(data.split(/\r?\n/), function(i, line) {
				if ( line ) {
					var li = $('<li/>').attr('data-path', path+line).appendTo(list);
					$('<a href="#"/>').text(line).appendTo(li);
				
					if ( /\/$/.test(line) ) {
						li.addClass('dir').append('<ul/>');
					} else {
						li.addClass('file');
						
					}
				}
			});
		});
	}
	
	function play( path ) {
		$.post(cgi+'video-play.sh?' + path);
		
		$('#stop').one('click', function() {
			$.post(cgi+'video-stop.sh');
		});
	}

	var list = $('#tv > ul')[0];
	
	$('li.dir > a', list).live('click', function(event) {
		loadDir($(this).next('ul'));
		return false;
	});

	$('li.file > a', list).live('click', function(event) {
		play($(this).closest('[data-path]').attr('data-path'));
		return false;
	});

	loadDir(list);

});

