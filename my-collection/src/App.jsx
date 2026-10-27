import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import Detail from './pages/Detail.jsx';
import Library from './pages/Library.jsx';
import Collections from './pages/Collections.jsx';
import Stats from './pages/Stats.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorar" element={<Explore />} />
          <Route path="/detalle/:id" element={<Detail />} />
          <Route path="/biblioteca" element={<Library />} />
          <Route path="/colecciones" element={<Collections />} />
          <Route path="/estadisticas" element={<Stats />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="*" element={<div className="state">Página no encontrada. <Link to="/">Volver al inicio</Link></div>} />
        </Routes>
      </main>
    </>
  );
}
