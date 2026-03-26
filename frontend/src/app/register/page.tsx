"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/services/auth";
import { getTenants, type Tenant } from "@/services/tenants";
import { FormCard, FormField, PageWrapper, Container, Alert } from "@/components/layout";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [tenantsError, setTenantsError] = useState("");

  useEffect(() => {
    async function loadTenants() {
      try {
        console.log("Carregando tenants...");
        setTenantsLoading(true);
        const data = await getTenants();
        setTenants(data);
      } catch (err: any) {
        console.log("erro tenants...");
        setTenantsError(err.message || "Erro ao carregar tenants");
      } finally {
        setTenantsLoading(false);
      }
    }

    loadTenants();
  }, []);

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
        backgroundColor: "var(--color-success)",
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

            {tenantsError && (
              <Alert
                type="error"
                message={tenantsError}
                onClose={() => setTenantsError("")}
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

            <FormField label="Organização" required>
              <select
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                disabled={tenantsLoading || tenants.length === 0}
                required
                style={{
                  width: "100%",
                  padding: "var(--spacing-2) var(--spacing-3)",
                  border: "1px solid var(--color-gray-300)",
                  borderRadius: "var(--border-radius-md)",
                  fontSize: "var(--font-size-base)",
                  cursor: tenantsLoading ? "not-allowed" : "pointer",
                  opacity: tenantsLoading ? 0.6 : 1,
                }}
              >
                <option value="">
                  {tenantsLoading ? "Carregando organizações..." : "Selecione uma organização"}
                </option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
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
