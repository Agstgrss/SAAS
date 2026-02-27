"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/services/auth";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantId, setTenantId] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    try {
      await registerUser({
        name,
        email,
        password,
        tenantId,
      });

      alert("Usuário criado!");
      router.push("/login");
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h1>Registrar</h1>

      <form onSubmit={handleRegister}>
        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Tenant ID"
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
        />
        <br /><br />

        <button type="submit">Registrar</button>
      </form>

      <br />

      <Link href="/login">
        <button>Ir para Login</button>
      </Link>
    </div>
  );
}