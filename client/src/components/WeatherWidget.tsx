import React, { useState, useEffect } from 'react';
import { Sun, Moon, Cloud, CloudRain, CloudDrizzle, CloudLightning, CloudSnow, Wind, Droplets, Sunrise } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
  uvIndex: number;
}

/** WMO UV bands. `strong` marks the levels worth actually reacting to. */
const getUvLevel = (uv: number) => {
  if (uv < 3) return { label: 'Low', strong: false };
  if (uv < 6) return { label: 'Moderate', strong: false };
  if (uv < 8) return { label: 'High', strong: true };
  if (uv < 11) return { label: 'Very High', strong: true };
  return { label: 'Extreme', strong: true };
};

const getWeatherInfo = (code: number, isDay: boolean) => {
  if (code <= 1) {
    if (!isDay) return { icon: Moon, label: 'Clear Night', theme: 'night' as const };
    const hour = new Date().getHours();
    if (hour >= 17 && hour < 19) return { icon: Sunrise, label: 'Sunset', theme: 'sunset' as const };
    return { icon: Sun, label: 'Sunny', theme: 'day' as const };
  }
  if (code <= 3) return { icon: Cloud, label: 'Partly Cloudy', theme: isDay ? 'cloudy-day' as const : 'night' as const };
  if (code <= 48) return { icon: Cloud, label: 'Cloudy', theme: 'cloudy' as const };
  if (code <= 57) return { icon: CloudDrizzle, label: 'Drizzle', theme: 'rain' as const };
  if (code <= 67) return { icon: CloudRain, label: 'Rainy', theme: 'rain' as const };
  if (code <= 77) return { icon: CloudSnow, label: 'Snowy', theme: 'rain' as const };
  if (code <= 82) return { icon: CloudRain, label: 'Showers', theme: 'rain' as const };
  if (code <= 99) return { icon: CloudLightning, label: 'Thunderstorm', theme: 'storm' as const };
  return { icon: Sun, label: 'Clear', theme: isDay ? 'day' as const : 'night' as const };
};

const themeStyles = {
  day: {
    bg: 'bg-gradient-to-r from-sky-400 via-sky-300 to-blue-400',
    icon: 'text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]',
    text: 'text-white',
    sub: 'text-white/70',
    pill: 'bg-white/20 border-white/25',
    pillText: 'text-white/90',
    badge: 'bg-yellow-400/25 text-yellow-100 border-yellow-300/30',
    divider: 'bg-white/25',
  },
  night: {
    bg: 'bg-gradient-to-r from-indigo-900 via-slate-800 to-indigo-950',
    icon: 'text-slate-200 drop-shadow-[0_0_8px_rgba(203,213,225,0.4)]',
    text: 'text-white',
    sub: 'text-slate-400',
    pill: 'bg-white/10 border-white/15',
    pillText: 'text-slate-300',
    badge: 'bg-indigo-500/30 text-indigo-200 border-indigo-400/30',
    divider: 'bg-white/15',
  },
  sunset: {
    bg: 'bg-gradient-to-r from-orange-500 via-rose-400 to-purple-500',
    icon: 'text-yellow-200 drop-shadow-[0_0_8px_rgba(253,186,116,0.5)]',
    text: 'text-white',
    sub: 'text-white/70',
    pill: 'bg-white/20 border-white/25',
    pillText: 'text-white/90',
    badge: 'bg-orange-400/30 text-orange-100 border-orange-300/30',
    divider: 'bg-white/25',
  },
  cloudy: {
    bg: 'bg-gradient-to-r from-slate-400 via-slate-300 to-gray-400',
    icon: 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]',
    text: 'text-slate-800',
    sub: 'text-slate-500',
    pill: 'bg-slate-700/15 border-slate-500/20',
    pillText: 'text-slate-600',
    badge: 'bg-slate-500/20 text-slate-700 border-slate-400/30',
    divider: 'bg-slate-600/20',
  },
  'cloudy-day': {
    bg: 'bg-gradient-to-r from-sky-300 via-slate-200 to-sky-300',
    icon: 'text-slate-500 drop-shadow-[0_0_4px_rgba(148,163,184,0.3)]',
    text: 'text-slate-800',
    sub: 'text-slate-500',
    pill: 'bg-slate-700/10 border-slate-400/20',
    pillText: 'text-slate-600',
    badge: 'bg-sky-500/15 text-sky-700 border-sky-400/25',
    divider: 'bg-slate-500/20',
  },
  rain: {
    bg: 'bg-gradient-to-r from-slate-600 via-blue-700 to-slate-700',
    icon: 'text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.4)]',
    text: 'text-white',
    sub: 'text-blue-200/70',
    pill: 'bg-white/15 border-white/20',
    pillText: 'text-blue-100',
    badge: 'bg-blue-400/25 text-blue-200 border-blue-300/30',
    divider: 'bg-white/20',
  },
  storm: {
    bg: 'bg-gradient-to-r from-slate-800 via-purple-900 to-slate-900',
    icon: 'text-purple-300 drop-shadow-[0_0_10px_rgba(196,181,253,0.5)]',
    text: 'text-white',
    sub: 'text-purple-300/70',
    pill: 'bg-white/10 border-white/15',
    pillText: 'text-purple-200',
    badge: 'bg-purple-500/25 text-purple-200 border-purple-400/30',
    divider: 'bg-white/15',
  },
};

const getBeachCondition = (code: number, temp: number) => {
  if (code >= 80) return null;
  if (code >= 51) return null;
  if (code <= 3 && temp >= 26 && temp <= 35) return 'Great for Beach';
  if (code <= 3 && temp >= 22) return 'Good for Beach';
  if (code <= 48) return 'Fair Weather';
  return null;
};

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=2.52&longitude=101.80&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day,uv_index&timezone=Asia%2FKuala_Lumpur')
      .then(r => r.json())
      .then(data => {
        if (data.current) {
          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            windSpeed: Math.round(data.current.wind_speed_10m),
            weatherCode: data.current.weather_code,
            isDay: data.current.is_day === 1,
            uvIndex: Math.round(data.current.uv_index ?? 0),
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || !weather) {
    if (loaded && !weather) return null;
    return null;
  }

  const { icon: WeatherIcon, label, theme } = getWeatherInfo(weather.weatherCode, weather.isDay);
  const style = themeStyles[theme];
  const beach = getBeachCondition(weather.weatherCode, weather.temperature);
  const uv = getUvLevel(weather.uvIndex);
  const showUv = weather.isDay && weather.uvIndex > 0;

  return (
    <section className="px-3 sm:px-6 lg:px-8 w-full flex justify-center">
      {/* Sized to its own content rather than the hero's full width, so the
          row stays a tight strip instead of a bar with a hole in the middle. */}
      <div className={`${style.bg} rounded-2xl px-3.5 sm:px-4 py-2 shadow-md border border-white/10 max-w-full transition-all duration-500`}>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <WeatherIcon className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 ${style.icon}`} />
            <div className="min-w-0 leading-tight">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-lg sm:text-xl font-extrabold ${style.text}`}>{weather.temperature}°</span>
                <span className={`text-xs sm:text-[13px] font-semibold ${style.sub} whitespace-nowrap`}>{label}</span>
              </div>
              <p className={`text-[10px] font-medium ${style.sub} whitespace-nowrap`}>Port Dickson &bull; Live</p>
            </div>
          </div>

          <span className={`w-px self-stretch my-0.5 ${style.divider}`} aria-hidden="true" />

          <div className="flex items-center gap-1.5 shrink-0">
            {/* UV reads 0 all night, so it only earns its slot in daylight;
                humidity takes the same slot after dark. */}
            {showUv ? (
              <div
                title={`UV index ${weather.uvIndex} — ${uv.label}`}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] sm:text-xs font-semibold whitespace-nowrap ${
                  uv.strong ? `${style.badge}` : `${style.pill} ${style.pillText}`
                }`}
              >
                <Sun className="w-3 h-3" />UV {weather.uvIndex}
                <span className="hidden lg:inline font-bold">&middot; {uv.label}</span>
              </div>
            ) : (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${style.pill} border text-[10px] sm:text-xs ${style.pillText} font-semibold whitespace-nowrap`}>
                <Droplets className="w-3 h-3" />{weather.humidity}%
              </div>
            )}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${style.pill} border text-[10px] sm:text-xs ${style.pillText} font-semibold whitespace-nowrap`}>
              <Wind className="w-3 h-3" />{weather.windSpeed}<span className="hidden sm:inline"> km/h</span>
            </div>
            {beach && (
              <div className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg ${style.badge} border text-[11px] font-bold whitespace-nowrap`}>
                <Sun className="w-3 h-3" />{beach}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
