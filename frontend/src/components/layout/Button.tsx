import React from "react";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "success";
  size?: "sm" | "base" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "base",
  fullWidth = false,
  isLoading = false,
  children,
  disabled,
  ...props
}) => {
  const variantClass = variant ? `btn-${variant}` : "btn-primary";
  const sizeClass = size !== "base" ? `btn-${size}` : "";
  const widthClass = fullWidth ? "btn-full" : "";

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${widthClass}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Processando..." : children}
    </button>
  );
};
