import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { cartService } from '../services/cart.service.js';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'sonner';
import { CartContext } from './CartContext.js';

const normalizeCart = (cart) =>
  cart?.items?.map((item) => ({
    product: item.product,
    productId: String(item.product?._id || item.product),
    quantity: item.quantity,
    price: item.priceAtAddTime,
  })) || [];

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const cartItemsRef = useRef(cartItems);
  cartItemsRef.current = cartItems;

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCartItems(normalizeCart(data.data));
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const setCartFromResponse = useCallback((data) => {
    setCartItems(normalizeCart(data.data));
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );
  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [cartItems]
  );

  const addToCart = useCallback(
    async (product, quantity = 1) => {
      if (!isAuthenticated) {
        toast.error('Please login to add items to cart');
        return false;
      }
      try {
        const data = await cartService.addToCart(product._id || product.id, quantity);
        setCartFromResponse(data);
        toast.success('Added to cart', {
          description: product.name || product.title,
          duration: 2000,
        });
        return true;
      } catch (error) {
        toast.error(error.message || 'Failed to add to cart');
        return false;
      }
    },
    [isAuthenticated, setCartFromResponse]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      try {
        const data = await cartService.updateQuantity(productId, quantity);
        setCartFromResponse(data);
      } catch (error) {
        toast.error(error.message || 'Failed to update quantity');
      }
    },
    [setCartFromResponse]
  );

  const increaseQuantity = useCallback(
    async (productId) => {
      const item = cartItemsRef.current.find((entry) => entry.productId === String(productId));
      if (item) await updateQuantity(item.productId, item.quantity + 1);
    },
    [updateQuantity]
  );

  const decreaseQuantity = useCallback(
    async (productId) => {
      const item = cartItemsRef.current.find((entry) => entry.productId === String(productId));
      if (item && item.quantity > 1) await updateQuantity(item.productId, item.quantity - 1);
    },
    [updateQuantity]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      try {
        const data = await cartService.removeFromCart(productId);
        setCartFromResponse(data);
        toast.success('Removed from cart', { duration: 1500 });
      } catch (error) {
        toast.error(error.message || 'Failed to remove item');
      }
    },
    [setCartFromResponse]
  );

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
      toast.success('Cart cleared', { duration: 1500 });
    } catch (error) {
      toast.error(error.message || 'Failed to clear cart');
    }
  }, []);

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartTotal,
      loading,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      refreshCart,
    }),
    [
      cartItems,
      cartCount,
      cartTotal,
      loading,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      refreshCart,
    ]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
