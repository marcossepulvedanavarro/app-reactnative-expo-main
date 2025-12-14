import { Text, View, StyleSheet, TextInput, Alert, Image } from 'react-native'
import Button from './ui/button'
import { Accuracy, getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';
import { launchCameraAsync, requestCameraPermissionsAsync } from 'expo-image-picker';
import Title from './ui/title'
import { useState } from 'react';
import { Task } from '@/constants/types';
import { useAuth } from './context/auth-context';

interface NewTaskProps {
  onClose: () => void
  onTaskSave: (task: Task) => void;
}

export default function NewTask({ onClose, onTaskSave }: NewTaskProps) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [isCapturingPhoto, setIsCapturingPhoto] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const {user} = useAuth();

  async function handleTakePhoto() {
    if (isCapturingPhoto) return;

    try {
      setIsCapturingPhoto(true);

      const { status } = await requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert("Permiso denegado", "No se pudo obtener permiso para acceder a la cámara.");
        setIsCapturingPhoto(false);
        return;
      }

      const result = await launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        allowsEditing: false,
        exif: false
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }

    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert("Error", "No se pudo tomar la foto. Inténtalo de nuevo.");
    } finally {
      setIsCapturingPhoto(false);
    }
  }

  async function handleSaveTask() {
    if (isSaving) return;
    let location = null;

    try {
      setIsSaving(true);

      const { status } = await requestForegroundPermissionsAsync()

        if (status === 'granted') {
            const locationResult = await getCurrentPositionAsync({
                accuracy: Accuracy.Balanced
            });
            location = {
                latitude: locationResult.coords.latitude.toFixed(6),
                longitude: locationResult.coords.longitude.toFixed(6),
            }
        }
            
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskTitle,
        completed: false,
        photoUri: photoUri || undefined,
        coordinates: location || undefined,
        userId: user ? user.id : "",
      };
      onTaskSave(newTask);

    } catch (error) {
        console.error('Error saving task:', error);
        Alert.alert("Error", "No se pudo guardar la tarea. Inténtalo de nuevo.");
    } finally {
        setIsSaving(false);
    }
  }   

  return (
    <View style={styles.container}>
      <Title>
        Crea una nueva tarea
      </Title>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Titulo de la tarea</Text>
        <TextInput style={styles.input} value={taskTitle} onChangeText={setTaskTitle}  />
      </View>

      {photoUri ? (
        <View style={{ marginBottom: 16 }}>
          <Image
            source={{ uri: photoUri }}
            style={{ width: '100%', height: 200, borderRadius: 4 }}
            resizeMode="contain"
          />
        </View>
      ) : (
        <View style={styles.emptyPhotoContainer}>
          <Text style={styles.emptyPhotoIcon}>📸</Text>
          <Text style={styles.emptyPhotoText}>Toma una foto para tu tarea</Text>
        </View>
      )}

      <Button type="outline" text={photoUri ? "Volver a tomar Foto" : "Tomar Foto"} onPress={handleTakePhoto} />

      <View style={{ gap: 12, flexDirection: 'column', marginTop: 96 }}>
        <Button type="primary" text="Agregar Tarea" onPress={handleSaveTask} disabled={!taskTitle.trim() || isSaving} loading={isSaving} />
        <Button type="danger" text="Cancelar" onPress={onClose} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    marginTop: 16,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
  },
  emptyPhotoContainer: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#585555ff',
  },
  emptyPhotoIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyPhotoText: {
    color: '#ffffffaa',
  },
})
