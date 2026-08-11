const express = require("express");
const axios = require("axios");

// Replace with your secure server-side key
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const getLocationName  = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Missing latitude or longitude" });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);

    if (response.data.status === "OK") {
      const address = response.data.results[0]?.formatted_address || "Address not available";
      return res.json({ address });
    } else {
      console.error("Geocode error:", JSON.stringify(response.data, null, 2));
      return res.status(500).json({ address: "Address not available" });
    }
  } catch (err) {
    console.error("Error calling Google Geocoding API:", err.message);
    return res.status(500).json({ address: "Address not available" });
  }
}

module.exports = {
    getLocationName
};
