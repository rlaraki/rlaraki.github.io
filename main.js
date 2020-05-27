
var list_countries = ['Switzerland','France']

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

		this.map_promise = d3.json("data/countries.json").then((topojson_raw) => {
	 			const country_paths = topojson.feature(topojson_raw, topojson_raw.objects.countries);
	 			return country_paths.features;
	 		});
		this.tool = d3.select('.scaling-svg-container').append('div')
				.attr('class', 'hidden tool');

	}
	drawData(countryShapes, date, value, data, projection) {
		throw new Error('Map plot class do not contain data and thus the map can not be drawn');
	}

	checkInstances() {
		var g = document.getElementById('svg g');
		if (g) g.remove();

		var s = document.getElementById('slider_id');
		if (s) s.remove();

		var c = document.getElementById('colorbar-area');
		if (c) c.remove();

    var colorbar = document.getElementById('colorbar');
		if (colorbar) colorbar.remove();

    var point = document.getElementById('point_svg');
    if (point)
      point.remove();
	}
}

function formatDate(input, formatInput, formatOutput){
	var dateParse = d3.timeParse("%Y-%m-%d");
	var dateFormat = d3.timeFormat(formatOutput);
	return dateFormat(dateParse(input));
}

function getData() {

	const cdr = d3.csv("data_website/map_cdr.csv").then((data) => {
		let year_to_cases = {};
		let year_to_recovered = {};
		let year_to_deaths = {};

		let dates = {};

		let max_cases = 0;
		let max_recovered = 0;
		let max_deaths = 0;

		data.forEach((row) => {
			// Cases
			if (row.confirmed > max_cases) {
				max_cases = parseInt(row.confirmed);
			}
			var date = this.formatDate(row.Date, "%Y-%m-%d", "%B %d, %Y");
			if (year_to_cases[date] == undefined) {
				year_to_cases[date] = [];
			}
			else {
				data = {};
				data["lon"] =  row.longitude;
				data["lat"] =  row.latitude;
				data["data"] =  parseInt(row.confirmed);
				year_to_cases[date].push(data);
			}
			// Recoverd
			if (row.recovered > max_recovered) {
				max_recovered = parseInt(row.recovered);
			}
			var date = this.formatDate(row.Date, "%Y-%m-%d", "%B %d, %Y");
			if (year_to_recovered[date] == undefined) {
				year_to_recovered[date] = [];
			}
			else {
				data = {};
				data["lon"] =  row.longitude;
				data["lat"] =  row.latitude;
				data["data"] =  parseInt(row.recovered);
				year_to_recovered[date].push(data);
			}

			//Deaths
			if (row.deaths > max_deaths) {
				max_deaths = parseInt(row.deaths);
			}
			var date = this.formatDate(row.Date, "%Y-%m-%d", "%B %d, %Y");
			if (year_to_deaths[date] == undefined) {
				year_to_deaths[date] = [];
			}
			else {
				data = {};
				data["lon"] =  row.longitude;
				data["lat"] =  row.latitude;
				data["data"] =  parseInt(row.deaths);
				year_to_deaths[date].push(data);
			}
			dates[date] = date;
		});
		dates = d3.keys(dates).sort(function(a,b) { return new Date(a) - new Date(b); });
		return [[year_to_cases, max_cases], [year_to_recovered, max_recovered], [year_to_deaths, max_deaths], [dates]];
	});



	const gov_measures = d3.csv("data_website/gov_si.csv").then((data) => {
		let country_to_year_to_data = {};
		let dates = {};

		data.forEach((row) => {
			var date = this.formatDate(row.Date, "%Y-%m-%d", "%B %d, %Y");
			if (country_to_year_to_data[row.Entity] == undefined) {
				country_to_year_to_data[row.Entity] = {}
			}
			country_to_year_to_data[row.Entity][date] = parseFloat(row.StringencyIndex);

			dates[date] = date;
		});
		dates = d3.keys(dates).sort(function(a,b) { return new Date(a) - new Date(b); });
		return [country_to_year_to_data, dates];
	});
	return [cdr, gov_measures]

	}

function get_data_plots(){
	var data = [];

	var request = new XMLHttpRequest();
	request.open('GET', '../data/general_data.json', false);
	request.send(null)

	var casesData = JSON.parse(request.responseText)

	data = [casesData['Switzerland'], casesData['France']];

	return data;
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
	const cdr = data[0];
	const gov_measures = data[1];

	plot_object = new MapBubble(cdr);
	plot_object.draw();
	var change = false;

/*
	console.log('before linechart');
	const data_plot = get_data_plots();
	line_chart = new MeasuresPlot("Confirmed cases", data_plot);
	console.log('after linechart');
	line_chart.draw(data_plot)
*/
	const cases_query = document.getElementById('cases');
	cases_query.addEventListener('click', () => {
		var point = document.getElementById('point_svg');
		if (point)
			point.remove();
		if (change) {
			plot_object = new MapBubble(cdr);
			change = false;
		}
		plot_object.class_name = "Confirmed cases";
		plot_object.draw();
	});

	const recovered_query = document.getElementById('recovered');
	recovered_query.addEventListener('click', () => {
		var point = document.getElementById('point_svg');
		if (point)
			point.remove();
		if (change) {
			plot_object = new MapBubble(cdr);
			change = false;
		}
		plot_object.class_name = "Recovered";
		plot_object.draw();
	});

	const deaths_query = document.getElementById('deaths');
	deaths_query.addEventListener('click', () => {
		var point = document.getElementById('point_svg');
		if (point)
			point.remove();
		if (change) {
			plot_object = new MapBubble(cdr);
			change = false;
		}
		plot_object.class_name = "Deaths";
		plot_object.draw();
	});


	const measures_query = document.getElementById('measures');
	measures_query.addEventListener('click', () => {
		var point = document.getElementById('point_svg');
		if (point)
			point.remove();
		plot_object = new MapMeasures(gov_measures);
		plot_object.draw();
		change = true;
	});


	window.onresize = function() {
		console.log("Resize")
		plot_object.draw(plot_object.date_ind);
	};

});
