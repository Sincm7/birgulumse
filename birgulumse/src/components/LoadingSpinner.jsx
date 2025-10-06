export function LoadingSpinner({ label = 'Yükleniyor...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-brand-700">
      <svg className="h-10 w-10 animate-spin text-brand-500" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <p className="mt-4 text-sm font-medium">{label}</p>
    </div>
  );
}
