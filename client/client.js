jQuery(function($) {

	$(document)
		.delegate('ul > li:has(> ul):not(.expand) > a', 'click', function(event) {
			console.log(event.type, this);
			$(this).trigger('expand');
		})
		.delegate('li', 'expand', function(event) {
			console.log(event.type, this);
			
			var load = $('> ul[data-src]:not(.loaded)', this);
			if ( load.length ) {
				$(load)
					.one('updated', function() {
						$(this).trigger('expand');
					})
					.trigger('loaddata');
			} else {
				$(this)
					.siblings('li.expand')
						.removeClass('expand')
					.end()
					.addClass('expand')
					.not(':has(.expand)')
					.find('li:first')
						.trigger('align');
			}
		})
		.delegate('li', 'click focus', function(event) {
			$(this).trigger('align');
		})
		.delegate('li:not(:has(ul))', 'click', function(event) {
			$(this).trigger('play');
		})
		.delegate('li', 'align', function(event) {
			// Move the list so this item is vertically aligned with its parent item
			var parentItemOffset = $(this).parents('li:first').offset();
			if ( parentItemOffset ) {
				$(this).offsetParent().offset({top: parentItemOffset.top - $(this).position().top });
			}
		});
	
	$('#root').trigger('loaddata');
});

