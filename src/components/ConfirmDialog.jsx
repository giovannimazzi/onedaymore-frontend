import { useEffect, useRef } from "react";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Conferma",
  cancelLabel = "Annulla",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
}) {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => confirmBtnRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="odm-confirm-backdrop"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="odm-confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="odm-confirm-title"
        aria-describedby={message ? "odm-confirm-desc" : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="odm-confirm-title" className="odm-confirm-dialog__title">
          {title}
        </h2>
        {message ? (
          <p id="odm-confirm-desc" className="odm-confirm-dialog__message">
            {message}
          </p>
        ) : null}
        <div className="odm-confirm-dialog__actions">
          <button
            type="button"
            className="odm-confirm-dialog__btn odm-confirm-dialog__btn--ghost"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            className={`odm-confirm-dialog__btn${confirmVariant === "danger" ? " odm-confirm-dialog__btn--danger" : " odm-confirm-dialog__btn--gold"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
