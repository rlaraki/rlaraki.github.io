
class MapPlot {

	constructor(svg_element_id) {

		var map_container_svg = document.getElementById('map_container_svg');
		const height = map_container_svg.offsetHeight;
		const width = map_container_svg.offsetWidth;

		console.log('height: ', height);
		console.log('width: ', width);


		var info;

		this.svg = d3.select('div#map_container_svg').append('svg')
			.attr('preserveAspectRatio', 'xMinYMin meet')
			.attr('viewBox', '0 0 ' + width.toString(10) + ' ' + height.toString(10))
			.classed('scaling-svg', true);


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


		this.map_promise = d3.json("data/countries.json").then((topojson_raw) => {
			const country_paths = topojson.feature(topojson_raw, topojson_raw.objects.countries);
			return country_paths.features;
		});

		Promise.all([this.map_promise]).then((results) => {
			let map_data = results[0];
			const map_container = this.svg.append("g").attr('id', 'svg g');

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

  redraw(){

		var map_container_svg = document.getElementById('map_container_svg')
		const svg_viewbox = this.svg.node().viewBox.animVal;

		const width = svg_viewbox.width;
		const height= svg_viewbox.height;

		var projection = d3.geoMercator()
								 .translate([width/2, width/2])
								 .scale([width * 0.15]);

		// use projection fn with geoPath fn
		var path = d3.geoPath()
						 .projection(projection);

		var g = document.getElementById('svg g');
		if (g) g.remove();

		this.svg
			.attr('preserveAspectRatio', 'xMinYMin meet')
			.attr('viewBox', '0 0 ' + map_container_svg.offsetWidth.toString(10) + ' ' + map_container_svg.offsetHeight.toString(10))
			.classed('scaling-svg', true);

				//Bind data and create one path per GeoJSON feature


		Promise.all([this.map_promise]).then((results) => {
			let map_data = results[0];
			const map_container = this.svg.append("g").attr('id', 'svg g');

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

	window.onresize = function() {
		console.log("resize")
		plot_object.redraw();
	};
});

	// plot object is global, you can inspect it in the dev-console
