
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

		//this.map_container = this.svg.append('g');

		const map_promise = d3.json("data/countries.json").then((topojson_raw) => {
			const country_paths = topojson.feature(topojson_raw, topojson_raw.objects.countries);
			return country_paths.features;
		});

		Promise.all([map_promise]).then((results) => {
			let map_data = results[0];
			this.svg.selectAll("path")
 				 .data(map_data)
 				 .enter()
 				 .append("path")
 				 .attr("d", path)
 				 .style("fill", "steelblue");
		});
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
