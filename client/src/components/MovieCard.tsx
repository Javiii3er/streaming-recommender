import { RecommendedMovie } from '../types';

interface Props {
  movie: RecommendedMovie;
  index: number;
}

// Géneros con colores para las etiquetas
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

export default function MovieCard({ movie, index }: Props) {
  const genres = movie.genres.split('|').slice(0, 3); // Máximo 3 géneros
  const scorePercent = Math.round(movie.score * 100);

  return (
    <div
      className="card animate-fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header de la card — imagen o fallback */}
      <div className="relative h-40 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
        {movie.image_url ? (
          <img
            src={movie.image_url}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-5xl opacity-30">🎬</span>
        )}

        {/* Badge de score */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: scorePercent >= 70 ? '#22c55e' : scorePercent >= 40 ? '#eab308' : '#ef4444',
            }}
          />
          <span className="text-xs font-display font-semibold text-white">
            {scorePercent}% match
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-display font-bold text-white text-lg leading-tight">
            {movie.title}
          </h3>
          {movie.year && (
            <span className="text-neutral-500 text-sm">{movie.year}</span>
          )}
        </div>

        {/* Géneros */}
        <div className="flex flex-wrap gap-1.5">
          {genres.map((genre) => (
            <span
              key={genre}
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                genreColors[genre] || 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Descripción */}
        {movie.description && (
          <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2">
            {movie.description}
          </p>
        )}

        {/* Explicación de IA */}
        {movie.aiEnrichment && (
          <div className="border-t border-neutral-800 pt-3 flex gap-2">
            <span className="text-brand-500 text-sm mt-0.5">✦</span>
            <p className="text-neutral-300 text-sm italic leading-relaxed">
              {movie.aiEnrichment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
