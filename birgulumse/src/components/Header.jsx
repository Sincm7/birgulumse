import { Link, NavLink, useNavigate } from '../lib/router';
import { useState } from 'react';
import { signOut } from '../lib/auth';
import { useAuth } from '../lib/AuthContext';
import { ROLES } from '../lib/constants';

const navItems = [
  { to: '/', label: 'Anasayfa' },
  { to: '/listings', label: 'İlanlar' },
  { to: '/create-listing', label: 'İlan Oluştur', roles: [ROLES.DONOR] }
];

export function Header() {
  const { user, profile } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const canSee = (item) => {
    if (!item.roles) return true;
    if (!profile) return false;
    return item.roles.includes(profile.role);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="rounded-full bg-brand-500 px-3 py-1 text-sm font-semibold text-white">BirGülümse</span>
          <span className="text-sm font-medium text-brand-700">Paylaşınca Çoğalan Mutluluk</span>
        </Link>
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5" />
          </svg>
        </button>
        <nav
          className={`${
            menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0 md:opacity-100'
          } absolute left-0 right-0 top-full z-20 mx-4 mt-2 grid gap-2 rounded-lg bg-white p-4 shadow-lg transition-all duration-150 md:static md:mx-0 md:mt-0 md:grid-flow-col md:items-center md:bg-transparent md:p-0 md:shadow-none md:transition-none`}
        >
          {navItems.filter(canSee).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-brand-100 hover:text-brand-700 ${
                  isActive ? 'bg-brand-500 text-white shadow-md' : 'text-brand-800'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          {profile?.role === ROLES.DONOR && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-brand-100 hover:text-brand-700 ${
                  isActive ? 'bg-brand-500 text-white shadow-md' : 'text-brand-800'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              Bağışçı Paneli
            </NavLink>
          )}
          {profile?.role === ROLES.ADMIN && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-brand-100 hover:text-brand-700 ${
                  isActive ? 'bg-brand-500 text-white shadow-md' : 'text-brand-800'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </NavLink>
          )}
          {!user ? (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="rounded-full border border-brand-400 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
              >
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
              >
                Üye Ol
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-800"
            >
              Çıkış Yap
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
