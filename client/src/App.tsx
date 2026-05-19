import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Explorar from './pages/Explorar';
import ChatBot from './components/ChatBot';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pelicula/:id" element={<MovieDetail />} />
          <Route path="/explorar" element={<Explorar />} />
        </Routes>
      </div>
      <ChatBot />
    </BrowserRouter>
  );
}