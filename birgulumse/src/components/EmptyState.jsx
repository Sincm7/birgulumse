export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-brand-200 bg-brand-50/50 px-6 py-16 text-center">
      <h3 className="text-xl font-semibold text-brand-800">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-brand-600">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
