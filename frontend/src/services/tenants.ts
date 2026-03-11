import { apiRequest } from "@/services/api";

export interface Tenant {
  id: string;
  name: string;
}

export async function getTenants(): Promise<Tenant[]> {
  return apiRequest("/tenants", {
    method: "GET",
  });
}
