class MapMeasures extends MapChoropleth {
	constructor(data) {
		super();
		this.color_scale = d3.scaleLinear()
			.range(["rgb(222,235,247)", "hsl(230,100%,20%)"])
			.interpolate(d3.interpolateHcl)
			.domain([0, 100]);
		this.data_promise = data;
	}


}
