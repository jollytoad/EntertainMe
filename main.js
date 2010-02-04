jQuery(function($) {

	$('#tabs').tabs();
	
	$('#tabs')
		.bind('keydown.key:left', function(event) {
			event.preventDefault();
			$('> ul > li.ui-state-active', this).prev().find('a').click();
		})
		.bind('keydown.key:right', function(event) {
			event.preventDefault();
			$('> ul > li.ui-state-active', this).next().find('a').click();		
		})
		.bind('keydown.key:down', function(event) {
			var all = $('> .ui-tabs-panel:visible :focusable', this),
				i = all.index(document.activeElement);
			
			all.eq(i >= 0 ? i+1 % all.length : 0).focus();

			event.preventDefault();
		})
		.bind('keydown.key:up', function(event) {
			var all = $('> .ui-tabs-panel:visible :focusable', this),
				i = all.index(document.activeElement);
			
			all.eq(i >= 0 ? i-1 : -1).focus();
			
			event.preventDefault();
		});

});

