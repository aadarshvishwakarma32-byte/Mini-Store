import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const UserIcon = () => (
  <svg {...iconProps}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const UserPlusIcon = () => (
  <svg {...iconProps}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M19 8v6M22 11h-6" />
  </svg>
);

const SettingsIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const PackageIcon = () => (
  <svg {...iconProps}>
    <path d="M16.5 9.4 7.55 4.24" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12.01" />
  </svg>
);

const HeartIcon = () => (
  <svg {...iconProps}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const LogoutIcon = () => (
  <svg {...iconProps}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const AdminPanelIcon = () => (
  <svg {...iconProps}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const ChevronIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const UserAccount = ({ isAuthenticated, user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (action) => {
    setOpen(false);
    if (action === 'logout') {
      onLogout();
    }
  };

  const isAdmin = user?.role === 'admin';

  if (isAuthenticated) {
    const firstName = user?.name?.split(' ')[0] || 'User';
    return (
      <div className="userAccountWrap" ref={ref}>
        <button
          type="button"
          className="userAccountBtn"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="true"
        >
          <span className="userAccountIcon">
            <UserIcon />
          </span>
          <span className="userAccountText">Welcome, {firstName}</span>
          <ChevronIcon className={open ? 'rotate' : ''} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              className="userDropdown"
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              <div className="dropdownHeader">
                <div className="dropdownAvatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
                <div>
                  <div className="dropdownName">{user?.name || 'User'}</div>
                  <div className="dropdownEmail">{user?.email || ''}</div>
                </div>
              </div>
              <div className="dropdownDivider" />
              {isAdmin && (
                <Link
                  to="/admin"
                  className="dropdownItem adminDropdownLink"
                  onClick={() => handleSelect('admin')}
                >
                  <AdminPanelIcon />
                  Admin Panel
                </Link>
              )}
              <Link to="/profile" className="dropdownItem" onClick={() => handleSelect('profile')}>
                <UserIcon />
                Profile
              </Link>
              <Link
                to="/settings"
                className="dropdownItem"
                onClick={() => handleSelect('settings')}
              >
                <SettingsIcon />
                Settings
              </Link>
              <Link to="/orders" className="dropdownItem" onClick={() => handleSelect('orders')}>
                <PackageIcon />
                My Orders
              </Link>
              <Link
                to="/wishlist"
                className="dropdownItem"
                onClick={() => handleSelect('wishlist')}
              >
                <HeartIcon />
                Wishlist
              </Link>
              <div className="dropdownDivider" />
              <button
                type="button"
                className="dropdownItem dropdownLogout"
                onClick={() => handleSelect('logout')}
              >
                <LogoutIcon />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link to="/login" className="loginBtn">
      <span className="loginIcon">
        <UserPlusIcon />
      </span>
      <span className="loginText">Hello, Sign in</span>
      <span className="loginSub">Account & Lists</span>
    </Link>
  );
};

export default UserAccount;
