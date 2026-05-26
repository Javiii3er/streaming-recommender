import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { http } from '../services/http';
import { ApiResponse, RecommendedMovie } from '../types';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RecommendedMovie[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const links = [
    { path: '/inicio', label: 'Inicio' },
    { path: '/explorar', label: 'Explorar' },
    { path: '/favoritos', label: '♥ Favoritos' },
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setQuery('');
        setResults([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await http.get<ApiResponse<RecommendedMovie[]>>(
          `/search?q=${encodeURIComponent(query)}`
        );
        setResults((res.data || []).slice(0, 5));
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  function handleSelectMovie(movieId: number) {
    navigate(`/pelicula/${movieId}`);
    setSearchOpen(false);
    setQuery('');
    setResults([]);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo — siempre va al inicio correcto según estado */}
        <Link
          to={isAuthenticated ? '/inicio' : '/'}
          className="font-display font-extrabold text-xl text-white flex-shrink-0"
        >
          Stream<span className="text-brand-500">Match</span>
        </Link>

        {/* Links — solo si está logueado */}
        <div className="flex items-center gap-6">
          {isAuthenticated && links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-body text-sm transition-colors ${
                location.pathname === link.path
                  ? 'text-white font-medium'
                  : link.path === '/favoritos'
                  ? 'text-brand-500 hover:text-brand-400'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth + Búsqueda */}
        <div className="flex items-center gap-3">

          {/* Buscador */}
          {isAuthenticated && (
            <div ref={searchRef} className="relative">
              {searchOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar película..."
                    className="w-48 md:w-64 bg-neutral-900 border border-neutral-700 rounded-xl
                               px-3 py-1.5 text-white text-sm placeholder-neutral-500
                               focus:outline-none focus:border-brand-500 transition-all"
                  />
                  <button
                    onClick={() => { setSearchOpen(false); setQuery(''); setResults([]); }}
                    className="text-neutral-500 hover:text-white transition-colors text-lg"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-neutral-400 hover:text-white transition-colors p-1.5"
                >
                  🔍
                </button>
              )}

              {/* Resultados dropdown */}
              {searchOpen && query.trim() && (
                <div className="absolute top-10 right-0 w-72 bg-neutral-900 border border-neutral-700
                                rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                  {searching ? (
                    <div className="p-4 text-center text-neutral-500 text-sm">Buscando...</div>
                  ) : results.length > 0 ? (
                    <div>
                      {results.map((movie) => (
                        <button
                          key={movie.id}
                          onClick={() => handleSelectMovie(movie.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-800
                                     transition-colors text-left"
                        >
                          {movie.image_url ? (
                            <img
                              src={movie.image_url}
                              alt={movie.title}
                              className="w-8 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-12 bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-xs">🎬</span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-white text-sm font-display font-semibold truncate">
                              {movie.title}
                            </p>
                            {movie.year && (
                              <p className="text-neutral-500 text-xs">{movie.year}</p>
                            )}
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={() => { navigate(`/explorar?q=${query}`); setSearchOpen(false); setQuery(''); setResults([]); }}
                        className="w-full px-4 py-3 text-brand-500 text-sm font-display
                                   hover:bg-neutral-800 transition-colors text-center border-t border-neutral-800"
                      >
                        Ver todos los resultados →
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-neutral-500 text-sm">
                      No se encontraron resultados.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/perfil')}
                className="text-neutral-400 text-sm font-body hidden md:flex items-center gap-2
                           hover:text-white transition-colors"
              >
                <span className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center
                                 text-white text-xs font-display font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
                <span>Hola, <span className="text-white font-medium">{user?.name}</span></span>
              </button>

              <button
                onClick={handleLogout}
                className="text-sm font-display text-neutral-400 hover:text-brand-500
                           border border-neutral-700 hover:border-brand-500 px-4 py-1.5
                           rounded-xl transition-all"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-display text-neutral-400 hover:text-white transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="text-sm font-display bg-brand-500 hover:bg-brand-600 text-white
                           px-4 py-1.5 rounded-xl transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}