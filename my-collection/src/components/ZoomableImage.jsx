import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './ZoomableImage.css';

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const STEP = 0.5;

const clamp = (n) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, n));

export default function ZoomableImage({ src, alt = '', className = '' }) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, []);

  // Al volver al zoom mínimo, centrar la imagen
  useEffect(() => {
    if (scale === MIN_SCALE) setPos({ x: 0, y: 0 });
  }, [scale]);

  // Teclado + bloqueo del scroll de fondo mientras el visor está abierto
  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === '+' || e.key === '=') setScale((s) => clamp(s + STEP));
      else if (e.key === '-') setScale((s) => clamp(s - STEP));
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const onWheel = (e) => {
    setScale((s) => clamp(s + (e.deltaY < 0 ? STEP : -STEP)));
  };

  const onPointerDown = (e) => {
    if (scale === MIN_SCALE) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current = { x: e.clientX, y: e.clientY };
    setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const onDoubleClick = () => {
    setScale((s) => (s > MIN_SCALE ? MIN_SCALE : 2.5));
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`zoomable-trigger ${className}`.trim()}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
      />

      {open &&
        createPortal(
          <div
            className="zoom-overlay"
            onClick={(e) => e.target === e.currentTarget && close()}
            onWheel={onWheel}
          >
            <button type="button" className="zoom-close" onClick={close} aria-label="Cerrar">
              ✕
            </button>

            <img
              src={src}
              alt={alt}
              className="zoom-image"
              draggable={false}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                cursor: scale > MIN_SCALE ? 'grab' : 'zoom-in',
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onDoubleClick={onDoubleClick}
            />

            <div className="zoom-controls">
              <button
                type="button"
                onClick={() => setScale((s) => clamp(s - STEP))}
                disabled={scale <= MIN_SCALE}
                aria-label="Alejar"
              >
                −
              </button>
              <input
                type="range"
                min={MIN_SCALE}
                max={MAX_SCALE}
                step={0.01}
                value={scale}
                onChange={(e) => setScale(clamp(parseFloat(e.target.value)))}
                aria-label="Zoom"
              />
              <button
                type="button"
                onClick={() => setScale((s) => clamp(s + STEP))}
                disabled={scale >= MAX_SCALE}
                aria-label="Acercar"
              >
                +
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}