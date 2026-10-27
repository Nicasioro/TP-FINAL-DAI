import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext.jsx';
import { STATUSES } from '../utils/stats.js';
import TrackCard from '../components/TrackCard.jsx';
import ItemControls from '../components/ItemControls.jsx';
import State from '../components/State.jsx';

export default function Library() {
  const { library } = useMusic();
  const [status, setStatus] = useState('');
  const [text, setText] = useState('');
  const [sort, setSort] = useState('recent');

  let shown = library.filter((i) =>
    (!status || i.status === status) &&
    (`${i.title} ${i.artist}`.toLowerCase().includes(text.toLowerCase()))
  );
  if (sort === 'recent') shown = [...shown].sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  if (sort === 'rating') shown = [...shown].sort((a, b) => b.rating - a.rating);
  if (sort === 'title') shown = [...shown].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <h1>Mi biblioteca <span className="muted small">({library.length})</span></h1>
      <div className="row filters">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Filtrar por título o artista..." />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos los estados</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="recent">Más recientes</option>
          <option value="rating">Mejor puntuados</option>
          <option value="title">Título (A-Z)</option>
        </select>
        <Link className="btn" to="/explorar">+ Agregar más</Link>
      </div>
      <State empty={!shown.length} emptyText="No hay temas que coincidan con el filtro.">
        <div className="grid wide">
          {shown.map((t) => (
            <TrackCard key={t.id} track={t}>
              <span className="badge status">{t.status}</span>
              <ItemControls track={t} />
            </TrackCard>
          ))}
        </div>
      </State>
    </>
  );
}
