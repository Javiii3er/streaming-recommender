import { Request, Response } from 'express';

// POST /api/favorites — Agregar a favoritos
export async function addFavorite(req: Request, res: Response): Promise<void> {
  try {
    const { userId, movieId, title, genres, year, image_url, description } = req.body;

    if (!userId || !movieId || !title) {
      res.status(400).json({ success: false, error: 'Datos incompletos.' });
      return;
    }

    const pool = (await import('../db/db')).default;

    await pool.query(
      `INSERT IGNORE INTO favorites (user_id, movie_id, title, genres, year, image_url, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, movieId, title, genres || '', year || null, image_url || null, description || null]
    );

    res.json({ success: true, message: 'Agregado a favoritos.' });
  } catch (error) {
    console.error('Error en addFavorite:', error);
    res.status(500).json({ success: false, error: 'Error al agregar favorito.' });
  }
}

// DELETE /api/favorites — Eliminar de favoritos
export async function removeFavorite(req: Request, res: Response): Promise<void> {
  try {
    const { userId, movieId } = req.body;
    const pool = (await import('../db/db')).default;

    await pool.query(
      'DELETE FROM favorites WHERE user_id = ? AND movie_id = ?',
      [userId, movieId]
    );

    res.json({ success: true, message: 'Eliminado de favoritos.' });
  } catch (error) {
    console.error('Error en removeFavorite:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar favorito.' });
  }
}

// GET /api/favorites/:userId — Obtener favoritos del usuario
export async function getFavorites(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    const pool = (await import('../db/db')).default;

    const [rows] = await pool.query(
      'SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error en getFavorites:', error);
    res.status(500).json({ success: false, error: 'Error al obtener favoritos.' });
  }
}

// GET /api/favorites/check/:userId/:movieId — Verificar si es favorito
export async function checkFavorite(req: Request, res: Response): Promise<void> {
  try {
    const { userId, movieId } = req.params;
    const pool = (await import('../db/db')).default;

    const [rows] = await pool.query<any[]>(
      'SELECT id FROM favorites WHERE user_id = ? AND movie_id = ?',
      [userId, movieId]
    );

    res.json({ success: true, data: { isFavorite: (rows as any[]).length > 0 } });
  } catch (error) {
    console.error('Error en checkFavorite:', error);
    res.status(500).json({ success: false, error: 'Error al verificar favorito.' });
  }
}

// POST /api/favorites/recommendations — Recomendaciones basadas en favoritos
export async function getFavoriteRecommendations(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.body;
    const pool = (await import('../db/db')).default;

    // Obtiene los favoritos del usuario
    const [favorites] = await pool.query<any[]>(
      'SELECT genres FROM favorites WHERE user_id = ? LIMIT 10',
      [userId]
    );

    if (!(favorites as any[]).length) {
      res.json({ success: true, data: [], message: 'No hay favoritos para generar recomendaciones.' });
      return;
    }

    // Extrae todos los géneros de los favoritos y los cuenta
    const genreCount: Record<string, number> = {};
    (favorites as any[]).forEach((fav) => {
      fav.genres.split('|').forEach((genre: string) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });

    // Ordena géneros por frecuencia y toma los top 3
    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);

    // Obtiene IDs de películas ya en favoritos para excluirlas
    const [favMovies] = await pool.query<any[]>(
      'SELECT movie_id FROM favorites WHERE user_id = ?',
      [userId]
    );
    const excludeIds = (favMovies as any[]).map((f) => f.movie_id);

    // Busca películas similares que no estén en favoritos
    const genreConditions = topGenres.map(() => 'genres LIKE ?').join(' OR ');
    const genreParams = topGenres.map((g) => `%${g}%`);

    let query = `
      SELECT m.*, COALESCE(AVG(r.rating), 3.0) as avg_rating
      FROM movies m
      LEFT JOIN ratings r ON m.id = r.movie_id
      WHERE (${genreConditions})
    `;

    if (excludeIds.length > 0) {
      query += ` AND m.id NOT IN (${excludeIds.map(() => '?').join(',')})`;
    }

    query += ' GROUP BY m.id ORDER BY avg_rating DESC LIMIT 12';

    const params = excludeIds.length > 0
      ? [...genreParams, ...excludeIds]
      : genreParams;

    const [recommendations] = await pool.query<any[]>(query, params);

    res.json({
      success: true,
      data: recommendations,
      topGenres,
    });
  } catch (error) {
    console.error('Error en getFavoriteRecommendations:', error);
    res.status(500).json({ success: false, error: 'Error al generar recomendaciones.' });
  }
}