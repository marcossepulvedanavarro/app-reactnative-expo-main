import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import Button from "@/components/ui/button";
import Title from "@/components/ui/title";
import getAuthService from "@/services/auth-service";

export default function RegisterScreen() {
  const router = useRouter();
  const authService = getAuthService();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Validación", "Debes ingresar email y contraseña.");
      return;
    }

    try {
      setLoading(true);

      await authService.register({
        email: email.trim(),
        password: password.trim(),
      });

      Alert.alert(
        "Registro exitoso",
        "Tu cuenta fue creada. Ahora puedes iniciar sesión."
      );

      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title>Crear cuenta</Title>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={{ marginTop: 20, gap: 12 }}>
        <Button
          type="primary"
          text="Registrarse"
          onPress={onRegister}
          loading={loading}
          disabled={loading}
        />

        <Button
          type="outline"
          text="Volver a login"
          onPress={() => router.replace("/login")}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  label: {
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
});
