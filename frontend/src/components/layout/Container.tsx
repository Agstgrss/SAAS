import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full";
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = "md",
  className = "",
}) => {
  const maxWidths = {
    sm: "600px",
    md: "1280px",
    lg: "1400px",
    full: "100%",
  };

  return (
    <div
      className={`container ${className}`}
      style={{
        maxWidth: maxWidths[size],
      }}
    >
      {children}
    </div>
  );
};
