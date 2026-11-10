import { useEffect, useState } from 'react';
import { Filters } from './Filters';
import { ProductCard } from './ProductCard';

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: undefined,
    maxPrice: undefined,
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://fakestoreapi.com/products', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Ошибка сети: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
    return () => controller.abort();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false;
    if (filters.minPrice !== undefined && product.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) return false;
    return true;
  });

  if (loading) return <p style={{ textAlign: 'center' }}>Загрузка товаров...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>Ошибка: {error}</p>;

  return (
    <section>
      <Filters onFilterChange={setFilters} initialFilters={filters} />
      {filteredProducts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777' }}>Товары не найдены по выбранным фильтрам.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}