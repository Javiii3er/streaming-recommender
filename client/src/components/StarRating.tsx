import { useState } from 'react';
import { http } from '../services/http';
import { useAuth } from '../context/AuthContext';

interface Props {
  movieId: number;
  initialRating?: number;
}

export default function StarRating({ movieId, initialRating = 0 }: Props) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  async function handleRate(value: number) {
    setRating(value);
    setSaving(true);
    setSaved(false);

    try {
      await http.post('/ratings', {
        movieId,
        rating: value,
        userId: user?.id,  // ← aquí estaba el problema
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      console.error('Error al guardar rating');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-neutral-400 text-sm font-body">Tu valoración:</p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="text-3xl transition-all duration-100 hover:scale-125"
          >
            <span className={star <= (hover || rating) ? 'text-yellow-400' : 'text-neutral-700'}>
              ★
            </span>
          </button>
        ))}

        <span className="ml-3 text-sm font-body">
          {saving && <span className="text-neutral-500">Guardando...</span>}
          {saved && <span className="text-green-400">✓ Guardado</span>}
          {!saving && !saved && rating > 0 && (
            <span className="text-neutral-400">{rating}/5</span>
          )}
        </span>
      </div>
    </div>
  );
}