// src/components/Toast.jsx
import React, { useEffect } from 'react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-emerald-600' : 'bg-red-600';

  return (
    <div className={`fixed bottom-5 right-5 ${bgColor} text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50 animate-fade-in`}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}