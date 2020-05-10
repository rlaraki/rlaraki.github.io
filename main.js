
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



		const map_promise = d3.json("data/countries.json").then((topojson_raw) => {
			const country_paths = topojson.feature(topojson_raw, topojson_raw.objects.countries);
			return country_paths.features;
		});

		const data_promise = this.getData();


		Promise.all([map_promise, data_promise]).then((results) => {
			let map_creation = results[0];
			let data = results[1][0];
			let dates = results[1][1];
			console.log(dates);

			map_creation.forEach(country => {
				country.properties.date = data[country.properties.name];
			});

			const map_container = this.svg.append("g");

			var countryShapes = map_container.selectAll("path")
				 .data(map_creation)
				 .enter()
				 .append("path")
				 .attr("d", path);

			 let current_plot = this;

			 var slider = d3.select(".slider")
	 			.append("input")
	 			.attr("type", "range")
	 			.attr("min", 0)
	 			.attr("max", dates.length - 1)
				.attr("step", 1)
	 			.on("input", function() {
	 				var date = dates[this.value];
					slider.property("value", this.value);
	 				current_plot.drawData(countryShapes, date, slider);
	 			});

			slider.property("value", 0);
			this.drawData(countryShapes, dates[0], slider);


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


class MapMeasures extends MapPlot {
	constructor(svg_element_id) {
		super(svg_element_id);
	}

	getData() {
		const gov_measures = d3.csv("data_website/gov_si.csv").then((data) => {
			let country_to_year_to_data = {};
			let dates = {};

			data.forEach((row) => {
				if (country_to_year_to_data[row.CountryName] == undefined) {
					country_to_year_to_data[row.CountryName] = {}
				}
				else {
					country_to_year_to_data[row.CountryName][row.Date] = parseFloat(row.StringencyIndexForDisplay);
				}
				dates[row.Date] = row.Date;
			});
			dates = Object.values(dates);
			dates.sort(function(a,b) { return a - b; });
			return [country_to_year_to_data, dates];
		});
		return gov_measures;
	}

	drawData(countryShapes, date, slider) {

		const color_scale = d3.scaleLinear()
			.range(["hsl(62,100%,90%)", "hsl(228,30%,20%)"])
			.interpolate(d3.interpolateHcl);

		color_scale.domain([0, 100]);

		countryShapes.style("fill", function(d) {
			if (d.properties.date != undefined) {
				return color_scale(d.properties.date[date]);
			}
			else {
				return color_scale(d.properties.date);
			}
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
	plot_map = new MapMeasures('map-plot8');


	// plot object is global, you can inspect it in the dev-console
});
