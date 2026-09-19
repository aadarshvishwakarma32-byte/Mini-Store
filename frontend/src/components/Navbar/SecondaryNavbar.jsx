import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const menuItems = [
  { to: '/deals', label: "Today's Deals" },
  { to: '/new-arrivals', label: 'New Arrivals' },
  { to: '/best-sellers', label: 'Best Sellers' },
  { to: '/trending', label: 'Trending' },
  { to: '/categories', label: 'Categories' },
  { to: '/offers', label: 'Offers' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const megaCategories = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty',
  'Sports',
  'Books',
  'Mobiles',
  'Computers',
  'Accessories',
  'Offers',
];

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

const SecondaryNavbar = () => {
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="secondaryNav">
      <div className="secondaryNavInner">
        <button
          type="button"
          className="allCategoriesBtn"
          onClick={() => setMegaOpen((v) => !v)}
          aria-expanded={megaOpen}
        >
          <span className="allCategoriesIcon"><MenuIcon /></span>
          <span>{megaOpen ? 'Close' : 'All Categories'}</span>
        </button>
        <nav className="secondaryNavLinks" aria-label="Categories">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `secondaryNavLink${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      {megaOpen && (
        <div className="megaMenu" ref={megaRef}>
          <div className="megaMenuInner">
            <div className="megaMenuTitle">Shop by Category</div>
            <div className="megaMenuGrid">
              {megaCategories.map((cat) => (
                <Link
                  key={cat}
                  to={`/?category=${encodeURIComponent(cat.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`}
                  className="megaMenuItem"
                  onClick={() => setMegaOpen(false)}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecondaryNavbar;
