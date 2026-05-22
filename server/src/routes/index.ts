import { Router } from 'express';
import {
  getRecommendations,
  getAllMovies,
  getGenres,
  getMovieById,
  searchTMDB,
  addRating,
} from '../controllers/recommendation.controller';
import { chatWithAI } from '../controllers/chat.controller';
import { register, login } from '../controllers/auth.controller';

const router = Router();

// Recomendaciones personalizadas
router.post('/recommendations', getRecommendations);

// Chat con IA
router.post('/chat', chatWithAI);

// Películas y géneros
router.get('/movies', getAllMovies);
router.get('/genres', getGenres);
router.get('/movies/:id', getMovieById);
router.get('/search', searchTMDB);

// Ratings
router.post('/ratings', addRating);

// Autenticación
router.post('/auth/register', register);
router.post('/auth/login', login);

// Health check
router.get('/health', (_req, res) => {
  res.json({ success: true, message: '🎬 StreamMatch API corriendo correctamente.' });
});

export default router;