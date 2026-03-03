import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "SaaS Scrum",
  description: "Sistema Scrum estilo Jira - Gerenciamento de Projetos Ágil",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}