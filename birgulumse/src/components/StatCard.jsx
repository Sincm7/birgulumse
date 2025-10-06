export function StatCard({ title, value, icon }) {
  return (
    <div className="card-shadow rounded-3xl border border-brand-100 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-brand-900">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}
