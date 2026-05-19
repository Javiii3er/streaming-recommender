import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '../services/http';
import { ApiResponse, RecommendedMovie } from '../types';

export default function Explorar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RecommendedMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setHasSearched(true);

    try {
      const res = await http.get<ApiResponse<RecommendedMovie[]>>(
        `/search?q=${encodeURIComponent(query)}`
      );
      setResults(res.data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch();
  }

  return (
    <div className="min-h-screen bg-neutral-950">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 via-neutral-950/50 to-neutral-950 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 pt-10 pb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
            <span className="text-brand-500 text-sm font-display font-semibold tracking-wide">
              Catálogo completo
            </span>
          </div>

          <h1 className="font-display font-extrabold text-5xl md:text-6xl text-white mb-4 leading-none">
            Explora el <span className="text-brand-500">catálogo</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto font-body mt-4">
            Busca cualquier película directamente desde la base de datos de TMDB
            con millones de títulos disponibles.
          </p>

          {/* Barra de búsqueda */}
          <div className="mt-8 flex gap-3 max-w-xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Busca una película... ej: Inception"
              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-5 py-3.5
                         text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500
                         transition-colors font-body text-base"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="btn-primary px-6"
            >
              {loading ? '...' : '🔍'}
            </button>
          </div>
        </div>
      </header>

      {/* ── Resultados ───────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 pb-20">

        {loading && (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="spinner" />
            <p className="text-neutral-500">Buscando en TMDB...</p>
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && (
          <div className="text-center py-16 text-neutral-500">
            No se encontraron películas para "{query}".
          </div>
        )}

        {!loading && results.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-white text-xl">
                Resultados para "{query}"
              </h2>
              <span className="bg-brand-500/10 border border-brand-500/20 text-brand-500
                               font-display font-bold text-sm px-4 py-2 rounded-full">
                {results.length} películas
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {results.map((movie, i) => (
                <div
                  key={movie.id}
                  onClick={() => navigate(`/pelicula/${movie.id}`)}
                  className="cursor-pointer group animate-fade-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-neutral-900
                                  border border-neutral-800 group-hover:border-brand-500
                                  transition-all duration-300 group-hover:-translate-y-1
                                  group-hover:shadow-xl group-hover:shadow-brand-500/20">
                    {movie.image_url ? (
                      <img
                        src={movie.image_url}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl opacity-20">🎬</span>
                      </div>
                    )}

                    {/* Score overlay */}
                    {movie.score > 0 && (
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm
                                      rounded-full px-2 py-0.5 text-xs font-display font-bold text-white">
                        ★ {(movie.score * 10).toFixed(1)}
                      </div>
                    )}
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
          </section>
        )}

        {/* Estado inicial */}
        {!hasSearched && (
          <div className="text-center py-20">
            <span className="text-6xl opacity-20">🎬</span>
            <p className="text-neutral-600 mt-4 font-body">
              Escribe el nombre de una película para comenzar
            </p>
          </div>
        )}
      </main>
    </div>
  );
}