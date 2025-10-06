import { useState } from 'react';

export function PhoneReveal({ phone }) {
  const [visible, setVisible] = useState(false);

  if (!phone) return <p className="text-sm text-brand-600">Telefon bilgisi paylaşılmadı.</p>;

  const masked = phone.length > 5 ? `${phone.slice(0, 3)} *** ** ${phone.slice(-2)}` : phone;

  return (
    <div className="flex items-center gap-3">
      <p className="text-lg font-semibold text-brand-800">{visible ? phone : masked}</p>
      {!visible && (
        <button
          onClick={() => setVisible(true)}
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
        >
          Telefonu Göster
        </button>
      )}
    </div>
  );
}
