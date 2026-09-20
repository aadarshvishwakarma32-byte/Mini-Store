import { motion } from 'framer-motion';

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const SearchBar = ({ value, onChange }) => {
  return (
    <motion.div
      className="searchWrap"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="searchField">
        <span className="searchIcon">
          <SearchIcon />
        </span>
        <input
          type="search"
          className="searchInput"
          placeholder="Search products..."
          aria-label="Search products"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </motion.div>
  );
};

export default SearchBar;
