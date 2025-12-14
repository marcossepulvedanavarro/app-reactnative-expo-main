import { getTodoService, Todo } from "@/services/todo-service";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

function normalizeTodos(resp: any): Todo[] {
  // Algunos backends devuelven Todo[] y otros { data: Todo[] }
  if (Array.isArray(resp)) return resp;
  if (Array.isArray(resp?.data)) return resp.data;
  return [];
}

export default function TodosScreen() {
  const todoService = getTodoService();

  const [items, setItems] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setErr(null);
    setLoading(true);
    try {
      const resp = await todoService.list();
      setItems(normalizeTodos(resp));
    } catch (e: any) {
      setErr(e?.message ?? "No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Cargando tareas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!!err && <Text style={styles.err}>{err}</Text>}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.muted}>No hay tareas aún.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={[styles.title, item.completed && styles.done]}>
              {item.completed ? "✅ " : "⬜ "} {item.title}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  row: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
  },
  title: { fontSize: 16 },
  done: { textDecorationLine: "line-through", opacity: 0.6 },
  muted: { color: "#666" },
  err: { color: "crimson" },
});
