const right_scroll_plot = document.getElementById('right_scroll_plot');

var data = []

var request = new XMLHttpRequest();
request.open('GET', '../data/per_day_cases_json.json', false);
request.send(null)

var casesData = JSON.parse(request.responseText)
list_countries.forEach(add_data);

function add_data(item) {
  data = data.concat(casesData[item])
}


var layout = {
  title: 'Testing time series',
  xaxis: {
    autorange: true,
    range: ['2020-02-01', '2020-05-16'],
    rangeselector: {buttons: [
        {
          count: 1,
          label: '1m',
          step: 'month',
          stepmode: 'backward'
        },
        {
          count: 6,
          label: '6m',
          step: 'month',
          stepmode: 'backward'
        },
        {step: 'all'}
      ]},
    rangeslider: {range: ['2020-02-01', '2020-05-16']},
    type: 'date'
  },
  yaxis: {
    autorange: true,
    type: 'linear'
  }
};

Plotly.newPlot(right_scroll_plot, data, layout, {scrollZoom: true});
