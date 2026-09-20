import { Link } from 'react-router-dom';

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

const ReturnIcon = () => (
  <svg {...iconProps}>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

const OrdersLink = () => {
  return (
    <Link to="/orders" className="ordersLink">
      <span className="ordersIcon">
        <ReturnIcon />
      </span>
      <span className="ordersText">
        <span className="ordersLabel">Returns</span>
        <span className="ordersSub">& Orders</span>
      </span>
    </Link>
  );
};

export default OrdersLink;
