/**
 * Created by ivan on 24.06.18.
 * Modified by Shikhar on 28.10.19.
 */

import axios from 'axios';
import API from './API';

import grid from '../data/json/grid.json';
import monday from '../data/json/monday.json';
import saturday from '../data/json/saturday.json';
import sunday from '../data/json/sunday.json';

const APP_ID = '093c63d1d6dd2f0f77c6f14d91a19042';
let start = 287, destination = 287;
var start_data_list, end_data_list;

class WeatherService {
  static getWeatherByPosition(requestParams, cancelToken, marker) {
    const params = {
      cnt: 6,
      appid: APP_ID,
      units: 'metric',
      ...requestParams
    };

    return axios.get(API.forecastDaily, {
      params,
      cancelToken,
      transformResponse: data => {
        let { city, list = [] } = JSON.parse(data);

        const lat = city.coord.lat;
        const lon = city.coord.lon;

        if (marker === 'start') {
          let min = 9999999;

          for (let i = 0; i < grid.length; i++) {
            let value = Math.pow(grid[i].latitude - lat, 2) + Math.pow(grid[i].longitude - lon, 2);

            if (min > value) {
              min = value;
              start = grid[i].src;
            }
          }
        }

        if (marker === 'end') {
          let min = 9999999;

          for (let i = 0; i < grid.length; i++) {
            let value = Math.pow(grid[i].latitude - lat, 2) + Math.pow(grid[i].longitude - lon, 2);

            if (min > value) {
              min = value;
              destination = grid[i].src;
            }
          }
        }

        let satData = saturday.filter(val => { return val.src == start && val.des == destination; });
        let sunData = sunday.filter(val => { return val.src == start && val.des == destination; });
        let monData = monday.filter(val => { return val.src == start && val.des == destination; });
        satData = satData.concat(saturday.filter(val => { return val.src == destination && val.des == start; }));
        sunData = sunData.concat(sunday.filter(val => { return val.src == destination && val.des == start; }));
        monData = monData.concat(monday.filter(val => { return val.src == destination && val.des == start; }));

        list = list.map(day => {
          return {
            date: day.dt,
            oft: day.humidity,
            ort: day.speed,
            eft: day.humidity,
            ert: day.speed,
            main: {
              icon: day.weather[0].icon,
              description: day.weather[0].description
            }
          };
        });

        console.log(list[0]);

        for (let i = 0; i < 3; i++) {
            if (i == 0){
                list[i].oft = Math.round(satData[0].observedTraffic);
                list[i].ort = Math.round(satData[1].observedTraffic);
                list[i].eft = Math.round(satData[0].estimatedTraffic);
                list[i].ert = Math.round(satData[1].estimatedTraffic);
                list[i + 3].oft = Math.round(satData[0].observedTraffic);
                list[i + 3].ort = Math.round(satData[1].observedTraffic);
                list[i + 3].eft = Math.round(satData[0].estimatedTraffic);
                list[i + 3].ert = Math.round(satData[1].estimatedTraffic);
            } else if (i == 1){
                list[i].oft = Math.round(sunData[0].observedTraffic);
                list[i].ort = Math.round(sunData[1].observedTraffic);
                list[i].eft = Math.round(sunData[0].estimatedTraffic);
                list[i].ert = Math.round(sunData[1].estimatedTraffic);
                list[i + 3].oft = Math.round(sunData[0].observedTraffic);
                list[i + 3].ort = Math.round(sunData[1].observedTraffic);
                list[i + 3].eft = Math.round(sunData[0].estimatedTraffic);
                list[i + 3].ert = Math.round(sunData[1].estimatedTraffic);
            } else{
                list[i].oft = Math.round(monData[0].observedTraffic);
                list[i].ort = Math.round(monData[1].observedTraffic);
                list[i].eft = Math.round(monData[0].estimatedTraffic);
                list[i].ert = Math.round(monData[1].estimatedTraffic);
                list[i + 3].oft = Math.round(monData[0].observedTraffic);
                list[i + 3].ort = Math.round(monData[1].observedTraffic);
                list[i + 3].eft = Math.round(monData[0].estimatedTraffic);
                list[i + 3].ert = Math.round(monData[1].estimatedTraffic);
            }
        }

        return { city, list };
      }
    });
  }

  static findCities(q, cancelToken) {
    const params = {
      q,
      cnt: 6,
      appid: APP_ID
    };

    return axios.get(API.find, {
      params,
      cancelToken
    });
  }

  static prepareDataChart(list) {
    const datasetDay = {
      label: 'Day',
      backgroundColor: 'rgba(255, 143, 0, .2)',
      borderWidth: 1,
      borderColor: 'rgba(255, 143, 0, .7)',
      data: []
    };
    const datasetNight = {
      label: 'Night',
      backgroundColor: 'rgba(60, 78, 77, .2)',
      borderWidth: 1,
      borderColor: 'rgba(60, 78, 77, .7)',
      data: []
    };
    const labels = [];

    for (let i = 0; i < list.length; i++) {
      const day = list[i];

      labels.push(day.date);
      datasetDay.data.push(day.temp.day.toFixed());
      datasetNight.data.push(day.temp.night.toFixed());
    }

    return { labels, datasets: [datasetDay, datasetNight] };
  }
}

export default WeatherService;
