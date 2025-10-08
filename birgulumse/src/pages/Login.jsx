import { useState } from 'react';
import { Link, useNavigate } from '../lib/router';
import { toast } from '../lib/toast';
import { signIn } from '../lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await signIn({ email, password });
      toast.success('Giriş başarılı');
      navigate('/');
    } catch (error) {
      console.error('Login error', error);
      toast.error(error.message || 'Giriş yapılamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 shadow-lg">
      <h1 className="text-3xl font-semibold text-brand-900">Tekrar hoş geldiniz</h1>
      <p className="mt-2 text-sm text-brand-600">Bağış hesabınıza giriş yapın.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
      <p className="mt-6 text-sm text-brand-600">
        Henüz bir hesabınız yok mu?{' '}
        <Link to="/register" className="font-semibold text-brand-700 underline">
          Ücretsiz üye olun
        </Link>
      </p>
    </div>
  );
}
