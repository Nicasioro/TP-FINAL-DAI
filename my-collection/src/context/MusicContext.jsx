import { createContext, useContext, useEffect, useRef, useState } from 'react';
import initial from '../data/initialData.json';
import { searchTracks } from '../services/api.js';

const MusicContext = createContext();
const KEY = 'my-collection-music-v1';


const load = () => {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : initial;
  } catch {
    return initial;
  }
};

const newItem = (t, status = 'Quiero escuchar') => ({
  ...t, status, favorite: false, rating: 0, review: '', addedAt: new Date().toISOString(),
});

export function MusicProvider({ children }) {
  const [data, setData] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  }, [data]);

  const tried = useRef(new Set());
  useEffect(() => {
    const missing = data.library.filter((i) => !i.cover && !tried.current.has(i.id));
    if (!missing.length) return;
    missing.forEach((i) => tried.current.add(i.id));
    (async () => {
      for (const it of missing) {
        try {
          const [r] = await searchTracks(`${it.title} ${it.artist}`, 1);
          if (!r || !r.cover) continue;
          setData((d) => ({
            ...d,
            library: d.library.map((x) => (x.id === it.id ? { ...x, cover: r.cover, previewUrl: x.previewUrl || r.previewUrl } : x)),
          }));
        } catch { }
      }
    })();
  }, [data.library]);

 
  const withLog = (d, text) => ({
    ...d,
    activity: [{ id: 'a' + Date.now(), text, date: new Date().toISOString() }, ...d.activity].slice(0, 30),
  });

  const addToBiblioteca = (t, status) =>
    setData((d) => d.library.some((i) => i.id === t.id) ? d
      : withLog({ ...d, library: [newItem(t, status), ...d.library] }, `Agregaste "${t.title}" a tu biblioteca`));

  const removeFromLibrary = (id) =>
    setData((d) => {
      const it = d.library.find((i) => i.id === id);
      return withLog({
        ...d,
        library: d.library.filter((i) => i.id !== id),
        collections: d.collections.map((c) => ({ ...c, trackIds: c.trackIds.filter((x) => x !== id) })),
      }, `Eliminaste "${it?.title}" de tu biblioteca`);
    });

  const updateItem = (id, patch, text) =>
    setData((d) => withLog({ ...d, library: d.library.map((i) => (i.id === id ? { ...i, ...patch } : i)) }, text));

  const toggleFavorite = (id) =>
    setData((d) => {
      const it = d.library.find((i) => i.id === id);
      if (!it) return d;
      return withLog(
        { ...d, library: d.library.map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i)) },
        it.favorite ? `Quitaste "${it.title}" de favoritos` : `Marcaste "${it.title}" como favorito`
      );
    });

  const createCollection = (name) =>
    setData((d) => withLog({ ...d, collections: [...d.collections, { id: 'c' + Date.now(), name, trackIds: [] }] }, `Creaste la playlist "${name}"`));

  const deleteCollection = (id) =>
    setData((d) => ({ ...d, collections: d.collections.filter((c) => c.id !== id) }));


  const addToCollection = (colId, track) =>
    setData((d) => {
      const c = d.collections.find((x) => x.id === colId);
      if (!c || c.trackIds.includes(track.id)) return d;
      const library = d.library.some((i) => i.id === track.id) ? d.library : [newItem(track), ...d.library];
      return withLog({
        ...d, library,
        collections: d.collections.map((x) => (x.id === colId ? { ...x, trackIds: [...x.trackIds, track.id] } : x)),
      }, `Agregaste "${track.title}" a la playlist "${c.name}"`);
    });

  const removeFromCollection = (colId, trackId) =>
    setData((d) => ({
      ...d,
      collections: d.collections.map((c) => (c.id === colId ? { ...c, trackIds: c.trackIds.filter((x) => x !== trackId) } : c)),
    }));

  const updateProfile = (patch) => setData((d) => withLog({ ...d, profile: { ...d.profile, ...patch } }, 'Actualizaste tu perfil'));

  const resetData = () => setData(initial);

  const value = {
    ...data, addToBiblioteca, removeFromLibrary, updateItem, toggleFavorite,
    createCollection, deleteCollection, addToCollection, removeFromCollection, updateProfile, resetData,
  };
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export const useMusic = () => useContext(MusicContext);