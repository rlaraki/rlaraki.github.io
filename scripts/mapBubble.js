class MapBubble extends MapPlot {

  constructor() {
		super();
	}

  draw(){

		var map_container_svg = document.getElementById('map_container_svg')
		this.svg_viewbox = this.svg.node().viewBox.animVal;

		const width = this.svg_viewbox.width;
		const height= this.svg_viewbox.height;

		var projection = d3.geoMercator()
								 .translate([width/2, width/2])
								 .scale([width * 0.15]);

		// use projection fn with geoPath fn
		var path = d3.geoPath()
						 .projection(projection);

		var g = document.getElementById('svg g');
		if (g) g.remove();

		var s = document.getElementById('slider_id');
		if (s) s.remove();

		var c = document.getElementById('colorbar-area');
		if (c) c.remove();

    var point = document.getElementById('point_svg');
    if (point)
      point.remove();


		this.svg
			.attr('preserveAspectRatio', 'xMinYMin meet')
			.attr('viewBox', '0 0 ' + map_container_svg.offsetWidth.toString(10) + ' ' + map_container_svg.offsetHeight.toString(10))
			.classed('scaling-svg', true);


		Promise.all([this.map_promise, this.data_promise]).then((results) => {
			let map_data = results[0];
			let data = results[1][0];
			let dates = results[1][1];
      this.max = results[1][2];

			this.map_container = this.svg.append("g").attr('id', 'svg g');

			let current_plot = this;

			var pred;
			var countryShapes = this.map_container.selectAll("path")
				 .data(map_data)
				 .enter()
				 .append("path")
				 .on("mouseover",function(){
					 pred = this.style.fill;
					 d3.select(this).style('fill', 'red').style('stroke');
				  	})
 	          .on("mouseout",function(){
		 					d3.select(this).style('fill', pred);})
							.on("click", function(){
								if (this.style.stroke != 'red'){
								d3.select(this).style('stroke', 'red');
							} else {
								d3.select(this).style('stroke', null);
							}
							})
						.attr('fill', 'black')
								.attr("d", path);


			 d3.select("#slider")
 				.select("label")
 				.style("width", width*0.25);

			 d3.select("#slider")
	 			.append("input")
				.style("width", width*0.5)
				.attr("id", "slider_id")
	 			.attr("type", "range")
	 			.attr("min", 0)
	 			.attr("max", dates.length - 1)
				.attr("step", 1)
				.attr("displayValue", true)
	 			.on("input", function() {
	 				var date = dates[this.value];
					var point = document.getElementById('point_svg');
					if (point)
						point.remove();
					point_container = current_plot.svg.append("g").attr('id', 'point_svg');
	 				current_plot.drawData(countryShapes, date, this.value, data, projection, point_container);
	 			});

			var point_container = this.svg.append("g").attr('id', 'point_svg');
			this.drawData(countryShapes, dates[0], 0, data, projection, point_container);

			const zoom = d3.zoom()
	 	 					       .scaleExtent([1, 8])
	 	 					       .on('zoom', function() {
	 										  d3.event.transform.x = Math.min(0, Math.max(d3.event.transform.x, width - width * d3.event.transform.k));
	 						   				d3.event.transform.y = Math.min(0, Math.max(d3.event.transform.y, height - height * d3.event.transform.k));
	 											current_plot.map_container.selectAll('path').attr("transform", d3.event.transform);
												point_container.selectAll('circle').attr('transform', d3.event.transform.toString());
	 	 								 });
	 			this.svg.call(zoom);
        this.map_container.append("g")
          .attr("fill", "#777")
          .attr("transform", "translate(" + width * 0.05 + ', ' + height * 0.95 + ")")
          .attr("text-anchor", "middle")
          .style("font", "10px sans-serif")
          .selectAll("circle")
            .data([parseInt(this.max/4), parseInt(this.max/2), parseInt(this.max)])
            .enter()
            .append("circle")
      	        .attr("fill", "none")
      	        .attr("stroke", "black")
      	        .attr("cy", d => -this.point_scale(d))
      	        .attr("r", this.point_scale);
		});
	}


}
