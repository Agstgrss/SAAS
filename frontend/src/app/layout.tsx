import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "SaaS Scrum",
  description: "Sistema Scrum estilo Jira",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "Arial", padding: 20 }}>
        {children}
      </body>
    </html>
  );
}