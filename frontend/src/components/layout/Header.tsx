import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  actions,
  showBackButton = false,
  onBack,
}) => {
  return (
    <header>
      <div className="container">
        <div className="header-content">
          <div className="flex flex-col">
            {showBackButton && (
              <button
                className="btn btn-outline btn-sm"
                onClick={onBack}
                style={{ marginBottom: "var(--spacing-2)" }}
              >
                ← Voltar
              </button>
            )}
            <h1 className="header-title">{title}</h1>
            {subtitle && <p className="text-muted">{subtitle}</p>}
          </div>
          {actions && <div className="header-actions">{actions}</div>}
        </div>
      </div>
    </header>
  );
};
