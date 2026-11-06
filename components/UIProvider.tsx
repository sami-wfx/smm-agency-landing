"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getSmoother } from "@/lib/smoother";

type UI = {
  drawerOpen: boolean;
  modalOpen: boolean;
  plan: string;
  openDrawer: () => void;
  closeDrawer: () => void;
  openModal: (plan?: string) => void;
  closeModal: () => void;
};

const Ctx = createContext<UI | null>(null);

export function useUI() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useUI must be used inside <UIProvider>");
  return v;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawer] = useState(false);
  const [modalOpen, setModal] = useState(false);
  const [plan, setPlan] = useState("");

  const openDrawer = useCallback(() => setDrawer(true), []);
  const closeDrawer = useCallback(() => setDrawer(false), []);
  const openModal = useCallback((p = "") => {
    setPlan(p);
    setModal(true);
    setDrawer(false);
  }, []);
  const closeModal = useCallback(() => setModal(false), []);

  // блокировка прокрутки, пока открыто меню или форма
  const locked = drawerOpen || modalOpen;
  useEffect(() => {
    document.documentElement.style.overflow = locked ? "hidden" : "";
    getSmoother()?.paused(locked);
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [locked]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setModal(false);
      setDrawer(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(
    () => ({ drawerOpen, modalOpen, plan, openDrawer, closeDrawer, openModal, closeModal }),
    [drawerOpen, modalOpen, plan, openDrawer, closeDrawer, openModal, closeModal],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
