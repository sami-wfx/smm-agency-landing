"use client";

import { motion } from "motion/react";
import { NAV_LINKS } from "@/lib/content";
import { asset } from "@/lib/asset";
import { AnchorLink } from "./AnchorLink";
import { useUI } from "./UIProvider";

export function Nav() {
  const { openModal, openDrawer } = useUI();
  return (
    <motion.nav
      id="nav"
      aria-label="Основное меню"
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container bar">
        <AnchorLink href="#top" className="logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("logo-triocrash.png")} alt="TRIOCRASH — на главную" width={152} height={24} />
        </AnchorLink>
        <div className="links">
          {NAV_LINKS.map((l) => (
            <AnchorLink key={l.href} href={l.href}>
              {l.label}
            </AnchorLink>
          ))}
        </div>
        <div className="right">
          <button className="btn btn-primary btn-header" onClick={() => openModal()}>
            Обсудить проект
          </button>
          <button className="burger" aria-label="Открыть меню" onClick={openDrawer}>
            <span />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
