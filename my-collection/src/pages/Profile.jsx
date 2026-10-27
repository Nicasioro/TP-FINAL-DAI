import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext.jsx';
import { computeStats, fmtDate } from '../utils/stats.js';
import TrackCard from '../components/TrackCard.jsx';
import ActivityList from '../components/ActivityList.jsx';

export default function Profile() {
  const { profile, library, collections, activity, updateProfile, resetData } = useMusic();
  const s = computeStats(library, collections);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = (e) => {
    e.preventDefault();
    updateProfile({
      name: form.name.trim() || profile.name,
      bio: form.bio,
      avatar: form.avatar || profile.avatar,
      favoriteGenres: String(form.favoriteGenres).split(',').map((g) => g.trim()).filter(Boolean),
    });
    setEditing(false);
  };

  return (
    <>
      <section className="profile-head card">
        <div className="avatar">{profile.avatar}</div>
        <div className="grow">
          <h1>{profile.name}</h1>
          <p className="muted">{profile.username} · Miembro desde {fmtDate(profile.joined)}</p>
          <p>{profile.bio}</p>
          <div className="chips">
            {profile.favoriteGenres.map((g) => <Link key={g} to={`/explorar?q=${encodeURIComponent(g)}`} className="chip">{g}</Link>)}
          </div>
        </div>
        <button className="btn ghost" onClick={() => { setForm({ ...profile, favoriteGenres: profile.favoriteGenres.join(', ') }); setEditing(!editing); }}>
          {editing ? 'Cancelar' : 'Editar perfil'}
        </button>
      </section>

      {editing && (
        <form className="card form" onSubmit={save}>
          <label>Nombre<input value={form.name} onChange={change('name')} required /></label>
          <label>Avatar (emoji)<input value={form.avatar} onChange={change('avatar')} maxLength={4} /></label>
          <label>Bio<textarea value={form.bio} onChange={change('bio')} rows={3} /></label>
          <label>Géneros favoritos (separados por coma)<input value={form.favoriteGenres} onChange={change('favoriteGenres')} /></label>
          <div className="row"><button className="btn">Guardar</button></div>
        </form>
      )}

      <div className="grid kpis">
        <div className="card kpi"><small>Canciones</small><strong>{s.total}</strong></div>
        <div className="card kpi"><small>Favoritos</small><strong>{s.favorites.length}</strong></div>
        <div className="card kpi"><small>Playlists</small><strong>{collections.length}</strong></div>
        <div className="card kpi"><small>Promedio</small><strong>{s.avg ? s.avg.toFixed(1) : '—'}</strong></div>
      </div>

      <section>
        <h2>Canciones favoritas</h2>
        {s.favorites.length
          ? <div className="grid">{s.favorites.slice(0, 6).map((t) => <TrackCard key={t.id} track={t} />)}</div>
          : <p className="muted">Sin favoritos todavía.</p>}
      </section>

      <section>
        <h2>Playlists</h2>
        <div className="grid">
          {collections.map((c) => (
            <Link key={c.id} to="/colecciones" className="card playlist-card"><h3>🎶 {c.name}</h3><p className="muted">{c.trackIds.length} canciones</p></Link>
          ))}
        </div>
      </section>

      <section>
        <h2>Actividad reciente</h2>
        <ActivityList items={activity.slice(0, 8)} />
      </section>

      <button className="btn danger small-btn" onClick={() => window.confirm('¿Restaurar los datos iniciales?') && resetData()}>
        Restaurar datos iniciales
      </button>
    </>
  );
}
