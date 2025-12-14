// services/auth-service.ts
import { API_URL } from "@/constants/config";
import axios, { isAxiosError } from "axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
  };
}

export type RegisterPayload = LoginPayload;
export type RegisterResponse = LoginResponse;

export default function getAuthService() {
  const client = axios.create({
    baseURL: `${API_URL}/auth`,
  });

  async function login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const response = await client.post<LoginResponse>("/login", payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          throw new Error(
            "Credenciales inválidas. Por favor, verifica tu email y contraseña."
          );
        }
      }

      throw new Error(
        "Error al conectar con el servidor. Por favor, intenta nuevamente más tarde."
      );
    }
  }

  async function register(
    payload: RegisterPayload
  ): Promise<RegisterResponse> {
    try {
      
      const response = await client.post<RegisterResponse>("/register", payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          throw new Error(
            "email registrado. Favor intenta con otro email."
          );
        }
      }

      throw new Error(
        "Se produjo un error al registrar el usuario. Por favor, intenta nuevamente más tarde. "
      );
    }
  }

  return {
    login,
    register,
  };
}
