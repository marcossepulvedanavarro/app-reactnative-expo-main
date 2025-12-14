// components/context/auth-context.tsx
import getAuthService from "@/services/auth-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type User = { token: string; email: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
};

const TOKEN_KEY = "@token";
const EMAIL_KEY = "@email";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  const restore = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const email = await AsyncStorage.getItem(EMAIL_KEY);

      if (token && email) {
        setUser({ token, email });
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    restore();
  }, []);

  const login = async (email: string, password: string) => {
    const auth = getAuthService();

    
    const response = await auth.login({ email, password });

    const token = response.data.token;

  
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(EMAIL_KEY, email);

    setUser({ token, email });
  };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(EMAIL_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token: user?.token ?? null,
      isLoading,
      login,
      logout,
      restore,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

