"use client";

import { Task } from "@/types/task";

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
}

export function TaskModal({ task, onClose }: TaskModalProps) {
  if (!task) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeStyle}>
          X
        </button>

        <h2>{task.title}</h2>

        <p><strong>Status:</strong> {task.status}</p>

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
          {new Date(task.createdAt).toLocaleDateString()}
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
  width: 400,
  position: "relative",
};

const closeStyle: React.CSSProperties = {
  position: "absolute",
  top: 10,
  right: 10,
  cursor: "pointer",
};