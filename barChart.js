// Instantiate Bar Chart

const barChart = britecharts.bar();

buildSVG('.right_scroll_plot')
//const container = d3.select('.right_scroll_plot').append("svg").attr("width", 400).attr("height", 350);

// Create Dataset with proper shape
const barData = [
    { name: 'Luminous', value: 2 },
    { name: 'Glittering', value: 5 },
    { name: 'Intense', value: 4 },
    { name: 'Radiant', value: 3 }
];

// Configure chart
barChart
    .margin({left: 100})
    .isHorizontal(true)
    .height(350)
    .width(400);

container.datum(barData).call(barChart);

const redrawChart = () => {
    const newContainerWidth = container.node() ? container.node().getBoundingClientRect().width : false;

    // Setting the new width on the chart
    barChart.width(newContainerWidth);

    // Rendering the chart again
    container.call(barChart);
};
const throttledRedraw = _.throttle(redrawChart, 200);

window.addEventListener("resize", throttledRedraw);


// Instantiate Bar Chart
const barChart2 = britecharts.bar();
const container2 = d3.select('.right_scroll_plot').append("svg").attr("width", 400)
.attr("height", 350);

// Create Dataset with proper shape
const barData2 = [
    { name: 'Luminous', value: 6 },
    { name: 'Glittering', value: 4 },
    { name: 'Intense', value: 2 },
    { name: 'Radiant', value: 7 }
];

// Configure chart
barChart2
    .margin({left: 100})
    .isHorizontal(true)
    .height(350)
    .width(400);

container2.datum(barData2).call(barChart2);

const redrawChart2 = () => {
    const newContainerWidth2 = container2.node() ? container2.node().getBoundingClientRect().width : false;

    // Setting the new width on the chart
    barChart2.width(newContainerWidth2);

    // Rendering the chart again
    container2.call(barChart2);
};
const throttledRedraw2 = _.throttle(redrawChart2, 200);

window.addEventListener("resize", throttledRedraw2);


// Instantiate Bar Chart
const barChart3 = britecharts.bar();
const container3 = d3.select('.right_scroll_plot').append("svg").attr("width", 400)
.attr("height", 350);

// Create Dataset with proper shape
const barData3 = [
    { name: 'Luminous', value: 1 },
    { name: 'Glittering', value: 2 },
    { name: 'Intense', value: 6 },
    { name: 'Radiant', value: 1 }
];

// Configure chart
barChart3
    .margin({left: 100})
    .isHorizontal(true)
    .height(350)
    .width(400);

container3.datum(barData3).call(barChart3);

const redrawChart3 = () => {
    const newContainerWidth3 = container3.node() ? container3.node().getBoundingClientRect().width : false;

    // Setting the new width on the chart
    barChart3.width(newContainerWidth3);

    // Rendering the chart again
    container3.call(barChart3);
};
const throttledRedraw3 = _.throttle(redrawChart3, 200);

window.addEventListener("resize", throttledRedraw3);
