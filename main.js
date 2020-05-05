
class MapPlot {

	constructor(svg_element_id) {
		this.svg = d3.select('#' + svg_element_id);

		// may be useful for calculating scales
		const svg_viewbox = this.svg.node().viewBox.animVal;
		this.svg_width = svg_viewbox.width;
		this.svg_height = svg_viewbox.height;
		const width = this.svg_width
		const height = this.svg_height

		//Define map projection
		var projection = d3.geoMercator()
								 .translate([width/2, height/2])
								 .scale([width * 0.15]);

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
			const map_container = this.svg.append("g");

			map_container.selectAll("path")
 				 .data(map_data)
 				 .enter()
 				 .append("path")
 				 .attr("d", path)
 				 .style("fill", "steelblue");


	 		const zoom = d3.zoom()
	 					       .scaleExtent([1, 8])
	 					       .on('zoom', function() {
							 			 	d3.event.transform.x = Math.min(0, Math.max(d3.event.transform.x, width - width * d3.event.transform.k));
						   				d3.event.transform.y = Math.min(0, Math.max(d3.event.transform.y, height - height * d3.event.transform.k));
											map_container.selectAll('path').attr("transform", d3.event.transform);
	 								 });
			this.svg.call(zoom);
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
	plot_object = new MapPlot('map-plot8');
	// plot object is global, you can inspect it in the dev-console
});
