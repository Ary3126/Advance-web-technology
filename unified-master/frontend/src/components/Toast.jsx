import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${toast.type || 'info'}`}>
        <span>
          {toast.type === 'success' && '✅'}
          {toast.type === 'error' && '❌'}
          {toast.type === 'warning' && '⚠️'}
          {toast.type === 'info' && 'ℹ️'}
        </span>
        <div>
          {toast.title && <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{toast.title}</div>}
          <div>{toast.message}</div>
        </div>
      </div>
    </div>
  );
}

