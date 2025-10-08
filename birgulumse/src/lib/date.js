const thresholds = [
  { limit: 60, divisor: 1, getLabel: () => 'az önce' },
  { limit: 3600, divisor: 60, getLabel: (value) => `${value} dakika önce` },
  { limit: 86400, divisor: 3600, getLabel: (value) => `${value} saat önce` },
  { limit: 604800, divisor: 86400, getLabel: (value) => `${value} gün önce` },
  { limit: 2629800, divisor: 604800, getLabel: (value) => `${value} hafta önce` },
  { limit: 31557600, divisor: 2629800, getLabel: (value) => `${value} ay önce` }
];

const getYearLabel = (value) => `${value} yıl önce`;

export function formatRelativeTime(input) {
  if (!input) return '';
  const date = input instanceof Date ? input : new Date(input);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const now = Date.now();
  const diffInSeconds = Math.max(0, Math.floor((now - date.getTime()) / 1000));

  for (const { limit, divisor, getLabel } of thresholds) {
    if (diffInSeconds < limit) {
      if (divisor === 1) {
        return getLabel();
      }

      const value = Math.max(1, Math.floor(diffInSeconds / divisor));
      return getLabel(value);
    }
  }

  const years = Math.max(1, Math.floor(diffInSeconds / 31557600));
  return getYearLabel(years);
}
