import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../lib/AuthContext';
import { ROLES, STATUS } from '../lib/constants';
import { formatAddress } from '../lib/location';
import { fetchListingsByOwner, requestDonationApproval } from '../lib/listings';

export default function DonorDashboardPage() {
  const { profile, user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(null);

  const loadListings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchListingsByOwner(user.id);
      setListings(data ?? []);
    } catch (error) {
      console.error('Donor listings error', error);
      toast.error('İlanlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleCompletionRequest = async (listingId) => {
    setRequesting(listingId);
    try {
      await requestDonationApproval(listingId);
      toast.success('Bağış tamamlandı talebi admin onayına gönderildi');
      await loadListings();
    } catch (error) {
      console.error('Completion request error', error);
      toast.error(error.message || 'Talep oluşturulamadı');
    } finally {
      setRequesting(null);
    }
  };

  if (profile?.role !== ROLES.DONOR) {
    return (
      <div className="rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-2xl font-semibold text-brand-900">Bu alan sadece bağışçılar için.</h1>
        <p className="mt-2 text-sm text-brand-600">Bağış ilanları burada yönetilir.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-brand-900">Merhaba {profile.is_anonymous ? 'İsimsiz Bağışçı' : profile.full_name}</h1>
        <p className="mt-2 text-sm text-brand-600">
          Toplam onaylı bağış sayınız: <span className="font-semibold text-brand-800">{profile.donation_count ?? 0}</span>
        </p>
      </div>
      {loading ? (
        <LoadingSpinner label="İlanlarınız getiriliyor" />
      ) : listings.length ? (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <table className="min-w-full divide-y divide-brand-100">
            <thead className="bg-brand-50/70">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-brand-600">İlan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-brand-600">Konum</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-brand-600">Durum</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-brand-600">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-brand-50/40">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-brand-900">{listing.title}</p>
                    <p className="text-xs text-brand-600">{listing.category}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-brand-700">
                    {formatAddress({
                      city: listing.location_city,
                      district: listing.location_district,
                      neighborhood: listing.location_neighborhood
                    }) || 'Belirtilmedi'}
                  </td>
                  <td className="px-6 py-4 text-sm text-brand-700">
                    <StatusBadge status={listing.status} />
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-brand-700">
                    {listing.status === STATUS.ACTIVE ? (
                      <button
                        onClick={() => handleCompletionRequest(listing.id)}
                        disabled={requesting === listing.id}
                        className="rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {requesting === listing.id ? 'Gönderiliyor...' : 'Bağış tamamlandı'}
                      </button>
                    ) : (
                      <span className="text-xs text-brand-500">Onay için bekliyor</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="Henüz ilanınız yok"
          description="İlk bağış ilanınızı oluşturarak ihtiyaç sahibi ailelere umut olabilirsiniz."
        />
      )}
    </div>
  );
}
