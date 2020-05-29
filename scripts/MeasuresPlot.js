class MeasuresPlot {

  constructor(class_name, total_data) {

    this.class_name = class_name;
    this.total_data = total_data;


    var plot_container = document.getElementById('right_scroll_plot');

    this.height = 300;
    this.width = plot_container.offsetWidth;


    this.margin = 40;

    this.svg = d3.select('div#right_scroll_plot').append("svg")
      .attr('id', "line_chart")
      .attr('preserveAspectRatio', 'xMinYMin meet')

      .attr("width", (this.width) + "px")
      .attr("height", (this.height) + "px")

  }

  draw() {
    /* Format Data */
    var parseDate = d3.timeParse("%d-%m-%Y");

    /* Add Axis into SVG */

    var data = [this.total_data['Switzerland'], this.total_data['France']];

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var height_linechart = this.height;
    var width_linechart = this.width;
    var margin_linechart = this.margin;

    /* Add SVG */
    this.svg
      .on("click", function(d) {
        svg.selectAll('*').remove();

        var request = new XMLHttpRequest();
        request.open('GET', '../data/general_data.json', false);
        request.send(null)

        var casesData = JSON.parse(request.responseText)
        data = []
        list_countries.forEach((item) => {
          data = data.concat(casesData[item])
        });
        this.update(data);
      })
      .attr("width", (width_linechart + margin_linechart) + "px")
      .attr("height", (height_linechart + margin_linechart) + "px")
      .append('g')
      .attr("transform", `translate(${margin_linechart}, ${margin_linechart})`)
      .attr('id', 'firstG');

    this.update(data);
  }

  update(data) {
    //console.log('line_charts data first before parse', data);
    const duration = 250;
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


    data.forEach(function(d) {
      d.values.forEach(function(d) {
        d.date = parseDate(d.date);
        d.cases = +d.cases;
      });
    });

    //console.log('line_charts data first after parse', data);
    var height_linechart = this.height;
    var width_linechart = this.width;
    var margin_linechart = this.margin;
    /* Scale */
    var xScale = d3.scaleTime()
      .domain(d3.extent(data[0].values, d => d.date))
      .range([margin_linechart, width_linechart - margin_linechart]);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(data[0].values, d => d.cases)])
      .range([height_linechart - margin_linechart, 0]);



    var xAxis = d3.axisBottom(xScale).ticks(10);
    var yAxis = d3.axisLeft(yScale).ticks(10);

    yAxis = g => g
      .attr("transform", `translate(${margin_linechart},0)`)
      .call(d3.axisLeft(yScale));

    /* Add line into SVG */
    var line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.cases));

    let lines = this.svg.append('g')
      .attr('class', 'lines')
      .attr('id', 'linesChart_lines');

    //console.log('data for lines', data);
    lines.selectAll('.line-group')
      .data(data).enter()
      .append('g')
      .attr('class', 'line-group')
      .on("mouseover", function(d, i) {
        this.svg.append("text")
          .attr("class", "title-text")
          .style("fill", color(i))
          .text(d.name)
          .attr("text-anchor", "middle")
          .attr("x", (width_linechart - margin_linechart) / 2)
          .attr("y", 5);
      })
      .on("mouseout", function(d) {
        this.svg.select(".title-text").remove();
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
          .style("stroke-width_linechart", lineStrokeHover)
          .style("cursor", "pointer");
      })
      .on("mouseout", function(d) {
        d3.selectAll(".line")
          .style('opacity', lineOpacity);
        d3.selectAll('.circle')
          .style('opacity', circleOpacity);
        d3.select(this)
          .style("stroke-width_linechart", lineStroke)
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

    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height_linechart-margin_linechart})`)
      .call(xAxis);

    this.svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append('text')
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#000")
      .text("Total values");

  }
}
