import { STATUS } from '../lib/constants';

const statusCopy = {
  [STATUS.PENDING]: 'Onay Bekliyor',
  [STATUS.ACTIVE]: 'Yayında',
  [STATUS.COMPLETED]: 'Tamamlandı',
  [STATUS.DRAFT]: 'Taslak'
};

const statusColor = {
  [STATUS.PENDING]: 'bg-amber-100 text-amber-700',
  [STATUS.ACTIVE]: 'bg-emerald-100 text-emerald-700',
  [STATUS.COMPLETED]: 'bg-slate-200 text-slate-700',
  [STATUS.DRAFT]: 'bg-gray-200 text-gray-700'
};

export function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {statusCopy[status] ?? status}
    </span>
  );
}
