'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface OpenMeteoResponse {
  current: {
    temperature_2m: number
    wind_speed_10m: number
    weather_code: number
  }
}

const CACHE_MS = 30 * 60 * 1000

const WEATHER_API_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=29.5955&longitude=-89.9067&current=temperature_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago'

function getWeatherLabel(code: number): { emoji: string; label: string } {
  if (code === 0) return { emoji: '☀️', label: 'Clear sky' }
  if (code <= 3) return { emoji: code === 3 ? '☁️' : '🌤️', label: code === 3 ? 'Overcast' : 'Partly cloudy' }
  if (code <= 48) return { emoji: '🌫️', label: 'Fog' }
  if (code <= 67) return { emoji: code <= 57 ? '🌦️' : '🌧️', label: code <= 57 ? 'Drizzle' : 'Rain' }
  if (code <= 77) return { emoji: '❄️', label: 'Snow' }
  if (code <= 82) return { emoji: '🌧️', label: 'Showers' }
  return { emoji: '⛈️', label: 'Thunderstorm' }
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<OpenMeteoResponse['current'] | null>(null)
  const [loading, setLoading] = useState(true)
  const lastFetchRef = useRef<number>(0)

  const fetchWeather = useCallback(async () => {
    if (Date.now() - lastFetchRef.current < CACHE_MS) return
    lastFetchRef.current = Date.now()
    try {
      const res = await fetch(WEATHER_API_URL)
      const data = await res.json() as OpenMeteoResponse
      setWeather(data.current)
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWeather()
    const interval = setInterval(fetchWeather, CACHE_MS)
    return () => clearInterval(interval)
  }, [fetchWeather])

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-3 max-w-[200px]">
        <div className="h-16 animate-pulse bg-green-water/20 rounded-lg" />
      </div>
    )
  }

  if (!weather) return null

  const { emoji, label } = getWeatherLabel(weather.weather_code)
  const temp = Math.round(weather.temperature_2m)
  const wind = Math.round(weather.wind_speed_10m)

  return (
    <div className="glass-card rounded-xl p-3 max-w-[200px] text-center">
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl">{emoji}</span>
        <span className="text-xl font-bold text-text-dark dark:text-cream">
          {temp}°F
        </span>
      </div>
      <p className="text-xs text-text-mid dark:text-cream/60 mt-0.5">{label}</p>
      <p className="text-xs text-text-mid dark:text-cream/60">Wind: {wind} mph</p>
      <p className="text-[0.65rem] text-text-mid/60 dark:text-cream/40 mt-1">
        Home Base, Plaquemines
      </p>
    </div>
  )
}
