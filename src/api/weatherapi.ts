import axios from 'axios';

import { apiKey} from '../constants';

const  forecastEndpoint = (params: { cityName: string; day: number }) => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.day}&aqi=no&alerts=no`
const  locationEndpoint = (params: { cityName: string }) => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`

const apiCall = async (endpoint: string) => {
    const options = {
        method: 'GET',
        url: endpoint}
        try{
            const response = await axios.request(options);
            return response.data;
        }
        catch(err){
            console.log('error: ', err);
            return null;
        }
    }

    export const fetchWeatherForecast = (params: { cityName: string; day: number }) => {
        return apiCall(forecastEndpoint(params));

    } 
    export const fetchLocations = (params: { cityName: string;}) => {
        return apiCall(locationEndpoint(params));

    } 