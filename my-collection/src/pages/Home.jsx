import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext.jsx';
import { searchTracks } from '../services/api.js';
import TrackCard from '../components/TrackCard.jsx';
import ActivityList from '../components/ActivityList.jsx';
import State from '../components/State.jsx';

export default function Home() {
  const { profile, library, collections, activity, addToLibrary } = useMusic();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const mainGenre = profile.favoriteGenres[0] || 'pop';

  // Recomendados desde la API según el género favorito del usuario
  useEffect(() => {
    let off = false;
    setLoading(true);
    searchTracks(`${mainGenre} hits`, 8)
      .then((r) => !off && setRecs(r))
      .catch(() => !off && setError('No se pudieron cargar las recomendaciones.'))
      .finally(() => !off && setLoading(false));
    return () => { off = true; };
  }, [mainGenre]);

  const favorites = library.filter((i) => i.favorite).slice(0, 4);
  const inProgress = library.filter((i) => i.status === 'Escuchando');

  return (
    <>
      <section className="hero">
        <h1>Hola, {profile.name.split(' ')[0]} {profile.avatar}</h1>
        <p className="muted">Tenés {library.length} temas en tu biblioteca y {collections.length} playlists.</p>
        <div className="chips">
          {profile.favoriteGenres.map((g) => <Link key={g} className="chip" to={`/explorar?q=${encodeURIComponent(g)}`}>{g}</Link>)}
        </div>
      </section>

      <section>
        <h2>Recomendados para vos <span className="muted small">({mainGenre})</span></h2>
        <State loading={loading} error={error} empty={!recs.length} emptyText="Sin recomendaciones por ahora.">
          <div className="grid">
            {recs.map((t) => (
              <TrackCard key={t.id} track={t}>
                {library.some((i) => i.id === t.id)
                  ? <span className="muted small">✓ En tu biblioteca</span>
                  : <button className="btn small-btn" onClick={() => addToLibrary(t)}>+ Biblioteca</button>}
              </TrackCard>
            ))}
          </div>
        </State>
      </section>

      <section>
        <h2>Tus favoritos</h2>
        <div className="grid">{favorites.map((t) => <TrackCard key={t.id} track={t} />)}</div>
      </section>

      <section>
        <h2>Escuchando ahora</h2>
        {inProgress.length
          ? <div className="grid">{inProgress.map((t) => <TrackCard key={t.id} track={t} />)}</div>
          : <p className="muted">No tenés temas en progreso.</p>}
      </section>

      <section>
        <h2>Playlists destacadas</h2>
        <div className="grid">
          {collections.slice(0, 3).map((c) => (
            <Link key={c.id} to="/colecciones" className="card playlist-card">
              <h3>🎶 {c.name}</h3>
              <p className="muted">{c.trackIds.length} canciones</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>Actividad reciente</h2>
        <ActivityList items={activity.slice(0, 5)} />
      </section>
    </>
  );
}
