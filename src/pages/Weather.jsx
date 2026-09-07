import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { http } from "../lib/api";
import { POPULAR_INDIAN_CITIES } from "../data/indianCities";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Drop,
  ThermometerSimple,
  WarningCircle,
  MagnifyingGlass,
  MapPin,
  Crosshair,
  CalendarBlank,
  Sparkle,
  Compass,
  ArrowRight,
  Airplane,
  ForkKnife,
  X,
  Clock,
  Sunglasses,
  ShieldCheck,
  CheckCircle,
} from "@phosphor-icons/react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const ICONS = {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle: CloudRain,
  CloudRain,
  CloudSnow,
  CloudLightning,
};

const alertColors = {
  danger: "bg-red-500/15 border-red-500/40 text-red-200",
  warning: "bg-amber-500/15 border-amber-500/40 text-amber-200",
  info: "bg-sky-500/15 border-sky-500/40 text-sky-200",
};

const QUICK_CITIES = [
  "Delhi",
  "Mumbai",
  "Jaipur",
  "Bengaluru",
  "Goa",
  "Varanasi",
  "Manali",
  "Hyderabad",
  "Kolkata",
  "Chennai",
  "Kochi",
  "Srinagar",
  "Agra",
  "Udaipur",
  "Shimla",
  "Leh",
];

function getWindDirection(deg) {
  if (deg === undefined || deg === null) return "N";
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const val = Math.floor((deg / 22.5) + 0.5);
  return directions[val % 16];
}

function getUVLevel(uv) {
  if (uv <= 2) return { text: "Low", color: "text-emerald-400" };
  if (uv <= 5) return { text: "Moderate", color: "text-yellow-400" };
  if (uv <= 7) return { text: "High", color: "text-amber-400" };
  if (uv <= 10) return { text: "Very High", color: "text-red-400" };
  return { text: "Extreme", color: "text-purple-400" };
}

function formatTime(isoStr) {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  } catch {
    return isoStr;
  }
}

const Weather = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCity = searchParams.get("city") || searchParams.get("q") || "Jaipur";

  const [cityInput, setCityInput] = useState(initialCity);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);

  const searchBoxRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    if (!cityInput.trim()) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      http
        .get(`/weather/search?q=${encodeURIComponent(cityInput.trim())}`)
        .then((res) => {
          setSuggestions(res.data || []);
        })
        .catch(() => {
          setSuggestions([]);
        });
    }, 200);
    return () => clearTimeout(timer);
  }, [cityInput]);

  // Fetch weather when selectedCity changes
  const fetchWeather = (city, lat, lon) => {
    setLoading(true);
    setError(null);
    setSelectedDayIdx(0);

    let url = `/weather`;
    if (lat !== undefined && lon !== undefined) {
      url = `/weather?lat=${lat}&lon=${lon}${city ? `&city=${encodeURIComponent(city)}` : ""}`;
    } else {
      url = `/weather?city=${encodeURIComponent(city)}`;
    }

    http
      .get(url)
      .then((res) => {
        setWeatherData(res.data);
        setCityInput(res.data.city);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.response?.data?.detail || "Could not load weather. Please try another Indian city.");
        setLoading(false);
        toast.error("Failed to fetch weather for " + city);
      });
  };

  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity]);

  const handleSelectCity = (cityObj) => {
    setShowDropdown(false);
    setCityInput(cityObj.name);
    setSelectedCity(cityObj.name);
    setSearchParams({ city: cityObj.name });
    fetchWeather(cityObj.name, cityObj.lat, cityObj.lon);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!cityInput.trim()) return;
    setShowDropdown(false);
    setSelectedCity(cityInput.trim());
    setSearchParams({ city: cityInput.trim() });
  };

  const handleQuickCity = (city) => {
    setCityInput(city);
    setSelectedCity(city);
    setSearchParams({ city });
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    toast.info("Detecting your location in India…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        fetchWeather("", lat, lon);
        toast.success("Location identified! Weather updated.");
      },
      (err) => {
        setLocating(false);
        toast.error("Could not obtain location. " + err.message);
      },
      { timeout: 10000 }
    );
  };

  const CurIcon = weatherData?.current?.icon ? (ICONS[weatherData.current.icon] || Cloud) : Cloud;
  const currentUV = weatherData?.current?.uv_index ?? 5;
  const uvInfo = getUVLevel(currentUV);

  return (
    <div className="pt-24 pb-24 md:pb-16 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Top Header & Search Hero */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-4 text-xs font-medium text-primary border border-primary/20">
          <Sparkle size={14} weight="fill" />
          <span>Real-Time India Weather & 5-Day Forecast</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight text-glow">
          Indian City Weather
        </h1>
        <p className="mt-3 text-muted-foreground text-base max-w-xl mx-auto">
          Explore live meteorological conditions, severe alerts, comfort metrics, and 5-day forecasts across India.
        </p>

        {/* Search Bar */}
        <div ref={searchBoxRef} className="mt-8 relative max-w-2xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center glass rounded-full p-2 border border-white/15 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-xl shadow-black/40"
          >
            <div className="pl-3 pr-2 text-muted-foreground">
              <MagnifyingGlass size={20} />
            </div>
            <input
              type="text"
              value={cityInput}
              onChange={(e) => {
                setCityInput(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search Indian city (e.g. Jaipur, Bengaluru, Shimla, Varanasi...)"
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/60 text-sm sm:text-base px-1"
              data-testid="weather-city-input"
            />
            {cityInput && (
              <button
                type="button"
                onClick={() => {
                  setCityInput("");
                  setSuggestions([]);
                }}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-white/5 transition-colors mr-1"
              >
                <X size={16} />
              </button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleUseLocation}
              disabled={locating}
              className="rounded-full px-3 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 h-9 mr-1"
              title="Use current GPS location"
              data-testid="weather-gps-btn"
            >
              <Crosshair size={16} className={locating ? "animate-spin text-primary" : ""} />
              <span className="hidden sm:inline">GPS</span>
            </Button>
            <Button
              type="submit"
              size="sm"
              className="rounded-full px-5 h-9 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 btn-3d"
              data-testid="weather-search-btn"
            >
              Search
            </Button>
          </form>

          {/* Autocomplete Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div
              className="absolute left-0 right-0 top-full mt-2 glass rounded-2xl border border-white/15 overflow-hidden z-50 shadow-2xl backdrop-blur-xl max-h-72 overflow-y-auto text-left"
              data-testid="weather-suggestions-list"
            >
              <div className="p-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-4 border-b border-white/5">
                Suggested Indian Cities
              </div>
              {suggestions.map((item, idx) => (
                <button
                  key={item.id || idx}
                  type="button"
                  onClick={() => handleSelectCity(item)}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center justify-between transition-colors border-b border-white/5 last:border-none"
                  data-testid={`suggestion-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <MapPin size={16} weight="duotone" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.state}, India</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.destinationId && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                        Curated Destination
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">→</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Popular Cities */}
        <div className="mt-5 flex items-center justify-center flex-wrap gap-1.5 max-w-3xl mx-auto">
          <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1">
            <Compass size={13} /> Popular:
          </span>
          {QUICK_CITIES.map((c) => {
            const isActive = selectedCity.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                onClick={() => handleQuickCity(c)}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30 font-semibold"
                    : "bg-white/5 text-foreground/80 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
                data-testid={`quick-city-${c.toLowerCase()}`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-6 animate-pulse" data-testid="weather-page-loading">
          <div className="glass rounded-3xl p-8 h-64 bg-white/5" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-4 h-24 bg-white/5" />
            ))}
          </div>
          <div className="glass rounded-3xl p-6 h-56 bg-white/5" />
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="glass rounded-3xl p-8 text-center max-w-md mx-auto my-8 border border-red-500/20" data-testid="weather-error-box">
          <WarningCircle size={48} weight="duotone" className="mx-auto text-red-400 mb-3" />
          <h3 className="font-serif text-xl font-bold text-foreground">City Not Found</h3>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => handleQuickCity("Jaipur")} className="rounded-full bg-primary text-primary-foreground">
              Try Jaipur
            </Button>
            <Button variant="outline" onClick={() => handleQuickCity("Delhi")} className="rounded-full">
              Try Delhi
            </Button>
          </div>
        </div>
      )}

      {/* Main Weather Display */}
      {!loading && weatherData && !error && (
        <div className="space-y-6" data-testid="weather-display-container">
          {/* Active Alerts (if any) */}
          {weatherData.alerts?.length > 0 && (
            <div className="space-y-2" data-testid="weather-active-alerts">
              {weatherData.alerts.map((a, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border ${
                    alertColors[a.level] || alertColors.info
                  } shadow-lg backdrop-blur-md`}
                >
                  <WarningCircle size={22} weight="fill" className="shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm tracking-wide">{a.title}</div>
                    <div className="text-sm opacity-90 mt-0.5 leading-relaxed">{a.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Current Conditions Hero Card */}
          <div className="glass rounded-3xl p-6 sm:p-8 border border-white/15 relative overflow-hidden shadow-2xl">
            <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -top-16 w-60 h-60 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left: Location & Primary Temp */}
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <MapPin size={14} weight="fill" />
                  <span>{weatherData.state} · India</span>
                  <span className="text-muted-foreground/60">•</span>
                  <span className="text-muted-foreground font-normal lowercase">
                    {weatherData.lat.toFixed(2)}°N, {weatherData.lon.toFixed(2)}°E
                  </span>
                </div>

                <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight mt-2 text-glow" data-testid="weather-city-name">
                  {weatherData.city}
                </h2>

                <div className="flex items-baseline gap-4 mt-2 flex-wrap">
                  <span className="font-serif text-6xl sm:text-7xl font-bold tracking-tighter" data-testid="weather-temp-now">
                    {Math.round(weatherData.current.temperature)}°<span className="text-3xl font-light text-muted-foreground">C</span>
                  </span>
                  <div>
                    <div className="text-lg font-medium text-foreground" data-testid="weather-condition-desc">
                      {weatherData.current.description}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Feels like <span className="font-semibold text-foreground/90">{Math.round(weatherData.current.apparent_temperature)}°C</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Weather Icon & Quick Highlight */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/30 flex items-center justify-center text-primary shadow-xl shadow-primary/20 border border-primary/20 float-y">
                  <CurIcon size={56} weight="duotone" />
                </div>

                {weatherData.forecast[0] && (
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Today's Range</div>
                    <div className="text-base font-semibold">
                      High {weatherData.forecast[0].max}° · Low {weatherData.forecast[0].min}°
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Travel Advisory Callout */}
            {weatherData.travel_tip && (
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3 text-sm text-foreground/90 bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Sparkle size={18} weight="duotone" />
                </div>
                <div>
                  <span className="font-semibold text-primary">Travel & Packing Advisory: </span>
                  <span className="text-foreground/80">{weatherData.travel_tip}</span>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Meteorological Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* 1. Feels Like */}
            <div className="glass rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Feels Like</span>
                <ThermometerSimple size={16} className="text-primary" />
              </div>
              <div className="text-2xl font-serif font-bold mt-2">
                {Math.round(weatherData.current.apparent_temperature)}°C
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                {weatherData.current.apparent_temperature > weatherData.current.temperature ? "Warmer due to humidity" : "Dry / balanced feel"}
              </div>
            </div>

            {/* 2. Humidity */}
            <div className="glass rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Humidity</span>
                <Drop size={16} className="text-sky-400" />
              </div>
              <div className="text-2xl font-serif font-bold mt-2">
                {weatherData.current.humidity}%
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                {weatherData.current.humidity > 70 ? "High humidity" : weatherData.current.humidity < 35 ? "Dry air" : "Comfortable"}
              </div>
            </div>

            {/* 3. Wind */}
            <div className="glass rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Wind</span>
                <Wind size={16} className="text-teal-400" />
              </div>
              <div className="text-2xl font-serif font-bold mt-2">
                {weatherData.current.wind_speed} <span className="text-xs font-sans font-normal text-muted-foreground">km/h</span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                Direction: {getWindDirection(weatherData.current.wind_direction)} ({weatherData.current.wind_direction}°)
              </div>
            </div>

            {/* 4. Rain & Precip */}
            <div className="glass rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Precipitation</span>
                <CloudRain size={16} className="text-blue-400" />
              </div>
              <div className="text-2xl font-serif font-bold mt-2">
                {weatherData.current.precipitation} <span className="text-xs font-sans font-normal text-muted-foreground">mm</span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                Chance today: {weatherData.forecast[0]?.precipitation_probability || 0}%
              </div>
            </div>

            {/* 5. UV Index */}
            <div className="glass rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>UV Index</span>
                <Sun size={16} className="text-amber-400" />
              </div>
              <div className="text-2xl font-serif font-bold mt-2">
                {currentUV} <span className={`text-xs font-sans font-medium ${uvInfo.color}`}>({uvInfo.text})</span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                {currentUV >= 6 ? "Sunscreen needed" : "Moderate rays"}
              </div>
            </div>

            {/* 6. Pressure */}
            <div className="glass rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Pressure</span>
                <Compass size={16} className="text-purple-400" />
              </div>
              <div className="text-2xl font-serif font-bold mt-2">
                {weatherData.current.surface_pressure} <span className="text-xs font-sans font-normal text-muted-foreground">hPa</span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                Stable barometric level
              </div>
            </div>
          </div>

          {/* 5-Day Forecast Section */}
          <div className="glass rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl" data-testid="weather-5day-forecast">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <CalendarBlank size={14} />
                  <span>5-Day Meteorological Outlook</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
                  Daily Forecast for {weatherData.city}
                </h3>
              </div>
              <span className="text-xs text-muted-foreground">
                Tap any day to see complete diurnal details
              </span>
            </div>

            {/* 5 Day Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {weatherData.forecast.slice(0, 5).map((f, i) => {
                const DayIcon = ICONS[f.icon] || Cloud;
                const dateObj = new Date(f.date);
                const isToday = i === 0;
                const isSelected = selectedDayIdx === i;
                const weekday = isToday ? "Today" : dateObj.toLocaleDateString("en-IN", { weekday: "short" });
                const dateNum = dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

                return (
                  <button
                    key={f.date}
                    onClick={() => setSelectedDayIdx(i)}
                    className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden group ${
                      isSelected
                        ? "bg-primary/15 border-primary/50 shadow-lg shadow-primary/20 scale-[1.02]"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    }`}
                    data-testid={`forecast-day-${i}`}
                  >
                    {isToday && (
                      <span className="absolute top-2 right-2 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/25 text-primary border border-primary/30">
                        Current
                      </span>
                    )}

                    <div className="font-semibold text-sm text-foreground">{weekday}</div>
                    <div className="text-xs text-muted-foreground">{dateNum}</div>

                    <div className="my-4 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <DayIcon size={28} className="text-primary" weight="duotone" />
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground line-clamp-1 mb-2 font-medium">
                      {f.description}
                    </div>

                    <div className="flex items-baseline justify-between pt-2 border-t border-white/10">
                      <div>
                        <span className="font-serif text-lg font-bold text-foreground">{f.max}°</span>
                        <span className="text-xs text-muted-foreground ml-1">/ {f.min}°</span>
                      </div>

                      {f.precipitation_probability > 0 && (
                        <div className="flex items-center gap-0.5 text-[11px] text-sky-300 font-medium">
                          <Drop size={11} weight="fill" />
                          <span>{f.precipitation_probability}%</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Day Expanded Detail */}
            {weatherData.forecast[selectedDayIdx] && (
              <div className="mt-6 pt-6 border-t border-white/10 bg-white/5 rounded-2xl p-5 border border-white/5">
                {(() => {
                  const sel = weatherData.forecast[selectedDayIdx];
                  const selDate = new Date(sel.date);
                  const DayIcon = ICONS[sel.icon] || Cloud;
                  return (
                    <div>
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                        <div className="flex items-center gap-3">
                          <DayIcon size={24} className="text-primary" weight="duotone" />
                          <div>
                            <span className="font-semibold text-base">
                              {selectedDayIdx === 0 ? "Today's Complete Outlook" : `${selDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}`}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">· {sel.description}</span>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="font-bold text-primary">{sel.max}°C</span>
                          <span className="text-muted-foreground"> max · </span>
                          <span className="font-bold text-sky-300">{sel.min}°C</span>
                          <span className="text-muted-foreground"> min</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                          <span className="text-muted-foreground">Feels Like Range</span>
                          <div className="font-semibold text-sm mt-1">{sel.apparent_max}°C / {sel.apparent_min}°C</div>
                        </div>
                        <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                          <span className="text-muted-foreground">Rain Chance & Volume</span>
                          <div className="font-semibold text-sm mt-1">{sel.precipitation_probability}% · {sel.precipitation} mm</div>
                        </div>
                        <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                          <span className="text-muted-foreground">Max Wind Speed</span>
                          <div className="font-semibold text-sm mt-1">{sel.wind_speed_max} km/h</div>
                        </div>
                        <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                          <span className="text-muted-foreground">Peak UV Exposure</span>
                          <div className="font-semibold text-sm mt-1">{sel.uv_index_max} ({getUVLevel(sel.uv_index_max).text})</div>
                        </div>
                      </div>

                      {(sel.sunrise || sel.sunset) && (
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-white/5 flex-wrap gap-2">
                          <div className="flex items-center gap-4">
                            {sel.sunrise && (
                              <span className="flex items-center gap-1">
                                <Sun size={14} className="text-amber-400" /> Sunrise: <strong className="text-foreground">{formatTime(sel.sunrise)}</strong>
                              </span>
                            )}
                            {sel.sunset && (
                              <span className="flex items-center gap-1">
                                <Sun size={14} className="text-orange-400" /> Sunset: <strong className="text-foreground">{formatTime(sel.sunset)}</strong>
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] opacity-75">
                            Standard India Timezone (GMT+5:30)
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Integrated City Travel Links (if matching Exploro Destination) */}
          {weatherData.destinationId && (
            <div className="glass rounded-3xl p-6 border border-primary/30 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
                  <Sparkle size={13} weight="fill" />
                  <span>Exploro India Travel Hub</span>
                </div>
                <h4 className="font-serif text-xl font-bold">
                  Planning to visit {weatherData.city}?
                </h4>
                <p className="text-xs text-muted-foreground max-w-lg">
                  Check out curated attractions, budget breakdown, iconic walkable food trails, and custom AI itinerary planning for {weatherData.city}.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Link to={`/destinations/${weatherData.destinationId}`}>
                  <Button size="sm" className="rounded-full bg-primary text-primary-foreground">
                    Destination Guide <ArrowRight size={14} className="ml-1" />
                  </Button>
                </Link>
                <Link to={`/food-trail/${weatherData.destinationId}`}>
                  <Button size="sm" variant="outline" className="rounded-full bg-white/5 border-white/15">
                    <ForkKnife size={14} className="mr-1" /> Food Trail
                  </Button>
                </Link>
                <Link to={`/planner?dest=${weatherData.destinationId}`}>
                  <Button size="sm" variant="outline" className="rounded-full bg-white/5 border-white/15">
                    <Airplane size={14} className="mr-1" /> Plan Trip
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;
