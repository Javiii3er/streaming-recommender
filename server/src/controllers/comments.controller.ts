import { Request, Response } from 'express';

// GET /api/comments/:movieId
export async function getComments(req: Request, res: Response): Promise<void> {
  try {
    const { movieId } = req.params;
    const pool = (await import('../db/db')).default;

    const [rows] = await pool.query<any[]>(
      `SELECT c.id, c.content, c.created_at,
              u.id as user_id, u.name as user_name
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.movie_id = ?
       ORDER BY c.created_at DESC`,
      [movieId]
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error en getComments:', error);
    res.status(500).json({ success: false, error: 'Error al obtener comentarios.' });
  }
}

// POST /api/comments
export async function addComment(req: Request, res: Response): Promise<void> {
  try {
    const { userId, movieId, content } = req.body;

    if (!userId || !movieId || !content?.trim()) {
      res.status(400).json({ success: false, error: 'Todos los campos son requeridos.' });
      return;
    }

    if (content.trim().length > 500) {
      res.status(400).json({ success: false, error: 'El comentario no puede superar 500 caracteres.' });
      return;
    }

    const pool = (await import('../db/db')).default;

    const [result] = await pool.query<any>(
      'INSERT INTO comments (user_id, movie_id, content) VALUES (?, ?, ?)',
      [userId, movieId, content.trim()]
    );

    const [rows] = await pool.query<any[]>(
      `SELECT c.id, c.content, c.created_at,
              u.id as user_id, u.name as user_name
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    );

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error en addComment:', error);
    res.status(500).json({ success: false, error: 'Error al agregar comentario.' });
  }
}

// DELETE /api/comments/:id — funciona con DELETE y POST
export async function deleteComment(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.body.userId || req.query.userId;
    const pool = (await import('../db/db')).default;

    await pool.query(
      'DELETE FROM comments WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    res.json({ success: true, message: 'Comentario eliminado.' });
  } catch (error) {
    console.error('Error en deleteComment:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar comentario.' });
  }
}