import React from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  children,
}) => {
  return (
    <div className="form-group">
      <label className={`form-label ${required ? "required" : ""}`}>
        {label}
      </label>
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};
