(function($) {

	$(document)
		.delegate("li[data-mime=audio/x-bbc-iplayer]", "play", function(event) {
			var station = $(this).attr('data-src');
			$(this).trigger('embed', [ "http://beta.bbc.co.uk/iplayer/console/" + station ]);
		})
		
		.bind("embed", function(event, url) {
			console.log(event.type, url);
			
			var origin = $(event.target),
				embed = $('.embedded-player').empty();
			
			
			$('<iframe/>', { src: url }).appendTo(embed);
			embed.css({
					left: origin.offset().left + origin.outerWidth(true),
				})
				.removeClass('hidden');
		});

})(jQuery);

