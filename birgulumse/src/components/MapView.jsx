export function MapView({ latitude, longitude, label }) {
  if (!latitude || !longitude) {
    return (
      <div className="rounded-3xl border border-dashed border-brand-200 bg-brand-50/50 p-6 text-sm text-brand-600">
        Harita için konum bilgisi bekleniyor. Manuel giriş yapıldıysa sadece metinsel adres paylaşılır.
      </div>
    );
  }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div className="flex flex-col gap-2">
      <div className="h-64 w-full overflow-hidden rounded-3xl border border-brand-100 shadow-sm">
        <iframe
          title={label ?? 'İlan Konumu'}
          src={mapUrl}
          className="h-full w-full"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {label ? <p className="text-xs text-brand-600">Yaklaşık konum: {label}</p> : null}
    </div>
  );
}
