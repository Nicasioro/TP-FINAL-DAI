import { fmtDate } from '../utils/stats.js';

export default function ActivityList({ items }) {
  if (!items.length) return <p className="muted">Sin actividad todavía.</p>;
  return (
    <ul className="activity">
      {items.map((a) => (
        <li key={a.id}><span>{a.text}</span><small className="muted">{fmtDate(a.date)}</small></li>
      ))}
    </ul>
  );
}
