import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const links = [
    { path: '/', label: 'Inicio' },
    { path: '/explorar', label: 'Explorar' },
  ];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="font-display font-extrabold text-xl text-white">
          Stream<span className="text-brand-500">Match</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-body text-sm transition-colors ${
                location.pathname === link.path
                  ? 'text-white font-medium'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Nombre clickeable que lleva al perfil */}
              <button
                onClick={() => navigate('/perfil')}
                className="text-neutral-400 text-sm font-body hidden md:flex items-center gap-2
                           hover:text-white transition-colors"
              >
                {/* Avatar inicial */}
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