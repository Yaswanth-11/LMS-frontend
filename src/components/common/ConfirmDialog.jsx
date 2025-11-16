import React, { useEffect, useRef } from "react";

const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  description = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary", // primary | danger | success
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (open) {
      confirmRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="modal fade show"
      tabIndex="-1"
      role="dialog"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">{title}</h5>
            {!loading && (
              <button
                type="button"
                className="btn-close"
                onClick={onCancel}
              ></button>
            )}
          </div>

          <div className="modal-body">{description}</div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              disabled={loading}
              onClick={onCancel}
            >
              {cancelLabel}
            </button>

            <button
              ref={confirmRef}
              className={`btn btn-${variant}`}
              disabled={loading}
              onClick={onConfirm}
            >
              {loading ? "Processing..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
