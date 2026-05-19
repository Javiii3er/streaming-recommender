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
