// WMO weather code → short label + emoji
// Reference: https://open-meteo.com/en/docs (WMO Weather interpretation codes)
const WEATHER_CODE_MAP = {
  0: 'Clear sky ☀️',
  1: 'Mainly clear 🌤️',
  2: 'Partly cloudy ⛅',
  3: 'Overcast ☁️',
  45: 'Fog 🌫️',
  48: 'Rime fog 🌫️',
  51: 'Light drizzle 🌦️',
  53: 'Drizzle 🌦️',
  55: 'Dense drizzle 🌦️',
  56: 'Freezing drizzle 🌧️',
  57: 'Freezing drizzle 🌧️',
  61: 'Light rain 🌦️',
  63: 'Rain 🌧️',
  65: 'Heavy rain 🌧️',
  66: 'Freezing rain 🌧️',
  67: 'Freezing rain 🌧️',
  71: 'Light snow 🌨️',
  73: 'Snow 🌨️',
  75: 'Heavy snow ❄️',
  77: 'Snow grains 🌨️',
  80: 'Light showers 🌦️',
  81: 'Showers 🌧️',
  82: 'Violent showers ⛈️',
  85: 'Snow showers 🌨️',
  86: 'Heavy snow showers ❄️',
  95: 'Thunderstorm ⛈️',
  96: 'Thunderstorm with hail ⛈️',
  99: 'Thunderstorm with hail ⛈️',
}

export function weatherCodeToLabel(code) {
  return WEATHER_CODE_MAP[code] ?? 'Unknown conditions 🌡️'
}

export async function getWeather(lat, lng) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Weather request failed: HTTP ${res.status}`)
  const data = await res.json()
  const current = data?.current
  if (!current || typeof current.temperature_2m !== 'number') {
    throw new Error('Weather response missing current data')
  }
  const label = weatherCodeToLabel(current.weather_code)
  const [description, icon] = splitLabel(label)
  return {
    tempC: Math.round(current.temperature_2m),
    description,
    icon,
    code: current.weather_code,
    wind: Math.round(current.wind_speed_10m ?? 0),
    humidity: Math.round(current.relative_humidity_2m ?? 0),
  }
}

// Labels are stored as "Description <emoji>"; split them so callers can use
// the emoji separately if they want.
function splitLabel(label) {
  const lastSpace = label.lastIndexOf(' ')
  if (lastSpace === -1) return [label, '']
  return [label.slice(0, lastSpace), label.slice(lastSpace + 1)]
}
