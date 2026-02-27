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

  // 🔹 Navegação
  function handleBackToDashboard() {
    router.push("/dashboard");
  }

  function handleLogout() {
    localStorage.clear();
    router.replace("/");
  }

  // 🔹 Carrega tarefas
  useEffect(() => {
    async function load() {
      try {
        const data = await apiRequest(
          `/tasks?projectId=${id}`,
          { method: "GET" }
        );
        setTasks(data);
      } catch (err) {
        console.error(err);
        router.replace("/dashboard");
      }
    }

    if (id) load();
  }, [id, router]);

  // 🔹 Criar nova tarefa
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
    } catch (err: any) {
      alert(err.message || "Erro ao criar tarefa");
    }
  }

  // 🔹 Separação por coluna
  const todo = tasks.filter((t) => t.status === "TODO");
  const doing = tasks.filter((t) => t.status === "DOING");
  const done = tasks.filter((t) => t.status === "DONE");

  return (
    <div style={{ padding: 20 }}>
      {/* 🔥 Header com navegação */}
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
          <button
            onClick={handleBackToDashboard}
            style={{
              padding: "6px 12px",
              borderRadius: 4,
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            ← Dashboard
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: "6px 12px",
              borderRadius: 4,
              border: "none",
              background: "#ff4d4f",
              color: "white",
              cursor: "pointer",
            }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* Criar tarefa */}
      <div style={{ marginBottom: 20 }}>
        <input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Nova tarefa"
          style={{ padding: 8, marginRight: 10 }}
        />
        <button onClick={handleCreateTask}>
          Criar
        </button>
      </div>

      {/* Colunas */}
      <div style={{ display: "flex", gap: 20 }}>
        <Column title="TODO" tasks={todo} onTaskClick={setSelectedTask} />
        <Column title="DOING" tasks={doing} onTaskClick={setSelectedTask} />
        <Column title="DONE" tasks={done} onTaskClick={setSelectedTask} />
      </div>

      {/* Modal */}
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
    <div
      style={{
        flex: 1,
        background: "#f4f4f4",
        padding: 15,
        borderRadius: 8,
        minHeight: 400,
      }}
    >
      <h2>{title}</h2>

      {tasks.map((task) => (
        <div
          key={task.id}
          onClick={() => onTaskClick(task)}
          style={{
            background: "white",
            padding: 10,
            marginBottom: 10,
            borderRadius: 6,
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
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
  const [status, setStatus] = useState<Task["status"]>(task.status);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleStatusChange(newStatus: Task["status"]) {
    if (newStatus === status) return;

    setStatus(newStatus);
    setSaving(true);

    try {
      const updated: Task = await apiRequest(`/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      onUpdate(updated);
    } catch {
      alert("Erro ao atualizar status");
      setStatus(task.status);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmDelete = confirm("Tem certeza que deseja excluir essa tarefa?");
    if (!confirmDelete) return;

    setDeleting(true);

    try {
      await apiRequest(`/tasks/${task.id}`, {
        method: "DELETE",
      });

      onDelete(task.id);
      onClose();
    } catch {
      alert("Erro ao excluir tarefa");
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

        <h2 style={{ marginTop: 0 }}>{task.title}</h2>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <label style={{ marginRight: 8, fontSize: 14 }}>Status:</label>
            <select
              value={status}
              onChange={(e) =>
                handleStatusChange(e.target.value as Task["status"])
              }
              disabled={saving}
            >
              <option value="TODO">TODO</option>
              <option value="DOING">DOING</option>
              <option value="DONE">DONE</option>
            </select>
            {saving && (
              <span style={{ marginLeft: 8, fontSize: 12 }}>
                Salvando...
              </span>
            )}
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              background: "#ff4d4f",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {deleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>

        <p>
          <strong>Descrição:</strong><br />
          {task.description || "Sem descrição"}
        </p>

        <p>
          <strong>Prazo:</strong>{" "}
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "Sem prazo"}
        </p>

        <p>
          <strong>Criado em:</strong>{" "}
          {new Date(task.createdAt).toLocaleString()}
        </p>
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
  width: 420,
  maxWidth: "90vw",
  position: "relative",
  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
};

const closeStyle: React.CSSProperties = {
  position: "absolute",
  top: 10,
  right: 10,
  cursor: "pointer",
};