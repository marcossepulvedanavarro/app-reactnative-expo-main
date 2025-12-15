import { useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, View } from "react-native";
import Button from "./ui/button";
import Title from "./ui/title";

import {
  Accuracy,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";

import {
  launchCameraAsync,
  requestCameraPermissionsAsync,
} from "expo-image-picker";

import { getImageService } from "@/services/image-service";
import { getTodoService } from "@/services/todo-service";

interface NewTaskProps {
  onClose: () => void;
  onSaved: () => void;
}

export default function NewTask({ onClose, onSaved }: NewTaskProps) {
  const todoService = getTodoService();
  const imageService = getImageService();

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleTakePhoto() {
    if (isCapturingPhoto || isSaving) return;

    try {
      setIsCapturingPhoto(true);

      const { status } = await requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Se requiere acceso a la cámara.");
        return;
      }

      const result = await launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.7,
        allowsEditing: false,
        exif: false,
      });

      if (!result.canceled && result.assets?.length) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
      Alert.alert("Error", "No se pudo tomar la foto. Inténtalo de nuevo.");
    } finally {
      setIsCapturingPhoto(false);
    }
  }

  async function handleSaveTask() {
    if (isSaving) return;

    const title = taskTitle.trim();
    if (!title) {
      Alert.alert("Validación", "Debes ingresar un título.");
      return;
    }

    
    if (!photoUri) {
      Alert.alert("Validación", "Debes tomar una foto para guardar la tarea.");
      return;
    }

    let latitude: number | undefined;
    let longitude: number | undefined;

    try {
      setIsSaving(true);

      
      try {
        const { status } = await requestForegroundPermissionsAsync();
        if (status === "granted") {
          const locationResult = await getCurrentPositionAsync({
            accuracy: Accuracy.Balanced,
          });
          latitude = Number(locationResult.coords.latitude.toFixed(6));
          longitude = Number(locationResult.coords.longitude.toFixed(6));
        }
      } catch {
        console.warn("Ubicación no disponible, se guarda sin coordenadas");
      }

     
      const uploadResp = await imageService.upload({
        uri: photoUri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      const photoUrl = uploadResp?.data?.url;
      if (!photoUrl) {
        Alert.alert("Error", "No se pudo obtener la URL de la imagen subida.");
        return;
      }

      
      await todoService.create({
        title,
        latitude,
        longitude,
        photoUri: photoUrl,
      });

      setTaskTitle("");
      setPhotoUri(null);

      onSaved();
      onClose();
    } catch (error: any) {
      console.error("Error saving task:", error);
      Alert.alert("Error", error?.message ?? "No se pudo guardar la tarea.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <Title>Crea una nueva tarea</Title>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Título de la tarea</Text>
        <TextInput
          style={styles.input}
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
      </View>

      {photoUri ? (
        <View style={{ marginBottom: 16, marginTop: 16 }}>
          <Image
            source={{ uri: photoUri }}
            style={{ width: "100%", height: 200, borderRadius: 4 }}
            resizeMode="contain"
          />
        </View>
      ) : (
        <View style={styles.emptyPhotoContainer}>
          <Text style={styles.emptyPhotoIcon}>📸</Text>
          <Text style={styles.emptyPhotoText}>Debes tomar una foto</Text>
        </View>
      )}

      <Button
        type="outline"
        text={photoUri ? "Volver a tomar Foto" : "Tomar Foto"}
        onPress={handleTakePhoto}
        disabled={isCapturingPhoto || isSaving}
      />

      <View style={{ gap: 12, flexDirection: "column", marginTop: 24 }}>
        <Button
          type="primary"
          text="Agregar Tarea"
          onPress={handleSaveTask}
          disabled={!taskTitle.trim() || isSaving}
          loading={isSaving}
        />
        <Button type="danger" text="Cancelar" onPress={onClose} disabled={isSaving} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputContainer: { marginTop: 16 },
  label: { marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
  },
  emptyPhotoContainer: {
    height: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#585555ff",
  },
  emptyPhotoIcon: { fontSize: 48, marginBottom: 8 },
  emptyPhotoText: { color: "#ffffffaa" },
});


