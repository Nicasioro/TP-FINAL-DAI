import { Routes, Route, Link } from 'react-router-dom';
import Navegacion from './components/Navegacion.jsx';
import Home from './pages/Home.jsx';
import Buscador from './pages/Buscador.jsx';
import Detalles from './pages/Detalles.jsx';
import Biblioteca from './pages/Biblioteca.jsx';
import Playlist from './pages/Playlist.jsx';
import Estadisticas from './pages/Estadisticas.jsx';
import Perfil from './pages/Perfil.jsx';

export default function App() {
  return (
    <>
      <Navegacion />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorar" element={<Buscador />} />
          <Route path="/detalle/:id" element={<Detalles />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/colecciones" element={<Playlist />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="*" element={<div className="state">Página no encontrada. <Link to="/">Volver al inicio</Link></div>} />
        </Routes>
      </main>
    </>
  );
}
