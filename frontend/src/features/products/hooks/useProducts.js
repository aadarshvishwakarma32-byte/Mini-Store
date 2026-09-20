import { useCallback, useEffect, useState } from 'react';
import { productService } from '../../../services/product.service.js';

export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Home passes an object literal on every render. Using a stable serialized
  // query prevents an effect -> state update -> effect request loop.
  const paramsKey = JSON.stringify(params);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const requestParams = JSON.parse(paramsKey);
      const data = await productService.getProducts(requestParams);
      setProducts(data.data?.products || []);
    } catch {
      setError('Failed to load products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [paramsKey]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
