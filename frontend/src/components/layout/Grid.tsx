import React from "react";

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
  gap?: "2" | "3" | "4" | "6";
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 1,
  gap = "6",
  className = "",
}) => {
  const gridClass = cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-2" : "grid-cols-3";
  const gapClass = `gap-${gap}`;

  return (
    <div className={`grid ${gridClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};
