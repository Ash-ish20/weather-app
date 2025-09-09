import React from "react";

export default function WeatherCard({ data }) {
  const time = new Date(data.timestamp);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 transition hover:shadow-xl">
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            {data.temp}°C
          </h2>
          <p className="text-lg font-medium text-slate-700">
            {data.weather_main} • {data.weather_desc}
          </p>
          <p className="text-slate-500 text-sm">
            Feels like <span className="font-semibold">{data.feels_like}°C</span>
          </p>
        </div>

        {/* Weather Icon + Time */}
        <div className="text-center">
          <img
            src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
            alt={data.weather_desc}
            className="w-24 h-24 mx-auto drop-shadow-md"
          />
          <p className="text-xs text-slate-500 mt-1">
            ⏰ Updated {time.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-6 mt-6 text-sm">
        <div className="space-y-2">
          <p className="text-slate-700">
            <span className="font-semibold">📍 City:</span> {data.city},{" "}
            {data.country}
          </p>
          <p className="text-slate-700">
            <span className="font-semibold">🌡️ Min:</span> {data.temp_min}°C •{" "}
            <span className="font-semibold">Max:</span> {data.temp_max}°C
          </p>
        </div>
        <div className="space-y-2 text-right">
          <p className="text-slate-700">
            <span className="font-semibold">💧 Humidity:</span> {data.humidity}%
          </p>
          <p className="text-slate-700">
            <span className="font-semibold">🌬️ Wind:</span> {data.wind_speed}{" "}
            m/s
          </p>
        </div>
      </div>
    </div>
  );
}
