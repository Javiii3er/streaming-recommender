import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🎭',
    title: 'Recomendaciones personalizadas',
    desc: 'Nuestro algoritmo de filtrado colaborativo analiza tus gustos para sugerirte películas que realmente te van a gustar.',
  },
  {
    icon: '✦',
    title: 'Potenciado con IA',
    desc: 'Claude AI enriquece cada recomendación con una explicación personalizada basada en tus preferencias.',
  },
  {
    icon: '♥',
    title: 'Tu lista de favoritos',
    desc: 'Guarda las películas que más te gustan y recibe recomendaciones basadas en tu colección personal.',
  },
  {
    icon: '⭐',
    title: 'Califica y descubre',
    desc: 'Califica películas con estrellas y ayuda al sistema a conocerte mejor para mejorar tus recomendaciones.',
  },
  {
    icon: '🔍',
    title: 'Catálogo ilimitado',
    desc: 'Busca cualquier película del catálogo completo de TMDB con millones de títulos disponibles.',
  },
  {
    icon: '🎬',
    title: 'Películas similares',
    desc: 'Al ver el detalle de una película, descubre títulos similares que podrían interesarte.',
  },
];

const PREVIEW_MOVIES = [
  { title: 'Inception', year: 2010, image: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg' },
  { title: 'The Dark Knight', year: 2008, image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
  { title: 'Interstellar', year: 2014, image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  { title: 'The Matrix', year: 1999, image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
  { title: 'Pulp Fiction', year: 1994, image: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' },
  { title: 'Spirited Away', year: 2001, image: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 via-neutral-950/50 to-neutral-950 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,29,72,0.15),transparent_70%)] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
            <span className="text-brand-500 text-sm font-display font-semibold tracking-wide">
              Recomendaciones inteligentes
            </span>
          </div>

          <h1 className="font-display font-extrabold text-6xl md:text-7xl text-white mb-6 leading-none">
            Descubre tu próxima<br />
            <span className="text-brand-500">película favorita</span>
          </h1>

          <p className="text-neutral-400 text-xl max-w-2xl mx-auto font-body mb-10">
            StreamMatch combina un algoritmo de filtrado colaborativo con inteligencia
            artificial para recomendarte películas que realmente te van a gustar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="btn-primary text-lg px-10 py-4"
            >
              ✦ Comenzar gratis
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-white border border-neutral-700 hover:border-neutral-500
                         font-display font-semibold text-lg px-10 py-4 rounded-xl transition-all"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </header>

      {/* ── Preview de películas ──────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {PREVIEW_MOVIES.map((movie, i) => (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden aspect-[2/3] bg-neutral-900
                         border border-neutral-800 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-display font-bold leading-tight truncate">
                  {movie.title}
                </p>
                <p className="text-neutral-400 text-xs">{movie.year}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Características ───────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-white">
            Todo lo que necesitas para descubrir cine
          </h2>
          <p className="text-neutral-400 mt-3 font-body">
            Una plataforma completa impulsada por inteligencia artificial
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6
                         flex flex-col gap-3 hover:border-neutral-700 transition-colors"
            >
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="font-display font-bold text-white">{feature.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Final ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-brand-500/10 to-brand-500/5 border border-brand-500/20
                        rounded-3xl p-12 text-center space-y-6">
          <h2 className="font-display font-extrabold text-4xl text-white">
            ¿Listo para descubrir tu próxima película?
          </h2>
          <p className="text-neutral-400 font-body max-w-xl mx-auto">
            Únete a StreamMatch y empieza a recibir recomendaciones personalizadas hoy mismo. Es completamente gratis.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="btn-primary text-lg px-12 py-4"
          >
            ✦ Crear cuenta gratis
          </button>
        </div>
      </section>

    </div>
  );
}