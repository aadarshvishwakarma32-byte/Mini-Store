const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const CartIcon = () => (
  <svg {...iconProps}>
    <circle cx="9" cy="20" r="1" />
    <circle cx="19" cy="20" r="1" />
    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 8H6" />
  </svg>
);

const CartButton = ({ count, onClick }) => {
  return (
    <button
      type="button"
      className="cartBtn"
      onClick={onClick}
      aria-label={`Open cart, ${count} items`}
    >
      <span className="cartIcon"><CartIcon /></span>
      <span className="cartLabel">Cart</span>
      <span className="cartCount">({count})</span>
    </button>
  );
};

export default CartButton;
