import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

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

const ShieldIcon = () => (
  <svg {...iconProps}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const AdminLink = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated || !isAdmin) return null;

  return (
    <Link to="/admin" className="adminLinkBtn">
      <span className="adminLinkIcon">
        <ShieldIcon />
      </span>
      <span className="adminLinkText">Admin Panel</span>
    </Link>
  );
};

export default AdminLink;
