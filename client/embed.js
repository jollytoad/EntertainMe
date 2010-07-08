(function($) {

	$(document)
		.delegate("li[data-mime=audio/x-bbc-iplayer]", "play", function(event) {
			var player = {
					url: "http://beta.bbc.co.uk/iplayer/console/" + $(this).attr('data-src'),
					title: $(this).text()
				};
			$(this).trigger('embed', [ player ]);
		})
		
		.bind("embed", function(event, player) {
			console.log(event.type, player.url);
			
			var origin = $(event.target),
				embed = $('.embedded-player').empty();
			
			$(event.target).trigger('stop');
			
			$('<iframe/>', { src: player.url }).appendTo(embed);
			embed.css({
					left: origin.offset().left + origin.outerWidth(true),
				})
				.removeClass('hidden');

			$(document).one("stop", function() {
				$('.embedded-player')
					.addClass('hidden')
					.empty()
					.trigger('stopped');
			});
			
			$(event.target).trigger('playing', [ player ]);
		});

})(jQuery);

