import { apiRequest } from "./api";

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export async function getProjects(): Promise<Project[]> {
  return apiRequest("/projects", {
    method: "GET",
  });
}

export async function createProject(data: {
  name: string;
  description?: string;
}) {
  return apiRequest("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}