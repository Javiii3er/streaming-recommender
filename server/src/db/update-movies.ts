import dotenv from 'dotenv';
dotenv.config();

import pool from './db';
import { fetchMovieFromTMDB } from '../services/tmdb.service';

async function updateMovies() {
  console.log('🎬 Actualizando películas con datos de TMDB...\n');
  const [rows] = await pool.query<any[]>('SELECT id, title, year FROM movies');

  for (const movie of rows) {
    const { image_url, description } = await fetchMovieFromTMDB(movie.title, movie.year);
    if (image_url || description) {
      await pool.query(
        'UPDATE movies SET image_url = ?, description = ? WHERE id = ?',
        [image_url, description, movie.id]
      );
      console.log(`✅ ${movie.title}`);
    } else {
      console.log(`⚠️  ${movie.title} — no encontrada`);
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  console.log('\n🎉 ¡Listo!');
  process.exit(0);
}

updateMovies().catch(console.error);