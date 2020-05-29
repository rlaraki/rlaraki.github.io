class BarPlot {

  constructor(class_name, total_data){

    this.class_name = class_name;
    this.total_data = this.parseData(this.getData()['data']);

    var plot_container = document.getElementById('right_scroll_plot'); 
    this.height = 300;
    this.width = plot_container.offsetWidth ;  
    this.margin = 60;

    this.svg = d3.select('div#right_scroll_plot')
      .append("div")
      .classed("svg_cont_barplot", true)
      .attr("id", "bar_plot_cont")
      .append("svg")
      .classed("svg_barplot", true)
      .attr('id', "bar_chart")
      .attr('preserveAspectRatio', 'xMinYMin meet') 
      .attr("viewBox", "0 -30 " + (this.width) + ' ' + (this.height))

      this.tool = d3.select(".right_scroll_plot").append('div')
          .attr('class', 'hidden tool');

  }

  getData() {
    var generalData;
    if (this.class_name == 'Confirmed cases') {
      var request = new XMLHttpRequest();
      request.open('GET', '../data/top6_cases.json', false);
      request.send(null);
      generalData = JSON.parse(request.responseText);
    }
    else if (this.class_name == 'Recovered') {
      var request = new XMLHttpRequest();
      request.open('GET', '../data/top6_recovered.json', false);
      request.send(null);
      generalData = JSON.parse(request.responseText);
    }
    if (this.class_name == 'Deaths') {
      var request = new XMLHttpRequest();
      request.open('GET', '../data/top6_deaths.json', false);
      request.send(null);
      generalData = JSON.parse(request.responseText);
    }
    else if (this.class_name == 'Measures') {
      var request = new XMLHttpRequest();
      request.open('GET', '../data/top6_measures.json', false);
      request.send(null);
      generalData = JSON.parse(request.responseText);
    }
    return generalData;
  }

  parseData(data) {
    let current = this;
    data.forEach(function(d) {
      d.name = d.name;
      d.value = +d.value;
    });
    return data;
  }

  draw() {
    var format = d3.format(",");
    var current = this;

    var xScale = d3.scaleBand()
      .domain(d3.range(this.total_data.length))
      .range([this.margin, this.width])
      .padding(0.3);

    // number of countries taken
    var yScale = d3.scaleLinear()
      .domain([0, this.total_data[0].value])
      .range([this.height-this.margin, 0]);

    var xAxis = g => g
      .attr("transform", `translate(0,${this.height-this.margin})`)
      .attr("class", "axisWhite")
      .call(d3.axisBottom(xScale).tickFormat(i => this.total_data[i].name).tickSizeOuter(0));


    var yAxis = g => g
      .attr("transform", `translate(${this.margin},0)`)
      .attr("class", "axisWhite")
      .call(d3.axisLeft(yScale).ticks(null, this.total_data.format))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
          .attr("x", -this.margin)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(this.total_data.y));

    this.svg.append("g")
      .attr("fill", "#ccc")
      .selectAll("rect")
      .data(this.total_data)
      .enter()
      .append("rect")
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d.value))
        .attr("height", d => yScale(0) - yScale(d.value))
        .attr("width", xScale.bandwidth())
      .on('mouseover', function (d) {
        var coordinates = d3.mouse(d3.select('.scaling-svg-container').node());

        current.tool.classed('hidden', false)
          .attr('style', 'left:' + (coordinates[0] -140) + 'px; top:' + coordinates[1] + 'px')
          .html("<strong>Country: </strong><span class='details'>" + d.name + "<br></span>" + "<strong>"+  current.class_name + ": </strong><span class='details'>" + format(d.value) +"</span>");

      })
      .on('mouseout', function () {
        current.tool.classed('hidden', true);
      });



    this.svg.append("g")
      .attr("transform", `translate(0, ${height - margin})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'translate(0,16)rotate(30)');

    this.svg.append("g")
      .call(yAxis);

  }

}
