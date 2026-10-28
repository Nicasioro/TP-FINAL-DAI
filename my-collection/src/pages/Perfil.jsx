import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext.jsx';
import { computeEstadisticas, fmtDate } from '../utils/Estadisticas.js';
import { fileToAvatar } from '../utils/image.js';
import TarjetaCancion from '../components/TarjetaCancion.jsx';
import ListaActividades from '../components/ListaActividades.jsx';
import Avatar from '../components/Avatar.jsx';

export default function Perfil() {
  const { profile, library, collections, activity, updateProfile, resetData } = useMusic();
  const s = computeEstadisticas(library, collections);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [photoError, setPhotoError] = useState('');
  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setPhotoError('El archivo debe ser una imagen.'); return; }
    try {
      const avatar = await fileToAvatar(file);
      setForm((f) => ({ ...f, avatar }));
      setPhotoError('');
    } catch {
      setPhotoError('No se pudo leer la imagen. Probá con otra.');
    }
  };

  const save = (e) => {
    e.preventDefault();
    updateProfile({
      name: form.name.trim() || profile.name,
      bio: form.bio,
      avatar: form.avatar || '🎧',
      favoriteGenres: String(form.favoriteGenres).split(',').map((g) => g.trim()).filter(Boolean),
    });
    setEditing(false);
  };

  return (
    <>
      <section className="profile-head card">
        <Avatar value={profile.avatar} size={96} />
        <div className="grow">
          <h1>{profile.name}</h1>
          <p className="muted">{profile.username} · Miembro desde {fmtDate(profile.joined)}</p>
          <p>{profile.bio}</p>
          <div className="chips">
            {profile.favoriteGenres.map((g) => <Link key={g} to={`/explorar?q=${encodeURIComponent(g)}`} className="chip">{g}</Link>)}
          </div>
        </div>
        <button className="btn ghost" onClick={() => { setForm({ ...profile, favoriteGenres: profile.favoriteGenres.join(', ') }); setPhotoError(''); setEditing(!editing); }}>
          {editing ? 'Cancelar' : 'Editar perfil'}
        </button>
      </section>

      {editing && (
        <form className="card form" onSubmit={save}>
          <div className="avatar-edit">
            <Avatar value={form.avatar} size={80} />
            <div>
              <label className="btn ghost small-btn">
                Subir foto
                <input type="file" accept="image/*" onChange={onPhoto} hidden />
              </label>{' '}
              <button type="button" className="btn ghost small-btn" onClick={() => setForm({ ...form, avatar: '🎧' })}>Quitar foto</button>
              {photoError && <p className="state error">{photoError}</p>}
            </div>
          </div>
          <label>Nombre<input value={form.name} onChange={change('name')} required /></label>
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
          ? <div className="grid">{s.favorites.slice(0, 10).map((t) => <TarjetaCancion key={t.id} track={t} />)}</div>
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
        <ListaActividades items={activity.slice(0, 8)} />
      </section>

      <button className="btn danger small-btn" onClick={() => window.confirm('¿Restaurar los datos iniciales?') && resetData()}>
        Restaurar datos iniciales
      </button>
    </>
  );
}