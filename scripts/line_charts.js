var data = [];

var request = new XMLHttpRequest();
request.open('GET', '../data/general_data.json', false);
request.send(null)

var casesData = JSON.parse(request.responseText)
//list_countries.forEach(add_data);
/*
function add_data(item) {
  data = data.concat(casesData[item])
}
*/
data = [casesData['France'], casesData['Switzerland']];

const width_linechart = 420;
const height_linechart = 300;
const margin_linechart = 20;
var duration = 250;

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
var svg = d3.select("#right_scroll_plot").append("svg")
  .attr("id", 'line_chart')
  .on("click", function (d) {
    svg.selectAll('*').remove();

    var request = new XMLHttpRequest();
    request.open('GET', '../data/general_data.json', false);
    request.send(null)

    var casesData = JSON.parse(request.responseText)

    data = []
    list_countries.forEach((item) => {
      data = data.concat(casesData[item])
    });
    //console.log('line charts list countries', list_countries);
    //console.log('line charts data second', data);

    draw();


  })
  .attr("width", (width_linechart + margin_linechart) + "px")
  .attr("height", (height_linechart + margin_linechart) + "px")
  .append('g')
  .attr("transform", `translate(${margin_linechart}, ${margin_linechart})`)
  .attr('id', 'firstG');


function draw() {
  //console.log('line_charts data first before parse', data);
  data.forEach(function(d) {
    d.values.forEach(function(d) {
      d.date = parseDate(d.date);
      d.cases = +d.cases;
    });
  });

  //console.log('line_charts data first after parse', data);

  /* Scale */
  var xScale = d3.scaleTime()
    .domain(d3.extent(data[0].values, d => d.date))
    .range([0, width_linechart-margin_linechart]);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data[0].values, d => d.cases)])
    .range([height_linechart-margin_linechart, 0]);

  var xAxis = d3.axisBottom(xScale).ticks(10);
  var yAxis = d3.axisLeft(yScale).ticks(10);

  /* Add line into SVG */
  var line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.cases));

  let lines = svg.append('g')
    .attr('class', 'lines')
    .attr('id', 'linesChart_lines');

  //console.log('data for lines', data);
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
          .attr("x", (width_linechart-margin_linechart)/2)
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

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height_linechart-margin_linechart})`)
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

draw()
