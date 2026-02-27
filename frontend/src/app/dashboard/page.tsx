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

  useEffect(() => {
    async function load() {
      try {
        const me = await getMe();
        setUser(me);

        const projectList = await getProjects();
        setProjects(projectList);
      } catch {
        router.replace("/login");
      }
    }

    load();
  }, []);

  async function handleCreateProject() {
    if (!newProjectName) return;

    try {
      const project = await createProject({
        name: newProjectName,
      });

      setProjects((prev) => [...prev, project]);
      setNewProjectName("");
    } catch (err: any) {
      alert(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.replace("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>

      {user && (
        <>
          <p>Bem-vindo, {user.name}</p>
          <button onClick={handleLogout}>Sair</button>
        </>
      )}

      <hr />

      <h2>Seus Projetos</h2>

      <input
        placeholder="Nome do projeto"
        value={newProjectName}
        onChange={(e) => setNewProjectName(e.target.value)}
      />
      <button onClick={handleCreateProject}>
        Criar Projeto
      </button>

      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            style={{ cursor: "pointer", marginTop: 10 }}
            onClick={() => router.push(`/projects/${project.id}`)}
          >
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
}