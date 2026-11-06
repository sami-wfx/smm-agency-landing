"use client";

import type { AnchorHTMLAttributes } from "react";
import { scrollToId } from "@/lib/smoother";

/** Ссылка-якорь с плавной прокруткой (работает и с GSAP ScrollSmoother, и с обычным скроллом). */
export function AnchorLink({ href, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        scrollToId(href.replace(/^#/, ""));
        onClick?.(e);
      }}
      {...rest}
    />
  );
}
