"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DEFAULT_PREFS, STORAGE_KEY, type Prefs } from "@/lib/prefs";

interface Ctx {
  prefs: Prefs;
  ready: boolean;
  save: (p: Partial<Prefs>) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const PrefsContext = createContext<Ctx | null>(null);

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Prefs>;
        setPrefs({ ...DEFAULT_PREFS, ...parsed });
        if (!parsed.onboarded) setOpen(true);
      } else {
        setOpen(true); // first visit → onboarding
      }
    } catch {
      setOpen(true);
    }
    setReady(true);
  }, []);

  const save = useCallback((p: Partial<Prefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...p };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return (
    <PrefsContext.Provider value={{ prefs, ready, save, open, setOpen }}>
      {children}
    </PrefsContext.Provider>
  );
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used within PrefsProvider");
  return ctx;
}
