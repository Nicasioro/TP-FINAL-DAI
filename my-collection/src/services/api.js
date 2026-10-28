import axios from 'axios';

const http = axios.create({ baseURL: 'https://itunes.apple.com', timeout: 10000 });

export const normalize = (r) => ({
  id: String(r.trackId),
  title: r.trackName,
  artist: r.artistName,
  album: r.collectionName || '',
  genre: r.primaryGenreName || 'Sin género',
  year: r.releaseDate ? new Date(r.releaseDate).getFullYear() : null,
  cover: r.artworkUrl100 ? r.artworkUrl100.replace('100x100', '400x400') : '',
  previewUrl: r.previewUrl || '',
  durationMs: r.trackTimeMillis || 0,
  country: r.country || '',
});

export async function searchTracks(term, limit = 30) {
  const { data } = await http.get('/search', { params: { term, media: 'music', entity: 'song', limit } });
  return (data.results || []).filter((r) => r.trackId).map(normalize);
}

export async function getTrack(id) {
  const { data } = await http.get('/lookup', { params: { id } });
  if (!data.results || !data.results.length) throw new Error('No encontrado');
  return normalize(data.results[0]);
}
