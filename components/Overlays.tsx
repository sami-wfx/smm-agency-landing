"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useUI } from "./UIProvider";

// Меню и форма заявки (вместе с Motion) подгружаются отдельными чанками: при первом открытии
// или заранее — когда браузер свободен. Смонтированные остаются в DOM, чтобы сыграла анимация закрытия.
const loadDrawer = () => import("./Drawer").then((m) => m.Drawer);
const loadModal = () => import("./LeadModal").then((m) => m.LeadModal);
const Drawer = dynamic(loadDrawer, { ssr: false });
const LeadModal = dynamic(loadModal, { ssr: false });

export function Overlays() {
  const { drawerOpen, modalOpen } = useUI();
  const [drawer, setDrawer] = useState(false);
  const [modal, setModal] = useState(false);

  // «хоть раз открывали» — подгружаем и оставляем смонтированным (нужно для анимации закрытия)
  if (drawerOpen && !drawer) setDrawer(true);
  if (modalOpen && !modal) setModal(true);

  // прогрев чанков в простое, чтобы первое открытие было мгновенным
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const warm = () => {
      void loadDrawer();
      void loadModal();
    };
    if (w.requestIdleCallback) w.requestIdleCallback(warm, { timeout: 6000 });
    else setTimeout(warm, 3000);
  }, []);

  return (
    <>
      {drawer && <Drawer />}
      {modal && <LeadModal />}
    </>
  );
}
