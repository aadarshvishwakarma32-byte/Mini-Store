import { useId, useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const categories = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports', 'Books', 'Accessories', 'Mobiles', 'Computers'];

const sorts = [
  { value: 'default', label: 'Sort by: Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const FilterBar = ({ category, onCategoryChange, sort, onSortChange }) => {
  const panelId = useId();
  const [isExpanded, setIsExpanded] = useState(() => window.innerWidth >= 768);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryChange = (nextCategory) => {
    onCategoryChange(nextCategory);
    setIsExpanded(false);
  };

  const currentSort = sorts.find((s) => s.value === sort) || sorts[0];

  return (
    <motion.div
      className="filters"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="filtersLeft">
        <button
          type="button"
          className={`filterToggle ${isExpanded ? 'isExpanded' : ''}`}
          aria-expanded={isExpanded}
          aria-controls={panelId}
          onClick={() => setIsExpanded((open) => !open)}
        >
          <span>All Categories</span>
          <svg className="filterToggleIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              id={panelId}
              className="filterPanel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <div className="filterPanelInner">
                <div className="filterChips" aria-label="Product categories">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`filterChip ${category === cat ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="filterSortWrap">
        <div className="sortDropdown" ref={sortRef}>
          <button
            type="button"
            className="sortDropdownBtn"
            aria-expanded={sortOpen}
            aria-haspopup="listbox"
            onClick={() => setSortOpen((v) => !v)}
          >
            <span>{currentSort.label}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <AnimatePresence initial={false}>
            {sortOpen && (
              <motion.ul
                className="sortDropdownMenu"
                role="listbox"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                {sorts.map((s) => (
                  <li key={s.value}>
                    <button
                      type="button"
                      className={`sortDropdownItem ${sort === s.value ? 'active' : ''}`}
                      role="option"
                      aria-selected={sort === s.value}
                      onClick={() => {
                        setSortOpen(false);
                        onSortChange(s.value);
                      }}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;