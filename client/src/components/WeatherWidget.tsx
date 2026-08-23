import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudDrizzle, CloudLightning, CloudSnow, Wind, Droplets } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
}

const getWeatherIcon = (code: number) => {
  if (code <= 1) return { icon: Sun, label: 'Sunny', color: 'text-amber-400' };
  if (code <= 3) return { icon: Cloud, label: 'Partly Cloudy', color: 'text-slate-300' };
  if (code <= 48) return { icon: Cloud, label: 'Cloudy', color: 'text-slate-400' };
  if (code <= 57) return { icon: CloudDrizzle, label: 'Drizzle', color: 'text-blue-300' };
  if (code <= 67) return { icon: CloudRain, label: 'Rainy', color: 'text-blue-400' };
  if (code <= 77) return { icon: CloudSnow, label: 'Snowy', color: 'text-blue-200' };
  if (code <= 82) return { icon: CloudRain, label: 'Showers', color: 'text-blue-500' };
  if (code <= 99) return { icon: CloudLightning, label: 'Thunderstorm', color: 'text-purple-400' };
  return { icon: Sun, label: 'Clear', color: 'text-amber-400' };
};

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=2.52&longitude=101.80&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day&timezone=Asia%2FKuala_Lumpur')
      .then(r => r.json())
      .then(data => {
        if (data.current) {
          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            windSpeed: Math.round(data.current.wind_speed_10m),
            weatherCode: data.current.weather_code,
            isDay: data.current.is_day === 1,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const { icon: WeatherIcon, label, color } = weather
    ? getWeatherIcon(weather.weatherCode)
    : { icon: Sun, label: 'Loading...', color: 'text-slate-300' };

  return (
    <section className="px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div
        className={`bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-md border border-orange-100/80 w-full hover-lift transition-all duration-500 ${
          loaded && weather ? 'opacity-100 translate-y-0' : loaded && !weather ? 'hidden' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#FF7E5F]/20 to-[#FFB800]/20 flex items-center justify-center">
              <WeatherIcon className={`w-7 h-7 sm:w-8 sm:h-8 ${color}`} />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#1A2A2B]">{weather?.temperature ?? '--'}°C</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-500">{label}</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">Port Dickson, Negeri Sembilan &bull; Live</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold">{weather?.humidity ?? '--'}%</span>
              <span className="text-slate-400">Humidity</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <Wind className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-semibold">{weather?.windSpeed ?? '--'} km/h</span>
              <span className="text-slate-400">Wind</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-emerald-700">Perfect for Beach</span>
            </div>
          </div>

          <div className="sm:hidden flex items-center gap-2 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-400" />{weather?.humidity ?? '--'}%</span>
            <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-teal-400" />{weather?.windSpeed ?? '--'}km/h</span>
          </div>
        </div>
      </div>
    </section>
  );
};
