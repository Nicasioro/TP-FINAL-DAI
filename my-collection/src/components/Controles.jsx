import { useEffect, useState } from 'react';
import { useMusic } from '../context/MusicContext.jsx';
import { STATUSES } from '../utils/Estadisticas.js';
import Puntuacion from './Puntuacion.jsx';

export default function Controles({ track }) {
  const { library, collections, addToBiblioteca, removeFromBiblioteca, updateItem, toggleFavorite, addToCollection } = useMusic();
  const item = library.find((i) => i.id === track.id);
  const [review, setReview] = useState(item?.review || '');
  const [colId, setColId] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => setReview(item?.review || ''), [item?.review]);

  useEffect(() => {
    if (!mensaje) return;
    const t = setTimeout(() => setMensaje(''), 2500);
    return () => clearTimeout(t);
  }, [mensaje]);

  if (!item) return <button className="btn" onClick={() => addToBiblioteca(track)}>+ Agregar a biblioteca</button>;

  const saveReview = (e) => {
    e.preventDefault();
    updateItem(item.id, { review: review.trim() }, `Escribiste una reseña de "${item.title}"`);
    setMensaje(review.trim() ? 'Reseña guardada' : 'Reseña eliminada');
  };
  const sinCambios = review.trim() === (item.review || '');
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
      <Puntuacion mostrarTexto value={item.rating} onChange={(n) => updateItem(item.id, { rating: n }, `Puntuaste "${item.title}" con ${n} estrellas`)} />
      <form onSubmit={saveReview}>
        <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Tu reseña personal..." rows={2} />
        <div className="review-row">
          <button className="btn small-btn" disabled={sinCambios}>Guardar reseña</button>
          {mensaje && <span className="msg-ok" role="status">✓ {mensaje}</span>}
        </div>
      </form>
      <form className="row" onSubmit={addCol}>
        <select value={colId} onChange={(e) => setColId(e.target.value)}>
          <option value="">Agregar a playlist...</option>
          {collections.filter((c) => !c.trackIds.includes(item.id)).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn small-btn" disabled={!colId}>Agregar</button>
      </form>
      <button className="btn danger small-btn" onClick={() => removeFromBiblioteca(item.id)}>Eliminar de biblioteca</button>
    </div>
  );
}