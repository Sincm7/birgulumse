import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../lib/AuthContext';
import { ROLES, STATUS } from '../lib/constants';
import { formatAddress } from '../lib/location';
import {
  approveDonation,
  deleteListing,
  fetchDonationStats,
  fetchListings,
  fetchPendingDonationRequests,
  updateListingStatus
} from '../lib/listings';
import { getProfilesCount } from '../lib/auth';

export default function AdminDashboardPage() {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState({ users: 0, active: 0, completed: 0 });
  const [pendingListings, setPendingListings] = useState([]);
  const [donationRequests, setDonationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const isAdmin = profile?.role === ROLES.ADMIN;

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileCount, donationStats, listings, requests] = await Promise.all([
        getProfilesCount(),
        fetchDonationStats(),
        fetchListings({ status: STATUS.PENDING }),
        fetchPendingDonationRequests()
      ]);

      setStats({ users: profileCount, active: donationStats.activeCount, completed: donationStats.completedCount });
      setPendingListings(listings ?? []);
      setDonationRequests(requests ?? []);
    } catch (error) {
      console.error('Admin data error', error);
      toast.error('Yönetim verileri getirilemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleApproveListing = async (listingId) => {
    setActionLoading(listingId);
    try {
      await updateListingStatus(listingId, STATUS.ACTIVE);
      toast.success('İlan yayına alındı');
      await loadData();
    } catch (error) {
      console.error('Approve listing error', error);
      toast.error('İlan yayına alınamadı');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('İlanı silmek istediğinizden emin misiniz?')) return;
    setActionLoading(listingId);
    try {
      await deleteListing(listingId);
      toast.success('İlan silindi');
      await loadData();
    } catch (error) {
      console.error('Delete listing error', error);
      toast.error('İlan silinemedi');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveDonation = async (request) => {
    setActionLoading(request.id);
    try {
      await approveDonation(request.listing_id, user.id);
      toast.success('Bağış tamamlandı olarak işaretlendi');
      await loadData();
    } catch (error) {
      console.error('Approve donation error', error);
      toast.error('Bağış onaylanamadı');
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-2xl font-semibold text-brand-900">Yönetici yetkisi gerekiyor</h1>
        <p className="mt-2 text-sm text-brand-600">Admin paneline erişmek için yönetici olarak giriş yapın.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Kayıtlı Kullanıcı"
          value={stats.users}
          icon={<span className="rounded-full bg-brand-100 px-4 py-3 text-brand-700">👥</span>}
        />
        <StatCard
          title="Aktif İlan"
          value={stats.active}
          icon={<span className="rounded-full bg-brand-100 px-4 py-3 text-brand-700">📢</span>}
        />
        <StatCard
          title="Tamamlanan Bağış"
          value={stats.completed}
          icon={<span className="rounded-full bg-brand-100 px-4 py-3 text-brand-700">🎉</span>}
        />
      </div>

      {loading ? (
        <LoadingSpinner label="Yönetici verileri yükleniyor" />
      ) : (
        <div className="space-y-10">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-brand-900">Onay bekleyen ilanlar</h2>
              <button
                onClick={loadData}
                className="rounded-full border border-brand-300 px-4 py-2 text-xs font-semibold uppercase text-brand-700 hover:bg-brand-100"
              >
                Yenile
              </button>
            </div>
            {pendingListings.length ? (
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
                    {pendingListings.map((listing) => (
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
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleApproveListing(listing.id)}
                              disabled={actionLoading === listing.id}
                              className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {actionLoading === listing.id ? 'Onaylanıyor...' : 'Yayına Al'}
                            </button>
                            <button
                              onClick={() => handleDeleteListing(listing.id)}
                              disabled={actionLoading === listing.id}
                              className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="Onay bekleyen ilan yok"
                description="Yeni başvurular geldiğinde burada listelenecek."
              />
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-brand-900">Bağış tamamlandı talepleri</h2>
            {donationRequests.length ? (
              <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                <table className="min-w-full divide-y divide-brand-100">
                  <thead className="bg-brand-50/70">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-brand-600">İlan</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-brand-600">Talep Tarihi</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-brand-600">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-50">
                    {donationRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-brand-50/40">
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-brand-900">{request.listings?.title}</p>
                          <StatusBadge status={request.listings?.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-brand-700">
                          {new Date(request.created_at).toLocaleString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-brand-700">
                          <button
                            onClick={() => handleApproveDonation(request)}
                            disabled={actionLoading === request.id}
                            className="rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {actionLoading === request.id ? 'Onaylanıyor...' : 'Tamamlandı Onayla'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="Tamamlanma talebi yok"
                description="Bağışçılar bağışlarını tamamladığında talepler burada görünür."
              />
            )}
          </section>
        </div>
      )}
    </div>
  );
}
