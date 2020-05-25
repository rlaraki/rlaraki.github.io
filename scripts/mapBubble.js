class MapBubble extends MapPlot {

  constructor() {
		super();
	}

  draw(date_indice = 0){

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

      var format = d3.format(",");
			var pred;
      let value = [dates[0], 0]
      var pred;
			var pred_opacity;
      var pred_stroke_color;

      this.map_container.selectAll("path")
				 .data(map_data)
				 .enter()
				 .append("path")
				 .on("mouseover",function(d){
					 pred = this.style.stroke_width;
           pred_opacity = this.style.opacity;
           pred_stroke_color = this.style.stroke;
           if (this.style.stroke != 'black'){
             d3.select(this)
                .style('stroke', 'white')
                .style('stroke-width', 1)
                .style('opacity', 1.2);
           } else {
             d3.select(this)
                .style('stroke', 'black')
                .style('stroke-width', 1)
                .style('opacity', 1.2);
           }

				  	})
          .on("mousemove", function(d) {
            var coordinates = d3.mouse(current_plot.svg.node());
            current_plot.tooltip.classed('hidden', false)
             .attr('style', 'left:' + (coordinates[0] + 20) + 'px; top:' + coordinates[1] + 'px')
             .html("<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Stringency Index: </strong><span class='details'>" + console.log(d) +"</span>");
          })
          .on("mouseout",function(d){
            current_plot.tooltip.classed('hidden', true);
  					d3.select(this).style('stroke-width', 1)
              .style('opacity', pred_opacity)
              .style('stroke', pred_stroke_color);})
  				.on("click", function(){
  					if (this.style.stroke != 'black'){
  					  d3.select(this).style('stroke', 'black')
                .style('stroke-width', 1);
  				} else {
  					d3.select(this).style('stroke', null);
  				}
          pred_stroke_color = this.style.stroke;
  				})
					.attr('fill', 'black')
					.attr("d", path)
          .style("fill", "#ccc");


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
          value = [date, this.value];
					var point = document.getElementById('point_svg');
					if (point)
						point.remove();
					point_container = current_plot.svg.append("g").attr('id', 'point_svg');
          current_plot.date_ind = this.value;
	 				current_plot.drawData(date, this.value, data, projection, point_container);
	 			});

			var point_container = this.svg.append("g").attr('id', 'point_svg');
			this.drawData(dates[date_indice], date_indice, data, projection, point_container);

			const zoom = d3.zoom()
	 	 					       .scaleExtent([1, 8])
	 	 					       .on('zoom', function() {
	 										  d3.event.transform.x = Math.min(0, Math.max(d3.event.transform.x, width - width * d3.event.transform.k));
	 						   				d3.event.transform.y = Math.min(0, Math.max(d3.event.transform.y, height - height * d3.event.transform.k));
	 											current_plot.map_container.selectAll('path').attr("transform", d3.event.transform);
												point_container.selectAll('circle').attr("transform", d3.event.transform);


	 	 								 });
	 			this.svg.call(zoom);
        this.legend = this.map_container.append("g")
          .attr("fill", "#777")
          .attr("transform", "translate(" + width * 0.05 + ', ' + height * 0.95 + ")")
          .attr("text-anchor", "middle")
          .style("font", "10px sans-serif")
          .selectAll("circle")
            .data([parseInt(this.max/4), parseInt(this.max/2), parseInt(this.max)])
            .enter();
        this.legend.append("circle")
      	        .attr("fill", "none")
      	        .attr("stroke", "black")
      	        .attr("cy", d => -this.point_scale(d))
      	        .attr("r", this.point_scale);
        this.legend.append("text")
  	        .attr("y", d => -2 * this.point_scale(d))
  	        .attr("dy", "1.3em")
  	        .text(d3.format(".1s"));
		});
	}
}
