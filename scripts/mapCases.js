class MapCases extends MapBubble {
	constructor(data) {
		super();
		this.data_promise = data;
	}


		drawData(countryShapes, date, value, data, projection, point_container) {
	    this.point_scale = d3.scaleLinear()
	        .domain([0, this.max])
	        .range([0, 40]);

			d3.select("#date-value").text(date);
			d3.select("#slider_id").property("value", value);

			countryShapes.style("fill", "#ccc");

/*
			this.legend.append("circle")
	        .attr("fill", "none")
	        .attr("stroke", "#ccc")
	        .attr("cy", d => console.log(d))
	        .attr("r", this.point_scale);

	    this.legend.append("text")
	        .attr("y", d => -2 * this.point_scale(d))
	        .attr("dy", "1.3em")
	        .text(d3.format(".1s"));
*/

	    point_container.selectAll("circle")
	      .data(data[date])
				.enter()
				.append("circle")
				.attr("r",  (d) => this.point_scale(d["confirmed"]))
				.attr("cx", (d) => projection([d["lon"], d["lat"]])[0])
				.attr("cy", (d) => projection([d["lon"], d["lat"]])[1])
	      .style("fill", "red")
				.attr("fill-opacity", 0.5);
		}

}
