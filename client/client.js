(function($) {

	$(document)
	
		// Expand an items sublist (if it has one) when clicked
		.delegate('ul > li:has(> ul):not(.expand)', 'click', function(event) {
			$(this).trigger('expand');
		})

		// Play an item that has no sublist
		.delegate('li:not(:has(ul))', 'click', function(event) {
			$(this).trigger('play');
		})

		// Expand the sublist
		.delegate('li', 'expand', function(event) {
			var load = $('> ul[data-src]:not(.loaded)', this);
			if ( load.length ) {
				$(load)
					.one('updated', function() {
						$(this).trigger('expand');
					})
					.trigger('loaddata');
				event.stopImmediatePropagation();
			} else {
				$(this).siblings('li.expand').removeClass('expand').end()
					.addClass('expand').trigger('expanded');
			}
		})

		// Shift focus using cursor keys
		.delegate('li', 'keydown', function(event) {
			var kc = $.keys.combo(event);
			
			switch(kc) {
				case 'enter':
					$(this).trigger('click');
					return false;
				
				case 'down':
					$(this).next().focus();
					return false;
				
				case 'up':
					$(this).prev().focus();
					return false;
				
				case 'right':
					$(this)
						.one('expanded', function() {
							$('> ul > li', this).filter(':first-child,.align').last().focus();
						})
						.trigger('expand');
					return false;
				
				case 'left':
					$(this).parents('li:first').focus();
					return false;
			}
		})
	;
})(jQuery);

