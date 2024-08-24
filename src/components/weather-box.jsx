import { debounce, fetchWeather, generateRandomCoordinates } from '@/utils'
import { useState, useEffect, useRef } from 'react'
import GoogleMap from '@/components/google-map'
import RegionCollection from './region-collection'
import { Shuffle } from 'lucide-react'
import { MapPin } from 'lucide-react'
import AddCollectionDialog from './add-collection-dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'

export default function WeatherBox() {
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

  const regionCollectionRef = useRef(null)

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
    <section className="flex flex-col items-center justify-center gap-4 w-full">
      <div className="flex items-center justify-center gap-4">
        <h2 className="text-2xl font-bold font-serif">Random Weather App</h2>
        <div className='flex items-center justify-center gap-2'>
          <button className='bg-lime-400 p-2 rounded-md' title="Random Region" onClick={handleRandomRegion} disabled={loading}><Shuffle /></button>
          <button className='bg-lime-400 p-2 rounded-md' title="Your Location" onClick={handleYourLocation} disabled={loading}><MapPin /></button>
          <AddCollectionDialog coordinates={coordinates} handleAddRegion={regionCollectionRef.current?.handleAddRegion} />
        </div>
      </div>
      <RegionCollection setCoordinates={setCoordinates} ref={regionCollectionRef} />
      <div className='flex items-center justify-center gap-2 flex-col md:flex-row w-full'>
        <Input className='w-full md:w-[150px] text-center text-xl border-2 border-slate-500 rounded-md p-2 font-mono' type="number" min={-90} max={90} placeholder='Enter latitude' value={coordinates.latitude} onChange={(e) => setCoordinates({ ...coordinates, latitude: e.target.value })} />
        <Input className='w-full md:w-[150px] text-center text-xl border-2 border-slate-500 rounded-md p-2 font-mono' type="number" min={-180} max={180} placeholder='Enter longitude' value={coordinates.longitude} onChange={(e) => setCoordinates({ ...coordinates, longitude: e.target.value })} />
        <Button className='bg-green-600 text-white py-3 px-6 rounded-md font-serif' onClick={handleSearch} disabled={loading}>{loading ? 'Loading...' : 'Search'}</Button>
      </div>
      <ul className="flex flex-col items-center justify-center gap-2">
        <li><span className='font-bold font-mono'>Temperature:</span> {weather.temperature} <span className='text-sm font-extralight'>{weatherUnit.temperature}</span></li>
        <li><span className='font-bold font-mono'>Humidity:</span> {weather.humidity} <span className='text-sm font-extralight'>{weatherUnit.humidity}</span></li>
        <li><span className='font-bold font-mono'>Wind Speed:</span> {weather.windSpeed} <span className='text-sm font-extralight'>{weatherUnit.windSpeed}</span></li>
      </ul>
      <GoogleMap coordinates={coordinates} />
    </section>
  )
}
