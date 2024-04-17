import express from 'express';
import { getCurrentAQI, getHistory, nearbyAQI, searchAQI} from '../controllers/aqiController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/getCurrentAQI', authenticateJWT, getCurrentAQI);
router.post('/getHistory', getHistory);
router.get('/search', authenticateJWT ,searchAQI);
router.get('/nearbyaqi' ,nearbyAQI);

export default router;
