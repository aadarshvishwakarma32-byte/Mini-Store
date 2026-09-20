import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { wishlistService } from '../services/wishlist.service.js';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'sonner';
import { WishlistContext } from './WishlistContext.js';

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState(() => new Set());
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const wishlistIdsRef = useRef(wishlistIds);
  wishlistIdsRef.current = wishlistIds;

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistIds(new Set());
      setWishlistItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await wishlistService.getWishlist();
      const ids = new Set(data.data?.products?.map((p) => String(p._id || p)) || []);
      const items = data.data?.products || [];
      setWishlistIds(ids);
      setWishlistItems(items);
    } catch {
      setWishlistIds(new Set());
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const toggleWishlist = useCallback(
    async (productId) => {
      if (!isAuthenticated) {
        toast.error('Please login to use wishlist');
        return;
      }
      const strId = String(productId);
      try {
        if (wishlistIdsRef.current.has(strId)) {
          await wishlistService.removeFromWishlist(strId);
          setWishlistIds((prev) => {
            const next = new Set(prev);
            next.delete(strId);
            return next;
          });
          setWishlistItems((prev) => prev.filter((item) => String(item._id || item) !== strId));
          toast.success('Removed from wishlist');
        } else {
          await wishlistService.addToWishlist(strId);
          setWishlistIds((prev) => new Set(prev).add(strId));
          toast.success('Added to wishlist');
        }
      } catch {
        toast.error('Failed to update wishlist');
      }
    },
    [isAuthenticated]
  );

  const addToWishlist = useCallback(
    async (productId) => {
      if (!isAuthenticated) {
        toast.error('Please login to use wishlist');
        return;
      }
      const strId = String(productId);
      try {
        await wishlistService.addToWishlist(strId);
        setWishlistIds((prev) => new Set(prev).add(strId));
        toast.success('Added to wishlist');
      } catch {
        toast.error('Failed to add to wishlist');
      }
    },
    [isAuthenticated]
  );

  const removeFromWishlist = useCallback(async (productId) => {
    const strId = String(productId);
    try {
      await wishlistService.removeFromWishlist(strId);
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(strId);
        return next;
      });
      setWishlistItems((prev) => prev.filter((item) => String(item._id || item) !== strId));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove from wishlist');
    }
  }, []);

  const isInWishlist = useCallback(
    (productId) => wishlistIdsRef.current.has(String(productId)),
    []
  );

  const value = useMemo(
    () => ({
      wishlistIds,
      wishlistItems,
      loading,
      isInWishlist,
      toggleWishlist,
      addToWishlist,
      removeFromWishlist,
      refreshWishlist,
    }),
    [
      wishlistIds,
      wishlistItems,
      loading,
      isInWishlist,
      toggleWishlist,
      addToWishlist,
      removeFromWishlist,
      refreshWishlist,
    ]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
