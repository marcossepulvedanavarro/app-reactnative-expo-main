// app/login.tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../src/components/context/auth-context';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setErr(null);
    setLoading(true);
    try {
      await login(email.trim(), password);

      router.replace('/(tabs)');
    } catch (e: any) {
      setErr(e?.message ?? 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.c}>
      <Text style={styles.title}>Iniciar sesión</Text>

      {!!err && <Text style={styles.err}>{err}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title={loading ? 'Ingresando...' : 'Ingresar'}
        onPress={onSubmit}
        disabled={loading}
      />

      {/* 🔹 BOTÓN REGISTRO */}
      <Button
        title="Crear cuenta"
        onPress={() => router.push('/register')}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  c: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
  err: {
    color: 'crimson',
    textAlign: 'center',
  },
});


