"use client";
import { useEffect, useState } from "react";
import { State, City } from "country-state-city";

const LocationSelect = ({ formData, setFormData, isUploading }) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const indianStates = State.getStatesOfCountry("IN");
    setStates(indianStates);
  }, []);

  const handleStateChange = (e) => {
    const selectedStateCode = e.target.value;
    const selectedState = states.find((s) => s.isoCode === selectedStateCode);

    setFormData((prev) => ({
      ...prev,
      state: selectedState.name,
      city: "",
      location: "",
    }));

    const citiesInState = City.getCitiesOfState("IN", selectedStateCode);
    setCities(citiesInState);
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    const location = `${city}, ${formData.state}`;
    setFormData((prev) => ({
      ...prev,
      city,
      location,
    }));
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">State *</label>
      <select
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
        onChange={handleStateChange}
        value={states.find((s) => s.name === formData.state)?.isoCode || ""}
        disabled={isUploading}
      >
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state.isoCode} value={state.isoCode}>
            {state.name}
          </option>
        ))}
      </select>

      <label className="block text-gray-700 font-medium mb-2">City *</label>
      <select
        className="w-full border border-gray-300 rounded-xl px-4 py-3"
        onChange={handleCityChange}
        value={formData.city || ""}
        disabled={!formData.state || isUploading}
      >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city.name} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Pincode *
        </label>
        <input
          name="pincode"
          type="text"
          value={formData.pincode || ""}
          onChange={(e) => {
            const value = e.target.value;

            if (/^\d{0,6}$/.test(value)) {
              setFormData((prev) => ({ ...prev, pincode: value }));
            }
          }}
          pattern="\d{6}"
          inputMode="numeric"
          maxLength={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter 6-digit Pincode"
          disabled={isUploading}
          required
        />
      </div>
    </div>
  );
};

export default LocationSelect;
