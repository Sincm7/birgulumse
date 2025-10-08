import { useEffect, useMemo, useRef, useState } from 'react';

const listeners = new Set();

const emit = (payload) => {
  listeners.forEach((listener) => listener(payload));
};

const createToast = (type, message, options = {}) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  type,
  message,
  duration: options.duration ?? 4000
});

export const toast = {
  success(message, options) {
    emit(createToast('success', message, options));
  },
  error(message, options) {
    emit(createToast('error', message, options));
  }
};

const positionClasses = {
  'top-right': 'top-6 right-6 items-end',
  'top-left': 'top-6 left-6 items-start',
  'top-center': 'top-6 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-6 right-6 items-end',
  'bottom-left': 'bottom-6 left-6 items-start',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2 items-center'
};

const typeClasses = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-rose-600 text-white'
};

export function Toaster({ position = 'top-right' }) {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Map());

  useEffect(() => {
    const timeouts = timeoutsRef.current;

    const handleToast = (toastItem) => {
      setToasts((prev) => [...prev, toastItem]);

      if (toastItem.duration > 0) {
        const timeoutId = setTimeout(() => {
          setToasts((prev) => prev.filter((item) => item.id !== toastItem.id));
          timeouts.delete(toastItem.id);
        }, toastItem.duration);

        timeouts.set(toastItem.id, timeoutId);
      }
    };

    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      timeouts.clear();
    };
  }, []);

  const wrapperClasses = useMemo(
    () =>
      `pointer-events-none fixed z-50 flex flex-col gap-2 ${
        positionClasses[position] ?? positionClasses['top-right']
      }`,
    [position]
  );

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={wrapperClasses}>
      {toasts.map((toastItem) => (
        <div
          key={toastItem.id}
          className={`pointer-events-auto min-w-[220px] max-w-sm rounded-md px-4 py-3 text-sm shadow-lg ${
            typeClasses[toastItem.type] ?? typeClasses.success
          }`}
        >
          {toastItem.message}
        </div>
      ))}
    </div>
  );
}
