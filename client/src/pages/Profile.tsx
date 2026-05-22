import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { http } from '../services/http';
import { ApiResponse } from '../types';

interface RatingItem {
  movie_id: number;
  title: string;
  genres: string;
  year: number | null;
  image_url: string | null;
  rating: number;
  created_at: string;
}

interface ProfileData {
  user: { id: number; name: string; email: string; created_at: string };
  ratings: RatingItem[];
  totalRatings: number;
}

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    http.get<ApiResponse<ProfileData>>(`/profile/${user.id}`)
      .then((res) => setProfile(res.data!))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  function renderStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-neutral-700'}>★</span>
    ));
  }

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
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center
                              font-display font-bold text-white text-2xl">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="font-display font-extrabold text-3xl text-white">
                  {user?.name}
                </h1>
                <p className="text-neutral-400 font-body text-sm mt-0.5">{user?.email}</p>
              </div>
            </div>

            {/* Botón volver */}
            <button
              onClick={() => navigate(-1)}
              className="text-sm font-display text-neutral-400 hover:text-white
                         border border-neutral-700 hover:border-neutral-500 px-4 py-2
                         rounded-xl transition-all"
            >
              ← Volver
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4">
              <p className="text-3xl font-display font-bold text-white">
                {profile?.totalRatings || 0}
              </p>
              <p className="text-neutral-400 text-sm mt-1">Películas valoradas</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4">
              <p className="text-3xl font-display font-bold text-white">
                {profile?.ratings.length
                  ? (profile.ratings.reduce((acc, r) => acc + r.rating, 0) / profile.ratings.length).toFixed(1)
                  : '—'}
              </p>
              <p className="text-neutral-400 text-sm mt-1">Rating promedio</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4">
              <p className="text-3xl font-display font-bold text-brand-500">
                {profile?.ratings[0]
                  ? new Date(profile.ratings[0].created_at).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
                  : '—'}
              </p>
              <p className="text-neutral-400 text-sm mt-1">Última valoración</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Historial ─────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="font-display font-bold text-white text-xl mb-6">
          Historial de valoraciones
        </h2>

        {!profile?.ratings.length ? (
          <div className="text-center py-16 space-y-4">
            <span className="text-5xl opacity-20">🎬</span>
            <p className="text-neutral-500">
              Aún no has valorado ninguna película.
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              ✦ Explorar recomendaciones
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {profile.ratings.map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(`/pelicula/${item.movie_id}`)}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4
                           flex items-center gap-4 cursor-pointer hover:border-neutral-600
                           transition-all duration-200 hover:-translate-y-0.5"
              >
                {/* Poster */}
                <div className="w-12 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-800">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">🎬</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-white truncate">{item.title}</p>
                  <p className="text-neutral-500 text-xs mt-0.5">
                    {item.year} · {item.genres.split('|').slice(0, 2).join(', ')}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex flex-col items-end gap-1">
                  <div className="flex text-lg">{renderStars(item.rating)}</div>
                  <p className="text-neutral-500 text-xs">
                    {new Date(item.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}