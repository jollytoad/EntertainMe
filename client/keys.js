/*** Tabpanel Keyboard Shortcuts Agent ***/
(function($) {

	$(document)
		.ready(function() {
			// Set key shortcut on each tab
			$('#tabs > ul > li > a').attr('data-key', function(i) {
				return (i+1);
			});
		});

})(jQuery);


/*** Keyboard Navigation Agent ***/
(function($) {

	$(document)
		.bind('keydown', function(event) {
			var kc = $.ui.keyCode;

			switch (event.keyCode) {
				case kc.LEFT:
				case kc.RIGHT:
					event.preventDefault();
					$('#tabs > ul > li.ui-state-active')[event.keyCode === kc.LEFT ? 'prev' : 'next']().find('a').click();
					break;
				
				case kc.UP:
				case kc.DOWN:
					event.preventDefault();
					var all = $('#tabs > .ui-tabs-panel:visible :focusable:not(.nonav)'),
						i = all.index(document.activeElement);
						
					if ( event.keyCode === kc.UP ) {
						all.eq(i >= 0 ? i-1 : -1).focus();
					} else {
						all.eq(i >= 0 ? (i+1) % all.length : 0).focus();
					}
					break;
			}
		});

})(jQuery);


/*** Keyboard Item Selection Agent ***/
(function($) {

	$(document)
		.bind('keydown.key:insert', function(event) {
				$(document.activeElement).closest('li').find('> :checkbox').click();
		});

})(jQuery);


/*** Keyboard Shortcut Agent ***/
(function($) {

	$(document)
		.bind('keydown', function(event) {
			var combo = $.keys.combo(event);
			if ( combo && $('[data-key='+combo+']:visible:not(.info)').click().size() > 0 ) {
				event.preventDefault();
			}
		});

})(jQuery);

