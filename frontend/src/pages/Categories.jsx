import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { catalogService } from '../services/catalog.service.js';

const fallbackCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: '⚡',
    description: 'Smart devices and everyday technology',
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    icon: '👕',
    description: 'Clothing, shoes, and seasonal styles',
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    icon: '🏠',
    description: 'Essentials for every room and meal',
  },
  { name: 'Beauty', slug: 'beauty', icon: '✨', description: 'Skincare, makeup, and self-care' },
  { name: 'Sports', slug: 'sports', icon: '🏅', description: 'Fitness, outdoor, and active gear' },
  { name: 'Books', slug: 'books', icon: '📚', description: 'Stories, learning, and new releases' },
  {
    name: 'Accessories',
    slug: 'accessories',
    icon: '👜',
    description: 'The finishing touches for your look',
  },
  {
    name: 'Mobiles',
    slug: 'mobiles',
    icon: '📱',
    description: 'Phones, cases, chargers, and more',
  },
  {
    name: 'Computers',
    slug: 'computers',
    icon: '💻',
    description: 'Laptops, parts, and desk essentials',
  },
  {
    name: 'Offers',
    slug: 'offers',
    icon: '🏷️',
    description: 'Limited-time savings across the store',
  },
];

function Categories() {
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    catalogService
      .getCategories()
      .then((response) => {
        const data = response.data;
        setCategories(Array.isArray(data) && data.length >= 0 ? data : fallbackCategories);
      })
      .catch(() => setCategories(fallbackCategories))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="categoriesPage">
      <div className="categoriesIntro">
        <p className="categoriesEyebrow">SHOP BY DEPARTMENT</p>
        <h1>Find your next favorite thing</h1>
        <p>Explore our most popular departments, from everyday essentials to special offers.</p>
      </div>

      <div className="categoryGrid" aria-busy={loading}>
        {categories.map((category) => (
          <Link
            className={`categoryCard ${category.slug === 'offers' ? 'categoryCardOffer' : ''}`}
            key={category.slug}
            to={
              category.slug === 'offers'
                ? '/offers'
                : `/?category=${encodeURIComponent(category.name)}`
            }
          >
            <span className="categoryIcon" aria-hidden="true">
              {category.icon}
            </span>
            <div>
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </div>
            <span className="categoryArrow" aria-hidden="true">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Categories;
