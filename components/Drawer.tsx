"use client";

import { AnimatePresence, motion } from "motion/react";
import { NAV_LINKS } from "@/lib/content";
import { IMG } from "@/lib/images";
import { AnchorLink } from "./AnchorLink";
import { useUI } from "./UIProvider";

export function Drawer() {
  const { drawerOpen, closeDrawer, openModal } = useUI();
  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.div
          id="drawer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.logo.src} alt="TRIOCRASH" width={IMG.logo.width} height={IMG.logo.height} loading="lazy" decoding="async" />
            <button className="close" aria-label="Закрыть меню" onClick={closeDrawer}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav>
            {NAV_LINKS.map((l, i) => (
              <motion.span
                key={l.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i + 0.1, duration: 0.4 }}
              >
                <AnchorLink href={l.href} onClick={closeDrawer}>
                  {l.label}
                </AnchorLink>
              </motion.span>
            ))}
            <button className="btn btn-primary with-arrow" style={{ marginTop: 8 }} onClick={() => openModal()}>
              Обсудить проект<span className="arrow">↗</span>
            </button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
