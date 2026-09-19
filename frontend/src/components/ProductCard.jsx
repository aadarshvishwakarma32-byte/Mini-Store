import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useWishlist } from '../hooks/useWishlist.js';

const round2 = (n) => Math.round(n * 100) / 100;

const ProductCard = ({ product, index }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const productId = product._id || product.id;
  const title = product.name || product.title || 'Untitled Product';
  const image =
    (Array.isArray(product.images) && product.images[0]) ||
    product.image ||
    'https://cdn-icons-png.flaticon.com/512/3081/3081558.png';
  const categoryName =
    typeof product.category === 'object' && product.category !== null
      ? product.category.name || ''
      : product.category || '';

  const rate =
    typeof product.rating === 'object' && product.rating !== null
      ? (product.rating.rate ?? 0)
      : Number(product.rating) || 0;
  const count =
    typeof product.rating === 'object' && product.rating !== null
      ? (product.rating.count ?? 0)
      : product.numReviews ?? 0;

  const validRate = Math.min(5, Math.max(0, Math.round(rate)));
  const stars = '★'.repeat(validRate) + '☆'.repeat(5 - validRate);
  const isLiked = isInWishlist(productId);

  const finalPrice = round2(product.discountPrice || product.price || 0);
  const originalPrice = round2(product.price ? (product.discountPrice ? product.price : product.price * 1.4) : 0);
  const discountPercent =
    product.discountPrice && product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 40;

  const handleBuyNow = async () => {
    try {
      await addToCart(product, 1);
      navigate('/checkout');
    } catch {
      // error already shown by context
    }
  };

  return (
    <motion.article
      className="productCard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -6 }}
    >
      <div className="badges">
        <span className="badge badgeNew">New</span>
        <span className="badge badgeHot">Sale</span>
      </div>

      <button
        type="button"
        className={`wishlistBtn ${isLiked ? 'liked' : ''}`}
        onClick={() => toggleWishlist(productId)}
        aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isLiked ? '♥' : '♡'}
      </button>

      <div className="productImageWrap">
        <img
          className="productImage"
          src={image}
          alt={title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
        />
      </div>

      <h3 className="productTitle">{title}</h3>
      {categoryName && <p className="productCategory">{categoryName}</p>}

      <div className="productRating">
        <span className="stars">{stars}</span>
        <span>{rate ? rate.toFixed(1) : '0.0'}</span>
        <span>({count})</span>
      </div>

      <p className="productPrice">
        ₹{finalPrice.toFixed(2)}
        {originalPrice > finalPrice && (
          <>
            <span className="original">₹{originalPrice.toFixed(2)}</span>
            <span className="discount">-{discountPercent}%</span>
          </>
        )}
      </p>

      <div className="cardActions">
        <motion.button
          type="button"
          className="btn btnGhost"
          onClick={() => addToCart(product)}
          whileTap={{ scale: 0.97 }}
        >
          Add to cart
        </motion.button>
        <motion.button
          type="button"
          className="btn"
          onClick={handleBuyNow}
          whileTap={{ scale: 0.97 }}
        >
          Buy Now
        </motion.button>
      </div>
    </motion.article>
  );
};

export default ProductCard;