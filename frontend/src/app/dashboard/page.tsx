"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/auth";
import {
  getProjects,
  createProject,
  Project,
} from "@/services/projects";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

useEffect(() => {
  async function load() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Token ausente, redirecionando para login");
      router.replace("/login");
      return;
    }

    try {
      const me = await getMe();
      setUser(me);
      const projectList = await getProjects();
      setProjects(projectList);
    } catch (err: any) {
      console.error("Erro no load do dashboard:", err.message);
      localStorage.removeItem("token");
      router.replace("/login");
    }
  }

  load();
}, [router]);

  async function handleCreateProject() {
    if (!newProjectName) return;

    try {
      const project = await createProject({
        name: newProjectName,
        description: newProjectDescription,
      });

      setProjects((prev) => [...prev, project]);

      setNewProjectName("");
      setNewProjectDescription("");
    } catch (err: any) {
      alert(err.message || "Erro ao criar projeto");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.replace("/login");
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Dashboard</h1>

      {user && (
        <>
          <p>Bem-vindo, {user.name}</p>
          <button onClick={handleLogout}>Sair</button>
        </>
      )}

      <hr style={{ margin: "20px 0" }} />

      <h2>Seus Projetos</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Nome do projeto"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          style={{ display: "block", marginBottom: 10 }}
        />

        <textarea
          placeholder="Descrição do projeto"
          value={newProjectDescription}
          onChange={(e) => setNewProjectDescription(e.target.value)}
          style={{ display: "block", marginBottom: 10 }}
        />

        <button onClick={handleCreateProject}>
          Criar Projeto
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => router.push(`/projects/${project.id}`)}
            style={{
              padding: 15,
              border: "1px solid #ddd",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            <h3 style={{ margin: 0 }}>{project.name}</h3>
            <p style={{ margin: "5px 0 0 0", color: "#666" }}>
              {project.description || "Sem descrição"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}