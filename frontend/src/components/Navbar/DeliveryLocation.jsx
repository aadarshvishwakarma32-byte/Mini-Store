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

const PinIcon = () => (
  <svg {...iconProps}>
    <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const DeliveryLocation = () => {
  return (
    <button type="button" className="deliveryBtn">
      <span className="deliveryIcon"><PinIcon /></span>
      <span className="deliveryText">
        <span className="deliveryLabel">Deliver to</span>
        <span className="deliveryCountry">India</span>
      </span>
    </button>
  );
};

export default DeliveryLocation;
