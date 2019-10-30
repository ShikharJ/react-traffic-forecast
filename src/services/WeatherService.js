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
  findGrid(lat, lon) {
    console.log(lat, log);
    console.log(grid);
  }

  findTraffic(src, dest) {
    return { incoming, outgoing };
  }

  static getWeatherByPosition(requestParams, cancelToken, marker) {
    const params = {
      cnt: 5,
      appid: APP_ID,
      units: 'metric',
      ...requestParams
    };

    //console.log(marker);

    return axios.get(API.forecastDaily, {
      params,
      cancelToken,
      transformResponse: data => {
        let { city, list = [] } = JSON.parse(data);

        const lat = city.coord.lat;
        const lon = city.coord.lon;

        if (marker === 'start') {
          let min = 9999999;
          start = -1;
          for (let i = 0; i < grid.length; i++) {
            let value =
              Math.pow(grid[i].latitude - lat, 2) +
              Math.pow(grid[i].longitude - lon, 2);

            if (min > value) {
              min = value;
              start = grid[i].src;
            }
          }
        }
        if (marker === 'end') {
          let min = 9999999;
          destination = -1;
          for (let i = 0; i < grid.length; i++) {
            let value =
              Math.pow(grid[i].latitude - lat, 2) +
              Math.pow(grid[i].longitude - lon, 2);

            if (min > value) {
              min = value;
              destination = grid[i].src;
            }
          }
        }

        console.log(start, destination);

        const mondayData = monday.filter(val => {
          return val.src == start && val.des == destination;
        });

        console.log(mondayData);

        // const mondayData = monday.filter(val => {
        //   return val.src == start && val.des == destination;
        // });

        // console.log(mondayData);

        // const mondayData = monday.filter(val => {
        //   return val.src == start && val.des == destination;
        // });

        // console.log(mondayData);

        list = list.map(day => {
          return {
            date: day.dt,
            humidity: day.humidity,
            speed: day.speed,
            temp: day.temp,
            main: {
              icon: day.weather[0].icon,
              description: day.weather[0].description
            }
          };
        });
        //list = list.slice(0, 4);

        return { city, list };
      }
    });
  }

  static findCities(q, cancelToken) {
    const params = {
      q,
      cnt: 5,
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
