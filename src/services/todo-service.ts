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


type ApiResponse<T> = { data: T };

export function getTodoService() {
  return {

    list: async () => {
      const resp = await apiFetch<ApiResponse<Todo[]>>("/todos");
      return resp.data;
    },

    create: async (payload: {
      title: string;
      completed?: boolean;
      latitude?: number;
      longitude?: number;
      photoUri?: string;
    }) => {
      const resp = await apiFetch<ApiResponse<Todo>>("/todos", {
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
      });

      return resp.data;
    },

    patch: async (
      id: string,
      payload: Partial<{
        title: string;
        completed: boolean;
        latitude: number;
        longitude: number;
        photoUri: string;
      }>
    ) => {
      const resp = await apiFetch<ApiResponse<Todo>>(`/todos/${id}`, {
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
      });

      return resp.data;
    },

    remove: (id: string) =>
      apiFetch<void>(`/todos/${id}`, {
        method: "DELETE",
      }),
  };
}




