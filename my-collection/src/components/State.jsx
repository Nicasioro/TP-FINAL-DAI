// Muestra loading, error o vacío; si no aplica ninguno, renderiza los hijos
export default function State({ loading, error, empty, emptyText = 'No hay resultados.', children }) {
  if (loading) return <div className="state"><span className="spinner" /> Cargando...</div>;
  if (error) return <div className="state error">⚠️ {error}</div>;
  if (empty) return <div className="state">{emptyText}</div>;
  return children;
}
