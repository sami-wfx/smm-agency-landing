"use client";

import { NAV_LINKS } from "@/lib/content";
import { IMG } from "@/lib/images";
import { AnchorLink } from "./AnchorLink";
import { useUI } from "./UIProvider";

export function Nav() {
  const { openModal, openDrawer } = useUI();
  return (
    <nav id="nav" aria-label="Основное меню">
      <div className="container bar">
        <AnchorLink href="#top" className="logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG.logo.src} alt="TRIOCRASH — на главную" width={IMG.logo.width} height={IMG.logo.height} fetchPriority="high" decoding="async" />
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
    </nav>
  );
}
