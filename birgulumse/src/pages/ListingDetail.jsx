import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapView } from '../components/MapView';
import { PhoneReveal } from '../components/PhoneReveal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { RoleBadge } from '../components/RoleBadge';
import { StatusBadge } from '../components/StatusBadge';
import { formatAddress } from '../lib/location';
import { fetchListingById } from '../lib/listings';

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchListingById(id);
        setListing(data);
      } catch (error) {
        console.error('Listing detail error', error);
        toast.error('İlan bilgisi yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return <LoadingSpinner label="İlan detayları hazırlanıyor" />;
  }

  if (!listing) {
    return <p className="text-center text-sm text-brand-600">İlan bulunamadı.</p>;
  }

  const address = formatAddress({
    city: listing.location_city,
    district: listing.location_district,
    neighborhood: listing.location_neighborhood
  });

  const donorName = listing.profiles?.is_anonymous ? 'İsimsiz Bağışçı' : listing.profiles?.full_name ?? 'Bağışçı';

  return (
    <div className="grid gap-8 md:grid-cols-[3fr_2fr]">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <img
            src={listing.photo_url || 'https://images.unsplash.com/photo-1600823722735-8ac31936c5c5?auto=format&fit=crop&w=1200&q=80'}
            alt={listing.title}
            className="h-80 w-full object-cover"
          />
          <div className="space-y-4 p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-3xl font-semibold text-brand-900">{listing.title}</h1>
              <StatusBadge status={listing.status} />
            </div>
            <p className="text-brand-700">{listing.description}</p>
            <div className="grid gap-3 rounded-2xl bg-brand-50/70 p-4 text-sm text-brand-700">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-brand-900">Bağışçı:</span>
                <span>{donorName}</span>
                <RoleBadge role={listing.profiles?.role} />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-brand-900">Kategori:</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase text-brand-700">
                  {listing.category}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-brand-900">Konum:</span>
                <span>{address || 'Konum bilgisi paylaşılmadı'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-brand-900">Yaklaşık konum</h2>
          <p className="mt-2 text-sm text-brand-600">
            Güvenlik nedeniyle tam adres paylaşılmaz. İletişime geçerek detayları konuşabilirsiniz.
          </p>
          <div className="mt-4 overflow-hidden rounded-3xl">
            <MapView
              latitude={listing.latitude}
              longitude={listing.longitude}
              label={listing.title}
            />
          </div>
        </div>
      </div>
      <aside className="space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-brand-900">Bağışçı ile iletişim</h2>
          <p className="mt-2 text-sm text-brand-600">
            Telefon ile bağışçımızla iletişime geçebilir, teslim yöntemini konuşabilirsiniz.
          </p>
          <div className="mt-6">
            <PhoneReveal phone={listing.phone} />
          </div>
          {listing.profiles?.is_anonymous ? (
            <p className="mt-4 text-xs text-brand-500">
              Bu bağışçı anonim kalmayı seçti. Telefonla iletişime geçtiğinizde kendinizi tanıtmayı unutmayın.
            </p>
          ) : null}
        </div>
        <div className="rounded-3xl bg-brand-900 p-8 text-brand-50">
          <h3 className="text-xl font-semibold">Bağış süreci nasıl işler?</h3>
          <ul className="mt-4 space-y-3 text-sm text-brand-100">
            <li>1. Bağışçı ile iletişime geçip teslim detaylarını konuşun.</li>
            <li>2. Teslim sonrası bağışçı panelinden "Bağış tamamlandı" seçeneğini işaretlemesini isteyin.</li>
            <li>3. Admin onayı ile ilan kapanır ve bağış sayacı güncellenir.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
