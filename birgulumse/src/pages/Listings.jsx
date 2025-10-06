import { useEffect, useState } from 'react';
import { CategoryFilter } from '../components/CategoryFilter';
import { EmptyState } from '../components/EmptyState';
import { ListingCard } from '../components/ListingCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { fetchListings } from '../lib/listings';

export default function ListingsPage() {
  const [category, setCategory] = useState();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      try {
        const data = await fetchListings({ category });
        setListings(data ?? []);
      } catch (error) {
        console.error('Listings fetch error', error);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [category]);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-brand-900">Tüm bağış ilanları</h1>
        <p className="mt-2 text-sm text-brand-600">
          Giyimden oyuncaklara sekiz farklı kategori. Filtreleyin, size en yakın ilanı seçin.
        </p>
        <div className="mt-6">
          <CategoryFilter activeCategory={category} onChange={setCategory} />
        </div>
      </div>
      {loading ? (
        <LoadingSpinner label="İlanlar yükleniyor" />
      ) : listings.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Henüz ilan bulunamadı"
          description="Filtreleri kaldırarak tekrar deneyebilirsiniz."
        />
      )}
    </div>
  );
}
