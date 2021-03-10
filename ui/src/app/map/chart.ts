// You have no idea how long this took. -Jason Ball

import Chart from 'chart.js';
import Graphic from 'esri/Graphic';
import moment from 'moment';
import { PurpleAirChartData } from '../models/PurpleAirChartData.model';
import { PurpleairService } from '../services/purpleair.service';

/**
 * Builds a chart from a PurpleAir point on the map
 * @param { Graphic } graphic PurpleAir point
 * @returns An HTML canvas with a graph
 */
export default async function buildChart(g: any, purpleAirService: PurpleairService) {
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
  let hourlyChartData: number[] = [];
  let hourlyChartLabels: string[] = [];
  let eightHourChartData: number[] = [];
  let eightHourChartLabels: string[] = [];
  let lastHourChartData: number[] = [];
  let lastHourChartLabels: string[] = [];

  purpleAirChartData.week.forEach(sensor => {
    weekChartData.push(sensor.correctedPM25);
    weekChartLabels.push(moment(sensor.time).format('MMM. D'))
  });

  purpleAirChartData.hourly.forEach(sensor => {
    hourlyChartData.push(sensor.correctedPM25);
    hourlyChartLabels.push(moment(sensor.time).format('h:mm A'))
  });

  purpleAirChartData.eightHours.forEach(sensor => {
    eightHourChartData.push(sensor.correctedPM25);
    eightHourChartLabels.push(moment(sensor.time).format('h:mm A'))
  });

  purpleAirChartData.hour.forEach(sensor => {
    lastHourChartData.push(sensor.correctedPM25);
    lastHourChartLabels.push(moment(sensor.time).format('h:mm A'))
  });

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: weekChartLabels,
      datasets: [{
        label: 'Average Air Quality (Daily)',
        data: weekChartData,
        backgroundColor: 'black',
        borderWidth: 1,
        borderDash: [5, 15],
        fill: false
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
  rangeDiv.style.justifyContent = 'flex-end';

  const range = document.createElement('label');
  range.setAttribute('for', `purpleair-chart-${graphic.attributes.purpleair_id}-mode-select`);
  range.textContent = 'Range:';
  range.style.paddingRight = '2px';

  div.id = `purpleair-chart-${graphic.attributes.purpleair_id}`;
  div.classList.add('purpleair-chart');

  select.addEventListener('change', event => {
    switch (select.value) {
      case '1h':
        chart.data.datasets[0].data = lastHourChartData;
        chart.data.labels = lastHourChartLabels;
        chart.options.title.text = 'Average Air Quality (Last Hour)';
        chart.update();
        break;
      case '8h':
        chart.data.datasets[0].data = eightHourChartData;
        chart.data.labels = eightHourChartLabels;
        chart.options.title.text = 'Average Air Quality (Last 8 Hours)';
        chart.update();
        break;
      case '24h':
        chart.data.datasets[0].data = hourlyChartData;
        chart.data.labels = hourlyChartLabels;
        chart.options.title.text = 'Average Air Quality (Last 24 Hours)';
        chart.update();
        break;
      case 'week':
        chart.data.datasets[0].data = weekChartData;
        chart.data.labels = weekChartLabels;
        chart.options.title.text = 'Average Air Quality (Last 7 Days)';
        chart.update();
        break;
      default:
        break;
    }
  });

  rangeDiv.appendChild(range);
  rangeDiv.appendChild(select);
  div.appendChild(rangeDiv);
  div.appendChild(canvas);

  return div;
}
