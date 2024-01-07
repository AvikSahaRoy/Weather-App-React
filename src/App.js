import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import pic from "./Images/Weather-default.png";
import logo from './Images/favicon.png';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isCityNotFound, setIsCityNotFound] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [showDefaultImage, setShowDefaultImage] = useState(true);
  const API_KEY = '30d4741c779ba94c470ca1f63045390a';

  // Weather Data Start --------------------------------------------
  const getWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
      setIsCityNotFound(false);
      setShowDefaultImage(false);

      getForecast() // Weather Forecast Data Calling
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        setWeatherData(null);
        setForecastData(null)
        setIsCityNotFound(true);
        setShowDefaultImage(false);
      }
    }
  };

  // Weather Data End --------------------------------------------

  // Weather Forecast Data Start --------------------------------------------
  const getForecast = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      setForecastData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Weather Forecast Data End --------------------------------------------

  // Convert temperature Start --------------------------------------------

  const convertToCelsius = (temperature) => {
    return Math.round(temperature);
  };

  // Convert temperature End --------------------------------------------

  // Show Date Start --------------------------------------------
  useEffect(() => {
    const getCurrentDateTime = () => {
      const currentDate = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      const formattedDateTime = currentDate.toLocaleString('en-US', options);
      setCurrentDateTime(formattedDateTime);
    };

    getCurrentDateTime();
  }, []);

  // Show Date End --------------------------------------------

  // Weather Type Start --------------------------------------------------
  const getWeatherAnimation = (weatherCondition) => {
    switch (weatherCondition) {
      case 'Clouds':
        return 'cloudy';
      case 'Rain':
        return 'rainy';
      case 'Haze':
        return 'haze';
      case 'ClearSky':
        return 'clearsky';
      case 'Thunderstorm':
        return 'thunderstorm';
      default:
        return 'default';
    }
  };

  // Weather Type End --------------------------------------------------


  return (
    <div className={`App ${weatherData && getWeatherAnimation(weatherData.weather[0].main)}`}>

      {/* Navbar -----------------------------------------*/}
      <nav class="container navbar navbar-dark bg-dark mb-3">
        <div class="container-fluid">
          <span class="navbar-brand ms-3 h1">
            <img src={logo} className='logo' alt='logo'></img>
            <span className='appname'> WeatherNows</span></span>
          <span className='text-white'>Welcome to my weather app! Enter your city name to get the weather</span>
        </div>
      </nav>

      <div className='weather container'>
        {/* Input box and Button */}
        <div className='weather1'>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter Your City..."
          />
          <button onClick={getWeather} type="button" class="">Search</button>
        </div>

        <div className='weather3'>
          {/* Weather Data print */}
          {weatherData && (
            <div>
              <div class="maincard card text-white bg-dark mb-4" >
                <div class="card-body">
                  <h5 class="card-title h2 text-center"><i class="bi bi-geo-alt-fill"></i> {weatherData.name}</h5>
                  <p class="card-text text-center">
                    <p className='temp'>{convertToCelsius(weatherData.main.temp)}°C</p>
                    <img
                      src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                      alt={weatherData.weather[0].description}
                    />
                    <p className='weatherDes'>{weatherData.weather[0].main}</p>
                    <p className='feelsLike'>Feels Like {convertToCelsius(weatherData.main.feels_like)}°C</p>
                  </p>
                </div>
              </div>
            </div>
          )}

          {weatherData && (
            <div>
              <div class="data text-white bg-dark mb-3" >
                <h5 class="card-title h4 mb-3 ms-3"> <p>{currentDateTime}</p></h5>
                <div class="container overflow-hidden">
                  <div class="row row-cols-2 row-cols-lg-4 g-2 g-lg-3">
                    <div class="col">
                      <div class="border p-2 text-center border-info">
                        <h6>TEMPERATURE</h6>
                        <p>{convertToCelsius(weatherData.main.temp)}°C</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class=" border p-2 text-center border-info">
                        <h6>WEATHER</h6>
                        <p>{weatherData.weather[0].description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Hourly Forecast data print */}
          {forecastData && (
            <div class="data2 ">
              {/* <h2><center>Hourly Forecast for Today</center></h2> */}
              <div class="card text-white bg-dark mb-3" style={{ maxWidth: "18rem;" }}>
                <div class="card-body">
                  <h5 class="card-title text-center h4">Hourly Forecast for Today</h5>
                </div>
              </div>
              <table class="table table-dark">
                <thead>
                  <tr>
                    {['TIME', 'TEMPERATURE', 'WEATHER', 'HUMIDITY', 'WIND SPEED'].map((header) => (
                      <th key={header} scope="col">{header}</th>
                    ))}
                  </tr>
                </thead>
              </table>
              {forecastData.list.map((forecast) => {
                const forecastDate = new Date(forecast.dt_txt);
                if (forecastDate.getDate() === new Date().getDate()) {
                  return (
                    <div key={forecast.dt}>
                      <table class="table table-dark">
                        <tbody>
                          <tr>
                            <td data-label="Time">{forecastDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</td>
                            <td data-label="Temperature">{convertToCelsius(forecast.main.temp)}°C</td>
                            <td data-label="Weather">
                              <img
                                src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                                alt={forecast.weather[0].description}
                              />
                              {forecast.weather[0].description}</td>
                            <td data-label="Humidity">{forecast.main.humidity}%</td>
                            <td data-label="Wind Speed">{forecast.wind.speed} m/s</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}

          {/* If City Not Found */}
          {isCityNotFound && (
            <h3 className='text-center text-danger'>City Not Found!</h3>
          )}

          {/* Showing Default Image */}
          {showDefaultImage &&
            <div className='defautImg'>
              <img src={pic} alt="Default" className='mx-auto d-block img-fluid' />
              <p className='text-center'>
                Experience weather forecasting at its finest with our WeatherNows app. Get real-time
                updates on temperature, humidity, wind speed, and more. Plan your day confidently with
                hourly and daily forecasts tailored to your location. Stay informed and prepared for any
                weather condition, wherever you are.
              </p>
            </div>
          }

          {/* 5-Day Forecast Print */}
          {forecastData && (
            <div class="data2  mb-5">
              {/* <h2><center>5-Day Forecast</center></h2> */}
              <div class="card text-white bg-dark mb-3" style={{ maxWidth: "18rem;" }}>
                <div class="card-body">
                  <h5 class="card-title text-center h4">5-Day Forecast</h5>
                </div>
              </div>
              <table class="table table-dark ">
                <thead>
                  <tr>
                    {['Date', 'Temperature', 'Weather', 'Humidity', 'Wind Speed'].map((header) => (
                      <th key={header} scope="col">{header}</th>
                    ))}
                  </tr>
                </thead>
              </table>
              {forecastData.list
                .filter((forecast) => forecast.dt_txt.includes('00:00:00'))
                .map((forecast) => (
                  <div key={forecast.dt}>
                    <table class="table table-dark">
                      <tbody>
                        <tr>
                          <td data-label="Date">
                            {new Date(forecast.dt_txt.split(' ')[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td data-label="Temperature">{convertToCelsius(forecast.main.temp)}°C</td>
                          <td data-label="Weather">
                            <img
                              src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                              alt={forecast.weather[0].description}
                            />
                            {forecast.weather[0].description}
                          </td>
                          <td data-label="Humidity">{forecast.main.humidity}%</td>
                          <td data-label="Wind Speed">{forecast.wind.speed} m/s</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer class="container footer fixed-bottom  bg-dark text-white text-center py-1" style={{ marginTop: "39px" }}>
        <div class="container">
          <span>
            Designed & Created by <a href='https://aviksaharoy.github.io/' target='_blank'>Avik</a> <br />
            WeatherNows | <span class="far fa-copyright" aria-hidden="true"></span> 2023 All Rights Reserved.
          </span>
        </div>
      </footer>

    </div>
  );
};

export default App;
