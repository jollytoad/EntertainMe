/*global jQuery */

/* Spring the UI into life when document ready
 */
jQuery(function($) {

	// Load the root menu
	$('#root')
		.one('updated', function() {
			$('> li:first-child', this).focus();
		})
		.trigger('loaddata');

});

