import { Toaster } from '../lib/toast';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-brand-50/60 via-white to-white">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}
