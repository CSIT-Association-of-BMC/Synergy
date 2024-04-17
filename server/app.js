import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config'
import authRoutes from './routes/authRoutes.js';
import aqiRoutes from './routes/aqiRoutes.js';
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Middleware to enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specified HTTP methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Allow specified headers
    next();
});

app.use(cors());


// Routes 
app.use('/auth', authRoutes);
app.use('/aqi', aqiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
