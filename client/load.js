/*global jQuery, document */

/* List loading agent 
 */
(function($) {

	function expandNumbers(str) {
		return str.replace(/\d+/g, function(m) {
			return ("00000000" + parseInt(m, 10)).slice(-8);
		});
	}

	function removeThe(str) {
		return str.replace(/^the/i, "");
	}

	function prep(str) {
		return removeThe(expandNumbers(str)).trim();
	}

	function compareItems(a,b) {
		return prep($('> *:first', a).text()).localeCompare(prep($('> *:first', b).text()));
	}
	
	$.fn.insertInto.comparators.alphanumeric = compareItems;

	$(document)
		.delegate('ul[data-src]', 'loaddata', function(event) {
			console.log(event.type, this);

			var content = this,
				url = $(this).attr('data-src');

			$(this).addClass('loading');

			$.get(url, function(data) {
				if ( data ) {
					$(content).trigger('loaded', [ data ]);
				}
			});
		})
		.delegate('ul.loading', 'loaded', function(event, item) {
			console.log(event.type, this, item);

			var self = $(this);
			
			if ( item && item.order ) {
				$(this).attr('data-order', item.order);
				// Should reorder the list if this changes
			}

			if ( item && $.isArray(item.list) ) {
				self.trigger('addlist', [ item.list ]);
			}

			self.removeClass('loading').addClass('loaded').trigger('updated');
		})
		.delegate('ul', 'addlist', function(event, list) {
			console.log(event.type, list);
			
			list.forEach(function(item) {
				this.trigger('additem', item);
			}, $(this));
		})
		.delegate('ul', 'additem', function(event, item) {
			console.log(event.type, item);

			// create the item
			var li = $('<li/>', { tabindex: 0 });

			$('<span/>', { text: item.title }).appendTo(li);

			if ( item.mime ) {
				li.attr('data-mime', item.mime);
			}

			li.insertInto(this, $(this).attr('data-order') || compareItems );

			if ( item.list ) {
				var ul = $('<ul/>', { 'data-src': item.path, 'data-order': item.order }).appendTo(li);
				
				if ( $.isArray(item.list) ) {
					ul.trigger('addlist', [ item.list ]);
				}
			} else {
				li.attr('data-src', item.path);
			}
		})
	;
})(jQuery);

