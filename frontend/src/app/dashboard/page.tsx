// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/services/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getMe();
        setUser(data);
      } catch {
        router.push("/login");
      }
    }

    loadUser();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>

      {user && (
        <>
          <p>Bem-vindo, {user.name}</p>
          <p>Email: {user.email}</p>
        </>
      )}

      <br />

      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}