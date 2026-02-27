import { apiRequest } from "@/services/api";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  tenantId: string;
}) {
  return apiRequest("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  return apiRequest("/session", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMe() {
  return apiRequest("/me", {
    method: "GET",
  });
}