import React from "react";

interface FormCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const FormCard: React.FC<FormCardProps> = ({
  title,
  subtitle,
  children,
  onSubmit,
  submitButtonText = "Enviar",
  cancelButtonText = "Cancelar",
  onCancel,
  isLoading = false,
}) => {
  return (
    <div
      className="card"
      style={{
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <div
        className="card-header"
        style={{
          textAlign: "center",
          marginBottom: "var(--spacing-4)",
        }}
      >
        <h2
          className="card-title"
          style={{
            marginBottom: "var(--spacing-2)",
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p className="text-muted">
            {subtitle}
          </p>
        )}
      </div>

      <form onSubmit={onSubmit}>
        <div className="card-body">{children}</div>

        <div
          className="card-footer"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "var(--spacing-2)",
          }}
        >
          {onCancel && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelButtonText}
            </button>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};