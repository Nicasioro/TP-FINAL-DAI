export default function Avatar({ value, size = 96 }) {
  const isImg = /^(data:image|https?:)/.test(value || '');
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.5 }}>
      {isImg ? <img src={value} alt="Foto de perfil" /> : (value || '🎧')}
    </div>
  );
}
