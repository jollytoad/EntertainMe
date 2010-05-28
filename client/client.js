jQuery(function($) {

	$.getJSON("config.json", function(config) {
		console.log(config);
		
		$('#tab-tmpl')
			.render(config.tabs)
			.appendTo('#tabs > ul');

		$('#tabpanel-tmpl')
			.render(config.tabs)
			.appendTo('#tabs');

		$('#tabs').tabs({
			show: function(event, ui) {
				var panel = $(ui.panel),
					template = panel.attr('data-template');
				if (template) {
					panel.removeAttr('data-template');
					$(template)
						.render({})
						.appendTo(panel);
				}
			}
		});
	});

});

