import type { CreateTodoInput, Todo, TodosApi, UpdateTodoInput } from "@/hooks/useTodos";
import { getTodoService } from "@/services/todo-service";

export function buildTodosApi(): TodosApi {
  const svc = getTodoService();

  return {
    list: async (): Promise<Todo[]> => {
      return await svc.list();
    },

    create: async (payload: CreateTodoInput): Promise<Todo> => {
      return await svc.create({
        title: payload.title,
        completed: payload.completed,
        latitude: payload.latitude,
        longitude: payload.longitude,
        photoUri: payload.photoUri,
      });
    },

    update: async (id: string, payload: UpdateTodoInput): Promise<Todo> => {
      return await svc.patch(id, {
        title: payload.title,
        completed: payload.completed,
        latitude: payload.latitude,
        longitude: payload.longitude,
       
        photoUri: payload.photoUri ?? undefined,
      });
    },

    remove: async (id: string): Promise<void> => {
      await svc.remove(id);
    },
  };
}



