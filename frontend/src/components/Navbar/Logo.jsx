import { Link } from 'react-router-dom';

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const BagIcon = () => (
  <svg {...iconProps}>
    <path d="M6 8h12l1 12H7L6 8Z" />
    <path d="M9 10V6a3 3 0 0 1 6 0v4" />
  </svg>
);

const Logo = () => {
  return (
    <Link to="/" className="logoLink" aria-label="Mini Store home">
      <span className="logoIcon"><BagIcon /></span>
      <span className="logoText">Mini Store</span>
    </Link>
  );
};

export default Logo;
