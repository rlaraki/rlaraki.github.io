
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

		this.map_promise = d3.json("data/countries.json").then((topojson_raw) => {
	 			const country_paths = topojson.feature(topojson_raw, topojson_raw.objects.countries);
	 			return country_paths.features;
	 		});
		this.tooltip = d3.select('.scaling-svg-container').append('div')
				.attr('class', 'hidden tooltip');

	}
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
			if (country_to_year_to_data[row.Entity] == undefined) {
				country_to_year_to_data[row.Entity] = {}
			}
			country_to_year_to_data[row.Entity][date] = parseFloat(row.StringencyIndex);

			dates[date] = date;
		});
		dates = d3.keys(dates).sort(function(a,b) { return new Date(a) - new Date(b); });
		return [country_to_year_to_data, dates];
	});
	return [cases, recovered, deaths, gov_measures]

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
		plot_object.draw(plot_object.date_ind);
	};

});
