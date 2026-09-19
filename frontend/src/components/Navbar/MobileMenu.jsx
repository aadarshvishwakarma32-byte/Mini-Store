import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

const MobileMenu = ({ open, onClose, isAuthenticated, onLogout }) => {
  const handleNavClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="mobileOverlay" onClick={onClose} />
          <motion.aside
            className="mobileDrawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobileDrawerHeader">
              <span className="mobileDrawerTitle">Menu</span>
              <button type="button" className="mobileDrawerClose" onClick={onClose} aria-label="Close menu">
                <CloseIcon />
              </button>
            </div>
            <nav className="mobileDrawerNav">
              <NavLink to="/" end className="mobileLink" onClick={handleNavClick}>Home</NavLink>
              <NavLink to="/about" className="mobileLink" onClick={handleNavClick}>About</NavLink>
              <NavLink to="/service" className="mobileLink" onClick={handleNavClick}>Service</NavLink>
              <NavLink to="/contact" className="mobileLink" onClick={handleNavClick}>Contact</NavLink>
              {isAuthenticated ? (
                <>
                  <NavLink to="/profile" className="mobileLink" onClick={handleNavClick}>Profile</NavLink>
                  <NavLink to="/settings" className="mobileLink" onClick={handleNavClick}>Settings</NavLink>
                  <NavLink to="/orders" className="mobileLink" onClick={handleNavClick}>My Orders</NavLink>
                  <NavLink to="/wishlist" className="mobileLink" onClick={handleNavClick}>Wishlist</NavLink>
                  <button type="button" className="mobileLink mobileLogout" onClick={() => { handleNavClick(); onLogout(); }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="mobileLink" onClick={handleNavClick}>Login</NavLink>
                  <NavLink to="/register" className="mobileLink mobileSignup" onClick={handleNavClick}>Sign Up</NavLink>
                </>
              )}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
