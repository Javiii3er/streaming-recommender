import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Explorar from './pages/Explorar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';
import ChatBot from './components/ChatBot';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-16">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route path="/" element={
            <PrivateRoute><Home /></PrivateRoute>
          } />
          <Route path="/explorar" element={
            <PrivateRoute><Explorar /></PrivateRoute>
          } />
          <Route path="/pelicula/:id" element={
            <PrivateRoute><MovieDetail /></PrivateRoute>
          } />
          <Route path="/perfil" element={
            <PrivateRoute><Profile /></PrivateRoute>
          } />
          <Route path="/favoritos" element={
            <PrivateRoute><Favorites /></PrivateRoute>
          } />

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <ChatBot />
    </BrowserRouter>
  );
}