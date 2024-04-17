import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config'
import authRoutes from './routes/authRoutes.js';
import aqiRoutes from './routes/aqiRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Routes 
app.use('/auth', authRoutes);
app.use('/aqi', aqiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
