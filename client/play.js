/*global jQuery, document */

/* Media Playing Agent
 */
(function($) {

	$(document)
		.delegate('li[data-src]', 'play', function(event) {
			console.log(event.type, this);
			$.post($(this).attr('data-src') + '?play');
		})
		
		.bind('playing', function(event, player) {
			console.log(event.type, player);

			$('.playing').text('');
			$.each(player, function(key, val) {
				$('.playing.'+key).text(val);
			});
		})

		.bind('stopped', function(event) {
			console.log(event.type);
			$('.playing').text('');
		});

})(jQuery);

