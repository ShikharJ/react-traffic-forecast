import { put, call, take, takeLatest, cancel, cancelled } from 'redux-saga/effects';
import axios from 'axios';
import { fetchSuccess, fetchFailed } from '../actions/weatherList';
import WeatherService from '../../services/WeatherService';

var start_data;

const fetchWeatherList = function* (action) {
    const cancelSource = axios.CancelToken.source();
    const token = cancelSource.token;
    console.log(action.data);

    if (action.data.marker)
    {
        try {
            const { data } = yield call(WeatherService.getWeatherByPosition, action.data, token, action.data.marker);
            start_data = data;
            //console.log(data);
            yield put(fetchSuccess(start_data));
        } catch (e) {
            yield put(fetchFailed(e));
        } finally {
            if (yield cancelled()) {
                yield call(cancelSource.cancel);
            }
        }
    } else
    {
        try {
            const { data } = yield call(WeatherService.getWeatherByPosition, action.data, token);
            //console.log(data);
            yield put(fetchSuccess(data));
        } catch (e) {
            yield put(fetchFailed(e));
        } finally {
            if (yield cancelled()) {
                yield call(cancelSource.cancel);
            }
        }
    }
};

const fetchWeatherListWatcher = function* () {
    while (true) {
        const task = yield takeLatest('FETCH_WEATHER', fetchWeatherList);
        yield take('CANCEL_FETCH_WEATHER');
        yield cancel(task);
    }
};

export default fetchWeatherListWatcher;