
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

		this.data_promise = this.getData();

	}


	formatDate(input, formatInput, formatOutput){
		var dateParse = d3.timeParse("%Y-%m-%d");
		var dateFormat = d3.timeFormat(formatOutput);
		return dateFormat(dateParse(input));
	}


	getData() {
		throw new Error('Map plot class do not contain data');
	}

	drawData(countryShapes, date, value, data, projection) {
		throw new Error('Map plot class do not contain data and thus the map can not be drawn');
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
	plot_object = new MapMeasures();
	plot_object.draw();

	const cases_query = document.getElementById('cases');
	cases_query.addEventListener('click', () => {
		var point = document.getElementById('point_svg');
		if (point)
			point.remove();
		plot_object = new MapCases();
		plot_object.draw();
	});

	const recovered_query = document.getElementById('recovered');
	recovered_query.addEventListener('click', () => {
		var point = document.getElementById('point_svg');
		if (point)
			point.remove();
		plot_object = new MapRecovered();
		plot_object.draw();
	});

	const deaths_query = document.getElementById('deaths');
	deaths_query.addEventListener('click', () => {
		var point = document.getElementById('point_svg');
		if (point)
			point.remove();
		plot_object = new MapDeaths();
		plot_object.draw();
	});


	const measures_query = document.getElementById('measures');
	measures_query.addEventListener('click', () => {
		var point = document.getElementById('point_svg');
		if (point)
			point.remove();
		plot_object = new MapMeasures();
		plot_object.draw();
	});


	window.onresize = function() {
		console.log("resize")
		plot_object.draw();
	};

});
