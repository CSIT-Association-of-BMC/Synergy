import express from 'express';
import { getCurrentAQI, getHistory } from '../controllers/aqiController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/getCurrentAQI', authenticateJWT, getCurrentAQI);
router.post('/getHistory', getHistory);

export default router;
