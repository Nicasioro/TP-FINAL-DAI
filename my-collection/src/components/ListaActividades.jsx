import { fmtDate } from '../utils/Estadisticas.js';
import './ListaActividades.css';

export default function ListaActividades({ items }) {
  if (!items.length) return <p className="muted">Sin actividad todavía.</p>;
  return (
    <ul className="activity">
      {items.map((a) => (
        <li key={a.id}><span>{a.text}</span><small className="muted">{fmtDate(a.date)}</small></li>
      ))}
    </ul>
  );
}
