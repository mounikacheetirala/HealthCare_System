import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ value, onChange, placeholder = 'Search…', onSubmit, className = '', style }) {
  return (
    <form
      className={`hero-search ${className}`}
      style={style}
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(value); }}
      role="search"
    >
      <input
        className="input"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        aria-label={placeholder}
      />
      <button type="submit" className="btn btn-primary">
        <FiSearch /> Search
      </button>
    </form>
  );
}
