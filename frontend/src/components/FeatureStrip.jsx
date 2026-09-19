import { motion } from 'framer-motion';

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

const TruckIcon = () => (
  <svg {...iconProps}>
    <path d="M10 17h4V5H2v12h3" />
    <path d="M14 9h4l4 4v4h-3" />
    <circle cx="7" cy="17.5" r="2" />
    <circle cx="17" cy="17.5" r="2" />
  </svg>
);

const LockIcon = () => (
  <svg {...iconProps}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    <path d="M12 15v3" />
  </svg>
);

const ChatIcon = () => (
  <svg {...iconProps}>
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
    <path d="M8 9h8M8 13h5" />
  </svg>
);

const ReturnIcon = () => (
  <svg {...iconProps}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l3 3" />
  </svg>
);

const features = [
  {
    icon: <TruckIcon />,
    title: 'Free Shipping',
    desc: 'On orders over ₹999',
  },
  {
    icon: <LockIcon />,
    title: 'Secure Payment',
    desc: '100% secure checkout',
  },
  {
    icon: <ChatIcon />,
    title: '24/7 Support',
    desc: 'Dedicated support team',
  },
  {
    icon: <ReturnIcon />,
    title: 'Easy Returns',
    desc: '30-day return policy',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const FeatureStrip = () => {
  return (
    <motion.div
      className="featureStrip"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {features.map((feature) => (
        <motion.div
          key={feature.title}
          className="featureItem"
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="featureIcon">{feature.icon}</div>
          <div className="featureText">
            <strong>{feature.title}</strong>
            <span>{feature.desc}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeatureStrip;
