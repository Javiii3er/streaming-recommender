import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import router from './routes';
import { errorHandler, notFound } from './middlewares/error.middleware';

const app = express();

// ── Middlewares globales ──────────────────────────────────────
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rutas ────────────────────────────────────────────────────
app.use('/api', router);

// ── Manejo de errores (siempre al final) ─────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
