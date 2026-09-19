import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero.jsx';
import FeatureStrip from '../components/FeatureStrip.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FilterBar from '../components/FilterBar.jsx';
import ProductList from '../components/ProductList.jsx';
import { useProducts } from '../features/products/hooks/useProducts.js';

const Home = () => {
  const { products, loading, error } = useProducts({ limit: 50 });
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(() => searchParams.get('category') || 'All');
  const [sort, setSort] = useState('default');

  const filteredProducts = useMemo(() => {
    let result = products;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => {
        const title = (p.name || p.title || '').toLowerCase();
        const cat = (typeof p.category === 'object' && p.category !== null ? p.category.name : p.category) || '';
        const desc = (p.description || '').toLowerCase();
        return title.includes(q) || cat.toLowerCase().includes(q) || desc.includes(q);
      });
    }

    if (category !== 'All') {
      result = result.filter((p) => {
        const catName = typeof p.category === 'object' && p.category !== null ? p.category.name : p.category;
        return catName && catName.toLowerCase() === category.toLowerCase();
      });
    }

    if (sort === 'price-asc') {
      result = [...result].sort((a, b) => {
        const priceA = a.discountPrice || a.price || 0;
        const priceB = b.discountPrice || b.price || 0;
        return priceA - priceB;
      });
    } else if (sort === 'price-desc') {
      result = [...result].sort((a, b) => {
        const priceA = a.discountPrice || a.price || 0;
        const priceB = b.discountPrice || b.price || 0;
        return priceB - priceA;
      });
    } else if (sort === 'rating') {
      result = [...result].sort((a, b) => {
        const rateA = typeof a.rating === 'object' && a.rating !== null ? (a.rating.rate ?? 0) : (Number(a.rating) || 0);
        const rateB = typeof b.rating === 'object' && b.rating !== null ? (b.rating.rate ?? 0) : (Number(b.rating) || 0);
        return rateB - rateA;
      });
    }

    return result;
  }, [products, search, category, sort]);

  return (
    <main className="main">
      <Hero onShopNow={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} />
      <FeatureStrip />
      <SearchBar value={search} onChange={setSearch} />
      <FilterBar category={category} onCategoryChange={setCategory} sort={sort} onSortChange={setSort} />

      {loading && (
        <div className="productGrid" aria-label="Loading products">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div key={idx} className="skeletonCard" aria-hidden="true">
              <div className="skeletonImage" />
              <div className="skeletonLine w60" />
              <div className="skeletonLine w40" />
              <div className="skeletonLine w90" />
              <div className="skeletonBtn" />
            </div>
          ))}
        </div>
      )}

      {error && <div className="status error">{error}</div>}

      {!loading && !error && (
        <div id="products">
          <AnimatePresence mode="popLayout">
            <ProductList
              products={filteredProducts}
            />
          </AnimatePresence>
        </div>
      )}
    </main>
  );
};

export default Home;
