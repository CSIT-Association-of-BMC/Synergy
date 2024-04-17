import { getClient } from "../config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
export const getCurrentAQI = async (req, res) => {
  let client;
  try {
    const { longitude, latitude } = req.body;

    const requestOptions = {
      method: "GET",
    };

    const reverseCoding = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${process.env.GREV_KEY}`,
      requestOptions
    );
    const result = await reverseCoding.json();
    const userAddress = `${result.results[0].city},${result.results[0].country}`;

    if (req.user.username !== "null") {
      client = getClient();
      client.connect();
      const combinedCoordinates = `${longitude},${latitude}`;
      const query = `UPDATE users SET last_known_location = '${combinedCoordinates}' WHERE id = '${req.user.id}'`;

      try {
        const result = await client.query(query);
      } catch (error) {
        console.error("Error during login:", error);
        res.json(500).json({ error: "Internal server error" });
        return;
      }
    }

    const payload = {
      location: {
        latitude: latitude,
        longitude: longitude,
      },

      extraComputations: [
        "HEALTH_RECOMMENDATIONS",
        "POLLUTANT_ADDITIONAL_INFO",
        "DOMINANT_POLLUTANT_CONCENTRATION",
        "LOCAL_AQI",
      ],
      universalAqi: false,

      customLocalAqis: [
        {
          regionCode: "US",
          aqi: "usa_epa",
        },
      ],
    };

    const response = await fetch(
      `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${process.env.GAQI_KEY}`,
      {
        method: "post",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();

    if (req.user.username === "null") {
      req.user.username = "There";
    }

    res.json({ user: req.user, address: userAddress, data: data });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getHistory = async (req, res) => {
  // Get the current date and time
  const now = new Date();

  // Calculate the total hours from 0:00 to now
  const hoursSinceMidnight = now.getHours();
  const totalHours = hoursSinceMidnight + 1;
  console.log(totalHours);

  // Google Air Quality API endpoint
  const apiUrl = `https://airquality.googleapis.com/v1/history:lookup?key=${process.env.GAQI_KEY}`;


  const { latitude, longitude } = req.body;

  // Data payload for the POST request
  const requestData = {
    hours: totalHours,
    location: {
      latitude: latitude,
      longitude: longitude,
    },
  };

  // Options for the fetch request
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  };

  try {
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
    res.json({ data: data });
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    res.status(500).json({ error: "Internal server error" });
    m;
  }
};

export const searchAQI = async (req, res) => {
  const keyword = req.query.keyword || "kathmandu";

  const requestOptions = {
    method: "GET",
  };

  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${keyword}&apiKey=${process.env.GREV_KEY}`,
      requestOptions
    );
    const data = await response.json();
    console.log(data.features[0].properties.lon, data.features[0].properties.lat);

    const payload = {
          latitude: data.features[0].properties.lat,
          longitude: data.features[0].properties.lon,
    }
    const requestOptions2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const response =  await fetch(
        "http://localhost:3000/aqi/getCurrentAQI",
        requestOptions2
      );
      const AQIInfo = await response.json();
      res.json({ "AQIInfo": AQIInfo });
      
    } catch (error) {
      console.log("Error:", error);
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const nearbyAQI = async (req, res) => {
    const {latitude, longitude} = req.body

    const latSign = latitude >= 0 ? '+' : '-';
    const lonSign = longitude >= 0 ? '+' : '-';
  
    const url = `http://geodb-free-service.wirefreethought.com/v1/geo/locations/${latSign}${Math.abs(latitude)}${lonSign}${Math.abs(longitude)}/nearbyPlaces?radius=20&types=CITY&hateoasMode=false&limit=5&offset=0`;
  

    const response = await fetch(url, {
                        "headers": {
                            "accept": "application/json",
                        },
                        "method": "GET"
    });

    const data = await response.json();        

    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };
    const aqiData = [];
    try {
        for (let i=0; i<data.data.length; i++) {
          const response = await fetch("http://localhost:3000/aqi/getCurrentAQI", {
            ...requestOptions,
            body: JSON.stringify({ latitude: data.data[i].latitude, longitude: data.data[i].longitude })
          });
    
          if (!response.ok) {
            throw new Error(`Failed to fetch AQI for ${data.data[i].name}. HTTP status: ${response.status}`);
          }
    
          const aqiInfo = await response.json();
          console.log(aqiInfo);
          const locationAqi = {
            location: data.data[i].name,
            aqi: aqiInfo.data.indexes[0].aqi
          };
          aqiData.push(locationAqi);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    
      res.json({"aqiData":aqiData});
    
};