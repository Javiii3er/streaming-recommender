import { Router } from 'express';
import {
  getRecommendations,
  getAllMovies,
  getGenres,
} from '../controllers/recommendation.controller';
import { chatWithAI } from '../controllers/chat.controller';

const router = Router();

// Recomendaciones personalizadas
router.post('/recommendations', getRecommendations);

// Chat con IA
router.post('/chat', chatWithAI);

// Películas y géneros
router.get('/movies', getAllMovies);
router.get('/genres', getGenres);

// Health check
router.get('/health', (_req, res) => {
  res.json({ success: true, message: ' StreamMatch API corriendo correctamente.' });
});

export default router;
