import { NavLink } from 'react-router-dom';
import { useMusic } from '../context/MusicContext.jsx';
import Avatar from './Avatar.jsx';

const links = [
  ['/', 'Home'], ['/explorar', 'Explorar'], ['/biblioteca', 'Biblioteca'],
  ['/colecciones', 'Playlists'], ['/estadisticas', 'Estadísticas'], ['/perfil', 'Perfil'],
];

export default function Navegacion() {
  const { profile } = useMusic();
  return (
    <header className="mc-header">
      <span className="mc-logo">🎵 My Collection</span>
      <nav className='mc-nav'>
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
            {label}
          </NavLink>
        ))}
      </nav>
          <span className="mc-user"><Avatar value={profile.avatar} size={28} /> {profile.username}</span>
    </header>
  );
}
