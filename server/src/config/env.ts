import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT || 3001,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'streamingdb',
  },
  anthropicKey: process.env.ANTHROPIC_API_KEY || '',
  tmdbKey: process.env.TMDB_API_KEY || '',
  jwtSecret: process.env.JWT_SECRET || 'streammatch_secret_key_2026',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};