import { apiFetch } from "@/api/client";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  location?: { latitude: number; longitude: number } | null;
  photoUri?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export function getTodoService() {
  return {
    list: () => apiFetch<Todo[]>("/todos"),

    create: (payload: {
      title: string;
      completed?: boolean;
      latitude?: number;
      longitude?: number;
      photoUri?: string;
    }) =>
      apiFetch<Todo>("/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: payload.title,
          completed: payload.completed ?? false,
          location:
            payload.latitude != null && payload.longitude != null
              ? { latitude: payload.latitude, longitude: payload.longitude }
              : undefined,
          photoUri: payload.photoUri ?? undefined,
        }),
      }),

    patch: (
      id: string,
      payload: Partial<{
        title: string;
        completed: boolean;
        latitude: number;
        longitude: number;
        photoUri: string;
      }>
    ) =>
      apiFetch<Todo>(`/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(payload.title != null ? { title: payload.title } : {}),
          ...(payload.completed != null ? { completed: payload.completed } : {}),
          ...(payload.latitude != null && payload.longitude != null
            ? { location: { latitude: payload.latitude, longitude: payload.longitude } }
            : {}),
          ...(payload.photoUri != null ? { photoUri: payload.photoUri } : {}),
        }),
      }),

    remove: (id: string) =>
      apiFetch<void>(`/todos/${id}`, {
        method: "DELETE",
      }),
  };
}


