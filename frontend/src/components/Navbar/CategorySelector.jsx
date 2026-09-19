import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  'All',
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty',
  'Sports',
  'Books',
  'Accessories',
  'Mobiles',
  'Computers',
  'Offers',
];

const CategorySelector = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="categorySelectorWrap" ref={ref}>
      <button
        type="button"
        className="categorySelectorBtn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{open ? 'Close' : 'Categories'}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul className="categoryDropdown" role="listbox">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                type="button"
                className="categoryOption"
                role="option"
                onClick={() => {
                  setOpen(false);
                  navigate(cat === 'All' ? '/' : cat === 'Offers' ? '/offers' : `/?category=${encodeURIComponent(cat)}`);
                }}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategorySelector;
