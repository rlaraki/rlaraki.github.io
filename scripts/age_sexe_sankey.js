class Sankey {
    constructor() {
        var plot_container = document.getElementById('right_scroll_plot');


        this.width = plot_container.offsetWidth;
        this.margin = {
            top: 30,
            right: 10,
            bottom: 10,
            left: 10
        };
        this.height = 200 - this.margin.top - this.margin.bottom;


        this.units = 'Cases';
        this.possible_countries = ['Argentina', 'Australia', 'Austria', 'Bangladesh',
            'Belgium', 'Bosnia and Herzegovina', 'Canada', 'Chile', 'China',
            'Colombia', 'Czech Republic', 'Denmark', 'Dominican Republic', 'Ecuador',
            'Estonia', 'Finland', 'Germany', 'Greece', 'Indonesia', 'Iran', 'Ireland',
            'Italy', 'Luxembourg', 'Mexico', 'Netherlands', 'Norway', 'Pakistan',
            'Peru', 'Philippines', 'Portugal', 'Romania', 'South Africa',
            'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Thailand',
            'Ukraine', 'United Kingdom'
        ]

        this.svg = d3.select('#right_scroll_plot').append('svg')
            .attr('id', 'sankey_diagram_event')
            .attr('height', '1px')
            .attr('width', this.width + 'px');

    }

    draw_all_sankeys() {
        let current = this;


        if (d3.select('#sankey_diagram_event')) {
            d3.select('#sankey_diagram_event')
                .on('dblclick', function() {
                    d3.selectAll('#sankey_diagram').remove();
                    list_countries.forEach(item => current.draw_sankey(item));
                });
        }
        list_countries.forEach(item => current.draw_sankey(item));
    }

    draw_sankey(country) {
        var index_country = this.possible_countries.indexOf(country);
        if (index_country > -1) {
            let current = this;
            // format variables
            var formatNumber = d3.format(",.0f"), // zero decimal places
                format = function(d) {
                    return formatNumber(d) + " " + current.units;
                },
                color = d3.scaleOrdinal(d3.schemeCategory10);

            // append the svg object to the body of the page
            var svg = d3.select('#right_scroll_plot')
                .append('div')
                .classed('svg_container_sankey', true)
                .append("svg")
                .classed('svg_sankey', true)
                .attr('id', 'sankey_diagram')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr("viewBox", "0 0 " + (this.width + this.margin.left + this.margin.right) + ' ' + (this.height + this.margin.top + this.margin.bottom))
                .append("g")
                .attr("transform",
                    "translate(" + this.margin.left + "," + this.margin.top + ")");

            svg.append("text")
                .attr("x", (this.width / 2))
                .attr("y", 0 - (this.margin.top / 10))
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text("Ratio for Gender and Deaths for " + country);

            // Set the sankey diagram properties
            var sankey = d3.sankey()
                .nodeWidth(30)
                .nodePadding(40)
                .size([this.width, this.height]);

            var path = sankey.link();

            // load the data
            d3.json('../data/sexe_deaths_sankey/sexe_deaths_sankey_' + country + '.json').then(function(graph) {

                sankey
                    .nodes(graph.nodes)
                    .links(graph.links)
                    .layout(32);

                // add in the links
                var link = svg.append("g").selectAll(".link")
                    .data(graph.links)
                    .enter().append("path")
                    .attr("class", "link")
                    .attr("d", path)
                    .style("stroke-width", function(d) {
                        return Math.max(1, d.dy);
                    })
                    .sort(function(a, b) {
                        return b.dy - a.dy;
                    });

                // add the link titles
                link.append("title")
                    .text(function(d) {
                        return d.source.name + " → " +
                            d.target.name + "\n" + format(d.value);
                    });

                // add in the nodes
                var node = svg.append("g").selectAll(".node")
                    .data(graph.nodes)
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });


                // add the rectangles for the nodes
                node.append("rect")
                    .attr("height", function(d) {
                        return d.dy;
                    })
                    .attr("width", sankey.nodeWidth())
                    .style("fill", function(d) {
                        return d.color = color(d.name.replace(/ .*/, ""));
                    })
                    .style("stroke", function(d) {
                        return d3.rgb(d.color).darker(2);
                    })
                    .append("title")
                    .text(function(d) {
                        return d.name + "\n" + format(d.value);
                    });

                // add in the title for the nodes
                node.append("text")
                    .attr("x", -6)
                    .attr("y", function(d) {
                        return d.dy / 2;
                    })
                    .attr("dy", ".35em")
                    .attr("text-anchor", "end")
                    .attr("transform", null)
                    .text(function(d) {
                        return d.name;
                    })
                    .filter(function(d) {
                        return d.x < (current.width / 2);
                    })
                    .attr("x", 6 + sankey.nodeWidth())
                    .attr("text-anchor", "start");

            });
        }

    }

}
