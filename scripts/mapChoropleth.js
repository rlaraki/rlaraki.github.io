class MapChoropleth extends MapPlot {

  constructor() {
		super();
    this.date_ind = 0;
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

    // Check for path deletion
    this.checkInstances();

		this.svg
			.attr('preserveAspectRatio', 'xMinYMin meet')
			.attr('viewBox', '0 0 ' + map_container_svg.offsetWidth.toString(10) + ' ' + map_container_svg.offsetHeight.toString(10))
			.classed('scaling-svg', true);


		Promise.all([this.map_promise, this.data_promise]).then((results) => {
      var format = d3.format(",");

      // Data retrieved from the premises
			let map_data = results[0];
			let data = results[1][0];
			let dates = results[1][1];
      let current_plot = this;

      // insert properties in map_data
      map_data.forEach(country => {
        country.properties.date = data[country.properties.name];
        country.properties.selectioned =  list_countries.indexOf(country.properties.name)
      });

			this.map_container = this.svg.append("g").attr('id', 'svg g');


      // Creates the Chroropleth map
      var pred;
			var pred_opacity;
      var pred_stroke_color;
      var countryShapes = this.map_container.selectAll("path")
				 .data(map_data)
				 .enter()
				 .append("path")
         .attr("d", path)
				 .on("mouseover",function(d){
					 pred = this.style.stroke_width;
           pred_opacity = this.style.opacity;
           pred_stroke_color = this.style.stroke;
           if (this.style.stroke != 'red'){
             d3.select(this)
                .style('stroke', 'white')
                .style('stroke-width', 1)
                .style('opacity', 1.2);
           } else {
             d3.select(this)
                .style('stroke', 'red')
                .style('stroke-width', 1)
                .style('opacity', 1.2);
           }

				  	})
          .on("mousemove", function(d) {
            var coordinates = d3.mouse(current_plot.svg.node());
            if (d.properties.date != undefined) {
              current_plot.tooltip.classed('hidden', false)
               .attr('style', 'left:' + (coordinates[0] + 20) + 'px; top:' + coordinates[1] + 'px')
               .html("<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Stringency Index: </strong><span class='details'>" + format(d.properties.date[dates[current_plot.date_ind]]) +"</span>");
             }
            })
          .on("mouseout",function(d){
            current_plot.tooltip.classed('hidden', true);
  					d3.select(this).style('stroke-width', 1)
              .style('opacity', pred_opacity)
              .style('stroke', pred_stroke_color);})
  				.on("click", function(d){
  					if (this.style.stroke != 'red'){
              list_countries.push(d.properties.name)
              d3.select("#line_chart")
                .dispatch('click', {detail: d.properties.name});
  					  d3.select(this).style('stroke', 'red')
                .style('stroke-width', 1);
  				  } else {
  			       d3.select(this).style('stroke', null);
               var p = list_countries.indexOf(d.properties.name)
               list_countries.splice(p, 1)
  				  }
          pred_stroke_color = this.style.stroke;
  				})
          .attr('fill', 'black')
          .attr('opacity', 0.8)

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
          current_plot.date_ind = this.value;
	 				current_plot.drawData(countryShapes, date, this.value, data);
	 			});

			this.drawData(countryShapes, dates[date_indice], date_indice);

      // Zoom action
			const zoom = d3.zoom()
	 	 					       .scaleExtent([1, 8])
	 	 					       .on('zoom', function() {
	 										  d3.event.transform.x = Math.min(0, Math.max(d3.event.transform.x, width - width * d3.event.transform.k));
	 						   				d3.event.transform.y = Math.min(0, Math.max(d3.event.transform.y, height - height * d3.event.transform.k));
	 											current_plot.map_container.selectAll('path').attr("transform", d3.event.transform);
	 	 								 });
	 			this.svg.call(zoom);

				this.makeLegend(this.svg, [35, height*0.25], [width * 0.03, height * 0.5]);
		});
	}

  makeLegend(svg, top_left, colorbar_size, scaleClass=d3.scaleLinear) {

		const value_to_svg = scaleClass()
			.domain(this.color_scale.domain())
			.range([colorbar_size[1], 0]);

		const range01_to_color = d3.scaleLinear()
			.domain([0, 1])
			.range(this.color_scale.range())
			.interpolate(this.color_scale.interpolate());

		// Axis numbers
		const colorbar_axis = d3.axisLeft(value_to_svg)
			.tickFormat(d3.format(".0f"))

		const colorbar_g = svg.append('g')
			.attr("id", "colorbar")
			.attr("transform", "translate(" + top_left[0] + ', ' + top_left[1] + ")")
			.call(colorbar_axis);


		// Create the gradient
		function range01(steps) {
			return Array.from(Array(steps), (elem, index) => index / (steps-1));
		}

		const svg_defs = svg.append("defs");

		const gradient = svg_defs.append('linearGradient')
			.attr('id', 'colorbar-gradient')
			.attr('x1', '0%') // left
			.attr('y1', '100%')
			.attr('x2', '0%') // to right
			.attr('y2', '0%')
			.attr('spreadMethod', 'pad');

		gradient.selectAll('stop')
			.data(range01(10))
			.enter()
			.append('stop')
				.attr('offset', d => Math.round(100*d) + '%')
				.attr('stop-color', d => range01_to_color(d))
				.attr('stop-opacity', 1);

		// create the colorful rect
		colorbar_g.append('rect')
			.attr('id', 'colorbar-area')
			.attr('width', colorbar_size[0])
			.attr('height', colorbar_size[1])
			.style('fill', 'url(#colorbar-gradient)')
			.style('stroke', 'black')
			.style('stroke-width', '1px')
      .style('opacity', 0.8);
	}

  drawData(countryShapes, date, value) {

		const current_class = this;
		d3.select("#date-value").text(date);
		d3.select("#slider_id").property("value", value);

		countryShapes.style("fill", function(d) {
			if (d.properties.date != undefined) {
        if (d.properties.date[date] != undefined) {
          return current_class.color_scale(d.properties.date[date]);
        }
				else {
          return "#ccc";
        }
			}
			else {
				return "#ccc";
			}
		})
    .style('stroke', function(d) {
      if (d.properties.selectioned >= 0) {
        return 'red';
      }
    });
	}

}
