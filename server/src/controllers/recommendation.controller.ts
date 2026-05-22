import { Request, Response } from 'express';
import { recommendByGenres, recommendCollaborative } from '../services/recommender.service';
import { enrichWithAI } from '../services/ai.service';
import { ApiResponse, RecommendedMovie } from '../types';

// POST /api/recommendations
export async function getRecommendations(req: Request, res: Response): Promise<void> {
  try {
    const { genres, userId, userName } = req.body;

    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Debes seleccionar al menos un género.',
      } as ApiResponse<null>);
      return;
    }

    let recommendations: RecommendedMovie[];
    if (userId) {
      recommendations = await recommendCollaborative(userId, genres);
    } else {
      recommendations = await recommendByGenres(genres);
    }

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
export async function getMovieById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const pool = (await import('../db/db')).default;

    // Primero busca en BD local
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

    if ((rows as any[]).length > 0) {
      res.json({ success: true, data: (rows as any[])[0] });
      return;
    }

    // Si no existe en BD local, busca en TMDB
    const { env } = await import('../config/env');
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${env.tmdbKey}&language=es-ES`
    );
    const tmdbData = await tmdbRes.json() as any;

    if (tmdbData.id) {
      const movie = {
        id: tmdbData.id,
        title: tmdbData.title,
        genres: tmdbData.genres?.map((g: any) => g.name).join('|') || '',
        year: tmdbData.release_date
          ? new Date(tmdbData.release_date).getFullYear()
          : null,
        image_url: tmdbData.poster_path
          ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
          : null,
        description: tmdbData.overview || null,
        avg_rating: tmdbData.vote_average ? tmdbData.vote_average / 2 : 0,
        rating_count: tmdbData.vote_count || 0,
      };
      res.json({ success: true, data: movie });
      return;
    }

    res.status(404).json({ success: false, error: 'Película no encontrada.' });
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

    const [userRows] = await pool.query<any[]>(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (!(userRows as any[]).length) {
      res.status(404).json({ success: false, error: 'Usuario no encontrado.' });
      return;
    }

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

// GET /api/movies/:id/similar
export async function getSimilarMovies(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const pool = (await import('../db/db')).default;

    const [movieRows] = await pool.query<any[]>(
      'SELECT genres FROM movies WHERE id = ?', [id]
    );

    if (!(movieRows as any[]).length) {
      res.json({ success: true, data: [] });
      return;
    }

    const genres = (movieRows as any[])[0].genres.split('|');
    const genreConditions = genres.map(() => 'genres LIKE ?').join(' OR ');
    const genreParams = genres.map((g: string) => `%${g}%`);

    const [similar] = await pool.query<any[]>(
      `SELECT m.*, COALESCE(AVG(r.rating), 3.0) as avg_rating
       FROM movies m
       LEFT JOIN ratings r ON m.id = r.movie_id
       WHERE (${genreConditions}) AND m.id != ?
       GROUP BY m.id
       ORDER BY avg_rating DESC
       LIMIT 6`,
      [...genreParams, id]
    );

    res.json({ success: true, data: similar });
  } catch (error) {
    console.error('Error en getSimilarMovies:', error);
    res.status(500).json({ success: false, error: 'Error al obtener películas similares.' });
  }
}