import express from 'express';
import { getCurrentAQI } from '../controllers/aqiController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/getCurrentAQI', authenticateJWT, getCurrentAQI);

export default router;
