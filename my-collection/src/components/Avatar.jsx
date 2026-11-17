import './Avatar.css';
import ZoomableImage from './ZoomableImage.jsx';

export default function Avatar({ value = '/perfil.png', size = 96 }) {
  const safeValue = value || '/perfil.png';
  const isImg = /^(data:image|https?:|\/|\.\.?\/)/.test(safeValue) || /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(safeValue);

  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.5 }}>
      {isImg ? <ZoomableImage src={safeValue} alt="Foto de perfil" /> : safeValue}
    </div>
  );
}