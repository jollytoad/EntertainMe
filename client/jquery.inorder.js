/*global jQuery */

/* jQuery plugin to insert an element into an ordered set of elements at
 * the right place.
 * You need to pass a sort comparator which determines the positioning.
 */
(function($) {

	function prepend() { return -1; }
	function append() { return 1; }

	var comps = {
		'prepend': prepend,
		'append': append,
		'default': append
	};

	$.fn.insertInto = function(target, comparator) {
		if ( !$.isFunction(comparator) ) {
			comparator = comps[comparator] || comps['default'];
		}
		return this.each(function() {
			var insert = this, found = false;

			$(target).children().each(function() {
				var c = comparator(insert, this);
				if ( c < 0 ) {
					$(insert).insertBefore(this);
				} else if ( c === 0 ) {
					$(insert).insertAfter(this);
				}
				found = c <= 0;
				return !found;
			});

			if ( !found ) {
				$(target).append(insert);
			}
		});
	};
	
	$.fn.insertInto.comparators = comps;

})(jQuery);

