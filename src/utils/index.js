export function generateRandomCoordinates() {
  const latitude = Math.random() * 180 - 90
  const longitude = Math.random() * 360 - 180
  return { latitude: latitude.toFixed(2), longitude: longitude.toFixed(2) }
}

export function fetchWeather(latitude, longitude) {
  const api = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`

  return fetch(api)
}
