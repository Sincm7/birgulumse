import { ROLES } from '../lib/constants';

const roleCopy = {
  [ROLES.DONOR]: 'Bağışçı',
  [ROLES.RECEIVER]: 'İhtiyaç Sahibi',
  [ROLES.ADMIN]: 'Yönetici'
};

const roleColor = {
  [ROLES.DONOR]: 'bg-brand-100 text-brand-700',
  [ROLES.RECEIVER]: 'bg-emerald-100 text-emerald-700',
  [ROLES.ADMIN]: 'bg-sky-100 text-sky-700'
};

export function RoleBadge({ role }) {
  if (!role) return null;
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${roleColor[role] ?? 'bg-gray-100 text-gray-600'}`}>
      {roleCopy[role] ?? role}
    </span>
  );
}
