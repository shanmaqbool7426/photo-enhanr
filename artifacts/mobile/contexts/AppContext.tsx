import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Enhancement {
  id: string;
  originalUri: string;
  enhancedUri: string;
  mode: string;
  modeName: string;
  modeGradient: [string, string];
  createdAt: string;
  processingTime: number;
}

interface User {
  name: string;
  email: string;
  credits: number;
  isPremium: boolean;
  totalEnhanced: number;
}

interface AppContextType {
  user: User;
  history: Enhancement[];
  onboarded: boolean;
  setOnboarded: () => Promise<void>;
  addEnhancement: (e: Enhancement) => void;
  removeEnhancement: (id: string) => void;
  useCredit: () => boolean;
  upgradeToPremium: () => void;
  updateUser: (u: Partial<User>) => void;
}

const DEFAULT_USER: User = {
  name: "Guest User",
  email: "guest@example.com",
  credits: 5,
  isPremium: false,
  totalEnhanced: 0,
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [history, setHistory] = useState<Enhancement[]>([]);
  const [onboarded, setOnboardedState] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [ob, ud, hd] = await Promise.all([
          AsyncStorage.getItem("onboarded"),
          AsyncStorage.getItem("user"),
          AsyncStorage.getItem("history"),
        ]);
        if (ob === "true") setOnboardedState(true);
        if (ud) setUser(JSON.parse(ud));
        if (hd) setHistory(JSON.parse(hd));
      } catch {}
    };
    load();
  }, []);

  const setOnboarded = useCallback(async () => {
    await AsyncStorage.setItem("onboarded", "true");
    setOnboardedState(true);
  }, []);

  const addEnhancement = useCallback((e: Enhancement) => {
    setHistory((prev) => {
      const next = [e, ...prev];
      AsyncStorage.setItem("history", JSON.stringify(next));
      return next;
    });
    setUser((prev) => {
      const next = { ...prev, totalEnhanced: prev.totalEnhanced + 1 };
      AsyncStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  }, []);

  const removeEnhancement = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((e) => e.id !== id);
      AsyncStorage.setItem("history", JSON.stringify(next));
      return next;
    });
  }, []);

  const useCredit = useCallback((): boolean => {
    if (user.isPremium) return true;
    if (user.credits <= 0) return false;
    setUser((prev) => {
      const next = { ...prev, credits: prev.credits - 1 };
      AsyncStorage.setItem("user", JSON.stringify(next));
      return next;
    });
    return true;
  }, [user]);

  const upgradeToPremium = useCallback(() => {
    setUser((prev) => {
      const next = { ...prev, isPremium: true, credits: 999 };
      AsyncStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  }, []);

  const updateUser = useCallback((u: Partial<User>) => {
    setUser((prev) => {
      const next = { ...prev, ...u };
      AsyncStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        history,
        onboarded,
        setOnboarded,
        addEnhancement,
        removeEnhancement,
        useCredit,
        upgradeToPremium,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
