import { useEffect } from 'react';

/**
 * Accessible Confirmation Modal Component
 * Intercepts destructive actions (e.g. Delete Task) to ensure user intentionality.
 */
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', isDanger = true }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-container animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="modal-icon-badge">
            {isDanger ? '⚠️' : '❓'}
          </div>
          <h3 id="modal-title" className="modal-heading">
            {title || 'Confirm Action'}
          </h3>
        </div>

        <p className="modal-message">
          {message || 'Are you sure you want to proceed? This action cannot be undone.'}
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="btn-modal btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn-modal ${isDanger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
