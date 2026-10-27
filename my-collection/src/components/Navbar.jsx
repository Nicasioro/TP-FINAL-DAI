import { NavLink } from 'react-router-dom';
import { useMusic } from '../context/MusicContext.jsx';

const links = [
  ['/', 'Home'], ['/explorar', 'Explorar'], ['/biblioteca', 'Biblioteca'],
  ['/colecciones', 'Playlists'], ['/estadisticas', 'Estadísticas'], ['/perfil', 'Perfil'],
];

export default function Navbar() {
  const { profile } = useMusic();
  return (
    <header className="navbar">
      <span className="logo">🎵 My Collection</span>
      <nav>
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
            {label}
          </NavLink>
        ))}
      </nav>
      <span className="user-chip">{profile.avatar} {profile.username}</span>
    </header>
  );
}
