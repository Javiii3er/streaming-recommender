import { Request, Response, NextFunction } from 'express';

// Middleware global de errores — va al final de app.ts
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('❌ Error no manejado:', err.message);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor.',
  });
}

// Middleware para rutas no encontradas
export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Ruta ${req.method} ${req.path} no encontrada.`,
  });
}
