"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/services/api";

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

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

      const projectExists = projects.some(
        (project: any) => project.id === id
      );

      if (!projectExists) {
        router.replace("/projects/project-not-found");
        return;
      }

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

      // 🔥 abre o modal automaticamente
      setSelectedTask(task);
    } catch (err: any) {
      alert(err.message || "Erro ao criar tarefa");
    }
  }

  const todo = tasks.filter((t) => t.status === "TODO");
  const doing = tasks.filter((t) => t.status === "DOING");
  const done = tasks.filter((t) => t.status === "DONE");

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ margin: 0 }}>Scrum Board</h1>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleBackToDashboard}>
            ← Dashboard
          </button>
          <button
            onClick={handleLogout}
            style={{ background: "#ff4d4f", color: "white" }}
          >
            Sair
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Nova tarefa"
        />
        <button onClick={handleCreateTask}>
          Criar
        </button>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <Column title="TODO" tasks={todo} onTaskClick={setSelectedTask} />
        <Column title="DOING" tasks={doing} onTaskClick={setSelectedTask} />
        <Column title="DONE" tasks={done} onTaskClick={setSelectedTask} />
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
    </div>
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
    <div style={{ flex: 1, background: "#f4f4f4", padding: 15 }}>
      <h2>{title}</h2>

      {tasks.map((task) => (
        <div
          key={task.id}
          onClick={() => onTaskClick(task)}
          style={{
            background: "white",
            padding: 10,
            marginBottom: 10,
            cursor: "pointer",
          }}
        >
          {task.title}
        </div>
      ))}
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

  async function handleSave() {
    setSaving(true);

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
      alert("Tarefa atualizada com sucesso!");
    } catch {
      alert("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    setDeleting(true);

    try {
      await apiRequest(`/tasks/${task.id}`, {
        method: "DELETE",
      });

      onDelete(task.id);
      onClose();
    } catch {
      alert("Erro ao excluir");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={closeStyle}>
          X
        </button>

        <h2>Editar Tarefa</h2>

        <label>Título</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Status</label>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as Task["status"])
          }
        >
          <option value="TODO">TODO</option>
          <option value="DOING">DOING</option>
          <option value="DONE">DONE</option>
        </select>

        <label>Prazo</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <p>
          <strong>Criado em:</strong>{" "}
          {new Date(task.createdAt).toLocaleString()}
        </p>

        <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{ background: "#ff4d4f", color: "white" }}
          >
            {deleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  background: "#fff",
  padding: 24,
  borderRadius: 8,
  width: 450,
  maxWidth: "90vw",
  position: "relative",
};

const closeStyle: React.CSSProperties = {
  position: "absolute",
  top: 10,
  right: 10,
  cursor: "pointer",
};