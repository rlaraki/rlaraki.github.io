
var list_countries = ['France', 'Switzerland']


class MapPlot {

	constructor() {
		var map_container_svg = document.getElementById('map_container_svg'); 
		const height = map_container_svg.offsetHeight; 
		const width = map_container_svg.offsetWidth;  
		var info;
		this.svg = d3.select('div#map_container_svg')
				.append('svg') 
				.attr('preserveAspectRatio', 'xMinYMin meet') 
				.attr('viewBox', '0 0 ' + width.toString(10) + ' ' + height.toString(10)) 
				.classed('scaling-svg', true);


		//Define map projection
		var projection = d3.geoMercator()
								 .translate([width/2, height/2])
								 .scale([width * 0.15]);

		//Define path generator
		this.path = d3.geoPath()
						 .projection(projection);

=======

		this.map_promise = d3.json("data/countries.json").then((topojson_raw) => {
	 			const country_paths = topojson.feature(topojson_raw, topojson_raw.objects.countries);
	 			return country_paths.features;
	 		});

	}

	draw(){

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

		var s = document.getElementById('slider_id');
		if (s) s.remove();

		var c = document.getElementById('colorbar');
		if (c) c.remove();

		this.svg
			.attr('preserveAspectRatio', 'xMinYMin meet')
			.attr('viewBox', '0 0 ' + map_container_svg.offsetWidth.toString(10) + ' ' + map_container_svg.offsetHeight.toString(10))
			.classed('scaling-svg', true);


		Promise.all([this.map_promise, this.data_promise]).then((results) => {
			let map_data = results[0];
			let data = results[1][0];
			let dates = results[1][1];

			map_data.forEach(country => {
				country.properties.date = data[country.properties.name];
			});

			const map_container = this.svg.append("g").attr('id', 'svg g');

			var pred;
			var countryShapes = map_container.selectAll("path")
				 .data(map_data)
				 .enter()
				 .append("path")
				 .on("mouseover",function(){
					 pred = this.style.fill;
					 d3.select(this).style('fill', 'red').style('stroke');
				  	})
 	          .on("mouseout",function(){
		 					d3.select(this).style('fill', pred);})
							.on("click", function(){
								if (this.style.stroke != 'red'){
								d3.select(this).style('stroke', 'red');
							} else {
								d3.select(this).style('stroke', null);
							}
							})
						.attr('fill', 'black')
								.attr("d", path);


			 let current_plot = this;

			 var slider = d3.select(".slider")
	 			.append("input")
				.attr("id", "slider_id")
	 			.attr("type", "range")
	 			.attr("min", 0)
	 			.attr("max", dates.length - 1)
				.attr("step", 1)
	 			.on("input", function() {
	 				var date = dates[this.value];
					slider.property("value", this.value);
					d3.select(".slider").select('g').text(date);
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
				this.makeLegend(map_container, [width*0.55, height*0.05], [width * 0.40, height * 0.03]);
		});

	drawData(countryShapes, date, value, data, projection) {
		throw new Error('Map plot class do not contain data and thus the map can not be drawn');

	}
}

function formatDate(input, formatInput, formatOutput){
	var dateParse = d3.timeParse("%Y-%m-%d");
	var dateFormat = d3.timeFormat(formatOutput);
	return dateFormat(dateParse(input));
}

function getData() {
	const cases = d3.csv("data_website/map_cdr.csv").then((data) => {
		let year_to_cases = {};
		let dates = {};
		let max = 0;

		data.forEach((row) => {
			if (row.confirmed > max) {
				max = parseInt(row.confirmed);
			}
			var date = this.formatDate(row.Date, "%Y-%m-%d", "%B %d, %Y");
			if (year_to_cases[date] == undefined) {
				year_to_cases[date] = [];
			}
			else {
				data = {};
				data["lon"] =  row.longitude;
				data["lat"] =  row.latitude;
				data["confirmed"] =  parseInt(row.confirmed);
				year_to_cases[date].push(data);
			}
			dates[date] = date;
		});
		dates = d3.keys(dates).sort(function(a,b) { return new Date(a) - new Date(b); });
		return [year_to_cases, dates, max];
	});

	const recovered = d3.csv("data_website/map_cdr.csv").then((data) => {
		let year_to_recovered = {};
		let dates = {};
		let max = 0;

		data.forEach((row) => {
			if (row.recovered > max) {
				max = parseInt(row.recovered);
			}
			var date = this.formatDate(row.Date, "%Y-%m-%d", "%B %d, %Y");
			if (year_to_recovered[date] == undefined) {
				year_to_recovered[date] = [];
			}
			else {
				data = {};
				data["lon"] =  row.longitude;
				data["lat"] =  row.latitude;
				data["recovered"] =  parseInt(row.recovered);
				year_to_recovered[date].push(data);
			}
			dates[date] = date;
		});
		dates = d3.keys(dates).sort(function(a,b) { return new Date(a) - new Date(b); });
		return [year_to_recovered, dates, max];
	});

	const deaths = d3.csv("data_website/map_cdr.csv").then((data) => {
		let year_to_deaths = {};
		let dates = {};
		let max = 0;

		data.forEach((row) => {
			if (row.deaths > max) {
				max = parseInt(row.deaths);
			}
			var date = this.formatDate(row.Date, "%Y-%m-%d", "%B %d, %Y");
			if (year_to_deaths[date] == undefined) {
				year_to_deaths[date] = [];
			}
			else {
				data = {};
				data["lon"] =  row.longitude;
				data["lat"] =  row.latitude;
				data["deaths"] =  parseInt(row.deaths);
				year_to_deaths[date].push(data);
			}
			dates[date] = date;
		});
		dates = d3.keys(dates).sort(function(a,b) { return new Date(a) - new Date(b); });
		return [year_to_deaths, dates, max];
	});



	const gov_measures = d3.csv("data_website/gov_si.csv").then((data) => {
		let country_to_year_to_data = {};
		let dates = {};

		data.forEach((row) => {
			var date = this.formatDate(row.Date, "%Y-%m-%d", "%B %d, %Y");
			if (country_to_year_to_data[row.CountryName] == undefined) {
				country_to_year_to_data[row.CountryName] = {}
			}
			else {
				country_to_year_to_data[row.CountryName][date] = parseFloat(row.StringencyIndexForDisplay);
			}
			dates[date] = date;
		});
		dates = d3.keys(dates).sort(function(a,b) { return new Date(a) - new Date(b); });
		return [country_to_year_to_data, dates];
	});
	return [cases, recovered, deaths, gov_measures]


	makeLegend(svg, top_left, colorbar_size, scaleClass=d3.scaleLinear) {

		const value_to_svg = scaleClass()
			.domain(this.color_scale.domain())
			.range([0, colorbar_size[0]]);

		const range01_to_color = d3.scaleLinear()
			.domain([0, 1])
			.range(this.color_scale.range())
			.interpolate(this.color_scale.interpolate());

		// Axis numbers
		const colorbar_axis = d3.axisTop(value_to_svg)
		.tickFormat(d3.format(".0f"))

		const colorbar_g = svg.append('g')
			.attr("id", "colorbar")
			.attr("transform", "translate(" + top_left[0] + ', ' + top_left[1] + ")")
			.call(colorbar_axis);


		// Create the gradient
		function range01(steps) {
			return Array.from(Array(steps), (elem, index) => index / (steps-1));
		}

		const svg_defs = svg.append("defs");

		const gradient = svg_defs.append('linearGradient')
			.attr('id', 'colorbar-gradient')
			.attr('x1', '0%') // left
			.attr('y1', '0%')
			.attr('x2', '100%') // to right
			.attr('y2', '0%')
			.attr('spreadMethod', 'pad');

		gradient.selectAll('stop')
			.data(range01(10))
			.enter()
			.append('stop')
				.attr('offset', d => Math.round(100*d) + '%')
				.attr('stop-color', d => range01_to_color(d))
				.attr('stop-opacity', 1);

		// create the colorful rect
		colorbar_g.append('rect')
			.attr('id', 'colorbar-area')
			.attr('width', colorbar_size[0])
			.attr('height', colorbar_size[1])
			.style('fill', 'url(#colorbar-gradient)')
			.style('stroke', 'black')
			.style('stroke-width', '1px')


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

	const data = getData();
	const cases = data[0];
	const recovered = data[1];
	const deaths = data[2];
	const gov_measures = data[3];

	plot_object = new MapCases(cases);
	plot_object.draw();


  //plot_object.ready();

	const cases_query = document.getElementById('cases');
	cases_query.addEventListener('click', () => {
		var point = document.getElementById('point_svg');
		if (point)
			point.remove();
		plot_object = new MapCases(cases);
		plot_object.draw();
	});

	const recovered_query = document.getElementById('recovered');
	recovered_query.addEventListener('click', () => {
		var point = document.getElementById('point_svg');
		if (point)
			point.remove();
		plot_object = new MapRecovered(recovered);
		plot_object.draw();
	});

	const deaths_query = document.getElementById('deaths');
	deaths_query.addEventListener('click', () => {
		var point = document.getElementById('point_svg');
		if (point)
			point.remove();
		plot_object = new MapDeaths(deaths);
		plot_object.draw();
	});


	const measures_query = document.getElementById('measures');
	measures_query.addEventListener('click', () => {
		var point = document.getElementById('point_svg');
		if (point)
			point.remove();
		plot_object = new MapMeasures(gov_measures);
		plot_object.draw();
	});

	window.onresize = function() {
		console.log("Resize")
		plot_object.draw();
	};

});
