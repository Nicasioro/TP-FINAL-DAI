import { useMusic } from '../context/MusicContext.jsx';
import { computeEstadisticas } from '../utils/Estadisticas.js';
import Puntuacion from '../components/Puntuacion.jsx';

function Bars({ data }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="bars">
      {data.map((d) => (
        <div key={d.label} className="bar-row">
          <span>{d.label}</span>
          <div className="bar"><div style={{ width: `${(d.value / max) * 100}%` }} /></div>
          <b>{d.value}</b>
        </div>
      ))}
    </div>
  );
}

export default function Estadisticas() {
  const { library, collections } = useMusic();
  const s = computeEstadisticas(library, collections);

  return (
    <>
      <h1>Estadísticas</h1>
      <div className="grid kpis">
        <div className="card kpi"><small>Total en biblioteca</small><strong>{s.total}</strong></div>
        <div className="card kpi"><small>Género predominante</small><strong>{s.topGenre[0]}</strong><small>{s.topGenre[1]} temas</small></div>
        <div className="card kpi"><small>Puntuación promedio</small><strong>{s.avg ? s.avg.toFixed(1) : '—'}</strong><small>{s.ratedCount} puntuados</small></div>
        <div className="card kpi"><small>Artista más presente</small><strong>{s.topArtist[0]}</strong><small>{s.topArtist[1]} canciones</small></div>
      </div>
      <div className="grid wide">
        <section className="card"><h3>Canciones por estado</h3><Bars data={s.byStatus} /></section>
        <section className="card"><h3>Canciones por género</h3><Bars data={s.genres} /></section>
        <section className="card"><h3>Canciones por playlist</h3><Bars data={s.perPlaylist} /></section>
        <section className="card">
          <h3>Top de favoritos</h3>
          {s.favorites.length ? (
            <ol className="tracklist">
              {s.favorites.slice(0, 5).map((t) => <li key={t.id}><span>{t.title} <span className="muted">— {t.artist}</span></span><Puntuacion value={t.rating} /></li>)}
            </ol>
          ) : <p className="muted">Aún no marcaste favoritos.</p>}
        </section>
      </div>
    </>
  );
}
