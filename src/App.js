import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isCityNotFound, setIsCityNotFound] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const API_KEY = '30d4741c779ba94c470ca1f63045390a';

  // Weather Data Start --------------------------------------------
  const getWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
      setIsCityNotFound(false);

      getForecast()
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        setWeatherData(null);
        setForecastData(null)
        setIsCityNotFound(true);
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

  // Convert temperature --------------------------------------------
  const convertToCelsius = (temperature) => {
    return Math.round(temperature);
  };

  // Show Date --------------------------------------------
  useEffect(() => {
    const getCurrentDateTime = () => {
      const currentDate = new Date();
      const options = {
        year: 'numeric',
        month: 'short',
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

  return (
    <div className='container'>

      <nav class="navbar navbar-dark bg-dark mb-3">
        <div class="container-fluid">
          <span class="navbar-brand ms-3 h1"><i class="bi bi-umbrella-fill"></i> 
          <span className='appname'> WeatherNow</span></span>
          <span className='text-white'>Welcome to my weather app! Enter in a city to get the weather</span>
        </div>
      </nav>


      <div className='weather'>
        <div className='weather1'>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter Your City..."
          />
          <button onClick={getWeather} type="button" class="btn btn-info mx-1">Search</button>
        </div>

        <div className='weather2'>
          {/* <button onClick={getWeather} type="button" class="btn btn-info">Get Weather</button> */}
          {/* <button onClick={getForecast} type="button" class="btn btn-warning">Get Forecast</button> */}
        </div>

        <div className='weather3'>
          {weatherData && (
            <div>
              <div class="data text-white bg-dark mb-3" >
                <h5 class="card-title h4 mb-3 ms-3"><i class="bi bi-geo-alt-fill"></i> {weatherData.name} <p style={{ fontSize: "16px" }}>{currentDateTime}</p></h5>
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
                        <p>{weatherData.weather[0].main}</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class=" border p-2 text-center border-info">
                        <h6>FEELS LIKE</h6>
                        <p>{convertToCelsius(weatherData.main.feels_like)}°C</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class=" border p-2 text-center border-info">
                        <h6>HUMIDITY</h6>
                        <p>{weatherData.main.humidity}%</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class=" border p-2 text-center border-info">
                        <h6>WIND SPEED</h6>
                        <p>{weatherData.wind.speed} m/s</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class=" border p-2 text-center border-info">
                        <h6>VISIBILITY</h6>
                        <p>{weatherData.visibility / 1000} km</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class=" border p-2 text-center border-info">
                        <h6>MAX TEMPERATURE</h6>
                        <p>{convertToCelsius(weatherData.main.temp_max)}°C</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class=" border p-2 text-center border-info">
                        <h6>MIN TEMPERATURE</h6>
                        <p>{convertToCelsius(weatherData.main.temp_min)}°C</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className=" border p-2 text-center border-info">
                        <h6>SUNRISE</h6>
                        <p>{new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className=" border p-2 text-center border-info">
                        <h6>SUNSET</h6>
                        <p>{new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className=" border p-2 text-center border-info">
                        <h6>PRESSURE</h6>
                        <p>{weatherData.main.pressure} hPa</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className=" border p-2 text-center border-info">
                        <h6>DEW POINT</h6>
                        <p>{convertToCelsius(weatherData.main.temp - (100 - weatherData.main.humidity) / 5)}°C</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {forecastData && (
            <div class="data2 ">
              <h2><center>Hourly Forecast for Today</center></h2>
              <table class="table table-dark">
                <thead>
                  <tr>
                    <th scope="col">TIME</th>
                    <th scope="col">TEMPERATURE</th>
                    <th scope="col">WEATHER</th>
                    <th scope="col">HUMIDITY</th>
                    <th scope="col">WIND SPEED</th>
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
                            <td data-label="Time">{forecastDate.toLocaleTimeString()}</td>
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

          {isCityNotFound && (
            <h3 className='text-center text-danger'>City Not Found!</h3>
          )}

          {forecastData && (
            <div class="data2  mb-5">
              <h2><center>5-Day Forecast</center></h2>
              <table class="table table-dark ">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Temperature</th>
                    <th scope="col">Weather</th>
                    <th scope="col">Humidity</th>
                    <th scope="col">Wind Speed</th>
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
                          <td data-label="Date">{forecast.dt_txt.split(' ')[0]}</td>
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

      <footer class="container footer  bg-dark text-white text-center fixed-bottom mt-5">
        <div class="container">
          <span>
            – Thanks for visiting! – <br />
            WeatherNow | <span class="far fa-copyright" aria-hidden="true"></span> 2023 All Rights Reserved.
          </span>
        </div>
      </footer>

    </div>
  );
};

export default App;
