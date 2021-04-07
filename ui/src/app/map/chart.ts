// You have no idea how long this took. -Jason Ball

import Chart from 'chart.js';
import Color from 'esri/Color';
import Graphic from 'esri/Graphic';
import moment from 'moment';
import { PurpleAirChartData } from '../models/PurpleAirChartData.model';
import { PurpleAirService } from '../services/purpleair.service';

/**
 * Builds a chart from a PurpleAir point on the map
 * @param { Graphic } graphic PurpleAir point
 * @returns An HTML canvas with a graph
 */
export default async function buildChart(g: any, purpleAirService: PurpleAirService, colors: Color[]) {
  const { graphic }: { graphic: Graphic } = g;
  const purpleAirID: number = graphic.attributes.purpleair_id ?? 0
  const div = document.createElement('div');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let purpleAirChartData: PurpleAirChartData;

  try {
    purpleAirChartData = await purpleAirService.getChartDataForPoint(purpleAirID).toPromise()
  } catch (error) {
    console.error(error)
    return 'Error fetching chart data'
  }

  let weekChartData: number[] = [];
  let weekChartLabels: string[] = [];
  let weekChartColors: string[] = [];
  let hourlyChartData: number[] = [];
  let hourlyChartLabels: string[] = [];
  let hourlyChartColors: string[] = [];
  let eightHourChartData: number[] = [];
  let eightHourChartLabels: string[] = [];
  let eightHourChartColors: string[] = [];
  let lastHourChartData: number[] = [];
  let lastHourChartLabels: string[] = [];
  let lastHourChartColors: string[] = [];


  purpleAirChartData.week.forEach(sensor => {
    weekChartData.push(sensor.correctedPM25);
    weekChartLabels.push(moment(sensor.time).format('MMM. D'));
    weekChartColors.push(getColorForData(sensor.correctedPM25, colors).toHex());
  });

  purpleAirChartData.hourly.forEach(sensor => {
    hourlyChartData.push(sensor.correctedPM25);
    hourlyChartLabels.push(moment(sensor.time).format('h:mm A'));
    hourlyChartColors.push(getColorForData(sensor.correctedPM25, colors).toHex());
  });

  purpleAirChartData.eightHours.forEach(sensor => {
    eightHourChartData.push(sensor.correctedPM25);
    eightHourChartLabels.push(moment(sensor.time).format('h:mm A'));
    eightHourChartColors.push(getColorForData(sensor.correctedPM25, colors).toHex());
  });

  purpleAirChartData.hour.forEach(sensor => {
    lastHourChartData.push(sensor.correctedPM25);
    lastHourChartLabels.push(moment(sensor.time).format('h:mm A'));
    lastHourChartColors.push(getColorForData(sensor.correctedPM25, colors).toHex());
  });

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: weekChartLabels,
      datasets: [{
        label: 'Average Air Quality (Daily)',
        data: weekChartData,
        backgroundColor: weekChartColors,
        borderColor: 'black',
        borderWidth: 1,
        borderDash: [5, 15],
        fill: false,
        radius: 5
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
          scaleLabel: {
            display: true,
            labelString: 'Particulate Matter in the Air (µg/m³)',
            fontSize: 10
          }
        }]
      },
      title: {
        display: true,
        text: 'Average Air Quality (Daily)'
      },
      legend: {
        display: false
      }
    }
  })

  // Had to do this in JavaScript since ArcGIS creates the popups, not Angular. -Jason

  const select = document.createElement('select');
  select.id = `purpleair-chart-${graphic.attributes.purpleair_id}-mode-select`;

  const lastUpdated = document.createElement('p');
  lastUpdated.id = `purpleair-chart-${graphic.attributes.purpleair_id}-last-updated`;
  lastUpdated.textContent = `Updated ${moment(graphic.attributes.time * 1000).fromNow()}`;
  lastUpdated.classList.add('chart-last-updated');

  const oneHour = document.createElement('option');
  oneHour.value = '1h';
  oneHour.text = 'Last Hour';

  const eightHours = document.createElement('option');
  eightHours.value = '8h';
  eightHours.text = 'Last 8 Hours';

  const twentyFourHours = document.createElement('option');
  twentyFourHours.value = '24h';
  twentyFourHours.text = 'Last 24 Hours';

  const week = document.createElement('option');
  week.value = 'week';
  week.text = 'Last 7 Days';
  week.selected = true;

  [week, oneHour, eightHours, twentyFourHours].forEach(option => {
    select.appendChild(option);
  });

  const rangeDiv = document.createElement('div');
  rangeDiv.style.display = 'flex';
  rangeDiv.style.justifyContent = 'space-between';

  const range = document.createElement('label');
  range.setAttribute('for', `purpleair-chart-${graphic.attributes.purpleair_id}-mode-select`);
  range.textContent = 'Chart Range:';
  range.style.paddingRight = '2px';

  div.id = `purpleair-chart-${graphic.attributes.purpleair_id}`;
  div.classList.add('purpleair-chart');

  select.addEventListener('change', event => {
    switch (select.value) {
      case '1h':
        chart.data.datasets[0].data = lastHourChartData;
        chart.data.labels = lastHourChartLabels;
        chart.data.datasets[0].backgroundColor = lastHourChartColors;
        chart.options.title.text = 'Average Air Quality (Last Hour)';
        chart.update();
        break;
      case '8h':
        chart.data.datasets[0].data = eightHourChartData;
        chart.data.labels = eightHourChartLabels;
        chart.data.datasets[0].backgroundColor = eightHourChartColors;
        chart.options.title.text = 'Average Air Quality (Last 8 Hours)';
        chart.update();
        break;
      case '24h':
        chart.data.datasets[0].data = hourlyChartData;
        chart.data.labels = hourlyChartLabels;
        chart.data.datasets[0].backgroundColor = hourlyChartColors;
        chart.options.title.text = 'Average Air Quality (Last 24 Hours)';
        chart.update();
        break;
      case 'week':
        chart.data.datasets[0].data = weekChartData;
        chart.data.labels = weekChartLabels;
        chart.data.datasets[0].backgroundColor = weekChartColors;
        chart.options.title.text = 'Average Air Quality (Last 7 Days)';
        chart.update();
        break;
      default:
        break;
    }
  });

  rangeDiv.appendChild(lastUpdated);
  const rangeSelect = document.createElement('div');
  rangeSelect.appendChild(range);
  rangeSelect.appendChild(select);
  rangeDiv.appendChild(rangeSelect);
  div.appendChild(rangeDiv);
  div.appendChild(canvas);

  return div;
}

function getColorForData(value: number, colors: Color[]) {
  if (value <= 12) {
    return colors[0];
  } else if (value <= 35.4) {
    return colors[1];
  } else if (value <= 55.4) {
    return colors[2];
  } else if (value <= 150.4) {
    return colors[3];
  } else if (value <= 250.4) {
    return colors[4];
  } else {
    return colors[5];
  }
}
