import { useState } from 'react';

const ETIQUETAS = ['Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'];

export default function Puntuacion({ value = 0, onChange, mostrarTexto = false }) {
  const [hover, setHover] = useState(0);
  const activo = hover || value;

  return (
    <div className="Puntuacion">
      <div className="Puntuacion-estrellas" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={!onChange}
            className={n <= activo ? 'on' : ''}
            onMouseEnter={() => onChange && setHover(n)}
            onClick={() => onChange && onChange(n === value ? 0 : n)}
            aria-label={`${n} estrellas`}
          >★</button>
        ))}
      </div>
      {mostrarTexto && (
        <span className="Puntuacion-texto">
          {activo ? `${activo}/5 · ${ETIQUETAS[activo - 1]}` : 'Sin puntuar'}
        </span>
      )}
    </div>
  );
}