import { getClient } from '../config.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';


export const getCurrentAQI = async (req, res) => {
    let client;
    try {
      const { longitude, latitude } = req.body;

      const requestOptions = {
        method: 'GET',
      };
  
      const reverseCoding = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${process.env.GREV_API}`, requestOptions);
      const result = await reverseCoding.json();
      const userAddress = `${result.results[0].city},${result.results[0].country}`
  
      if (req.user.username !== "null") {
        client = getClient()
        client.connect()
        const combinedCoordinates = `${longitude},${latitude}`;
        const query = `UPDATE users SET last_known_location = '${combinedCoordinates}' WHERE id = '${req.user.id}'`;

        try {
            const result = await client.query(query)
            console.log(result);
        } catch (error) {
            console.error('Error during login:', error);
            res.json(500).json({ error: 'Internal server error' });
            return
        };      
        
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
          "LOCAL_AQI"
        ],
        "universalAqi": false,

        "customLocalAqis": [
            {
                "regionCode": "US",
                "aqi": "usa_epa"
            }
        ]
    
      };
  

      const response = await fetch(`https://airquality.googleapis.com/v1/currentConditions:lookup?key=${process.env.GAQI_KEY}`, {
        method: 'post',
        body: JSON.stringify(payload),
        headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();

    console.log(data);

    if (req.user.username === "null") {
        req.user.username = "There"
    }

      res.json({"user": req.user, "address": userAddress, data: data });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  export const getHistory = async (req, res) => {
    // Get the current date and time
        const now = new Date();

        // Calculate the total hours from 0:00 to now
        const hoursSinceMidnight = now.getHours();
        const totalHours = hoursSinceMidnight + 1; 
        console.log(totalHours)

        // Google Air Quality API endpoint
const apiUrl = `https://airquality.googleapis.com/v1/history:lookup?key=${process.env.GAQI_KEY}`;

// Data payload for the POST request
const requestData = {
    hours: getTotalHoursSinceMidnight(),
    location: {
        latitude: 37.419734,
        longitude: -122.0827784
    }
};

    // Options for the fetch request
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    };


        try {
            const response = await fetch(apiUrl, requestOptions);
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log(data);
            res.json({"data":data})
            
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            res.status(500).json({ error: 'Internal server error' });m
        }
    

  };
  