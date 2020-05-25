class MapDeaths extends MapBubble {
	constructor(data) {
		super();
		this.data_promise = data;
	}


	drawData(date, value, data, projection, point_container) {
    this.point_scale = d3.scaleSqrt()
        .domain([0, this.max])
        .range([0, 40]);



		d3.select("#date-value").text(date);
		d3.select("#slider_id").property("value", value);

    point_container.selectAll("circle")
      .data(data[date])
			.enter()
			.append("circle")
			.attr("r",  (d) => this.point_scale(d["deaths"]))
			.attr("cx", (d) => projection([d["lon"], d["lat"]])[0])
			.attr("cy", (d) => projection([d["lon"], d["lat"]])[1])
      .style("fill", "black")
			.attr("fill-opacity", 0.5);
	}


  makeLegend(svg, top_left, colorbar_size, scaleClass=d3.scaleLinear) {}

}
