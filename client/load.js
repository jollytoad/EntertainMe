/*** Content Loading Agent ***/
(function($) {

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
			var li = $('<li/>').appendTo(this);

			$('<a/>', { href: '#', text: item.title }).appendTo(li);

			if ( item.mime ) {
				li.attr('data-mime', item.mime);
			}

			if ( item.list ) {
				var ul = $('<ul/>', { 'data-src': item.path }).appendTo(li);
				
				if ( $.isArray(item.list) ) {
					ul.trigger('addlist', [ item.list ]);
				}
			} else {
				li.attr('data-src', item.path);
			}
		});

})(jQuery);

