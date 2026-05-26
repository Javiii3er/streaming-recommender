import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { http } from '../services/http';
import { ApiResponse } from '../types';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  user_name: string;
}

interface Props {
  movieId: number;
}

export default function Comments({ movieId }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    http.get<ApiResponse<Comment[]>>(`/comments/${movieId}`)
      .then((res) => setComments(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [movieId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !user) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await http.post<ApiResponse<Comment>>('/comments', {
        userId: user.id,
        movieId,
        content: content.trim(),
      });
      setComments((prev) => [res.data!, ...prev]);
      setContent('');
    } catch {
      setError('Error al publicar el comentario.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId: number) {
    if (!user) return;
    try {
      await http.post(`/comments/${commentId}/delete`, { userId: user.id });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      console.error('Error al eliminar comentario');
    }
  }

  return (
    <section className="space-y-5 border-t border-neutral-800 pt-10">
      <h2 className="font-display font-bold text-white text-xl">
        Comentarios
        {comments.length > 0 && (
          <span className="ml-2 text-neutral-500 font-body font-normal text-base">
            ({comments.length})
          </span>
        )}
      </h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="¿Qué te pareció esta película?"
          maxLength={500}
          rows={3}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3
                     text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500
                     transition-colors font-body text-sm resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-neutral-600 text-xs">{content.length}/500</span>
          {error && <span className="text-red-400 text-xs">{error}</span>}
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="btn-primary text-sm px-5 py-2"
          >
            {submitting ? 'Publicando...' : '✦ Comentar'}
          </button>
        </div>
      </form>

      {/* Lista de comentarios */}
      {loading ? (
        <div className="flex justify-center py-6">
          <div className="spinner" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-neutral-600 text-sm">
          Sé el primero en comentar esta película.
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center
                                   text-white text-xs font-display font-bold flex-shrink-0">
                    {comment.user_name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-white font-display font-semibold text-sm">
                    {comment.user_name}
                  </span>
                  <span className="text-neutral-600 text-xs">
                    {new Date(comment.created_at).toLocaleDateString('es-ES', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                </div>

                {/* Botón eliminar solo para el autor */}
                {user?.id === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-neutral-600 hover:text-red-400 transition-colors text-xs"
                  >
                    Eliminar
                  </button>
                )}
              </div>

              <p className="text-neutral-300 text-sm leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}