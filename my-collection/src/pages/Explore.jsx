import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMusic } from '../context/MusicContext.jsx';
import { searchTracks } from '../services/api.js';
import TrackCard from '../components/TrackCard.jsx';
import State from '../components/State.jsx';

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const { library, addToLibrary } = useMusic();
  const [text, setText] = useState(q);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    setText(q);
    setGenre('');
    if (!q) { setResults([]); return; }
    let off = false;
    setLoading(true);
    setError('');
    searchTracks(q)
      .then((r) => !off && setResults(r))
      .catch(() => !off && setError('No se pudo conectar con la API. Revisá tu conexión e intentá de nuevo.'))
      .finally(() => !off && setLoading(false));
    return () => { off = true; };
  }, [q]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) setParams({ q: text.trim() });
  };

  const genres = [...new Set(results.map((r) => r.genre))].sort();
  let shown = results.filter((r) => !genre || r.genre === genre);
  if (sort === 'year-desc') shown = [...shown].sort((a, b) => (b.year || 0) - (a.year || 0));
  if (sort === 'year-asc') shown = [...shown].sort((a, b) => (a.year || 0) - (b.year || 0));
  if (sort === 'title') shown = [...shown].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <h1>Explorar</h1>
      <form className="row filters" onSubmit={onSubmit}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Buscá canciones o artistas..." />
        <button className="btn">Buscar</button>
        <select value={genre} onChange={(e) => setGenre(e.target.value)} disabled={!results.length}>
          <option value="">Todos los géneros</option>
          {genres.map((g) => <option key={g}>{g}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Relevancia</option>
          <option value="year-desc">Año (más nuevo)</option>
          <option value="year-asc">Año (más viejo)</option>
          <option value="title">Título (A-Z)</option>
        </select>
      </form>

      {!q ? <div className="state">Escribí algo para empezar a buscar 🎧</div> : (
        <State loading={loading} error={error} empty={!shown.length} emptyText={`No encontramos resultados para "${q}".`}>
          <div className="grid">
            {shown.map((t) => (
              <TrackCard key={t.id} track={t}>
                {library.some((i) => i.id === t.id)
                  ? <span className="muted small">✓ En tu biblioteca</span>
                  : <button className="btn small-btn" onClick={() => addToLibrary(t)}>+ Biblioteca</button>}
              </TrackCard>
            ))}
          </div>
        </State>
      )}
    </>
  );
}
