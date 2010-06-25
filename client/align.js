/*global jQuery, document */

/* Menu 'Align' agent
 *
 * Causes an entire list to be shifted so that its active item aligns vertically
 * with its parent item
 */
(function($) {

	$(document)

		// Align an item with its parent when clicked or focused
		.delegate('li', 'click focus', function(event) {
			$(this).trigger('align');
		})

		// After the expansion of a list align its last focused (or first) item with its parent
		.delegate('li', 'expanded', function(event) {
			$('> ul > li', this).filter(':first-child,.align').last().trigger('align');
		})
		
		// Align the item vertically with its parent item by moving its parent list
		.delegate('li', 'align', function(event) {
			var parentItemOffset = $(this).parents('li:first').offset();
			
			if ( parentItemOffset ) {
				$(this).offsetParent().offset({top: parentItemOffset.top - $(this).position().top });
			} else {
				// Move the root list proportionally according to the active item
				var top = $('.header').outerHeight(true),
					bottom = $('.footer').offset().top,
					ul = $(this).offsetParent(),
					per = $(this).nextAll().length / $(ul).children().length;
					
				ul.offset({top: top + ((bottom - top) - ul.outerHeight(true)) * per});
			}
			
			$(this).siblings('li.align').removeClass('align').end()
				.addClass('align').trigger('aligned');
		})
	;
})(jQuery);

