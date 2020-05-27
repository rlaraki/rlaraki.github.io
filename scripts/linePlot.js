
class LinePlot {

    constructor(class_name, total_data) {

        this.class_name = class_name;
        this.total_data = this.getData();

        var plot_container = document.getElementById('right_scroll_plot'); 
        this.margin = 20;
        this.height = 350;
        this.width = plot_container.offsetWidth;  

        this.tool2 = d3.select(".right_scroll_plot")
            .append('div')
            .attr('class', 'hidden tool');

        this.svg = d3.select('div#right_scroll_plot').append("svg")
        .attr('id', "line_chart")
        .attr('preserveAspectRatio', 'xMinYMin meet') 
        .attr("width", (this.width + this.margin) + "px")
        .attr("height", (this.height + this.margin) + "px")

    }

    getData() {
        var generalData;
        if (this.class_name == 'Confirmed cases' | this.class_name == 'Recovered' | this.class_name == 'Deaths') {
            var request = new XMLHttpRequest();
            request.open('GET', '../data/general_data.json', false);
            request.send(null);
            generalData = JSON.parse(request.responseText);
        } else if (this.class_name == 'Testing') {
            var request = new XMLHttpRequest();
            request.open('GET', '../data/testing_data.json', false);
            request.send(null);
            generalData = JSON.parse(request.responseText);
        }
        return generalData;
    }

    concatData() {
        var data = []
        if (this.class_name == 'Confirmed cases' | this.class_name == 'Recovered' | this.class_name == 'Deaths') {
            var request = new XMLHttpRequest();
            request.open('GET', '../data/general_data.json', false);
            request.send(null);
            var generalData = JSON.parse(request.responseText);
            list_countries.forEach((item) => {
                data = data.concat(generalData[item])
            });
        } else if (this.class_name == 'Testing') {
            var request = new XMLHttpRequest();
            request.open('GET', '../data/testing_data.json', false);
            request.send(null);
            var generalData = JSON.parse(request.responseText);
            list_countries.forEach((item) => {
                data = data.concat(generalData[item])
            });
        }
        return data;
    }

    draw() {

        var data = this.concatData();

        /* Add Axis into SVG */
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        var height_linechart = this.height;
        var width_linechart = this.width;
        var margin_linechart = this.margin;
        let current = this;

        /* Add SVG */
        this.svg
            .on("click", function(d) {
                current.svg.selectAll('*').remove();
                data = current.concatData();
                if (data.length > 0) {
                    current.update(data);
                }
            })

        if (data.length > 0) {
            this.update(data);
        }
    }

    parseData(data) {
        let current = this;
        var parseDate = d3.timeParse("%d-%m-%Y");

        data.forEach(function(d) {
            d.country = d.name;
            d.values.forEach(function(d) {
                d.date = parseDate(d.date);
                if (current.class_name == "Confirmed cases") {
                    d.data = +d.cases;
                    d.type = 'cases';
                } else if (current.class_name == "Recovered") {
                    d.data = +d.recovered;
                    d.type = 'recovered';
                } else if (current.class_name == "Deaths") {
                    d.data = +d.deaths;
                    d.type = 'deaths';
                } else if (current.class_name == "Testing") {
                    d.data = +d.tests;
                    d.type = 'tests';
                }
            });
        });
        return data;
    }

    update(data) {
        //console.log('line_charts data first before parse', data);
        const duration = 250;
        const margin_linechart_left = 60;
        var lineOpacity = "0.25";
        var lineOpacityHover = "0.85";
        var otherLinesOpacityHover = "0.1";
        var lineStroke = "1.5px";
        var lineStrokeHover = "2.5px";
        var circleOpacity = '0.85';
        var circleOpacityOnLineHover = "0.25"
        var circleRadius = 3;
        var circleRadiusHover = 6;
        let current = this;


        data = this.parseData(data);

        this.svg
            .append('g')
            .attr("transform", `translate(${margin_linechart}, ${margin_linechart})`)
            .attr('id', 'firstG');

        //console.log('line_charts data first after parse', data);
        var height_linechart = this.height;
        var width_linechart = this.width;
        var margin_linechart = this.margin;

        var max_min_date_all_countries = [];
        var max_cases_all_countries = [];

        data.forEach((item) => {
            var max_min_date_per_country = d3.extent(item.values, d => d.date)
            max_min_date_all_countries = max_min_date_all_countries.concat(max_min_date_per_country)

        });

        data.forEach((item) => {
            var max_cases_per_country = d3.max(item.values, d => d.data)
            max_cases_all_countries.push(max_cases_per_country)
        });

        /* Scale */
        var xScale = d3.scaleTime()
            .domain(d3.extent(max_min_date_all_countries))
            .range([margin_linechart_left, width_linechart - margin_linechart]);

        var yScale = d3.scaleLinear()
            //.domain([0, d3.max(data, d => d.cases)])
            .domain([0, d3.max(max_cases_all_countries)])
            .range([height_linechart - 2*margin_linechart, 0]);

        var xAxis = d3.axisBottom(xScale).ticks(7);
        var yAxis = d3.axisLeft(yScale).ticks(7);

        yAxis = g => g .attr("transform", `translate(${margin_linechart_left},0)`) .call(d3.axisLeft(yScale));


        // Add a clipPath: everything out of this area won't be drawn.
        var clip = d3.select('#firstG').append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width_linechart - 4*margin_linechart )
            .attr("height", height_linechart )
            .attr("x", margin_linechart_left)
            .attr("y", 0);


        /* Add line into SVG */
        var line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.data));

        let lines = d3.select('#firstG').append('g')
            .attr('class', 'lines')
            .attr('id', 'linesChart_lines')
            .attr('clip-path', "url(#clip)");

        //

        //console.log('data for lines', data);
        var lines_group = lines.selectAll('.line-group')
            .data(data).enter()
            .append('g')
            .attr('class', 'line-group')
            .on("mouseover", function(d, i) {
                current.svg.append("text")
                    .attr("class", "title-text")
                    .style("fill", color(i))
                    .text(d.name)
                    .attr("text-anchor", "middle")
                    .attr("x", (width_linechart) / 2)
                    .attr("y", margin_linechart);
            })
            .on("mouseout", function(d) {
                current.svg.select(".title-text").remove();
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
        var circles = lines.selectAll("circle-group")
            .data(data).enter()
            .append("g")
            .style("fill", (d, i) => color(i))
            .selectAll("circle")
            .data(d => d.values).enter()
            .append("g")
            .attr("class", "circle")
            .on("mouseover", function(d) {
                var coordinates = d3.mouse(d3.select('.scaling-svg-container').node());
                console.log('linePlot on mouseOver circle d', d);
                current.tool2.classed('hidden', false)
                    .attr('style', 'left:' + (coordinates[0] -140) + 'px; top:' + coordinates[1] + 'px')
                    .html("<strong>Country: </strong><span class='details'>" + d.country + "<br></span>" + "<strong>"+  d.type + ": </strong><span class='details'>" + format(d.data) +"</span>");


                d3.select(this)
                    .style("cursor", "pointer")
                    .append("text")
                    .attr("class", "text")
                    .text(`${d.data} ${d.type} on ${d.date.toDateString()}`)
                    .attr("x", d => xScale(d.date) + 5)
                    .attr("y", d => yScale(d.data) - 10);
            })
            .on("mouseout", function(d) {
                current.tool2.classed('hidden', true);
                d3.select(this)
                    .style("cursor", "none")
                    .transition()
                    .duration(duration)
                    .selectAll(".text").remove();
            })
            .append("circle")
            .attr("cx", d => xScale(d.date))
            .attr("cy", d => yScale(d.data))
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


        var x_axis = d3.select('#firstG').append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${height_linechart - 2*margin_linechart})`)
            .call(xAxis);

        var y_axis = d3.select('#firstG').append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append('text')
            .attr("y", 15)
            .attr("transform", "rotate(-90)")
            .attr("fill", "#000")
            .text("Total values");


        // zoom actions
  			const zoom = d3.zoom()
  	 	 					       .scaleExtent([1, 12])
  	 	 					       .on('zoom', function() {
                          d3.event.transform.x = Math.min(0, Math.max(d3.event.transform.x, width_linechart - width_linechart * d3.event.transform.k));
                          x_axis.transition().duration(50)
                              .call(xAxis.scale(d3.event.transform.rescaleX(xScale)));

                          var new_xScale = d3.event.transform.rescaleX(xScale);
                          circles.attr('cx', d => new_xScale(d.date));

                          var new_line = d3.line()
                              .x(d => new_xScale(d.date))
                              .y(d => yScale(d.data));

                          lines_group.attr('d', d => new_line(d.values));

  	 	 								 });

        this.svg.call(zoom);

    }

}
