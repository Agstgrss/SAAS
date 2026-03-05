"use client";

import { useRouter } from "next/navigation";

export default function ProjectNotFound() {
  const router = useRouter();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 20,
      }}
    >
      <h1 style={{ fontSize: 40, marginBottom: 10 }}>
        Projeto não encontrado
      </h1>

      <p style={{ marginBottom: 30, color: "#666" }}>
        O projeto que você está tentando acessar não existe
        ou não pertence à sua conta.
      </p>

      <button
        onClick={() => router.push("/dashboard")}
        style={{
          padding: "10px 20px",
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Voltar para o Dashboard
      </button>
    </div>
  );
}