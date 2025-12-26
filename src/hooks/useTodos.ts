import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  location?: { latitude: number; longitude: number } | null;
  photoUri?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateTodoInput = {
  title: string;
  completed?: boolean;
  latitude?: number;
  longitude?: number;
  photoUri?: string;
};

export type UpdateTodoInput = Partial<{
  title: string;
  completed: boolean;
  latitude: number;
  longitude: number;
  photoUri: string | null;
}>;

export type TodosApi = {
  list: () => Promise<Todo[]>;
  create: (payload: CreateTodoInput) => Promise<Todo>;
  update: (id: string, payload: UpdateTodoInput) => Promise<Todo>;
  remove: (id: string) => Promise<void>;
};

type UseTodosOptions = {
  api: TodosApi;
  autoFetch?: boolean;
};

function normalizeErrorMessage(err: unknown): string {
  if (!err) return "Error desconocido";
  if (typeof err === "string") return err;

  const anyErr = err as any;
  const status = anyErr?.response?.status ?? anyErr?.status;
  const msg =
    anyErr?.response?.data?.message ??
    anyErr?.response?.data?.error ??
    anyErr?.message;

  if (status === 401) return "No autorizado (401). Inicia sesión nuevamente.";
  if (status === 403) return "Acceso prohibido (403).";
  if (status >= 500) return "Error del servidor. Intenta nuevamente.";

  return msg ?? "Ocurrió un error al procesar la solicitud.";
}

export function useTodos({ api, autoFetch = true }: UseTodosOptions) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const setSafeState = useCallback((setter: () => void) => {
    if (mountedRef.current) setter();
  }, []);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.list();
      setSafeState(() => setTodos(Array.isArray(data) ? data : []));
    } catch (e) {
      setSafeState(() => setError(normalizeErrorMessage(e)));
    } finally {
      setSafeState(() => setLoading(false));
    }
  }, [api, setSafeState]);

  useEffect(() => {
    if (autoFetch) fetchTodos();
  }, [autoFetch, fetchTodos]);

  const createTodo = useCallback(
    async (payload: CreateTodoInput) => {
      setLoading(true);
      setError(null);
      try {
        const created = await api.create(payload);
        setSafeState(() => setTodos((prev) => [created, ...prev]));
        return created;
      } catch (e) {
        setSafeState(() => setError(normalizeErrorMessage(e)));
        throw e;
      } finally {
        setSafeState(() => setLoading(false));
      }
    },
    [api, setSafeState]
  );

  const updateTodo = useCallback(
    async (id: string, payload: UpdateTodoInput) => {
      setLoading(true);
      setError(null);


      const snapshot = todos;

      setSafeState(() =>
        setTodos((prev) =>
          prev.map((t) => {
            if (t.id !== id) return t;

            const nextLocation =
              payload.latitude != null && payload.longitude != null
                ? { latitude: payload.latitude, longitude: payload.longitude }
                : t.location ?? null;

            return {
              ...t,
              ...payload,
              location: nextLocation,
              photoUri:
                payload.photoUri !== undefined ? payload.photoUri : t.photoUri ?? null,
            };
          })
        )
      );

      try {
        const updated = await api.update(id, payload);
        setSafeState(() =>
          setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
        );
        return updated;
      } catch (e) {
        setSafeState(() => setTodos(snapshot));
        setSafeState(() => setError(normalizeErrorMessage(e)));
        throw e;
      } finally {
        setSafeState(() => setLoading(false));
      }
    },
    [api, setSafeState, todos]
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      const current = todos.find((t) => t.id === id);
      if (!current) return;
      return updateTodo(id, { completed: !current.completed });
    },
    [todos, updateTodo]
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      const snapshot = todos;
      setSafeState(() => setTodos((prev) => prev.filter((t) => t.id !== id)));

      try {
        await api.remove(id);
      } catch (e) {
        setSafeState(() => setTodos(snapshot));
        setSafeState(() => setError(normalizeErrorMessage(e)));
        throw e;
      } finally {
        setSafeState(() => setLoading(false));
      }
    },
    [api, setSafeState, todos]
  );

  const clearError = useCallback(() => setError(null), []);

  const stats = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((t) => t.completed).length;
    return { total, done, pending: total - done };
  }, [todos]);

  return {
    todos,
    stats,
    loading,
    error,
    clearError,
    fetchTodos,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  };
}

