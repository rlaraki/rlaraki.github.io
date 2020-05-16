class MapMeasures extends MapChoropleth {
	constructor() {
		super();
		this.color_scale = d3.scaleLinear()
			.range(["hsl(62,100%,90%)", "hsl(228,30%,20%)"])
			.interpolate(d3.interpolateHcl);
	}

	getData() {
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
		return gov_measures;
	}


	drawData(countryShapes, date, value, data) {

		this.color_scale.domain([0, 100]);
		const current_class = this;
		d3.select("#date-value").text(date);
		d3.select("#slider_id").property("value", value);

		countryShapes.style("fill", function(d) {
			if (d.properties.date != undefined) {
				return current_class.color_scale(d.properties.date[date]);
			}
			else {
				return current_class.color_scale(d.properties.date);
			}
		});
	}

}
