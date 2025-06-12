import React, { useState, useEffect } from "react";
import axios from "axios";
import RouteMap from "./RouteMap";

const LocationForm = () => {
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);

  // Set default current location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setFromCoords(coords);
          setFromQuery("Current Location");
        },
        (err) => {
          console.warn("Geolocation error:", err);
        }
      );
    }
  }, []);

  const fetchSuggestions = async (query, type) => {
    if (!query || query === "Current Location") return;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`;
    const res = await axios.get(url);
    if (type === "from") setFromSuggestions(res.data);
    else setToSuggestions(res.data);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(fromQuery, "from");
    }, 400);
    return () => clearTimeout(timer);
  }, [fromQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(toQuery, "to");
    }, 400);
    return () => clearTimeout(timer);
  }, [toQuery]);

  const handleSelect = (place, type) => {
    const coords = {
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    };
    if (type === "from") {
      setFromQuery(place.display_name);
      setFromCoords(coords);
      setFromSuggestions([]);
    } else {
      setToQuery(place.display_name);
      setToCoords(coords);
      setToSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fromCoords || !toCoords) return;

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${fromCoords.lng},${fromCoords.lat};${toCoords.lng},${toCoords.lat}?overview=full&geometries=geojson`;
      const res = await axios.get(url);

      const coords = res.data.routes[0].geometry.coordinates.map(
        ([lng, lat]) => [lat, lng]
      );
      setRouteCoords(coords);
    } catch (err) {
      console.error("Failed to fetch route from OSRM", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-5 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-4  m-auto p-4">
        {/* Source */}
        <div className="relative">
          <input
            type="text"
            placeholder="Source"
            value={fromQuery}
            onChange={(e) => setFromQuery(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {fromSuggestions.length > 0 && (
            <ul className="absolute bg-white border max-h-40 overflow-y-auto w-full z-10">
              {fromSuggestions.map((place, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelect(place, "from")}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Destination */}
        <div className="relative">
          <input
            type="text"
            placeholder="Destination"
            value={toQuery}
            onChange={(e) => setToQuery(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {toSuggestions.length > 0 && (
            <ul className="absolute bg-white border max-h-40 overflow-y-auto w-full z-10">
              {toSuggestions.map((place, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelect(place, "to")}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-yellow-500 text-black rounded"
        >
          Submit
        </button>
      </form>

      <RouteMap
        origin={fromCoords}
        destination={toCoords}
        routeCoords={routeCoords}
      />
    </div>
  );
};

export default LocationForm;
