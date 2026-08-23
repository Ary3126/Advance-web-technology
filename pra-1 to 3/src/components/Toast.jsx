import { useEffect } from 'react';

/**
 * Toast Notification Component
 * Displays floating feedback alerts for success, error, and informational messages.
 * Automatically dismisses after `duration` ms.
 */
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isSuccess = toast.type === 'success';

  return (
    <div className={`toast-banner toast-${toast.type || 'info'} animate-slideInRight`}>
      <div className="toast-icon">
        {isSuccess && '✅'}
        {isError && '❌'}
        {!isSuccess && !isError && 'ℹ️'}
      </div>
      <div className="toast-content">
        {toast.title && <strong className="toast-title">{toast.title}</strong>}
        <p className="toast-message">{toast.message}</p>
      </div>
      <button
        type="button"
        className="toast-close-btn"
        onClick={onClose}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;
