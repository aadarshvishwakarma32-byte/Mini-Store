import { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext.js';

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
