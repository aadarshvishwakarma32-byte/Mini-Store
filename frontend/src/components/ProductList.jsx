import ProductCard from './ProductCard.jsx';

const ProductList = ({ products }) => {
  if (!products.length) {
    return (
      <div className="emptyState">
        No products found. Try adjusting your search or filter.
      </div>
    );
  }
  return (
    <section className="productGrid" aria-label="Products">
      {products.map((p, idx) => (
        <ProductCard
          key={p._id || p.id || idx}
          product={p}
          index={idx}
        />
      ))}
    </section>
  );
};

export default ProductList;
