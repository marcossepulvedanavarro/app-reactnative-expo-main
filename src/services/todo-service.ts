import { apiFetch } from "@/api/client";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt?: string;
  updatedAt?: string;
};


export function getTodoService() {
  return {
    list: () => apiFetch<any>("/todos"),
    create: (payload: { title: string; imageUrl?: string; latitude?: number; longitude?: number }) =>
      apiFetch<Todo>("/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    patch: (id: string, payload: Partial<Pick<Todo, "title" | "completed" | "imageUrl" | "latitude" | "longitude">>) =>
      apiFetch<Todo>(`/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    remove: (id: string) =>
      apiFetch<void>(`/todos/${id}`, {
        method: "DELETE",
      }),
  };
}