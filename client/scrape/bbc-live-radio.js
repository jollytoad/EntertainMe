jQuery(function($) {

	$('#scrape').bind('load', function() {
		console.log('iframe ready');
		
		var stations = [],
			found = {};
		
		$('a', this.contentDocument)
			.each(function() {
				var href = this.getAttribute('href'),
					m = /radio\/([^\/]+)$/.exec(href);
				
				if ( m && m[1] && !found[m[1]] ) {
					found[m[1]] = true;
					stations.push({
						title: $(this).text(),
						path: m[1],
						mime: "audio/x-bbc-iplayer",
						icon: 'http://www.bbc.co.uk/iplayer/r22008/img/station_logos/' + m[1] + '.png'
					});
				}
			});
		
		console.log(stations);
		
		$.ajax({
			type: "PUT",
			url: "/liveradio/stations",
			data: JSON.stringify({list:stations}),
			contentType: "application/json"
		});
	});

});
