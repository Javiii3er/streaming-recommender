// Script para importar películas populares de TMDB a la base de datos
// Ejecutar con: npx ts-node src/db/import-movies.ts

import dotenv from 'dotenv';
dotenv.config();

import pool from './db';
import { env } from '../config/env';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Mapa de IDs de géneros de TMDB a nombres (Corregido sin duplicados)
const GENRE_MAP: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation',
  35: 'Comedy', 80: 'Crime', 99: 'Documentary',
  18: 'Drama', 10751: 'Family', 14: 'Fantasy',
  36: 'History', 27: 'Horror', 10402: 'Musical',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War',
  37: 'Western',
};

async function importMovies() {
  console.log('🎬 Importando películas populares desde TMDB...\n');

  let imported = 0;
  let skipped = 0;

  // Importa las primeras 10 páginas (200 películas populares)
  for (let page = 1; page <= 10; page++) {
    const url = `${TMDB_BASE_URL}/movie/popular?api_key=${env.tmdbKey}&language=es-ES&page=${page}`;
    const response = await fetch(url);
    const data = await response.json() as any;

    for (const movie of data.results) {
      try {
        // Verifica si ya existe
        const [existing] = await pool.query<any[]>(
          'SELECT id FROM movies WHERE title = ? AND year = ?',
          [movie.title, movie.release_date ? new Date(movie.release_date).getFullYear() : null]
        );

        if ((existing as any[]).length > 0) {
          skipped++;
          continue;
        }

        // Mapea géneros
        const genres = movie.genre_ids
          .map((id: number) => GENRE_MAP[id])
          .filter(Boolean)
          .join('|');

        const year = movie.release_date
          ? new Date(movie.release_date).getFullYear()
          : null;

        const image_url = movie.poster_path
          ? `${TMDB_IMAGE_URL}${movie.poster_path}`
          : null;

        await pool.query(
          `INSERT INTO movies (title, genres, year, image_url, description) 
           VALUES (?, ?, ?, ?, ?)`,
          [movie.title, genres || 'Drama', year, image_url, movie.overview || null]
        );

        imported++;
        console.log(` ${movie.title} (${year})`);
      } catch (err) {
        console.log(`  Error con "${movie.title}"`);
      }
    }

    // Pausa entre páginas para no saturar la API
    await new Promise((r) => setTimeout(r, 500));
    console.log(`\n Página ${page}/10 completada\n`);
  }

  console.log(`\n ¡Importación completada!`);
  console.log(`Importadas: ${imported} películas`);
  console.log(` Omitidas: ${skipped} (ya existían)`);
  process.exit(0);
}

importMovies().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});