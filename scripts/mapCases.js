class MapCases extends MapBubble {
	constructor(data) {
		super();
		this.data_promise = data;
	}


		drawData(countryShapes, date, value, data, projection, point_container) {
	    console.log(data);
	    this.point_scale = d3.scaleLinear()
	        .domain([0, this.max])
	        .range([0, 60]);

			d3.select("#date-value").text(date);
			d3.select("#slider_id").property("value", value);

			countryShapes.style("fill", "blue");
	    point_container.selectAll("circle")
	      .data(data[date])
				.enter()
				.append("circle")
				.attr("r",  (d) => this.point_scale(d["confirmed"]))
				.attr("cx", (d) => projection([d["lon"], d["lat"]])[0])
				.attr("cy", (d) => projection([d["lon"], d["lat"]])[1])
	      .style("fill", "red");
		}

}
