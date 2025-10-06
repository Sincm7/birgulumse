import { CATEGORY_OPTIONS } from '../lib/constants';

export function CategoryFilter({ activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onChange(undefined)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          !activeCategory ? 'bg-brand-500 text-white shadow-md' : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
        }`}
      >
        Tümü
      </button>
      {CATEGORY_OPTIONS.map((category) => (
        <button
          key={category.value}
          onClick={() => onChange(category.value)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === category.value
              ? 'bg-brand-500 text-white shadow-md'
              : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
