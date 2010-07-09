/*global jQuery */

/* Spring the UI into life when document ready
 */
jQuery(function($) {

	$('body').css('font-size', Math.round(screen.width/50)+'px');

	// Load the root menu
	$('#root')
		.one('updated', function() {
			$('> ul > li:first-child', this).focus();
		})
		.trigger('expand');

});

