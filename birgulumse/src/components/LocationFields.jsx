export function LocationFields({ location, onChange }) {
  const handleChange = (field) => (event) => {
    onChange({ ...location, [field]: event.target.value });
  };

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div>
        <label className="block text-sm font-medium text-brand-800">İl</label>
        <input
          type="text"
          value={location.city}
          onChange={handleChange('city')}
          className="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 focus:border-brand-500 focus:outline-none"
          placeholder="İstanbul"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-800">İlçe</label>
        <input
          type="text"
          value={location.district}
          onChange={handleChange('district')}
          className="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 focus:border-brand-500 focus:outline-none"
          placeholder="Kadıköy"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-800">Mahalle</label>
        <input
          type="text"
          value={location.neighborhood}
          onChange={handleChange('neighborhood')}
          className="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 focus:border-brand-500 focus:outline-none"
          placeholder="Moda Mah."
        />
      </div>
    </div>
  );
}
