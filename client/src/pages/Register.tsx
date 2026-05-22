import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/auth.api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Todos los campos son requeridos.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const { token, user } = await registerUser(name, email, password);
      login(token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display font-extrabold text-4xl text-white">
            Stream<span className="text-brand-500">Match</span>
          </h1>
          <p className="text-neutral-400 mt-2 font-body">Crea tu cuenta gratis</p>
        </div>

        {/* Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-5">
          <h2 className="font-display font-bold text-white text-xl">Registro</h2>

          {error && (
            <div className="bg-red-950/50 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-neutral-400 text-sm font-body">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3
                           text-white placeholder-neutral-600 focus:outline-none focus:border-brand-500
                           transition-colors font-body"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-400 text-sm font-body">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3
                           text-white placeholder-neutral-600 focus:outline-none focus:border-brand-500
                           transition-colors font-body"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-400 text-sm font-body">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3
                           text-white placeholder-neutral-600 focus:outline-none focus:border-brand-500
                           transition-colors font-body"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? 'Creando cuenta...' : '✦ Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-neutral-500 text-sm font-body">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-brand-500 hover:text-brand-400 transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}