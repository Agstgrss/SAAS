"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/services/auth";
import { FormCard, FormField, Button, PageWrapper, Container, Alert } from "@/components/layout";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { token } = await loginUser({ email, password });

      localStorage.setItem("token", token);

      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageWrapper>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "var(--spacing-4)",
        backgroundColor: "var(--color-gray-50)",
      }}>
        <Container size="sm">
          <FormCard
            title="SaaS Scrum"
            subtitle="Faça login na sua conta"
            onSubmit={handleLogin}
            submitButtonText="Entrar"
            isLoading={isLoading}
          >
            {error && (
              <Alert
                type="error"
                message={error}
                onClose={() => setError("")}
              />
            )}

            <FormField label="Email" required>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Senha" required>
              <input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormField>

            <div style={{ marginTop: "var(--spacing-6)" }}>
              <p style={{ textAlign: "center", marginBottom: "var(--spacing-4)" }}>
                Não possui conta?{" "}
                <Link href="/register" style={{ fontWeight: "var(--font-weight-semibold)" }}>
                  Criar conta
                </Link>
              </p>
            </div>
          </FormCard>
        </Container>
      </div>
    </PageWrapper>
  );
}