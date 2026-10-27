import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext.jsx';
import { getTrack } from '../services/api.js';
import { Cover } from '../components/TrackCard.jsx';
import ItemControls from '../components/ItemControls.jsx';
import State from '../components/State.jsx';
import { fmtDuration } from '../utils/stats.js';

export default function Detail() {
  const { id } = useParams();
  const { library } = useMusic();
  const saved = library.find((i) => i.id === id);
  const [apiTrack, setApiTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let off = false;
    setApiTrack(null);
    setError('');
    // Los temas demo (id "demo-*") no existen en la API: se usan los datos guardados
    if (!/^\d+$/.test(id)) { setLoading(false); return; }
    setLoading(true);
    getTrack(id)
      .then((t) => !off && setApiTrack(t))
      .catch(() => !off && setError('No se pudo obtener la información desde la API.'))
      .finally(() => !off && setLoading(false));
    return () => { off = true; };
  }, [id]);

  // Se combinan los datos de la API con los del usuario (si ya lo tiene en la biblioteca)
  const track = apiTrack ? { ...apiTrack } : saved;

  return (
    <>
      <Link to="/explorar" className="muted">← Volver</Link>
      <State loading={loading} error={!track && error} empty={!track} emptyText="No encontramos este contenido.">
        {track && (
          <div className="detail">
            <Cover track={track} size="big" />
            <div>
              <h1>{track.title}</h1>
              <h3 className="muted">{track.artist}</h3>
              {error && <p className="state error">⚠️ {error} Mostrando datos guardados.</p>}
              <p><span className="badge">{track.genre}</span></p>
              <ul className="info">
                <li><b>Álbum:</b> {track.album || 'Sin datos'}</li>
                <li><b>Año:</b> {track.year || 'Sin datos'}</li>
                <li><b>Duración:</b> {fmtDuration(track.durationMs)}</li>
                {track.country && <li><b>País:</b> {track.country}</li>}
                <li><b>Puntuación general:</b> No disponible en la API</li>
              </ul>
              <p className="muted">
                {track.album ? `"${track.title}" es una canción de ${track.artist}, incluida en el álbum "${track.album}".` : 'Sin descripción disponible.'}
              </p>
              {track.previewUrl ? <audio controls src={track.previewUrl} /> : <p className="muted small">Sin preview de audio.</p>}
              <h3>Mi colección</h3>
              <ItemControls track={track} />
            </div>
          </div>
        )}
      </State>
    </>
  );
}
