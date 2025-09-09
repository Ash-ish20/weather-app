import React, { useEffect, useState, useRef } from "react";
import WeatherCard from "./components/WeatherCard";


const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
console.log("API_KEY:", API_KEY);

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";


function useDebouncedValue(value, delay = 500) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 550);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const intervalRef = useRef(null);

  const fetchWeather = async (url) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch weather");
      setWeather({
        city: json.name,
        country: json.sys?.country,
        temp: Math.round(json.main?.temp),
        feels_like: Math.round(json.main?.feels_like),
        temp_min: Math.round(json.main?.temp_min),
        temp_max: Math.round(json.main?.temp_max),
        humidity: json.main?.humidity,
        wind_speed: json.wind?.speed,
        weather_main: json.weather?.[0]?.main,
        weather_desc: json.weather?.[0]?.description,
        icon: json.weather?.[0]?.icon,
        timestamp: json.dt * 1000,
      });
    } catch (err) {
      setError(err.message || "Unknown error");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchByCity = (city) =>
    fetchWeather(`${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);

  const fetchByCoords = (lat, lon) =>
    fetchWeather(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      fetchByCity(debouncedQuery.trim());
      resetAutoRefresh(() => fetchByCity(debouncedQuery.trim()));
    }
  }, [debouncedQuery]);

  const resetAutoRefresh = (fn) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fn, 60_000);
  };

  useEffect(() => () => intervalRef.current && clearInterval(intervalRef.current), []);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchByCoords(pos.coords.latitude, pos.coords.longitude);
        resetAutoRefresh(() =>
          fetchByCoords(pos.coords.latitude, pos.coords.longitude)
        );
      },
      (err) => setError(err.message || "Failed to get location."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center p-6">
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-2">
            🌤️ Weather Now
          </h1>
          <p className="text-sm text-slate-600">Real-time weather at your fingertips</p>
        </div>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Search city (e.g. London)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            onClick={() => {
              setQuery("");
              setWeather(null);
              setError("");
            }}
          >
            Clear
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
            onClick={handleUseLocation}
          >
            📍 Use my location
          </button>
        </div>
      </header>

      {/* States */}
      {loading && (
        <div className="p-6 bg-blue-50 rounded-xl shadow text-blue-600 animate-pulse">
          Loading weather data…
        </div>
      )}
      {error && (
        <div className="p-6 bg-red-100 text-red-700 rounded-xl shadow font-medium">
          ⚠️ {error}
        </div>
      )}
      {!loading && !error && weather && <WeatherCard data={weather} />}
      {!loading && !error && !weather && (
        <div className="p-6 bg-slate-50 rounded-xl shadow text-slate-600">
          🔍 Try searching a city or click{" "}
          <span className="font-semibold text-blue-600">Use my location</span> to see weather.
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-slate-500">
        ⏳ Data updates every 60 seconds · 📌 Location requires permission
      </footer>
    </div>
  </div>
);

}
