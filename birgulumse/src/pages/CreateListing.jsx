import { useEffect, useState } from 'react';
import { useNavigate } from '../lib/router';
import { toast } from '../lib/toast';
import { LocationFields } from '../components/LocationFields';
import { useAuth } from '../lib/AuthContext';
import { CATEGORY_OPTIONS, ROLES, STATUS } from '../lib/constants';
import { getBrowserLocation, initialLocationState } from '../lib/location';
import { createListing, uploadListingPhoto } from '../lib/listings';

export default function CreateListingPage() {
  const { profile, user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]?.value);
  const [phone, setPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [location, setLocation] = useState(initialLocationState);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tryingGeolocation, setTryingGeolocation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || profile?.role !== ROLES.DONOR) return;
    const fillLocation = async () => {
      try {
        setTryingGeolocation(true);
        const coords = await getBrowserLocation();
        setLocation((prev) => ({ ...prev, ...coords }));
      } catch (error) {
        console.warn('Konum alınamadı', error);
      } finally {
        setTryingGeolocation(false);
      }
    };

    fillLocation();
  }, [user, profile]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      let photoUrl = null;
      if (photo) {
        photoUrl = await uploadListingPhoto(photo);
      }

      await createListing({
        title,
        description,
        category,
        phone,
        is_anonymous: isAnonymous,
        owner_id: user.id,
        photo_url: photoUrl,
        location_city: location.city,
        location_district: location.district,
        location_neighborhood: location.neighborhood,
        latitude: location.latitude,
        longitude: location.longitude,
        status: STATUS.PENDING
      });

      toast.success('İlanınız oluşturuldu. Yönetici onayından sonra yayına alınacak.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Create listing error', error);
      toast.error(error.message || 'İlan oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (profile?.role !== ROLES.DONOR) {
    return (
      <div className="rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-2xl font-semibold text-brand-900">Bu sayfa sadece bağışçılar içindir.</h1>
        <p className="mt-2 text-sm text-brand-600">
          İlan oluşturmak için bağışçı olarak kayıt olmanız gerekir.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-brand-900">Yeni bağış ilanı</h1>
        <p className="mt-2 text-sm text-brand-600">Birkaç adımda ilanınızı oluşturun.</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-brand-800">Başlık</label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
              placeholder="0-6 Ay Bebek Tulum Seti"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-800">Kategori</label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            >
              {CATEGORY_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-brand-800">Açıklama</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
              placeholder="Ürün durumu, teslim tercihi ve diğer bilgiler..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-800">Telefon</label>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
              placeholder="05xx xxx xx xx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-800">Anonim bağışçı</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3">
              <input
                id="anonymous-donor"
                type="checkbox"
                checked={isAnonymous}
                onChange={(event) => setIsAnonymous(event.target.checked)}
              />
              <label htmlFor="anonymous-donor" className="text-sm text-brand-700">
                İsmimi ilan kartında gizle
              </label>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-brand-800">Konum</label>
            <p className="text-xs text-brand-500">
              {tryingGeolocation
                ? 'Tarayıcı konumunuzu alıyor...'
                : 'Konum iznini reddettiyseniz alanları manuel doldurabilirsiniz.'}
            </p>
            <div className="mt-3">
              <LocationFields location={location} onChange={setLocation} />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-brand-800">Fotoğraf</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
              className="mt-2 w-full rounded-xl border border-brand-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-brand-500">Fotoğraf eklemek başvurunuzun onaylanmasını hızlandırır.</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full border border-brand-300 px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-100"
        >
          Vazgeç
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'İlan kaydediliyor...' : 'Onaya Gönder'}
        </button>
      </div>
    </form>
  );
}
