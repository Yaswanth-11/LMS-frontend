import React, { useEffect, useState } from "react";

const toastBus = new EventTarget();
let toastId = 1;

export function addToast(message, variant = "primary", timeout = 3000) {
  const id = toastId++;
  toastBus.dispatchEvent(
    new CustomEvent("add", {
      detail: { id, message, variant, timeout },
    })
  );
}

export default function ToastsContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const addHandler = (e) => {
      setToasts((prev) => [...prev, e.detail]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== e.detail.id));
      }, e.detail.timeout);
    };

    toastBus.addEventListener("add", addHandler);
    return () => toastBus.removeEventListener("add", addHandler);
  }, []);

  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 2000 }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast align-items-center text-bg-${toast.variant} show mb-2`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
}
