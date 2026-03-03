import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  fullHeight?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  fullHeight = true,
}) => {
  return (
    <div
      className="page-wrapper"
      style={{
        minHeight: fullHeight ? "100vh" : "auto",
      }}
    >
      {children}
    </div>
  );
};
