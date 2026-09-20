import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footerInner">
        {/* Brand column */}
        <div className="footerBrand">
          <Link to="/" className="footerLogo">
            <span className="footerLogoIcon">🛍</span>
            <span className="footerLogoText">
              Mini<span className="footerLogoAccent">Store</span>
            </span>
          </Link>
          <p className="footerTagline">
            Premium products curated for your lifestyle. Quality meets affordability.
          </p>
          <div className="footerSocials">
            {['🐦', '📘', '📷', '▶️'].map((icon, i) => (
              <motion.a
                key={i}
                href="#"
                className="footerSocialBtn"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Social link"
              >
                {icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="footerCol">
          <h4 className="footerColTitle">Quick Links</h4>
          <ul className="footerLinkList">
            <li>
              <Link to="/" className="footerLink">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="footerLink">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/service" className="footerLink">
                Services
              </Link>
            </li>
            <li>
              <Link to="/contact" className="footerLink">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Account */}
        <div className="footerCol">
          <h4 className="footerColTitle">Account</h4>
          <ul className="footerLinkList">
            <li>
              <Link to="/login" className="footerLink">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/register" className="footerLink">
                Create Account
              </Link>
            </li>
            <li>
              <Link to="/profile" className="footerLink">
                My Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="footerCol">
          <h4 className="footerColTitle">Support</h4>
          <ul className="footerLinkList">
            <li>
              <a href="#" className="footerLink">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="footerLink">
                Shipping Policy
              </a>
            </li>
            <li>
              <a href="#" className="footerLink">
                Returns &amp; Refunds
              </a>
            </li>
            <li>
              <a href="#" className="footerLink">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footerBottom">
        <span className="footerCopy">
          &copy; {new Date().getFullYear()} MiniStore. All rights reserved.
        </span>
        <span className="footerMade">Made in India</span>
      </div>
    </footer>
  );
};

export default Footer;
