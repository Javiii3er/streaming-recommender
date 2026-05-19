import { useState, useEffect } from 'react';
import { fetchGenres, fetchRecommendations } from '../services/recommendations.api';
import { RecommendedMovie } from '../types';
import MovieCard from '../components/MovieCard';

export default function Home() {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [userName, setUserName] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendedMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Carga géneros al montar el componente
  useEffect(() => {
    fetchGenres()
      .then(setGenres)
      .catch(() => setError('No se pudieron cargar los géneros. ¿Está el servidor corriendo?'));
  }, []);

  function toggleGenre(genre: string) {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  }

  async function handleSubmit() {
    if (selectedGenres.length === 0) {
      setError('Selecciona al menos un género para continuar.');
      return;
    }
    setError('');
    setLoading(true);
    setHasSearched(true);

    try {
      const results = await fetchRecommendations({
        genres: selectedGenres,
        userName: userName || undefined,
      });
      setRecommendations(results);
    } catch (err) {
      setError('Error al obtener recomendaciones. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <header className="relative overflow-hidden">
        {/* Fondo con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 via-neutral-950/50 to-neutral-950 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,29,72,0.15),transparent_70%)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
            <span className="text-brand-500 text-sm font-display font-semibold tracking-wide">
              Powered by IA
            </span>
          </div>

          <h1 className="font-display font-extrabold text-5xl md:text-6xl text-white mb-4 leading-none">
            Stream<span className="text-brand-500">Match</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto font-body">
            Descubre películas que se adaptan exactamente a tus gustos,
            combinando algoritmos de recomendación con inteligencia artificial.
          </p>
        </div>
      </header>

      {/* ── Formulario de preferencias ───────────────────────── */}
      <main className="max-w-4xl mx-auto px-6 pb-20 space-y-10">
        {/* Nombre opcional */}
        <section className="space-y-3">
          <label className="block font-display font-semibold text-white text-lg">
            ¿Cómo te llamas? <span className="text-neutral-500 font-body font-normal text-base">(opcional)</span>
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Tu nombre..."
            className="w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3
                       text-white placeholder-neutral-600 focus:outline-none focus:border-brand-500
                       transition-colors font-body"
          />
        </section>

        {/* Selección de géneros */}
        <section className="space-y-4">
          <div>
            <h2 className="font-display font-semibold text-white text-lg">
              ¿Qué géneros te gustan?
            </h2>
            <p className="text-neutral-500 text-sm mt-1">
              Selecciona uno o más géneros para personalizar tus recomendaciones.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`genre-chip ${
                  selectedGenres.includes(genre) ? 'genre-chip--selected' : ''
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {selectedGenres.length > 0 && (
            <p className="text-neutral-500 text-sm">
              {selectedGenres.length} género{selectedGenres.length !== 1 ? 's' : ''} seleccionado{selectedGenres.length !== 1 ? 's' : ''}
            </p>
          )}
        </section>

        {/* Error */}
        {error && (
          <div className="bg-red-950/50 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Botón */}
        <button
          onClick={handleSubmit}
          disabled={loading || selectedGenres.length === 0}
          className="btn-primary w-full md:w-auto"
        >
          {loading ? 'Analizando tus preferencias...' : '✦ Obtener recomendaciones'}
        </button>

        {/* ── Resultados ────────────────────────────────────── */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="spinner" />
            <p className="text-neutral-500 font-body">
              El algoritmo está trabajando junto con la IA...
            </p>
          </div>
        )}

        {!loading && hasSearched && recommendations.length === 0 && (
          <div className="text-center py-16 text-neutral-500">
            No se encontraron recomendaciones para los géneros seleccionados.
          </div>
        )}

        {!loading && recommendations.length > 0 && (
          <section className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-white text-2xl">
                {userName ? `Recomendaciones para ${userName}` : 'Tus recomendaciones'}
              </h2>
              <p className="text-neutral-500 text-sm mt-1">
                Basadas en tus géneros favoritos y enriquecidas con IA
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendations.map((movie, i) => (
                <MovieCard key={movie.id} movie={movie} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
