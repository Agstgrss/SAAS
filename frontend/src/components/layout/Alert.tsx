import React from "react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
}) => {
  return (
    <div className={`alert alert-${type}`}>
      <div style={{ flex: 1 }}>
        {title && <strong>{title}</strong>}
        <p style={{ margin: title ? "var(--spacing-2) 0 0 0" : "0" }}>
          {message}
        </p>
      </div>
      {onClose && (
        <button
          className="modal-close"
          onClick={onClose}
          style={{ padding: 0 }}
        >
          ✕
        </button>
      )}
    </div>
  );
};
