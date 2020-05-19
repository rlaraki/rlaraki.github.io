class MapMeasures extends MapChoropleth {
	constructor(data) {
		super();
		this.color_scale = d3.scaleLinear()
			.range(["hsl(62,100%,90%)", "hsl(228,30%,20%)"])
			.interpolate(d3.interpolateHcl);
		this.color_scale.domain([0, 100]);
		this.data_promise = data;
	}


}
