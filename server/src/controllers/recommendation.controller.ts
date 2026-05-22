import { Request, Response } from 'express';
import { recommendByGenres, recommendCollaborative } from '../services/recommender.service';
import { enrichWithAI } from '../services/ai.service';
import { ApiResponse, RecommendedMovie } from '../types';

// POST /api/recommendations
// Body: { genres: string[], userId?: number, userName?: string }
export async function getRecommendations(req: Request, res: Response): Promise<void> {
  try {
    const { genres, userId, userName } = req.body;

    // Validación básica
    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Debes seleccionar al menos un género.',
      } as ApiResponse<null>);
      return;
    }

    // Paso 1: Algoritmo de recomendación
    let recommendations: RecommendedMovie[];
    if (userId) {
      recommendations = await recommendCollaborative(userId, genres);
    } else {
      recommendations = await recommendByGenres(genres);
    }

    // Paso 2: Enriquecimiento con IA (Claude)
    const enriched = await enrichWithAI(recommendations, genres, userName);

    res.json({
      success: true,
      data: enriched,
      message: `Se encontraron ${enriched.length} recomendaciones personalizadas.`,
    } as ApiResponse<RecommendedMovie[]>);
  } catch (error) {
    console.error('Error en getRecommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno al generar recomendaciones.',
    } as ApiResponse<null>);
  }
}

// GET /api/movies
// Devuelve todas las películas disponibles
export async function getAllMovies(req: Request, res: Response): Promise<void> {
  try {
    const pool = (await import('../db/db')).default;
    const [rows] = await pool.query('SELECT * FROM movies ORDER BY title');
    res.json({ success: true, data: rows } as ApiResponse<any[]>);
  } catch (error) {
    console.error('Error en getAllMovies:', error);
    res.status(500).json({ success: false, error: 'Error al obtener películas.' });
  }
}

// GET /api/genres
// Devuelve la lista de géneros únicos disponibles
export async function getGenres(req: Request, res: Response): Promise<void> {
  try {
    const pool = (await import('../db/db')).default;
    const [rows] = await pool.query<any[]>('SELECT genres FROM movies');

    const genreSet = new Set<string>();
    rows.forEach((row) => {
      row.genres.split('|').forEach((g: string) => genreSet.add(g.trim()));
    });

    const genres = Array.from(genreSet).sort();
    res.json({ success: true, data: genres } as ApiResponse<string[]>);
  } catch (error) {
    console.error('Error en getGenres:', error);
    res.status(500).json({ success: false, error: 'Error al obtener géneros.' });
  }
}

// GET /api/movies/:id
// Devuelve los detalles de una película específica por su ID junto con su puntuación media
export async function getMovieById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const pool = (await import('../db/db')).default;
    
    const [rows] = await pool.query<any[]>(
      `SELECT m.*, 
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as rating_count
       FROM movies m
       LEFT JOIN ratings r ON m.id = r.movie_id
       WHERE m.id = ?
       GROUP BY m.id`,
      [id]
    );

    if (!rows.length) {
      res.status(404).json({ success: false, error: 'Película no encontrada.' });
      return;
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error en getMovieById:', error);
    res.status(500).json({ success: false, error: 'Error al obtener la película.' });
  }
}

// GET /api/search?q=matrix
export async function searchTMDB(req: Request, res: Response): Promise<void> {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      res.status(400).json({ success: false, error: 'Parámetro de búsqueda requerido.' });
      return;
    }

    const { env } = await import('../config/env');
    const query = encodeURIComponent(q);
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${env.tmdbKey}&query=${query}&language=es-ES&page=1`;

    const response = await fetch(url);
    const data = await response.json() as any;

    const movies = data.results?.slice(0, 12).map((m: any) => ({
      id: m.id,
      title: m.title,
      year: m.release_date ? new Date(m.release_date).getFullYear() : null,
      image_url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
      description: m.overview || null,
      genres: '',
      score: m.vote_average / 10,
    })) || [];

    res.json({ success: true, data: movies });
  } catch (error) {
    console.error('Error en searchTMDB:', error);
    res.status(500).json({ success: false, error: 'Error al buscar películas.' });
  }
}

// POST /api/ratings
export async function addRating(req: Request, res: Response): Promise<void> {
  try {
    const { movieId, rating, userId } = req.body;

    if (!movieId || !rating || rating < 0.5 || rating > 5) {
      res.status(400).json({ success: false, error: 'Datos de rating inválidos.' });
      return;
    }

    const pool = (await import('../db/db')).default;

    // Si hay userId, guarda en BD. Si no, solo devuelve éxito
    if (userId) {
      await pool.query(
        `INSERT INTO ratings (user_id, movie_id, rating) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE rating = ?`,
        [userId, movieId, rating, rating]
      );
    }

    res.json({ success: true, message: 'Rating guardado correctamente.' });
  } catch (error) {
    console.error('Error en addRating:', error);
    res.status(500).json({ success: false, error: 'Error al guardar el rating.' });
  }
}

// GET /api/profile/:userId
export async function getUserProfile(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    const pool = (await import('../db/db')).default;

    // Datos del usuario
    const [userRows] = await pool.query<any[]>(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (!(userRows as any[]).length) {
      res.status(404).json({ success: false, error: 'Usuario no encontrado.' });
      return;
    }

    // Historial de ratings con info de la película
    const [ratings] = await pool.query<any[]>(
      `SELECT r.rating, r.created_at, m.id as movie_id, m.title, m.genres, m.year, m.image_url
       FROM ratings r
       JOIN movies m ON r.movie_id = m.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        user: (userRows as any[])[0],
        ratings: ratings,
        totalRatings: (ratings as any[]).length,
      }
    });
  } catch (error) {
    console.error('Error en getUserProfile:', error);
    res.status(500).json({ success: false, error: 'Error al obtener perfil.' });
  }
}