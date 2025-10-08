import { Link } from '../lib/router';
import { formatRelativeTime } from '../lib/date';
import { formatAddress } from '../lib/location';

export function ListingCard({ listing }) {
  const { id, title, category, location_city, location_district, location_neighborhood, photo_url, created_at, profiles } = listing;

  const address = formatAddress({
    city: location_city,
    district: location_district,
    neighborhood: location_neighborhood
  });

  const donorName = profiles?.is_anonymous ? 'İsimsiz Bağışçı' : profiles?.full_name ?? 'Bağışçı';

  return (
    <Link
      to={`/listings/${id}`}
      className="flex flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={photo_url || 'https://images.unsplash.com/photo-1581579186989-4c06b1a0a4fd?auto=format&fit=crop&w=800&q=80'}
          alt={title}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase text-brand-700">
          {category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-lg font-semibold text-brand-900">{title}</h3>
          <p className="text-sm text-brand-700">{donorName}</p>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-brand-600">
          <span className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {address || 'Konum belirtilmedi'}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6l3 3" />
            </svg>
            {created_at ? formatRelativeTime(created_at) : 'Yeni'}
          </span>
        </div>
      </div>
    </Link>
  );
}
