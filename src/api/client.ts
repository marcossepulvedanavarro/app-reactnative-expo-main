import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://todo-list.dobleb.cl";

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

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const cleanHeaders: Record<string, string> = {};
  if (headers) {
    for (const [k, v] of Object.entries(headers)) {
      if (v != null) cleanHeaders[k] = v;
    }
  }

  const finalHeaders = await buildHeaders(cleanHeaders, auth);

  const url = `${API_URL}${path}`;
  const token = auth ? await AsyncStorage.getItem("@token") : null;

console.log("[apiFetch] ->", {
  url,
  method: rest?.method ?? "GET",
  hasToken: !!token,
  tokenLen: token?.length ?? 0,
});

  const res = await fetch(url, {
    ...rest,
    headers: finalHeaders,
  });

 
  const text = await res.text().catch(() => "");

  if (!res.ok) {
    
    console.log("[apiFetch] ERROR", res.status, url, text);

    
    try {
      const parsed = text ? JSON.parse(text) : null;
      throw new Error(parsed?.message ?? parsed?.error ?? `Error API (${res.status})`);
    } catch {
      throw new Error(text || `Error API (${res.status})`);
    }
  }

  
  if (!text) return undefined as T;


  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return JSON.parse(text) as T;
  }

  
  return text as unknown as T;
}



