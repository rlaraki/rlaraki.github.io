var list_countries = []

class MapPlot {

    constructor() {
        var map_container_svg = document.getElementById('map_container_svg');

        const height = map_container_svg.offsetHeight;

        const width = map_container_svg.offsetWidth;


        var info;
        this.svg = d3.select('div#map_container_svg')
            .append('svg')

            .attr('preserveAspectRatio', 'xMinYMin meet')

            .attr('viewBox', '0 0 ' + width.toString(10) + ' ' + height.toString(10))

            .classed('scaling-svg', true);

        this.map_promise = d3.json("data/countries.json").then((topojson_raw) => {
            const country_paths = topojson.feature(topojson_raw, topojson_raw.objects.countries);
            return country_paths.features;
        });
        this.tool = d3.select('.scaling-svg-container').append('div')
            .attr('class', 'hidden tool');

    }
    drawData(countryShapes, date, value, data, projection) {
        throw new Error('Map plot class do not contain data and thus the map can not be drawn');
    }

    draw(date_indice = 0) {
        throw new Error('Map plot class do not contain data and thus the map can not be drawn');
    }

    checkInstances() {
        var g = document.getElementById('svg g');
        if (g) g.remove();

        var s = document.getElementById('slider_id');
        if (s) s.remove();

        var c = document.getElementById('colorbar-area');
        if (c) c.remove();

        var colorbar = document.getElementById('colorbar');
        if (colorbar) colorbar.remove();

        var point = document.getElementById('point_svg');
        if (point)
            point.remove();
    }
}

function formatDate(input, formatInput, formatOutput) {
    var dateParse = d3.timeParse("%Y-%m-%d");
    var dateFormat = d3.timeFormat(formatOutput);
    return dateFormat(dateParse(input));
}

function getData() {

    const cdr = d3.csv("data/map_cdr.csv").then((data) => {
        let year_to_cases = {};
        let year_to_recovered = {};
        let year_to_deaths = {};

        let dates = {};

        let max_cases = 0;
        let max_recovered = 0;
        let max_deaths = 0;

        data.forEach((row) => {
            // Cases
            if (row.confirmed > max_cases) {
                max_cases = parseInt(row.confirmed);
            }
            var date = this.formatDate(row.Date, "%Y-%m-%d", "%B %d, %Y");
            if (year_to_cases[date] == undefined) {
                year_to_cases[date] = [];
            } else {
                data = {};
                data["lon"] = row.longitude;
                data["lat"] = row.latitude;
                data["data"] = parseInt(row.confirmed);
                year_to_cases[date].push(data);
            }
            // Recoverd
            if (row.recovered > max_recovered) {
                max_recovered = parseInt(row.recovered);
            }
            var date = this.formatDate(row.Date, "%Y-%m-%d", "%B %d, %Y");
            if (year_to_recovered[date] == undefined) {
                year_to_recovered[date] = [];
            } else {
                data = {};
                data["lon"] = row.longitude;
                data["lat"] = row.latitude;
                data["data"] = parseInt(row.recovered);
                year_to_recovered[date].push(data);
            }

            //Deaths
            if (row.deaths > max_deaths) {
                max_deaths = parseInt(row.deaths);
            }
            var date = this.formatDate(row.Date, "%Y-%m-%d", "%B %d, %Y");
            if (year_to_deaths[date] == undefined) {
                year_to_deaths[date] = [];
            } else {
                data = {};
                data["lon"] = row.longitude;
                data["lat"] = row.latitude;
                data["data"] = parseInt(row.deaths);
                year_to_deaths[date].push(data);
            }
            dates[date] = date;
        });
        dates = d3.keys(dates).sort(function(a, b) {
            return new Date(a) - new Date(b);
        });
        return [
            [year_to_cases, max_cases],
            [year_to_recovered, max_recovered],
            [year_to_deaths, max_deaths],
            [dates]
        ];
    });



    const gov_measures = d3.csv("data/gov_si.csv").then((data) => {
        let country_to_year_to_data = {};
        let dates = {};

        data.forEach((row) => {
            var date = this.formatDate(row.Date, "%Y-%m-%d", "%B %d, %Y");
            if (country_to_year_to_data[row.Entity] == undefined) {
                country_to_year_to_data[row.Entity] = {}
            }
            country_to_year_to_data[row.Entity][date] = parseFloat(row.StringencyIndex);

            dates[date] = date;
        });
        dates = d3.keys(dates).sort(function(a, b) {
            return new Date(a) - new Date(b);
        });
        return [country_to_year_to_data, dates];
    });
    return [cdr, gov_measures]

}

function checkInstancesButton() {
    if (d3.select('#line_chart')) {
        d3.select('#line_chart').remove();
    }

    if (d3.selectAll('#bar_plot_cont')) {
        d3.selectAll('#bar_plot_cont').remove();
    }

    if (d3.selectAll('#sankey_diagram')) {
        d3.selectAll('#sankey_diagram').remove();
    }
    if (d3.selectAll('#svg_cont_sankey')) {
        d3.selectAll('#svg_cont_sankey').remove();
    }

    if (d3.selectAll('.svg_container_line_chart')) {
        d3.selectAll('.svg_container_line_chart').remove();
    }
    if (d3.select('#line_chart_testing')) {
        d3.select('#line_chart_testing').remove();
    }

    d3.select('#sankey_diagram_event').remove();
    var point = document.getElementById('point_svg');
    if (point)
        point.remove();
}


function whenDocumentLoaded(action) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", action);
    } else {
        // `DOMContentLoaded` already fired
        action();
    }
}

function checkReady() {
  var svg = document.getElementById("svg g");
  if (svg == null) {
      setTimeout("checkReady()", 5);
  } else {
    document.querySelector(
      "#loader").style.display = "none";
    document.querySelector(
      "body").style.visibility = "visible";

  }
}

whenDocumentLoaded(() => {

    const data = getData();
    const cdr = data[0];
    const gov_measures = data[1];

    bar_chart = new BarPlot("Confirmed cases");
    bar_chart.draw();

    // Initialize first page as cases
    plot_object = new MapBubble(cdr);
    plot_object.draw();
    var change = false;

    line_chart = new LinePlot("Confirmed cases");
    line_chart.draw();

    sankey_diagram = new Sankey();
    sankey_diagram.draw_all_sankeys();

    const cases_query = document.getElementById('cases');
    cases_query.addEventListener('click', () => {
        checkInstancesButton();
        if (change) {
            plot_object = new MapBubble(cdr);
            change = false;
        }
        bar_chart = new BarPlot("Confirmed cases");
        sankey_diagram = new Sankey();
        line_chart = new LinePlot("Confirmed cases");

        plot_object.class_name = "Confirmed cases";
        plot_object.draw();
        bar_chart.draw();
        sankey_diagram.draw_all_sankeys();
        line_chart.draw();


    });

    const recovered_query = document.getElementById('recovered');
    recovered_query.addEventListener('click', () => {
        checkInstancesButton();
        if (change) {
            plot_object = new MapBubble(cdr);
            change = false;
        }
        bar_chart = new BarPlot("Recovered");
        line_chart = new LinePlot("Recovered");

        plot_object.class_name = "Recovered";
        plot_object.draw();
        bar_chart.draw();
        line_chart.draw();
    });

    const deaths_query = document.getElementById('deaths');
    deaths_query.addEventListener('click', () => {
        checkInstancesButton();
        if (change) {
            plot_object = new MapBubble(cdr);
            change = false;
        }

        bar_chart = new BarPlot("Deaths");
        sankey_diagram = new Sankey();
        line_chart = new LinePlot("Deaths");

        plot_object.class_name = "Deaths";
        plot_object.draw();
        bar_chart.draw();
        sankey_diagram.draw_all_sankeys();
        line_chart.draw();

    });


    const measures_query = document.getElementById('measures');
    measures_query.addEventListener('click', () => {
        checkInstancesButton();
        plot_object = new MapMeasures(gov_measures);
        plot_object.draw();

        top_measures = new BarPlot("Measures");
        top_measures.draw();

        line_chart = new LinePlot("Measures");
        line_chart.draw();

        line_tests = new LinePlot("Testing");
        line_tests.draw();

        change = true;
    });

    checkReady()

    window.onresize = function() {
        plot_object.draw(plot_object.date_ind);
    };


});
