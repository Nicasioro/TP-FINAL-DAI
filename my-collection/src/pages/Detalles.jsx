import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMusic } from '../context/MusicContext.jsx';
import { getTrack } from '../services/api.js';
import { Cover } from '../components/TarjetaCancion.jsx';
import Controles from '../components/Controles.jsx';
import { fmtDuration } from '../utils/Estadisticas.js';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const goBack = () => (location.key !== 'default' ? navigate(-1) : navigate('/'));
  const { library } = useMusic();
  const saved = library.find((i) => i.id === id);
  const [apiTrack, setApiTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let off = false;
    setApiTrack(null);
    setError('');
    if (!/^\d+$/.test(id)) { setLoading(false); return; }
    setLoading(true);
    getTrack(id)
      .then((t) => !off && setApiTrack(t))
      .catch(() => !off && setError('No se pudo obtener la información desde la API.'))
      .finally(() => !off && setLoading(false));
    return () => { off = true; };
  }, [id]);

  const track = apiTrack ? { ...apiTrack } : saved;

  return (
    <>
      <button type="button" className="btn ghost small-btn" onClick={goBack}>← Volver</button>
    
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
              <Controles track={track} />
            </div>
          </div>
        )}
    </>
  );
}