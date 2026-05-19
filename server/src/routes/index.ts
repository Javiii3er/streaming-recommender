import { Router } from 'express';
import {
  getRecommendations,
  getAllMovies,
  getGenres,
} from '../controllers/recommendation.controller';

const router = Router();

// Recomendaciones personalizadas
router.post('/recommendations', getRecommendations);

// Películas y géneros
router.get('/movies', getAllMovies);
router.get('/genres', getGenres);

// Health check — para verificar que el servidor está vivo
router.get('/health', (_req, res) => {
  res.json({ success: true, message: '🎬 StreamMatch API corriendo correctamente.' });
});

export default router;
