import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext.jsx';

function AddToPlaylist({ col }) {
  const { library, addToCollection } = useMusic();
  const [id, setId] = useState('');
  const available = library.filter((i) => !col.trackIds.includes(i.id));
  const submit = (e) => {
    e.preventDefault();
    const t = library.find((i) => i.id === id);
    if (t) { addToCollection(col.id, t); setId(''); }
  };
  return (
    <form className="row" onSubmit={submit}>
      <select value={id} onChange={(e) => setId(e.target.value)}>
        <option value="">Agregar canción...</option>
        {available.map((i) => <option key={i.id} value={i.id}>{i.title} — {i.artist}</option>)}
      </select>
      <button className="btn small-btn" disabled={!id}>Agregar</button>
    </form>
  );
}

export default function Collections() {
  const { collections, library, createCollection, deleteCollection, removeFromCollection } = useMusic();
  const [name, setName] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (name.trim()) { createCollection(name.trim()); setName(''); }
  };

  return (
    <>
      <h1>Mis playlists</h1>
      <form className="row filters" onSubmit={submit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre de la nueva playlist..." />
        <button className="btn">Crear playlist</button>
      </form>
      {!collections.length && <div className="state">Todavía no creaste playlists.</div>}
      <div className="grid wide">
        {collections.map((c) => {
          const tracks = c.trackIds.map((id) => library.find((i) => i.id === id)).filter(Boolean);
          return (
            <section key={c.id} className="card playlist">
              <div className="row between">
                <h3>🎶 {c.name} <span className="muted small">({tracks.length})</span></h3>
                <button className="btn danger small-btn" onClick={() => deleteCollection(c.id)}>Eliminar</button>
              </div>
              {tracks.length ? (
                <ol className="tracklist">
                  {tracks.map((t) => (
                    <li key={t.id}>
                      <Link to={`/detalle/${t.id}`}>{t.title} <span className="muted">— {t.artist}</span></Link>
                      <button className="icon-btn" onClick={() => removeFromCollection(c.id, t.id)} aria-label="Quitar">✕</button>
                    </li>
                  ))}
                </ol>
              ) : <p className="muted">Playlist vacía.</p>}
              <AddToPlaylist col={c} />
            </section>
          );
        })}
      </div>
    </>
  );
}
