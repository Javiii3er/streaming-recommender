import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieById } from '../services/recommendations.api';
import { Movie } from '../types';
import StarRating from '../components/StarRating';

const genreColors: Record<string, string> = {
  Action:    'bg-orange-900/50 text-orange-300',
  Drama:     'bg-blue-900/50 text-blue-300',
  Comedy:    'bg-yellow-900/50 text-yellow-300',
  Thriller:  'bg-red-900/50 text-red-300',
  'Sci-Fi':  'bg-purple-900/50 text-purple-300',
  Animation: 'bg-green-900/50 text-green-300',
  Romance:   'bg-pink-900/50 text-pink-300',
  Crime:     'bg-gray-700/50 text-gray-300',
  Horror:    'bg-red-950/50 text-red-400',
  Fantasy:   'bg-indigo-900/50 text-indigo-300',
};

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchMovieById(Number(id))
      .then(setMovie)
      .catch(() => setError('No se pudo cargar la película.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-400">{error || 'Película no encontrada.'}</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Volver al inicio
        </button>
      </div>
    );
  }

  const genres = movie.genres.split('|');

  return (
    <div className="min-h-screen bg-neutral-950">

      {/* ── Hero con imagen ───────────────────────────────── */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        {movie.image_url ? (
          <>
            <img
              src={movie.image_url}
              alt={movie.title}
              className="w-full h-full object-cover object-top opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
            <span className="text-8xl opacity-20">🎬</span>
          </div>
        )}

        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-black/50 backdrop-blur-sm border border-neutral-700
                     text-white px-4 py-2 rounded-xl text-sm font-display hover:bg-black/70
                     transition-colors flex items-center gap-2"
        >
          ← Volver
        </button>
      </div>

      {/* ── Contenido ─────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-6 -mt-20 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Poster */}
          {movie.image_url && (
            <div className="flex-shrink-0">
              <img
                src={movie.image_url}
                alt={movie.title}
                className="w-40 md:w-56 rounded-2xl shadow-2xl shadow-black/50 border border-neutral-800"
              />
            </div>
          )}

          {/* Info */}
          <div className="space-y-4 pt-4">
            <div>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white leading-tight">
                {movie.title}
              </h1>
              {movie.year && (
                <p className="text-neutral-400 mt-1">{movie.year}</p>
              )}
            </div>

            {/* Géneros */}
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    genreColors[genre] || 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Descripción */}
            {movie.description && (
              <p className="text-neutral-300 leading-relaxed text-base">
                {movie.description}
              </p>
            )}

            {/* Rating promedio + estrellas */}
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 flex items-center gap-2">
                  <span className="text-yellow-400 text-lg">★</span>
                  <div>
                    <p className="text-white font-display font-bold text-lg leading-none">
                      {Number((movie as any).avg_rating || 0).toFixed(1)}
                    </p>
                    <p className="text-neutral-500 text-xs">
                      {(movie as any).rating_count || 0} valoraciones
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/')}
                  className="btn-primary text-sm"
                >
                  ✦ Ver más recomendaciones
                </button>
              </div>

              {/* Sistema de rating con estrellas */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3">
                <StarRating
                  movieId={movie.id}
                  initialRating={Math.round((movie as any).avg_rating || 0)}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}