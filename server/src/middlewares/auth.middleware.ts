import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, error: 'Token requerido.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as any;
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Token inválido o expirado.' });
  }
}