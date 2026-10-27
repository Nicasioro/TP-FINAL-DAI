import { useEffect, useState } from 'react';
import { useMusic } from '../context/MusicContext.jsx';
import { STATUSES } from '../utils/stats.js';
import Stars from './Stars.jsx';

export default function ItemControls({ track }) {
  const { library, collections, addToLibrary, removeFromLibrary, updateItem, toggleFavorite, addToCollection } = useMusic();
  const item = library.find((i) => i.id === track.id);
  const [review, setReview] = useState(item?.review || '');
  const [colId, setColId] = useState('');

  useEffect(() => setReview(item?.review || ''), [item?.review]);

  if (!item) return <button className="btn" onClick={() => addToLibrary(track)}>+ Agregar a biblioteca</button>;

  const saveReview = (e) => {
    e.preventDefault();
    updateItem(item.id, { review: review.trim() }, `Escribiste una reseña de "${item.title}"`);
  };
  const addCol = (e) => {
    e.preventDefault();
    if (colId) { addToCollection(colId, item); setColId(''); }
  };

  return (
    <div className="controls">
      <div className="row">
        <select value={item.status} onChange={(e) => updateItem(item.id, { status: e.target.value }, `Cambiaste "${item.title}" a "${e.target.value}"`)}>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className={`btn ghost ${item.favorite ? 'fav' : ''}`} onClick={() => toggleFavorite(item.id)}>
          {item.favorite ? '♥ Favorito' : '♡ Favorito'}
        </button>
      </div>
      <Stars value={item.rating} onChange={(n) => updateItem(item.id, { rating: n }, `Puntuaste "${item.title}" con ${n} estrellas`)} />
      <form onSubmit={saveReview}>
        <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Tu reseña personal..." rows={2} />
        <button className="btn small-btn">Guardar reseña</button>
      </form>
      <form className="row" onSubmit={addCol}>
        <select value={colId} onChange={(e) => setColId(e.target.value)}>
          <option value="">Agregar a playlist...</option>
          {collections.filter((c) => !c.trackIds.includes(item.id)).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn small-btn" disabled={!colId}>Agregar</button>
      </form>
      <button className="btn danger small-btn" onClick={() => removeFromLibrary(item.id)}>Eliminar de biblioteca</button>
    </div>
  );
}
