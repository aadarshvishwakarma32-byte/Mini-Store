import { useWishlist } from '../../hooks/useWishlist.js';
import { useAuth } from '../../hooks/useAuth.js';

const Wishlist = () => {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <main className="main">
        <section className="page">
          <h1 className="pageTitle">My Wishlist</h1>
          <div className="status">Please login to view your wishlist.</div>
        </section>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="main">
        <section className="page">
          <h1 className="pageTitle">My Wishlist</h1>
          <div
            className="skeletonLine w60"
            style={{ height: '40px', width: '200px', borderRadius: '8px', margin: '0 auto 16px' }}
          />
          <div
            className="skeletonLine w40"
            style={{ height: '16px', width: '100%', borderRadius: '8px', margin: '0 auto 8px' }}
          />
          <div
            className="skeletonLine w40"
            style={{ height: '16px', width: '100%', borderRadius: '8px', margin: '0 auto' }}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      <section className="page">
        <h1 className="pageTitle">My Wishlist</h1>
        {wishlistItems.length === 0 ? (
          <div className="status">Your wishlist is empty.</div>
        ) : (
          <div className="productGrid">
            {wishlistItems.map((item) => (
              <div key={item._id || item} className="productCard">
                <div className="productImageWrap">
                  <img
                    className="productImage"
                    src={
                      item.image ||
                      item.images?.[0] ||
                      'https://cdn-icons-png.flaticon.com/512/3081/3081558.png'
                    }
                    alt={item.name || item.title || 'Product'}
                  />
                </div>
                <h3 className="productTitle">{item.name || item.title || 'Untitled Product'}</h3>
                <p className="productPrice">₹{item.price || item.discountPrice || '0.00'}</p>
                <button
                  type="button"
                  className="btn"
                  onClick={() => removeFromWishlist(item._id || item)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Wishlist;
