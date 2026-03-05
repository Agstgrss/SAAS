"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/services/auth";
import { FormCard, FormField, PageWrapper, Container, Alert } from "@/components/layout";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await registerUser({
        name,
        email,
        password,
        tenantId,
      });

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta");
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
            title="Criar Conta"
            subtitle="Preencha os dados abaixo para se registrar"
            onSubmit={handleRegister}
            submitButtonText="Registrar"
            isLoading={isLoading}
          >
            {error && (
              <Alert
                type="error"
                message={error}
                onClose={() => setError("")}
              />
            )}

            <FormField label="Nome" required>
              <input
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormField>

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
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormField>

            <FormField label="ID do Tenant" required>
              <input
                type="text"
                placeholder="Identificador único da sua organização"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                required
              />
            </FormField>

            <div style={{ marginTop: "var(--spacing-6)" }}>
              <p style={{ textAlign: "center", marginBottom: "var(--spacing-4)" }}>
                Já possui conta?{" "}
                <Link href="/login" style={{ fontWeight: "var(--font-weight-semibold)" }}>
                  Fazer login
                </Link>
              </p>
            </div>
          </FormCard>
        </Container>
      </div>
    </PageWrapper>
  );
}