
import { useState, useEffect } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function getWeatherIcon(condition) {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌫️",
    Haze: "🌫️",
  };

  return icons[condition] || "☁️";
}

// pronóstico por día
function getDailyForecast(list, timezone) {
  const days = {};

  list.forEach((item) => {
    const localDate = new Date((item.dt + timezone) * 1000);

    const date = [
      localDate.getUTCFullYear(),
      String(localDate.getUTCMonth() + 1).padStart(2, "0"),
      String(localDate.getUTCDate()).padStart(2, "0"),
    ].join("-");

    const hour = localDate.getUTCHours();
    const difference = Math.abs(hour - 12);

    if (!days[date] || difference < days[date].difference) {
      days[date] = {
        ...item,
        date,
        difference,
      };
    }
  });

  return Object.values(days).slice(0, 5);
}

function App() {
  // estados 
  const [city, setCity] = useState(
    localStorage.getItem("climora-city") || ""
  );

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const [theme, setTheme] = useState(
    localStorage.getItem("climora-theme") || "light"
  );

  const [unit, setUnit] = useState(
    localStorage.getItem("climora-unit") || "C"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // modo claro y oscuro
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
    localStorage.setItem("climora-theme", newTheme);
  };

  //  Celsius y Fahrenheit
  const toggleUnit = (newUnit) => {
    setUnit(newUnit);
    localStorage.setItem("climora-unit", newUnit);
  };

  const convertTemperature = (temp) => {
    if (unit === "F") {
      return (temp * 9) / 5 + 32;
    }

    return temp;
  };

  // consultar clima y pronóstico
  const searchWeather = async (cityToSearch) => {
    if (!cityToSearch.trim()) {
      setError("Escribe el nombre de una ciudad.");
      return;
    }

    if (!API_KEY) {
      setError("No se encontró la API Key. Revisa tu archivo .env.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // consultar clima actual
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityToSearch.trim()
        )}&appid=${API_KEY}&units=metric&lang=es`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("No encontramos esa ciudad.");
        }

        if (response.status === 401) {
          throw new Error("La API Key no es válida o todavía no está activa.");
        }

        throw new Error("No pudimos consultar el clima. Intenta más tarde.");
      }

      const data = await response.json();

      setWeather(data);
      setCity(data.name);

      // guardar ultima ciudad consultada
      localStorage.setItem("climora-city", data.name);

      // pronóstico de 5 dias
      try {
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            cityToSearch.trim()
          )}&appid=${API_KEY}&units=metric&lang=es`
        );

        if (!forecastResponse.ok) {
          throw new Error("No se pudo consultar el pronóstico.");
        }

        const forecastData = await forecastResponse.json();

        setForecast(
          getDailyForecast(
            forecastData.list,
            forecastData.city.timezone
          )
        );
      } catch (forecastError) {
        console.error(forecastError);
        setForecast([]);
      }
    } catch (err) {
      setError(err.message);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // enviar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    searchWeather(city);
  };

  // ultima ciudad guardada
  useEffect(() => {
    const savedCity = localStorage.getItem("climora-city");

    if (savedCity) {
      searchWeather(savedCity);
    }
  }, []);

  return (
    <main className={`app ${theme}`}>
      <header className="header">
        <div className="brand">
  <       div className="brand-title">
            <img src="/pwa-192x192.png" alt="Logo de Climora" />
            <h1>climora<span>.</span></h1>
          </div>
          <p>El clima, a tu manera.</p>
        </div>

        <button
          type="button"
          className="theme-button"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          title="Cambiar tema"
        >
          {theme === "light" ? "☾" : "☀️"}
        </button>
      </header>

      <section className="main-content">
        {/* Buscador de ciudades */}
        <form className="search" onSubmit={handleSearch}>
          <span>⌕</span>

          <input
            type="text"
            placeholder="Buscar ciudad..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {/* Mensaje de error */}
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {/* clima actual */}
        <section className="weather">
          <p className="location-label">CLIMA ACTUAL</p>

          <h2>
            {weather
              ? `${weather.name}, ${weather.sys.country}`
              : "Tu ciudad"}
          </h2>

          {/* selector unidades */}
          <div className="unit-toggle">
            <button
              type="button"
              className={unit === "C" ? "active" : ""}
              onClick={() => toggleUnit("C")}
            >
              °C
            </button>

            <button
              type="button"
              className={unit === "F" ? "active" : ""}
              onClick={() => toggleUnit("F")}
            >
              °F
            </button>
          </div>

          {weather ? (
            <>
              <div className="temperature">
                <span>{getWeatherIcon(weather.weather[0].main)}</span>

                <strong>
                  {Math.round(convertTemperature(weather.main.temp))}
                  {unit === "C" ? "°C" : "°F"}
                </strong>
              </div>

              <p className="description">
                {weather.weather[0].description}
              </p>

              <div className="details">
                <div>
                  <span>Humedad</span>
                  <strong>{weather.main.humidity}%</strong>
                </div>

                <div>
                  <span>Viento</span>
                  <strong>{weather.wind.speed} m/s</strong>
                </div>

                <div>
                  <span>Sensación térmica</span>
                  <strong>
                    {Math.round(
                      convertTemperature(weather.main.feels_like)
                    )}
                    {unit === "C" ? "°C" : "°F"}
                  </strong>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="temperature">
                <span>☁️</span>
                <strong>--°</strong>
              </div>

              <p className="description">
                {loading
                  ? "Consultando el clima..."
                  : "Busca una ciudad para conocer el clima"}
              </p>

              <div className="details">
                <div>
                  <span>Humedad</span>
                  <strong>-- %</strong>
                </div>

                <div>
                  <span>Viento</span>
                  <strong>-- m/s</strong>
                </div>

                <div>
                  <span>Sensación térmica</span>
                  <strong>--°</strong>
                </div>
              </div>
            </>
          )}
        </section>

        {/* pronostico de 5 dias */}
        {forecast.length > 0 && (
          <section className="forecast">
            <h3>Pronóstico de 5 días</h3>

            <div className="forecast-list">
              {forecast.map((day) => {
                const date = new Date(`${day.date}T12:00:00Z`);

                const dayName = new Intl.DateTimeFormat("es-MX", {
                  weekday: "short",
                  timeZone: "UTC",
                }).format(date);

                return (
                  <div className="forecast-card" key={day.date}>
                    <span>{dayName}</span>

                    <strong>
                      {getWeatherIcon(day.weather[0].main)}
                    </strong>

                    <span>
                      {Math.round(convertTemperature(day.main.temp))}
                      {unit === "C" ? "°C" : "°F"}
                    </span>

                    <small>{day.weather[0].description}</small>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </section>

      <footer className="footer">
        <p>climora. · Información meteorológica</p>
      </footer>
    </main>
  );
}

export default App;

