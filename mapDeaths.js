class MapDeaths extends MapBubble {
	constructor() {
		super();
	}

	getData() {
		const deaths_data = d3.csv("data_website/map_cdr.csv").then((data) => {
			let year_to_data = {};
			let dates = {};

			data.forEach((row) => {
				var date = this.formatDate(row.Date, "%Y-%m-%d", "%B %d, %Y");
				if (year_to_data[date] == undefined) {
					year_to_data[date] = [];
				}
				else {
          data = {};
          data["lon"] =  row.longitude;
          data["lat"] =  row.latitude;
          data["deaths"] =  parseInt(row.deaths);
          year_to_data[date].push(data);
				}
				dates[date] = date;
			});
			dates = d3.keys(dates).sort(function(a,b) { return new Date(a) - new Date(b); });
			return [year_to_data, dates];
		});
		return deaths_data;
	}


	drawData(countryShapes, date, value, data, projection, point_container) {
    console.log(data);
    this.point_scale = d3.scaleLinear()
        .domain([0, d3.max(data[date], d => d["deaths"])])
        .range([0, 15]);


		d3.select("#date-value").text(date);
		d3.select("#slider_id").property("value", value);

		countryShapes.style("fill", "blue");
    point_container.selectAll("circle")
      .data(data[date])
			.enter()
			.append("circle")
			.attr("r",  (d) => this.point_scale(d["deaths"]))
			.attr("cx", (d) => projection([d["lon"], d["lat"]])[0])
			.attr("cy", (d) => projection([d["lon"], d["lat"]])[1])
      .style("fill", "red");
	}


  makeLegend(svg, top_left, colorbar_size, scaleClass=d3.scaleLinear) {}

}
