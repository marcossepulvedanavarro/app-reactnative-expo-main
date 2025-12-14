import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL no está definido. Revisa tu .env.local");
}

type ApiOptions = Omit<RequestInit, "headers"> & {
  auth?: boolean; 
  headers?: Record<string, string>;
};

async function buildHeaders(
  extra?: Record<string, string>,
  auth: boolean = true
): Promise<Record<string, string>> {
  const base: Record<string, string> = {
    Accept: "application/json",
    ...(extra ?? {}),
  };

  if (auth) {
    const token = await AsyncStorage.getItem("@token");
    if (token) base.Authorization = `Bearer ${token}`;
  }

  return base;
}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const finalHeaders = await buildHeaders(headers, auth);

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders, 
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    try {
      const parsed = JSON.parse(text);
      throw new Error(parsed?.message ?? `Error API (${res.status})`);
    } catch {
      throw new Error(text || `Error API (${res.status})`);
    }
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

