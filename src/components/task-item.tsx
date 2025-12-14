import { Task } from '@/constants/types';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './ui/icon-symbol';

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}  

export default function TaskItem({ task, onToggle, onRemove }: TaskItemProps) {
  return (
  <View style={styles.container}>
    <TouchableOpacity 
      style={[styles.circle, task.completed && styles.completedCircle]} 
      onPress={() => onToggle(task.id)} 
    />
    <View>
      {task.photoUri && (
        <Image
          source={{ uri: task.photoUri }}
          style={{ width: 50, height: 50, borderRadius: 4, marginRight: 8 }}
          resizeMode="cover"
        />  
      )}
    </View>
    <View>
      <Text style={[styles.title, task.completed && styles.completedTitle]}>
        {task.title}
      </Text>
      {task.coordinates && (
        <Text style={{ fontSize: 12, color: '#666' }}>
          📍 Lat: {task.coordinates.latitude}, Lon: {task.coordinates.longitude}
        </Text>
      )}
    </View>
      <TouchableOpacity onPress={() => onRemove(task.id)} style={styles.removeButton}>
        <IconSymbol name="trash.circle" size={20} color="#ff0000" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 8, 
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    padding: 2,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: 'transparent',
    marginRight: 12,
  },
  completedCircle: {
    backgroundColor: '#000',
  },
  title: {
    fontSize: 16,
    color: '#000',
  },
  completedTitle: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  removeButton: {
    marginLeft: 'auto',
    padding: 4,
  },
});