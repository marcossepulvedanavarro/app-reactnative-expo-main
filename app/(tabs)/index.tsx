import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import NewTask from "@/components/new-task";
import Button from "@/components/ui/button";

import { buildTodosApi } from "@/hooks/todos-api";
import { Todo, useTodos } from "@/hooks/useTodos";

export default function TodosScreen() {

  const api = useMemo(() => buildTodosApi(), []);


  const {
    todos,
    loading,
    error,
    clearError,
    fetchTodos,
    toggleTodo,
    deleteTodo,
  } = useTodos({ api });


  const [showNewTask, setShowNewTask] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);


  useEffect(() => {
    if (!error) return;
    Alert.alert("Error", error, [{ text: "OK", onPress: clearError }]);
  }, [error, clearError]);

  const toggleCompleted = async (todo: Todo) => {
    if (busyId) return;
    setBusyId(todo.id);

    try {
      await toggleTodo(todo.id);
 
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo actualizar la tarea");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = (todo: Todo) => {
    Alert.alert("Eliminar tarea", `¿Seguro que deseas eliminar "${todo.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          if (busyId) return;
          setBusyId(todo.id);

          try {
            await deleteTodo(todo.id);
          
          } catch (e: any) {
            Alert.alert("Error", e?.message ?? "No se pudo eliminar la tarea");
          } finally {
            setBusyId(null);
          }
        },
      },
    ]);
  };

  if (loading && todos.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Cargando tareas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      

      <Button text="Nueva tarea" onPress={() => setShowNewTask(true)} type="primary" />

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.muted}>No hay tareas aún.</Text>}
        contentContainerStyle={{ gap: 10, paddingTop: 10 }}
        onRefresh={fetchTodos}
        refreshing={loading && todos.length > 0}
        renderItem={({ item }) => {
          const isBusy = busyId === item.id;

          return (
            <Pressable
              onPress={() => toggleCompleted(item)}
              disabled={!!busyId}
              style={[styles.row, isBusy && styles.rowBusy]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, item.completed && styles.done]}>
                  {item.completed ? "✅ " : "⬜ "} {item.title}
                </Text>

                {item.location?.latitude != null && item.location?.longitude != null ? (
                  <Text style={styles.meta}>
                    📍 {item.location.latitude}, {item.location.longitude}
                  </Text>
                ) : null}

                {item.photoUri ? (
                  <Image source={{ uri: item.photoUri }} style={styles.todoImage} />
                ) : null}

                {isBusy ? <Text style={styles.meta}>Procesando...</Text> : null}
              </View>

              <View style={styles.actions}>
                <Button
                  type="outline"
                  text="Eliminar"
                  onPress={() => confirmDelete(item)}
                  disabled={!!busyId}
                  style={styles.deleteBtn}
                />
              </View>
            </Pressable>
          );
        }}
      />

      <Modal visible={showNewTask} animationType="slide">
        <View style={styles.modal}>
         
          <NewTask
            onClose={() => setShowNewTask(false)}
            onSaved={async () => {
              setShowNewTask(false);
              await fetchTodos();
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },

  row: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  rowBusy: { opacity: 0.6 },

  title: { fontSize: 16, fontWeight: "600" },
  done: { textDecorationLine: "line-through", opacity: 0.7 },

  meta: { marginTop: 6, color: "#666", fontSize: 12 },
  muted: { color: "#666" },
  err: { color: "crimson" },

  todoImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginTop: 10,
  },

  actions: {
    width: 96,
    justifyContent: "center",
  },

  deleteBtn: {
    height: 36,
    borderRadius: 8,
  },

  modal: { flex: 1, padding: 16 },
});






