import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { addToFavorites, removeFromFavorites, checkIsFavorite } from '../services/favorites.api';

interface Props {
  movie: {
    id: number;
    title: string;
    genres: string;
    year: number | null;
    image_url: string | null;
    description: string | null;
  };
}

export default function FavoriteButton({ movie }: Props) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) return;
    checkIsFavorite(user.id, movie.id)
      .then(setIsFavorite)
      .finally(() => setChecking(false));
  }, [user, movie.id]);

  async function handleToggle() {
    if (!user || loading) return;
    setLoading(true);

    try {
      if (isFavorite) {
        await removeFromFavorites(user.id, movie.id);
        setIsFavorite(false);
      } else {
        await addToFavorites(user.id, movie);
        setIsFavorite(true);
      }
    } catch {
      console.error('Error al actualizar favoritos');
    } finally {
      setLoading(false);
    }
  }

  if (checking) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display
                  border transition-all duration-200 ${
                    isFavorite
                      ? 'bg-brand-500 border-brand-500 text-white hover:bg-brand-600'
                      : 'bg-transparent border-neutral-700 text-neutral-400 hover:border-brand-500 hover:text-brand-500'
                  } disabled:opacity-50`}
    >
      <span className="text-base">{isFavorite ? '♥' : '♡'}</span>
      {isFavorite ? 'En favoritos' : 'Agregar a favoritos'}
    </button>
  );
}