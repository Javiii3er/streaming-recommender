import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchFavorites, fetchFavoriteRecommendations, FavoriteMovie } from '../services/favorites.api';

const GENRE_TRANSLATIONS: Record<string, string> = {
  'Action': 'Acción', 'Adventure': 'Aventura', 'Animation': 'Animación',
  'Children': 'Infantil', 'Comedy': 'Comedia', 'Crime': 'Crimen',
  'Documentary': 'Documental', 'Drama': 'Drama', 'Family': 'Familia',
  'Fantasy': 'Fantasía', 'History': 'Historia', 'Horror': 'Terror',
  'IMAX': 'IMAX', 'Musical': 'Musical', 'Mystery': 'Misterio',
  'Romance': 'Romance', 'Sci-Fi': 'Ciencia Ficción', 'Thriller': 'Suspenso',
  'TV Movie': 'Película de TV', 'War': 'Guerra', 'Western': 'Western',
};

const genreColors: Record<string, string> = {
  Action: 'bg-orange-900/50 text-orange-300', Drama: 'bg-blue-900/50 text-blue-300',
  Comedy: 'bg-yellow-900/50 text-yellow-300', Thriller: 'bg-red-900/50 text-red-300',
  'Sci-Fi': 'bg-purple-900/50 text-purple-300', Animation: 'bg-green-900/50 text-green-300',
  Romance: 'bg-pink-900/50 text-pink-300', Crime: 'bg-gray-700/50 text-gray-300',
  Horror: 'bg-red-950/50 text-red-400', Fantasy: 'bg-indigo-900/50 text-indigo-300',
};

export default function Favorites() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [topGenres, setTopGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchFavorites(user.id)
      .then(setFavorites)
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user || favorites.length === 0) return;
    setLoadingRecs(true);
    fetchFavoriteRecommendations(user.id)
      .then((res: any) => {
        setRecommendations(res.data || res);
        setTopGenres(res.topGenres || []);
      })
      .finally(() => setLoadingRecs(false));
  }, [favorites, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 via-neutral-950/50 to-neutral-950 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 pt-10 pb-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-4">
                <span className="text-brand-500 text-sm font-display font-semibold">♥ Mis Favoritos</span>
              </div>
              <h1 className="font-display font-extrabold text-3xl text-white">
                Tus películas favoritas
              </h1>
              <p className="text-neutral-400 text-sm mt-1 font-body">
                {favorites.length} película{favorites.length !== 1 ? 's' : ''} guardada{favorites.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="text-sm font-display text-neutral-400 hover:text-white
                         border border-neutral-700 hover:border-neutral-500 px-4 py-2
                         rounded-xl transition-all"
            >
              ← Volver
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-20 space-y-12">

        {/* ── Lista de favoritos ────────────────────────────── */}
        {favorites.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <span className="text-6xl opacity-20">♡</span>
            <p className="text-neutral-500">Aún no tienes películas favoritas.</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              ✦ Explorar recomendaciones
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {favorites.map((movie, i) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/pelicula/${movie.movie_id}`)}
                className="cursor-pointer group animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-neutral-900
                                border border-neutral-800 group-hover:border-brand-500
                                transition-all duration-300 group-hover:-translate-y-1
                                group-hover:shadow-xl group-hover:shadow-brand-500/20">
                  {movie.image_url ? (
                    <img src={movie.image_url} alt={movie.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl opacity-20">🎬</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-brand-500 rounded-full w-6 h-6
                                  flex items-center justify-center text-white text-xs">
                    ♥
                  </div>
                </div>
                <div className="mt-2 px-1">
                  <p className="text-white text-sm font-display font-semibold leading-tight
                                truncate group-hover:text-brand-500 transition-colors">
                    {movie.title}
                  </p>
                  {movie.year && (
                    <p className="text-neutral-500 text-xs mt-0.5">{movie.year}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Recomendaciones basadas en favoritos ─────────── */}
        {favorites.length > 0 && (
          <section className="space-y-6">
            <div className="border-t border-neutral-800 pt-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display font-bold text-white text-2xl">
                    Porque te gustan tus favoritos...
                  </h2>
                  <p className="text-neutral-500 text-sm mt-1">
                    Basado en tus géneros más frecuentes:
                    {topGenres.map((g) => (
                      <span key={g} className="ml-2 text-brand-500 font-medium">
                        {GENRE_TRANSLATIONS[g] || g}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            {loadingRecs ? (
              <div className="flex justify-center py-8">
                <div className="spinner" />
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recommendations.map((movie, i) => (
                  <div
                    key={movie.id}
                    onClick={() => navigate(`/pelicula/${movie.id}`)}
                    className="card cursor-pointer animate-fade-up hover:-translate-y-1 transition-all"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="relative h-40 bg-neutral-900 overflow-hidden">
                      {movie.image_url ? (
                        <img src={movie.image_url} alt={movie.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl opacity-20">🎬</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-display font-bold text-white leading-tight">{movie.title}</h3>
                      {movie.year && <p className="text-neutral-500 text-xs">{movie.year}</p>}
                      <div className="flex flex-wrap gap-1">
                        {movie.genres.split('|').slice(0, 2).map((genre: string) => (
                          <span
                            key={genre}
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              genreColors[genre] || 'bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {GENRE_TRANSLATIONS[genre] || genre}
                          </span>
                        ))}
                      </div>
                      {movie.description && (
                        <p className="text-neutral-400 text-sm line-clamp-2">{movie.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-8">
                No encontramos recomendaciones adicionales por ahora.
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}