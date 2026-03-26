"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/auth";
import {
  getProjects,
  createProject,
  Project,
} from "@/services/projects";
import { PageWrapper, Container, Header, Card, Grid, FormField, Button, Alert } from "@/components/layout";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!newProjectName) return;

    setError("");
    setIsLoading(true);

    try {
      const project = await createProject({
        name: newProjectName,
        description: newProjectDescription,
      });

      setProjects((prev) => [...prev, project]);
      setNewProjectName("");
      setNewProjectDescription("");
    } catch (err: any) {
      setError(err.message || "Erro ao criar projeto");
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.replace("/login");
  }

  return (
    <PageWrapper>
      <Header
        title="Dashboard"
        subtitle={user ? `Bem-vindo, ${user.name}` : "Carregando..."}
        actions={
          user && (
            <Button variant="danger" onClick={handleLogout}>
              Sair
            </Button>
          )
        }
      />

      <div className="page-content">
        <Container>
          <Grid cols={1} gap="6">
            {/* Criar Projeto */}
            <Card
              title="Criar Novo Projeto"
              subtitle="Adicione um novo projeto ao seu workspace"
            >
              {error && (
                <Alert
                  type="error"
                  message={error}
                  onClose={() => setError("")}
                />
              )}

              <form onSubmit={handleCreateProject}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
                  <FormField label="Nome do Projeto" required>
                    <input
                      type="text"
                      placeholder="Digite o nome do projeto"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      required
                    />
                  </FormField>

                  <FormField label="Descrição">
                    <textarea
                      placeholder="Descrição opcional do projeto"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                    />
                  </FormField>

                  <Button type="submit" fullWidth isLoading={isLoading}>
                    Criar Projeto
                  </Button>
                </div>
              </form>
            </Card>

            {/* Lista de Projetos */}
            <div>
              <h2>Seus Projetos</h2>
              {projects.length === 0 ? (
                <Card>
                  <p style={{ textAlign: "center", color: "var(--color-success)" }}>
                    Nenhum projeto criado ainda. Crie um novo projeto acima!
                  </p>
                </Card>
              ) : (
                <Grid cols={projects.length > 1 ? 2 : 1} gap="4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => router.push(`/projects/${project.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <Card
                        title={project.name}
                        subtitle={project.description || "Sem descrição"}
                      >
                      </Card>
                    </div>
                  ))}
                </Grid>
              )}
            </div>
          </Grid>
        </Container>
      </div>
    </PageWrapper>
  );
}