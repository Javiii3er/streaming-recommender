import pool from '../db/db';
import { Movie, RecommendedMovie } from '../types';

// ============================================================
// ALGORITMO DE FILTRADO COLABORATIVO (Content-Based + Collaborative)
//
// ¿Cómo funciona?
// 1. Si el usuario tiene historial: busca usuarios similares por ratings
//    y recomienda lo que ellos calificaron bien (filtrado colaborativo).
// 2. Si el usuario no tiene historial: recomienda por géneros favoritos
//    con las películas mejor valoradas (content-based).
// ============================================================

// Calcula similitud del coseno entre dos vectores de ratings
function cosineSimilarity(
  ratingsA: Map<number, number>,
  ratingsB: Map<number, number>
): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  ratingsA.forEach((ratingA, movieId) => {
    normA += ratingA * ratingA;
    if (ratingsB.has(movieId)) {
      dotProduct += ratingA * ratingsB.get(movieId)!;
    }
  });

  ratingsB.forEach((ratingB) => {
    normB += ratingB * ratingB;
  });

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Recomendación basada en géneros (para usuarios sin historial)
export async function recommendByGenres(
  genres: string[],
  limit = 50
): Promise<RecommendedMovie[]> {
  const conn = await pool.getConnection();
  try {
    // Trae todas las películas con su rating promedio
    const [rows] = await conn.query<any[]>(`
      SELECT 
        m.*,
        COALESCE(AVG(r.rating), 3.0) as avg_rating,
        COUNT(r.id) as rating_count
      FROM movies m
      LEFT JOIN ratings r ON m.id = r.movie_id
      GROUP BY m.id
    `);

    // Filtra y puntúa por géneros seleccionados
    const scored = rows.map((movie) => {
      const movieGenres = movie.genres.split('|').map((g: string) => g.toLowerCase());
      const matchCount = genres.filter((g) =>
        movieGenres.includes(g.toLowerCase())
      ).length;

      // Score = coincidencia de géneros (peso 60%) + rating promedio (peso 40%)
      const genreScore = matchCount / genres.length;
      const ratingScore = (movie.avg_rating - 0.5) / 4.5; // Normaliza a 0-1
      const finalScore = genreScore * 0.6 + ratingScore * 0.4;

      return {
        ...movie,
        score: Math.round(finalScore * 100) / 100,
      } as RecommendedMovie;
    });

    // Devuelve las mejor puntuadas, excluyendo las que no coinciden en nada
    return scored
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } finally {
    conn.release();
  }
}

// Recomendación colaborativa (para usuarios con historial)
export async function recommendCollaborative(
  userId: number,
  genres: string[],
  limit = 50
): Promise<RecommendedMovie[]> {
  const conn = await pool.getConnection();
  try {
    // Trae todos los ratings de la BD
    const [allRatings] = await conn.query<any[]>(
      'SELECT user_id, movie_id, rating FROM ratings'
    );

    // Agrupa ratings por usuario
    const userRatingsMap = new Map<number, Map<number, number>>();
    allRatings.forEach(({ user_id, movie_id, rating }) => {
      if (!userRatingsMap.has(user_id)) {
        userRatingsMap.set(user_id, new Map());
      }
      userRatingsMap.get(user_id)!.set(movie_id, rating);
    });

    const targetRatings = userRatingsMap.get(userId);

    // Si el usuario no tiene ratings suficientes, usa content-based
    if (!targetRatings || targetRatings.size < 2) {
      return recommendByGenres(genres, limit);
    }

    // Calcula similitud con cada otro usuario
    const similarities: { userId: number; similarity: number }[] = [];
    userRatingsMap.forEach((ratings, otherUserId) => {
      if (otherUserId !== userId) {
        const sim = cosineSimilarity(targetRatings, ratings);
        if (sim > 0) {
          similarities.push({ userId: otherUserId, similarity: sim });
        }
      }
    });

    // Ordena por similitud descendente, toma los top 3 vecinos
    similarities.sort((a, b) => b.similarity - a.similarity);
    const neighbors = similarities.slice(0, 3);

    if (neighbors.length === 0) {
      return recommendByGenres(genres, limit);
    }

    // Películas ya vistas por el usuario objetivo
    const seenMovies = new Set(targetRatings.keys());

    // Calcula score ponderado para películas no vistas
    const movieScores = new Map<number, number>();
    neighbors.forEach(({ userId: neighborId, similarity }) => {
      const neighborRatings = userRatingsMap.get(neighborId)!;
      neighborRatings.forEach((rating, movieId) => {
        if (!seenMovies.has(movieId)) {
          const current = movieScores.get(movieId) || 0;
          movieScores.set(movieId, current + rating * similarity);
        }
      });
    });

    // Trae las películas recomendadas de la BD
    const movieIds = Array.from(movieScores.keys());
    if (movieIds.length === 0) return recommendByGenres(genres, limit);

    const placeholders = movieIds.map(() => '?').join(',');
    const [movies] = await conn.query<any[]>(
      `SELECT * FROM movies WHERE id IN (${placeholders})`,
      movieIds
    );

    // Combina score colaborativo con géneros
    const result: RecommendedMovie[] = movies.map((movie) => {
      const collabScore = movieScores.get(movie.id) || 0;
      const movieGenres = movie.genres.split('|').map((g: string) => g.toLowerCase());
      const genreMatch = genres.some((g) => movieGenres.includes(g.toLowerCase())) ? 1 : 0;
      const finalScore = collabScore * 0.7 + genreMatch * 0.3;

      return { ...movie, score: Math.round(finalScore * 100) / 100 };
    });

    return result.sort((a, b) => b.score - a.score).slice(0, limit);
  } finally {
    conn.release();
  }
}
