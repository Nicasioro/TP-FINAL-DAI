export const STATUSES = ['Quiero escuchar', 'Escuchando', 'Escuchado', 'Favorito'];

const count = (arr) => arr.reduce((acc, k) => { acc[k] = (acc[k] || 0) + 1; return acc; }, {});
const top = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1])[0] || ['—', 0];


export function computeEstadisticas(library, collections) {
  const byStatus = STATUSES.map((s) => ({ label: s, value: library.filter((i) => i.status === s).length }));
  const genres = count(library.map((i) => i.genre));
  const artists = count(library.map((i) => i.artist));
  const rated = library.filter((i) => i.rating > 0);
  const avg = rated.length ? rated.reduce((s, i) => s + i.rating, 0) / rated.length : 0;
  const favorites = library.filter((i) => i.favorite).sort((a, b) => b.rating - a.rating);
  return {
    total: library.length,
    byStatus,
    genres: Object.entries(genres).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value })),
    topGenre: top(genres),
    topArtist: top(artists),
    avg,
    ratedCount: rated.length,
    favorites,
    perPlaylist: collections.map((c) => ({ label: c.name, value: c.trackIds.length })),
  };
}

export const fmtDuration = (ms) => {
  if (!ms) return '—';
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
export const fmtDate = (iso) => new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
