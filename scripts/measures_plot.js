class measures_plot {

constructor(class_name, data){

  this.data_promise = data;
  this.class_name = class_name;


  const width = 420;
  const height = 300;
  const margin = 20;

  this.svg = d3.select("div#right_scroll_plot").append("svg")
  .attr('id', "line_chart")
  .attr("width", (width+margin)+"px")
  .attr("height", (height+margin)+"px")
  .append('g')
  .attr("transform", `translate(${margin}, ${margin})`);
}

draw(data){

  var lineOpacity = "0.25";
  var lineOpacityHover = "0.85";
  var otherLinesOpacityHover = "0.1";
  var lineStroke = "1.5px";
  var lineStrokeHover = "2.5px";
  var parseDate = d3.timeParse("%d-%m-%Y");
  var circleOpacity = '0.85';
  var circleOpacityOnLineHover = "0.25"
  var circleRadius = 3;
  var circleRadiusHover = 6;

  //var svg = document.getElementById('plot_container')

  /* Scale */
  data.forEach(function(d) {
    d.values.forEach(function(d) {
      d.date = parseDate(d.date);
      d.cases = +d.cases;
    });
  });

svg = this.svg;

  /* Scale */
  var lineOpacity = "0.25";
  var lineOpacityHover = "0.85";
  var otherLinesOpacityHover = "0.1";
  var lineStroke = "1.5px";
  var lineStrokeHover = "2.5px";

  var circleOpacity = '0.85';
  var circleOpacityOnLineHover = "0.25"
  var circleRadius = 3;
  var circleRadiusHover = 6;


  /* Format Data */
  var parseDate = d3.timeParse("%d-%m-%Y");


  /* Add Axis into SVG */


  var color = d3.scaleOrdinal(d3.schemeCategory10);

  /* Add SVG */

    data.forEach(function(d) {
      d.values.forEach(function(d) {
        d.date = parseDate(d.date);
        d.cases = +d.cases;
      });
    });


    /* Scale */
    var xScale = d3.scaleTime()
      .domain(d3.extent(data[0].values, d => d.date))
      .range([0, width-margin]);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(data[0].values, d => d.cases)])
      .range([height-margin, 0]);

    var xAxis = d3.axisBottom(xScale).ticks(10);
    var yAxis = d3.axisLeft(yScale).ticks(10);

    /* Add line into SVG */
    var line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.cases));

    let lines = svg.append('g')
      .attr('class', 'lines');


    lines.selectAll('.line-group')
      .data(data).enter()
      .append('g')
      .attr('class', 'line-group')
      .on("mouseover", function(d, i) {
          svg.append("text")
            .attr("class", "title-text")
            .style("fill", color(i))
            .text(d.name)
            .attr("text-anchor", "middle")
            .attr("x", (width-margin)/2)
            .attr("y", 5);
        })
      .on("mouseout", function(d) {
          svg.select(".title-text").remove();
        })
      .append('path')
      .attr('class', 'line')
      .attr('d', d => line(d.values))
      .style('stroke', (d, i) => color(i))
      .style('opacity', lineOpacity)
      .on("mouseover", function(d) {
          d3.selectAll('.line')
    					.style('opacity', otherLinesOpacityHover);
          d3.selectAll('.circle')
    					.style('opacity', circleOpacityOnLineHover);
          d3.select(this)
            .style('opacity', lineOpacityHover)
            .style("stroke-width", lineStrokeHover)
            .style("cursor", "pointer");
        })
      .on("mouseout", function(d) {
          d3.selectAll(".line")
    					.style('opacity', lineOpacity);
          d3.selectAll('.circle')
    					.style('opacity', circleOpacity);
          d3.select(this)
            .style("stroke-width", lineStroke)
            .style("cursor", "none");
        });


    /* Add circles in the line */
    lines.selectAll("circle-group")
      .data(data).enter()
      .append("g")
      .style("fill", (d, i) => color(i))
      .selectAll("circle")
      .data(d => d.values).enter()
      .append("g")
      .attr("class", "circle")
      .on("mouseover", function(d) {
          d3.select(this)
            .style("cursor", "pointer")
            .append("text")
            .attr("class", "text")
            .text(`${d.cases}`)
            .attr("x", d => xScale(d.date) + 5)
            .attr("y", d => yScale(d.cases) - 10);
        })
      .on("mouseout", function(d) {
          d3.select(this)
            .style("cursor", "none")
            .transition()
            .duration(duration)
            .selectAll(".text").remove();
        })
      .append("circle")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.cases))
      .attr("r", circleRadius)
      .style('opacity', circleOpacity)
      .on("mouseover", function(d) {
            d3.select(this)
              .transition()
              .duration(duration)
              .attr("r", circleRadiusHover);
          })
        .on("mouseout", function(d) {
            d3.select(this)
              .transition()
              .duration(duration)
              .attr("r", circleRadius);
          });




    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height-margin})`)
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append('text')
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#000")
      .text("Total values");




}
}
