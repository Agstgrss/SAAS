"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/services/api";

type Task = {
  id: string;
  title: string;
  status: "TODO" | "DOING" | "DONE";
};

export default function ProjectBoard() {
  const { id } = useParams();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

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
  }, [id]);

  // 🔹 Criar nova tarefa
  async function handleCreateTask() {
    if (!newTaskTitle) return;

    try {
      const task = await apiRequest("/tasks", {
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
      alert(err.message);
    }
  }

  // 🔹 Separação por coluna
  const todo = tasks.filter((t) => t.status === "TODO");
  const doing = tasks.filter((t) => t.status === "DOING");
  const done = tasks.filter((t) => t.status === "DONE");

  return (
    <div style={{ padding: 20 }}>
      <h1>Scrum Board</h1>

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
        <Column title="TODO" tasks={todo} />
        <Column title="DOING" tasks={doing} />
        <Column title="DONE" tasks={done} />
      </div>
    </div>
  );
}

function Column({
  title,
  tasks,
}: {
  title: string;
  tasks: Task[];
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
          style={{
            background: "white",
            padding: 10,
            marginBottom: 10,
            borderRadius: 6,
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          {task.title}
        </div>
      ))}
    </div>
  );
}