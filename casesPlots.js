
const lineChart = britecharts.line();

var map_container_svg = document.getElementById('map_container_svg');
const width = map_container_svg.offsetWidth;


const container = d3.select('.right_scroll_plot').append("svg").attr("width", width)
.attr("height", 350);

lineChart
    .isAnimated(true)
    .aspectRatio(0.5)
    .grid('horizontal')
    .tooltipThreshold(600)
    .width(containerWidth)
    .dateLabel('fullDate')
    .on('customMouseOver', chartTooltip.show)
    .on('customMouseMove', chartTooltip.update)
    .on('customMouseOut', chartTooltip.hide);

container.datum('data/per_day_selected_countries_cases_json.json').call(lineChart);

// Tooltip Setup and start
chartTooltip
    // In order to change the date range on the tooltip title, uncomment this line
    // .dateFormat(chartTooltip.axisTimeCombinations.HOUR .title('Quantity Sold')
    .topicsOrder(dataset.dataByTopic.map(function(topic) {
        return topic.topic;
    }));


//tooltipContainer = d3Selection.select('.js-line-chart-container .metadata-group .hover-marker');
//tooltipContainer.datum([]).call(chartTooltip);

const redrawChart = () => {
    const newContainerWidth = container.node() ? container.node().getBoundingClientRect().width : false;

    // Setting the new width on the chart
    barChart.width(newContainerWidth);

    // Rendering the chart again
    container.call(barChart);
};
const throttledRedraw = _.throttle(redrawChart, 200);

window.addEventListener("resize", throttledRedraw);
