"use client";

import { scrollToId } from "@/lib/smoother";

export function SkipLink() {
  return (
    <a
      href="#top"
      className="skip-link"
      onClick={(e) => {
        e.preventDefault();
        scrollToId("top");
        document.getElementById("top")?.focus({ preventScroll: true });
      }}
    >
      Перейти к содержимому
    </a>
  );
}
