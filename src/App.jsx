import { useState, useEffect } from 'react'
import './App.css'
import { debounce, fetchWeather, generateRandomCoordinates } from './utils'

function App() {
  const [coordinates, setCoordinates] = useState({
    longitude: 151.2152969,
    latitude: -33.8567844
  })
  const [weather, setWeather] = useState({
    temperature: 0,
    humidity: 0,
    windSpeed: 0
  })
  const [loading, setLoading] = useState(false)
  const [weatherUnit, setWeatherUnit] = useState({
    temperature: '°C',
    humidity: '%',
    windSpeed: 'km/h'
  })

  useEffect(() => {
    handleSearch()
  }, [])

  useEffect(() => {
    handleSearch()
  }, [coordinates])

  const handleSearch = debounce(async () => {
    // check if coordinates are valid
    if (coordinates.latitude < -90 || coordinates.latitude > 90 || coordinates.longitude < -180 || coordinates.longitude > 180) {
      alert('Invalid coordinates\nLatitude must be between -90 and 90\nLongitude must be between -180 and 180')
      return
    }
    setLoading(true)
    const res = await fetchWeather(coordinates.latitude, coordinates.longitude)
    const weather = await res.json()
    const currentWeather = weather.current
    const currentUnit = weather.current_units
    setWeather({
      temperature: currentWeather.temperature_2m,
      humidity: currentWeather.relative_humidity_2m,
      windSpeed: currentWeather.wind_speed_10m
    })
    setWeatherUnit({
      temperature: currentUnit.temperature_2m,
      humidity: currentUnit.relative_humidity_2m,
      windSpeed: currentUnit.wind_speed_10m
    })
    setLoading(false)
  }, 500)

  const handleRandomRegion = () => {
    setCoordinates(generateRandomCoordinates())
  }

  const handleYourLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      setCoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude })
    }, () => {
      alert('Error getting your location')
    })
  }

  return (
    <main className='main'>
      <section className="weather-container">
        <div className="weather-header">
          <h2>Weather App</h2>
          <div className='weather-header-operations'>
            <button title="Random Region" onClick={handleRandomRegion} disabled={loading}><i className="fas fa-random"></i></button>
            <button title="Your Location" onClick={handleYourLocation} disabled={loading}><i className="fas fa-map-marker-alt"></i></button>
          </div>
        </div>
        <div className='weather-search'>
          <input type="number" min={-90} max={90} placeholder='Enter latitude' value={coordinates.latitude} onChange={(e) => setCoordinates({ ...coordinates, latitude: e.target.value })} />
          <input type="number" min={-180} max={180} placeholder='Enter longitude' value={coordinates.longitude} onChange={(e) => setCoordinates({ ...coordinates, longitude: e.target.value })} />
          <button onClick={handleSearch} disabled={loading}>{loading ? 'Loading...' : 'Search'}</button>
        </div>
        <ul className="weather-info">
          <li>Temperature: {weather.temperature} {weatherUnit.temperature}</li>
          <li>Humidity: {weather.humidity} {weatherUnit.humidity}</li>
          <li>Wind Speed: {weather.windSpeed} {weatherUnit.windSpeed}</li>
        </ul>
        <iframe
          width="400"
          height="400"
          className="random-region-map"
          loading="lazy"
          allowFullScreen={true}
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_MAP_API_KEY}&center=${coordinates.latitude},${coordinates.longitude}&zoom=18&maptype=satellite`}>
        </iframe>
      </section>
    </main>
  )
}

export default App
