import { useEffect, useState } from 'react';
import { Link } from '../lib/router';
import { CategoryFilter } from '../components/CategoryFilter';
import { EmptyState } from '../components/EmptyState';
import { ListingCard } from '../components/ListingCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { fetchListings } from '../lib/listings';
import heroImage from '../assets/hero-illustration.svg';

export default function HomePage() {
  const [category, setCategory] = useState();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchListings({ category });
        setListings(data ?? []);
      } catch (error) {
        console.error('Listings load error', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [category]);

  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 rounded-3xl bg-gradient-to-br from-brand-100 via-white to-brand-100/40 px-8 py-16 shadow-sm md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase text-brand-700 shadow-sm">
            #BirGülümse ile paylaş
          </span>
          <h1 className="text-4xl font-semibold text-brand-900 md:text-5xl">
            Bebek ürünlerini ihtiyaç sahipleriyle güvenle buluşturun.
          </h1>
          <p className="text-lg text-brand-700">
            Kullanmadığınız bebek eşyalarınızı dakikalar içinde bağış ilanına dönüştürün, ailelerin yüzünü güldürün.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/create-listing"
              className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600"
            >
              İlan Oluştur
            </Link>
            <Link
              to="/listings"
              className="rounded-full border border-brand-400 px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-100"
            >
              İlanları Keşfet
            </Link>
          </div>
        </div>
        <img src={heroImage} alt="BirGülümse bağışlaşma" className="mx-auto w-full max-w-sm" />
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-brand-900">Güncel bağışlar</h2>
            <p className="text-sm text-brand-600">Kategoriye göre filtreleyin, size uygun bağışı bulun.</p>
          </div>
          <CategoryFilter activeCategory={category} onChange={setCategory} />
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
            title="Henüz bu kategoride ilan yok"
            description="Bağışçılar yeni ilanlar eklediğinde burada göreceksiniz."
            action={
              <Link
                to="/create-listing"
                className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-brand-600"
              >
                İlk Bağışı Siz Yapın
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}
