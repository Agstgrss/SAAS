"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/services/api";
import { PageWrapper, Container, Header, Card, Button, FormField, Alert } from "@/components/layout";
import { formatDate } from "@/utils/date";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "DOING" | "DONE";
  dueDate?: string;
  createdAt: string;
};

export default function ProjectBoard() {
  const { id } = useParams();
  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [error, setError] = useState("");
  const [isLoadingTask, setIsLoadingTask] = useState(false);

  function handleBackToDashboard() {
    router.push("/dashboard");
  }

  function handleLogout() {
    localStorage.clear();
    router.replace("/");
  }

  useEffect(() => {
    async function load() {
      try {
        const projects = await apiRequest("/projects", {
          method: "GET",
        });

        const project = projects.find(
          (project: any) => project.id === id
        );

        if (!project) {
          router.replace("/projects/project-not-found");
          return;
        }

        setProjectName(project.name);

        const data = await apiRequest(
          `/tasks?projectId=${id}`,
          { method: "GET" }
        );

        setTasks(data);
      } catch {
        router.replace("/dashboard");
      }
    }

    if (id) load();
  }, [id, router]);

  async function handleCreateTask() {
    if (!newTaskTitle) return;

    setError("");
    setIsLoadingTask(true);

    try {
      const task: Task = await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: newTaskTitle,
          projectId: id,
          status: "TODO",
        }),
      });

      setTasks((prev) => [task, ...prev]);
      setNewTaskTitle("");
      setSelectedTask(task);
    } catch (err: any) {
      setError(err.message || "Erro ao criar tarefa");
    } finally {
      setIsLoadingTask(false);
    }
  }

  const todo = tasks.filter((t) => t.status === "TODO");
  const doing = tasks.filter((t) => t.status === "DOING");
  const done = tasks.filter((t) => t.status === "DONE");

  return (
    <PageWrapper>
      <Header
        title={projectName || "Carregando..."}
        subtitle="Scrum Board"
        actions={
          <div style={{ display: "flex", gap: "var(--spacing-3)" }}>
            <Button variant="outline" onClick={handleBackToDashboard}>
              ← Dashboard
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        }
      />

      <div className="page-content">
        <Container>
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError("")}
            />
          )}

          <Card
            title="Nova Tarefa"
            subtitle="Crie uma nova tarefa para este projeto"
          >
            <div style={{ display: "flex", gap: "var(--spacing-3)" }}>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Título da tarefa"
                style={{ flex: 1 }}
              />
              <Button
                onClick={handleCreateTask}
                isLoading={isLoadingTask}
                style={{ alignSelf: "flex-start" }}
              >
                Criar
              </Button>
            </div>
          </Card>

          <div style={{ marginTop: "var(--spacing-8)" }}>
            <h2>Tarefas</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "var(--spacing-6)",
              marginTop: "var(--spacing-6)",
            }}>
              <Column title="📋 TODO" tasks={todo} onTaskClick={setSelectedTask} />
              <Column title="⚙️ DOING" tasks={doing} onTaskClick={setSelectedTask} />
              <Column title="✅ DONE" tasks={done} onTaskClick={setSelectedTask} />
            </div>
          </div>
        </Container>
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask: Task) => {
            setTasks((prev) =>
              prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            );
            setSelectedTask(updatedTask);
          }}
          onDelete={(taskId: string) => {
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
            setSelectedTask(null);
          }}
        />
      )}
    </PageWrapper>
  );
}

function Column({
  title,
  tasks,
  onTaskClick,
}: {
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}) {
  return (
    <div style={{
      backgroundColor: "var(--color-gray-100)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--spacing-4)",
    }}>
      <h3 style={{ marginBottom: "var(--spacing-4)" }}>{title}</h3>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-3)",
      }}>
        {tasks.length === 0 ? (
          <p style={{
            textAlign: "center",
            color: "var(--color-gray-400)",
            padding: "var(--spacing-4)",
          }}>
            Nenhuma tarefa
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              style={{
                backgroundColor: "var(--color-white)",
                padding: "var(--spacing-3)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                border: "2px solid transparent",
                transition: "all var(--transition-fast)",
              }}
              className="card"
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "var(--color-primary)";
                el.style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "transparent";
                el.style.boxShadow = "var(--shadow-sm)";
              }}
            >
              <p style={{ margin: 0, fontWeight: "var(--font-weight-medium)" }}>
                {task.title}
              </p>
              {task.dueDate && (
                <p style={{
                  margin: "var(--spacing-2) 0 0 0",
                  fontSize: "var(--font-size-sm)",
                  color: "var(--color-gray-500)",
                }}>
                  📅 {formatDate(task.dueDate)}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TaskModal({
  task,
  onClose,
  onUpdate,
  onDelete,
}: {
  task: Task;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState<Task["status"]>(task.status);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.split("T")[0] : ""
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");

    try {
      const updated: Task = await apiRequest(`/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title,
          description,
          status,
          dueDate: dueDate || null,
        }),
      });

      onUpdate(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    setDeleting(true);
    setError("");

    try {
      await apiRequest(`/tasks/${task.id}`, {
        method: "DELETE",
      });

      onDelete(task.id);
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao excluir");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Editar Tarefa</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError("")}
            />
          )}

          <FormField label="Título" required>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormField>

          <FormField label="Descrição">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da tarefa (opcional)"
            />
          </FormField>

          <FormField label="Status" required>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Task["status"])}
            >
              <option value="TODO">📋 TODO</option>
              <option value="DOING">⚙️ DOING</option>
              <option value="DONE">✅ DONE</option>
            </select>
          </FormField>

          <FormField label="Prazo (Data)">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </FormField>

          <div style={{
            backgroundColor: "var(--color-gray-100)",
            padding: "var(--spacing-4)",
            borderRadius: "var(--radius-lg)",
            marginBottom: "var(--spacing-6)",
          }}>
            <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--color-gray-600)" }}>
              <strong>Criado em:</strong> {new Date(task.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={deleting}
          >
            Excluir
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={saving}
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}