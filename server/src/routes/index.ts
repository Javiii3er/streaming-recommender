import { Router } from 'express';
import {
  getRecommendations,
  getAllMovies,
  getGenres,
  getMovieById, 
  addRating,
} from '../controllers/recommendation.controller';
import { searchTMDB } from '../controllers/recommendation.controller';
import { chatWithAI } from '../controllers/chat.controller';

const router = Router();

// Recomendaciones personalizadas
router.post('/recommendations', getRecommendations);

router.get('/search', searchTMDB); // Endpoint para búsqueda en TMDB

router.get('/movies/:id', getMovieById);  // Detalles de película por ID

router.post('/ratings', addRating);// Endpoint para agregar una nueva valoración de película

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
