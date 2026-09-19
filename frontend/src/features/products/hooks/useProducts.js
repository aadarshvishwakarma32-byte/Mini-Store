import { useState, useEffect } from 'react';
import { productService } from '../../../services/product.service.js';

export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productService.getProducts(params);
      setProducts(data.data?.products || []);
    } catch {
      setError('Failed to load products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}
