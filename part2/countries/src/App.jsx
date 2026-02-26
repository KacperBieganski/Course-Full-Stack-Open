import { useState, useEffect } from "react";
import axios from "axios";

const CountryDetail = ({ country }) => {
  const capital = country.capital ? country.capital[0] : null;

  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>capital {country.capital}</p>
      <p>area {country.area}</p>

      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="150"
      />

      {capital && <CapitalWeather capital={capital} />}
    </div>
  );
};

const CapitalWeather = ({ capital }) => {
  const [weather, setWeather] = useState(null);

  const api_key = import.meta.env.VITE_SOME_KEY2;

  useEffect(() => {
    if (capital) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`,
        )
        .then((response) => {
          setWeather(response.data);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    }
  }, [capital, api_key]);

  if (!weather) {
    return <p>Loading weather data...</p>;
  }

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>temperature {weather.main.temp} Celsius</p>

      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />

      <p>wind {weather.wind.speed} m/s</p>
    </div>
  );
};

const Display = ({ countries, query, handleShowCountry }) => {
  if (query === "") {
    return null;
  }

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (countries.length > 1 && countries.length <= 10) {
    return (
      <div>
        {countries.map((country) => (
          <div key={country.name.common}>
            {country.name.common}{" "}
            <button onClick={() => handleShowCountry(country.name.common)}>
              show
            </button>
          </div>
        ))}
      </div>
    );
  }

  if (countries.length === 1) {
    return <CountryDetail country={countries[0]} />;
  }

  return <p>No matches found</p>;
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allCountries, setAllCountries] = useState([]);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setAllCountries(response.data);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleShowCountry = (name) => {
    setSearchQuery(name);
  };

  const filteredCountries = allCountries.filter((country) =>
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      <div>
        find countries{" "}
        <input value={searchQuery} onChange={handleSearchChange} />
      </div>

      <Display
        countries={filteredCountries}
        query={searchQuery}
        handleShowCountry={handleShowCountry}
      />
    </div>
  );
};

export default App;
