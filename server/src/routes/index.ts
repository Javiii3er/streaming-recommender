import { Router } from 'express';
import {
  getRecommendations,
  getAllMovies,
  getGenres,
  getMovieById,
  searchTMDB,
  addRating,
  getUserProfile,
} from '../controllers/recommendation.controller';
import { chatWithAI } from '../controllers/chat.controller';
import { register, login } from '../controllers/auth.controller';
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
  getFavoriteRecommendations,
} from '../controllers/favorites.controller';

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

// Perfil de usuario
router.get('/profile/:userId', getUserProfile);

// Favoritos
router.post('/favorites', addFavorite);
router.post('/favorites/remove', removeFavorite);
router.delete('/favorites', removeFavorite);
router.get('/favorites/:userId', getFavorites);
router.get('/favorites/check/:userId/:movieId', checkFavorite);
router.post('/favorites/recommendations', getFavoriteRecommendations);

// Health check
router.get('/health', (_req, res) => {
  res.json({ success: true, message: '🎬 StreamMatch API corriendo correctamente.' });
});

export default router;