import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-6 text-center">
      <div className="space-y-6 max-w-md">

        {/* Número 404 */}
        <div className="relative">
          <p className="font-display font-extrabold text-[12rem] leading-none text-neutral-900 select-none">
            404
          </p>
          <span className="absolute inset-0 flex items-center justify-center text-6xl">
            🎬
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-bold text-2xl text-white">
            Página no encontrada
          </h1>
          <p className="text-neutral-400 font-body">
            Parece que esta escena fue cortada del guión. La página que buscas no existe.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-display text-neutral-400 hover:text-white
                       border border-neutral-700 hover:border-neutral-500 px-6 py-2.5
                       rounded-xl transition-all"
          >
            ← Volver
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            ✦ Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
}