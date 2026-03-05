export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  tenantId: string;
  status: "TODO" | "DOING" | "DONE";
  assignedToId?: string;
  dueDate?: string;
  createdAt: string;
}