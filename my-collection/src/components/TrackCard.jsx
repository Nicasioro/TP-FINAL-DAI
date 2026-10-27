import { Link } from 'react-router-dom';

export function Cover({ track, size = '' }) {
  return track.cover
    ? <img className={`cover ${size}`} src={track.cover} alt={`Carátula de ${track.title}`} loading="lazy" />
    : <div className={`cover placeholder ${size}`}>{track.title?.[0] || '♪'}</div>;
}

export default function TrackCard({ track, children }) {
  return (
    <article className="card">
      <Link to={`/detalle/${track.id}`} className="card-link">
        <Cover track={track} />
        <h3>{track.title}</h3>
        <p className="muted">{track.artist}</p>
        <span className="badge">{track.genre}</span>
        {track.year && <span className="muted small"> · {track.year}</span>}
      </Link>
      {children && <div className="card-actions">{children}</div>}
    </article>
  );
}
