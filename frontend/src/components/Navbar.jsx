import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeContext } from '../theme/ThemeContext.jsx';
import Cart from './Cart.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { CartContext } from '../context/CartContext.js';
import Logo from './Navbar/Logo.jsx';
import DeliveryLocation from './Navbar/DeliveryLocation.jsx';
import CategorySelector from './Navbar/CategorySelector.jsx';
import SearchBar from './Navbar/SearchBar.jsx';
import ThemeToggle from './Navbar/ThemeToggle.jsx';
import UserAccount from './Navbar/UserAccount.jsx';
import OrdersLink from './Navbar/OrdersLink.jsx';
import AdminLink from './Navbar/AdminLink.jsx';
import CartButton from './Navbar/CartButton.jsx';
import SecondaryNavbar from './Navbar/SecondaryNavbar.jsx';
import MobileMenu from './Navbar/MobileMenu.jsx';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx?.theme ?? 'light';
  const toggleTheme = themeCtx?.toggleTheme ?? (() => {});

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (!isCartOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCartOpen]);

  const onOutsideClick = (e) => {
    if (e.target === e.currentTarget) setIsCartOpen(false);
  };

  const onOutsideTouch = (e) => {
    if (e.target === e.currentTarget) setIsCartOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
    }
  };

  return (
    <>
      <header className="newHeader">
        <div className="topNavbar">
          <Logo />
          <DeliveryLocation />
          <CategorySelector />
          <SearchBar value={searchValue} onChange={setSearchValue} onSearch={handleSearch} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <UserAccount isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
          <AdminLink />
          <OrdersLink />
          <CartButton onClick={() => setIsCartOpen(true)} />
        </div>
        <SecondaryNavbar onCategoryClick={() => setMobileMenuOpen(true)} />
        <AnimatePresence>
          {isCartOpen && (
            <motion.div
              className="cartOverlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onMouseDown={onOutsideClick}
              onTouchStart={onOutsideTouch}
            >
              <Cart onClose={() => setIsCartOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        <MobileMenu
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
      </header>
    </>
  );
};

export default Header;
