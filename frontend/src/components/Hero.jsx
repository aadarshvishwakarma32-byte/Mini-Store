import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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

const ArrowIcon = () => (
  <svg {...iconProps}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2c.6 4.8 2.2 6.4 7 7-4.8.6-6.4 2.2-7 7-.6-4.8-2.2-6.4-7-7 4.8-.6 6.4-2.2 7-7Z" />
    <path d="M19 14c.3 2.4 1.1 3.2 3.5 3.5-2.4.3-3.2 1.1-3.5 3.5-.3-2.4-1.1-3.2-3.5-3.5 2.4-.3 3.2-1.1 3.5-3.5Z" />
  </svg>
);

const MotionLink = motion(Link);

const Hero = ({ onShopNow }) => {
  return (
    <motion.section
      className="hero"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: 'transform' }}
    >
      <div className="heroContent">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.6 }}
          style={{ willChange: 'transform' }}
        >
          Summer <span className="heroAccent">Collection</span>
        </motion.h1>
        <motion.p
          className="heroSubtitle"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          style={{ willChange: 'transform' }}
        >
          Discover premium products curated for your lifestyle. Quality meets affordability.
        </motion.p>
        <motion.div
          className="heroActions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          style={{ willChange: 'transform' }}
        >
          <motion.button
            type="button"
            className="heroBtnPrimary"
            onClick={onShopNow}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ willChange: 'transform' }}
          >
            <CartIcon />
            <span>Shop Now</span>
          </motion.button>
          <MotionLink
            className="heroBtnGhost"
            to="/about"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ willChange: 'transform' }}
          >
            <span>Learn More</span>
            <ArrowIcon />
          </MotionLink>
        </motion.div>
      </div>

      <motion.div
        className="heroImage"
        initial={{ opacity: 0, scale: 0.9, x: 28 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.25, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
        <div className="heroVisual">
          <div className="heroFrame">
            <div className="heroFrameGlow" />
            <svg className="heroArt" viewBox="0 0 420 360" fill="none" role="img" aria-label="Summer collection shopping illustration">
              <defs>
                <linearGradient id="heroBag" x1="105" y1="155" x2="315" y2="315" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#34D399" />
                  <stop offset="1" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="heroCard" x1="115" y1="170" x2="270" y2="270" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF" />
                  <stop offset="1" stopColor="#D1FAE5" />
                </linearGradient>
              </defs>
              <circle cx="210" cy="180" r="138" fill="#D1FAE5" opacity="0.62" />
              <circle cx="210" cy="180" r="104" fill="#ECFDF5" />
              <path d="M78 111c40-42 102-61 161-48 58 13 101 54 118 111" stroke="#6EE7B7" strokeWidth="2" strokeDasharray="4 10" strokeLinecap="round" />
              <rect x="104" y="158" width="212" height="142" rx="24" fill="url(#heroCard)" stroke="#A7F3D0" strokeWidth="1.5" />
              <path d="M143 158c0-38 16-61 39-61 24 0 39 23 39 61" stroke="#10B981" strokeWidth="7" strokeLinecap="round" />
              <path d="M184 158h72" stroke="#10B981" strokeWidth="7" strokeLinecap="round" />
              <circle cx="220" cy="226" r="34" fill="#BBF7D0" />
              <path d="M208 226h24M220 214v24" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
              <path d="M132 258h62M132 278h38" stroke="#6EE7B7" strokeWidth="5" strokeLinecap="round" />
              <path d="M264 258h28M264 278h20" stroke="#A7F3D0" strokeWidth="5" strokeLinecap="round" />
              <path d="M318 84l8 17 18 3-13 13 3 18-16-8-16 8 3-18-13-13 18-3 8-17Z" fill="#FDE68A" />
              <path d="M83 235l5 11 12 2-9 9 2 12-10-6-11 6 2-12-9-9 12-2 5-11Z" fill="#6EE7B7" />
              <circle cx="344" cy="222" r="7" fill="#10B981" />
              <circle cx="78" cy="154" r="5" fill="#34D399" />
            </svg>
            <motion.div
              className="heroFloatingBadge"
              animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
            >
              <SparkleIcon />
              <span>Summer edit</span>
            </motion.div>
            <motion.div
              className="heroFloatingCard"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 0.4 }}
            >
              <span className="floatingCardIcon">+</span>
              <span>Curated for you</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
