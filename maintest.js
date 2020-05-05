
class MapPlot {

	constructor(svg_element_id) {
		this.svg = d3.select('#' + svg_element_id);

		// may be useful for calculating scales
		const svg_viewbox = this.svg.node().viewBox.animVal;
		this.svg_width = svg_viewbox.width;
		this.svg_height = svg_viewbox.height;

		//Define map projection
		var projection = d3.geoMercator()
		.translate([this.svg_width/2, this.svg_height/2])
		.scale([this.svg_width * 0.15]);

		//Define path generator
		var path = d3.geoPath()
		.projection(projection);

		const g = this.svg.append('g');

		d3.json("data/countries.json").then((topojson_raw) => {

			g.selectAll('path')
				.data(topojson.feature(topojson_raw, topojson_raw.objects.countries)
					.features)
				.enter()
				.append('path')
				.attr('d', path);

		});

		const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', function() {
          g.selectAll('path')
           .attr('transform', d3.event.transform);
			});

		this.svg.call(zoom);

	}
}


function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

whenDocumentLoaded(() => {
	plot_object = new MapPlot('map-plot');
	// plot object is global, you can inspect it in the dev-console
});
