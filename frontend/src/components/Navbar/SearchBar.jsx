const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const SearchIcon = () => (
  <svg {...iconProps}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const SearchBar = ({ value, onChange, onSearch }) => {
  return (
    <form className="searchBarForm" onSubmit={onSearch}>
      <div className="searchBarWrap">
        <input
          type="search"
          className="searchBarInput"
          placeholder="Search products..."
          aria-label="Search products"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button type="submit" className="searchBarBtn" aria-label="Search">
          <SearchIcon />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
