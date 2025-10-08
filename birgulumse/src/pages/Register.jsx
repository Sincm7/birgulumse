import { useState } from 'react';
import { Link, useNavigate } from '../lib/router';
import { toast } from '../lib/toast';
import { signUp } from '../lib/auth';
import { ROLES } from '../lib/constants';

const roleOptions = [
  { value: ROLES.DONOR, label: 'Bağışçı' },
  { value: ROLES.RECEIVER, label: 'İhtiyaç Sahibi' }
];

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.DONOR);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await signUp({ email, password, fullName, role, isAnonymous });
      toast.success('Üyelik talimatları e-postanıza gönderildi');
      navigate('/login');
    } catch (error) {
      console.error('Register error', error);
      toast.error(error.message || 'Kayıt tamamlanamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 shadow-lg">
      <h1 className="text-3xl font-semibold text-brand-900">BirGülümse ailesine katılın</h1>
      <p className="mt-2 text-sm text-brand-600">
        Bağışçı veya ihtiyaç sahibi olarak saniyeler içinde hesabınızı oluşturun.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-brand-800">Ad Soyad</label>
          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required={!isAnonymous}
            className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            placeholder="Ayşe Yılmaz"
          />
          <p className="mt-1 text-xs text-brand-500">Anonim bağışçı seçeneğiyle isminiz ilanlarda gizlenir.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-800">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            placeholder="ornek@birgulumse.org"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-800">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-800">Rolünüz</label>
          <div className="mt-2 grid gap-3">
            {roleOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                  role === option.value ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-brand-200 text-brand-600'
                }`}
              >
                <span>{option.label}</span>
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={role === option.value}
                  onChange={() => setRole(option.value)}
                />
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-800">Anonimlik</label>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3">
            <input
              id="anonymous"
              type="checkbox"
              checked={isAnonymous}
              onChange={(event) => setIsAnonymous(event.target.checked)}
            />
            <label htmlFor="anonymous" className="text-sm text-brand-700">
              İlanlarda ismimi gizle (Anonim bağışçı / ihtiyaç sahibi)
            </label>
          </div>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Kaydınız oluşturuluyor...' : 'Ücretsiz Üye Ol'}
          </button>
        </div>
      </form>
      <p className="mt-6 text-sm text-brand-600">
        Zaten üyeyim?{' '}
        <Link to="/login" className="font-semibold text-brand-700 underline">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
}
