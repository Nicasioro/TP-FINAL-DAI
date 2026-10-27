export default function Stars({ value = 0, onChange }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n} type="button" disabled={!onChange}
          className={n <= value ? 'on' : ''}
          onClick={() => onChange && onChange(n === value ? 0 : n)}
          aria-label={`${n} estrellas`}
        >★</button>
      ))}
    </span>
  );
}
