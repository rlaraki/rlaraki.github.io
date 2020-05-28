/*
This class enables to create, using d3 library the
*/
class LinePlot {

    constructor(class_name) {

        this.class_name = class_name;
        this.total_data = this.getData();
        this.id_name = this.getIDName();

        var plot_container = document.getElementById('right_scroll_plot');

        this.margin = 20;
        this.height = 350;
        this.width = plot_container.offsetWidth;


        this.tool2 = d3.select(".right_scroll_plot")
            .append('div')
            .attr('class', 'hidden tool');


        this.svg = d3.select('div#right_scroll_plot')
            .append('div')
            .classed('svg_container_line_chart', true)
            .append("svg")
            .attr('id', "line_chart")
            .classed('svg_line_chart', true)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr("viewBox", "0 0 " + (this.width + this.margin) + ' ' + (this.height + this.margin));


    }


    getIDName() {
      if (this.class_name == 'Testing') {
        return "line_chart_testing";
      }
      else {
        return "line_chart";
      }
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
        } else if (this.class_name == 'Measures') {
            var request = new XMLHttpRequest();
            request.open('GET', '../data/measure_data.json', false);
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
        } else if (this.class_name == 'Measures') {
            var request = new XMLHttpRequest();
            request.open('GET', '../data/measure_data.json', false);
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

        var color = d3.scaleOrdinal(d3.schemeCategory10);
        var height_linechart = this.height;
        var width_linechart = this.width;
        var margin_linechart = this.margin;
        let current = this;

        this.svg.select("#firstG")
          .selectAll("text")
          .append("text")
          .attr("x", (this.width / 2))
          .attr("y", 0 )
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("text-decoration", "underline")
          .text("Value vs Date Graph");

        /* Add SVG */
        this.svg
            .on("click", function(d) {
                console.log("click event");
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
        var parseDate1 = d3.timeParse("%Y-%m-%d");

        data.forEach(function(d) {
            var country = d.name;
            if (current.class_name == "Measures") {
                console.log('parse data for measures');
                d.values.forEach(d => {
                    d.data = +d.cases;
                    d.date = parseDate(d.date);

                });

                d.values1.forEach(d => {
                    d.data = +d.cases;
                    d.measures = d.measure;
                    d.date = parseDate1(d.date);
                    d.country = country;
                });


            } else {
                d.values.forEach(d => {

                    d.date = parseDate(d.date);
                    d.country = country;

                    if (current.class_name == "Confirmed cases") {
                        d.data = +d.cases;
                        d.type = 'Number of Cases';
                    } else if (current.class_name == "Recovered") {
                        d.data = +d.recovered;
                        d.type = 'Number of Recovered';
                    } else if (current.class_name == "Deaths") {
                        d.data = +d.deaths;
                        d.type = 'Number of Deaths';
                    } else if (current.class_name == "Testing") {
                        d.data = +d.tests;
                        d.type = 'Number of Tests';
                    }
                });
            }
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
        var color = d3.scaleOrdinal(d3.schemeCategory10);


        data = this.parseData(data);


        this.svg
            .append('g')
            .attr("transform", `translate(${margin_linechart}, ${margin_linechart})`)
            .attr('id', 'firstG')


        this.svg.select('#firstG')
            .append('text')
            .attr("x", (this.width / 2))
            .attr("y", (this.margin*0.8))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("fill", "#ccc")
            .text(this.class_name+" evolution over time");

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
            .range([height_linechart - 2 * margin_linechart, margin_linechart*1.3]);

        var xAxis = d3.axisBottom(xScale).ticks(7);
        var yAxis = d3.axisLeft(yScale).ticks(7);

        yAxis = g => g
            .attr("transform", `translate(${margin_linechart_left},0)`)
            .call(d3.axisLeft(yScale));


        // Add a clipPath: everything out of this area won't be drawn.
        var clip = this.svg.select('#firstG').append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width_linechart - 4 * margin_linechart)
            .attr("height", height_linechart+margin_linechart)
            .attr("x", margin_linechart_left)
            .attr("y", 0);


        /* Add line into SVG */
        var line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.data));


        let lines = this.svg.select('#firstG').append('g')
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


        var circles;
        if (this.class_name == 'Measures') {
            /* Add circles in the line */
            console.log('cirles measures data', data);
            circles = lines.selectAll("circle-group")
                .data(data).enter()
                .append("g")
                .style("fill", (d, i) => color(i))
                .selectAll("circle")
                .data(d => d.values1).enter()
                .append("g")
                .attr("class", "circle")
                .on("mouseover", function(d) {
                    console.log('circles measures d.values1', d);
                    var coordinates = d3.mouse(d3.select('.scaling-svg-container').node());
                    current.tool2.classed('hidden', false)
                        .attr('style', 'left:' + (coordinates[0] - 140) + 'px; top:' + coordinates[1] + 'px')
                        .html("<strong>Country: </strong><span class='details'>" + d.country + "<br></span>" +
                            "<strong>Date: </strong><span class='details'>" + d.date.toDateString() + "<br></span>" +
                            "<strong>Taken measures: </strong><span class='details'>" + d.measures + "</span>");
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
        } else {
            /* Add circles in the line */
            circles = lines.selectAll("circle-group")
                .data(data).enter()
                .append("g")
                .style("fill", (d, i) => color(i))
                .selectAll("circle")
                .data(d => d.values).enter()
                .append("g")
                .attr("class", "circle")
                .on("mouseover", function(d) {
                    var coordinates = d3.mouse(d3.select('.scaling-svg-container').node());
                    current.tool2.classed('hidden', false)
                        .attr('style', 'left:' + (coordinates[0] - 140) + 'px; top:' + coordinates[1] + 'px')
                        .html("<strong>Country: </strong><span class='details'>" + d.country + "<br></span>" +
                            "<strong>Date: </strong><span class='details'>" + d.date.toDateString() + "<br></span>" +
                            "<strong>" + d.type + ": </strong><span class='details'>" + d.data + "</span>");
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
        }



        var x_axis = this.svg.select('#firstG').append("g")
            .attr("class", "x axis")
            .attr("class", "axisWhite")
            .attr("transform", `translate(0, ${height_linechart - 2*margin_linechart})`)
            .call(xAxis);

        var y_axis = this.svg.select('#firstG').append("g")
            .attr("class", "axisWhite")
            .call(yAxis)
            .append('text')
            .attr("y",(this.margin*0.6) )
            .attr("x",(-20) )
            .attr("transform", "rotate(-90)")
            .attr("fill", "#000")
            .text("Total number");


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

        this.svg.select('#firstG')
            .append('svg:rect')
            .attr("width", width_linechart - margin_linechart - margin_linechart_left)
            .attr("height", height_linechart - 2*margin_linechart)
            .attr('transform', `translate(${margin_linechart_left}, 0)`)
            .style("visibility", "hidden")
            .attr("pointer-events", "all")
            .call(zoom);



    }

}
