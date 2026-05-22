import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

// POST /api/auth/register
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, error: 'Todos los campos son requeridos.' });
      return;
    }

    const pool = (await import('../db/db')).default;

    // Verifica si el email ya existe
    const [existing] = await pool.query<any[]>(
      'SELECT id FROM users WHERE email = ?', [email]
    );

    if ((existing as any[]).length > 0) {
      res.status(400).json({ success: false, error: 'El email ya está registrado.' });
      return;
    }

    // Encripta la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserta el usuario
    const [result] = await pool.query<any>(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Genera el token
    const token = jwt.sign(
      { userId: result.insertId, name },
      env.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: { token, user: { id: result.insertId, name, email } }
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ success: false, error: 'Error al registrar usuario.' });
  }
}

// POST /api/auth/login
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email y contraseña requeridos.' });
      return;
    }

    const pool = (await import('../db/db')).default;

    const [rows] = await pool.query<any[]>(
      'SELECT * FROM users WHERE email = ?', [email]
    );

    const user = (rows as any[])[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ success: false, error: 'Credenciales incorrectas.' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name },
      env.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: { token, user: { id: user.id, name: user.name, email: user.email } }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, error: 'Error al iniciar sesión.' });
  }
}