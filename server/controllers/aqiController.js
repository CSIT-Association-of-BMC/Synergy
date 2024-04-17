import { getClient } from '../config.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';


export const getCurrentAQI = async (req, res) => {
    let client;
    try {
      const { longitude, latitude } = req.body;

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

      res.json({"user": req.user ,message: 'Data', data });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  