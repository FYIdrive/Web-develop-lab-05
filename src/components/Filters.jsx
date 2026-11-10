import React from 'react';

export function Filters({ onFilterChange, initialFilters }) {
  const [localCategory, setLocalCategory] = React.useState(initialFilters.category || '');
  const [localMinPrice, setLocalMinPrice] = React.useState(String(initialFilters.minPrice ?? ''));
  const [localMaxPrice, setLocalMaxPrice] = React.useState(String(initialFilters.maxPrice ?? ''));
  const [errors, setErrors] = React.useState({});

  const validate = () => {
    const errs = {};
    const min = localMinPrice === '' ? undefined : Number(localMinPrice);
    const max = localMaxPrice === '' ? undefined : Number(localMaxPrice);

    if (min !== undefined && !Number.isFinite(min)) {
      errs.min = 'Введите корректную цену';
    } else if (min !== undefined && min < 0) {
      errs.min = 'Цена не может быть отрицательной';
    }

    if (max !== undefined && !Number.isFinite(max)) {
      errs.max = 'Введите корректную цену';
    } else if (max !== undefined && max < 0) {
      errs.max = 'Цена не может быть отрицательной';
    }

    if (
      min !== undefined && max !== undefined &&
      Number.isFinite(min) && Number.isFinite(max) &&
      min >= 0 && max >= 0 && min > max
    ) {
      errs.min = 'Цена «от» не может быть больше цены «до»';
      errs.max = 'Цена «до» не может быть меньше цены «от»';
    }

    return errs;
  };

  const handleApply = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onFilterChange({
      category: localCategory === '' ? undefined : localCategory,
      minPrice: localMinPrice === '' ? undefined : Number(localMinPrice),
      maxPrice: localMaxPrice === '' ? undefined : Number(localMaxPrice),
    });
  };

  const handleMinChange = (event) => {
    setLocalMinPrice(event.target.value);
    setErrors((previous) => ({ ...previous, min: '' }));
  };

  const handleMaxChange = (event) => {
    setLocalMaxPrice(event.target.value);
    setErrors((previous) => ({ ...previous, max: '' }));
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label>Категория</label>
          <select
            value={localCategory}
            onChange={(event) => setLocalCategory(event.target.value)}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Все категории</option>
            <option value="electronics">Электроника</option>
            <option value="jewelery">Ювелирные изделия</option>
            <option value="men's clothing">Мужская одежда</option>
            <option value="women's clothing">Женская одежда</option>
          </select>
        </div>

        <div>
          <label>Цена от</label>
          <input
            type="number"
            value={localMinPrice}
            onChange={handleMinChange}
            placeholder="0"
            min="0"
            step="any"
            style={{
              width: '100%',
              padding: '8px',
              border: errors.min ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {errors.min && (
            <span style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
              {errors.min}
            </span>
          )}
        </div>

        <div>
          <label>Цена до</label>
          <input
            type="number"
            value={localMaxPrice}
            onChange={handleMaxChange}
            placeholder="9999"
            min="0"
            step="any"
            style={{
              width: '100%',
              padding: '8px',
              border: errors.max ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {errors.max && (
            <span style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
              {errors.max}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={handleApply}
        style={{
          padding: '10px 24px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Применить фильтры
      </button>
    </div>
  );
}