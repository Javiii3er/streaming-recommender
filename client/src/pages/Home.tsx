import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGenres, fetchRecommendations } from '../services/recommendations.api';
import { RecommendedMovie } from '../types';
import MovieCard from '../components/MovieCard';

const HOW_IT_WORKS = [
  {
    icon: '🎭',
    title: 'Seleccionas géneros',
    desc: 'Elige uno o más géneros que se adapten a tu estado de ánimo.',
  },
  {
    icon: '⚙️',
    title: 'El algoritmo analiza',
    desc: 'Nuestro sistema de filtrado colaborativo encuentra patrones en miles de ratings reales.',
  },
  {
    icon: '✦',
    title: 'La IA personaliza',
    desc: 'Claude AI enriquece cada recomendación con una explicación personalizada para ti.',
  },
];

export default function Home() {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [userName, setUserName] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendedMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  const navigate = useNavigate();

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
      setCurrentPage(1);
    } catch {
      setError('Error al obtener recomendaciones. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 via-neutral-950/50 to-neutral-950 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,29,72,0.15),transparent_70%)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 pt-10 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
            <span className="text-brand-500 text-sm font-display font-semibold tracking-wide">
              Recomendaciones inteligentes
            </span>
          </div>

          <h1 className="font-display font-extrabold text-5xl md:text-6xl text-white mb-4 leading-none">
            Descubre tu próxima<br />
            <span className="text-brand-500">película favorita</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto font-body mt-4">
            Combinamos un algoritmo de filtrado colaborativo con inteligencia 
            artificial para recomendarte películas que realmente te van a gustar.
          </p>
        </div>
      </header>

      {/* ── Cómo funciona ────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <div
              key={i}
              className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6
                         flex flex-col gap-3 animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-3xl">{step.icon}</span>
              <h3 className="font-display font-bold text-white">{step.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Formulario ───────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-6 pb-20 space-y-10">

        {/* Paso 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-display font-bold flex items-center justify-center">1</span>
            <h2 className="font-display font-semibold text-white text-lg">¿Cómo te llamas?
              <span className="text-neutral-500 font-body font-normal text-base ml-2">(opcional)</span>
            </h2>
          </div>
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

        {/* Paso 2 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-display font-bold flex items-center justify-center">2</span>
            <div>
              <h2 className="font-display font-semibold text-white text-lg">
                ¿Qué géneros te gustan?
              </h2>
              <p className="text-neutral-500 text-sm mt-0.5">
                Selecciona uno o más géneros para personalizar tus recomendaciones.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`genre-chip ${selectedGenres.includes(genre) ? 'genre-chip--selected' : ''}`}
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

        {/* Paso 3 — Botón */}
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-display font-bold flex items-center justify-center">3</span>
          <button
            onClick={handleSubmit}
            disabled={loading || selectedGenres.length === 0}
            className="btn-primary"
          >
            {loading ? 'Analizando tus preferencias...' : '✦ Ver recomendaciones'}
          </button>
        </div>

        {/* ── Loading ───────────────────────────────────────── */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="spinner" />
            <p className="text-neutral-500 font-body">
              El algoritmo está trabajando junto con la IA...
            </p>
          </div>
        )}

        {/* ── Sin resultados ────────────────────────────────── */}
        {!loading && hasSearched && recommendations.length === 0 && (
          <div className="text-center py-16 text-neutral-500">
            No se encontraron recomendaciones para los géneros seleccionados.
          </div>
        )}

        {/* ── Resultados ────────────────────────────────────── */}
        {!loading && recommendations.length > 0 && (
          <section className="space-y-6">
            {/* Encabezado con contador */}
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display font-bold text-white text-2xl">
                  {userName ? `Recomendaciones para ${userName}` : 'Tus recomendaciones'}
                </h2>
                <p className="text-neutral-500 text-sm mt-1">
                  Basadas en tus géneros favoritos y enriquecidas con IA
                </p>
              </div>
              <span className="bg-brand-500/10 border border-brand-500/20 text-brand-500
                               font-display font-bold text-sm px-4 py-2 rounded-full whitespace-nowrap">
                {recommendations.length} películas encontradas
              </span>
            </div>

            {/* Grid de películas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendations
                .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                .map((movie, i) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    index={i}
                    onClick={() => navigate(`/pelicula/${movie.id}`)}
                  />
                ))}
            </div>

            {/* Paginación */}
            {recommendations.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-700
                             text-neutral-400 hover:border-brand-500 hover:text-brand-500
                             disabled:opacity-30 disabled:cursor-not-allowed transition-all font-display text-sm"
                >
                  ← Anterior
                </button>

                <span className="text-neutral-400 font-body text-sm px-4">
                  Página <span className="text-white font-bold">{currentPage}</span> de{' '}
                  <span className="text-white font-bold">
                    {Math.ceil(recommendations.length / ITEMS_PER_PAGE)}
                  </span>
                </span>

                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.min(Math.ceil(recommendations.length / ITEMS_PER_PAGE), p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === Math.ceil(recommendations.length / ITEMS_PER_PAGE)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-700
                             text-neutral-400 hover:border-brand-500 hover:text-brand-500
                             disabled:opacity-30 disabled:cursor-not-allowed transition-all font-display text-sm"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}