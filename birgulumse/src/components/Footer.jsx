export function Footer() {
  return (
    <footer className="mt-16 bg-brand-900 text-brand-50">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold">BirGülümse</h3>
          <p className="mt-2 text-sm text-brand-100">
            Bebek ürünlerini ihtiyaç sahipleriyle buluşturan, güvenli ve şeffaf bağış platformu.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide">Kategoriler</h4>
          <ul className="mt-2 space-y-1 text-sm text-brand-100">
            <li>Giyim ve Tekstil</li>
            <li>Oyuncaklar ve Kitaplar</li>
            <li>Bebek Mobilyaları</li>
            <li>Bebek Arabaları</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide">İletişim</h4>
          <p className="mt-2 text-sm text-brand-100">
            Destek hattı: <a href="tel:+908502220000" className="font-medium text-brand-50 underline">0850 222 00 00</a>
          </p>
          <p className="mt-1 text-sm text-brand-100">E-posta: destek@birgulumse.org</p>
        </div>
      </div>
      <div className="border-t border-brand-800 py-4 text-center text-xs text-brand-200">
        © {new Date().getFullYear()} BirGülümse Sosyal Bağış Platformu. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
