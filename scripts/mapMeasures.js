class MapMeasures extends MapChoropleth {
  constructor(data) {
    super();
    this.color_scale = d3.scaleLinear()
      .range(["#9cb5b4", "#034946"])
      .interpolate(d3.interpolateHcl)
      .domain([0, 100]);
    this.data_promise = data;
  }


}
