jQuery(function($) {


	$(document)
		.delegate('ul > li:has(> ul):not(.expand)', 'click', function(event) {
			$(this).trigger('expand');
		})
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
		.delegate('li', 'click focus', function(event) {
			$(this).trigger('align');
		})
		.delegate('li:not(:has(ul))', 'click', function(event) {
			$(this).trigger('play');
		})
		.delegate('li', 'expanded', function(event) {
			$('> ul > li', this).filter(':first-child,.align').last().trigger('align');
		})
		.delegate('li', 'align', function(event) {
			// Move the list so this item is vertically aligned with its parent item
			var parentItemOffset = $(this).parents('li:first').offset();
			if ( parentItemOffset ) {
				$(this).offsetParent().offset({top: parentItemOffset.top - $(this).position().top });
			} else {
				console.log('no parent');
				var top = $('.header').outerHeight(true),
					bottom = $('.footer').offset().top,
					ul = $(this).offsetParent(),
					per = $(this).nextAll().length / $(ul).children().length;
					
				ul.offset({top: top + ((bottom - top) - ul.outerHeight(true)) * per});
			}
			$(this).siblings('li.align').removeClass('align').end()
				.addClass('align').trigger('aligned');
		})
		.delegate('li', 'keydown', function(event) {
			var kc = $.keys.combo(event);
			
			switch(kc) {
				case 'enter':
					$(this).trigger('expand');
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
		});
	
	$('#root')
		.one('updated', function() {
			$('> li:first-child', this).focus();
		})
		.trigger('loaddata');
});

