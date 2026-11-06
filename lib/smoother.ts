import type ScrollSmoother from "gsap/ScrollSmoother";

let instance: ScrollSmoother | null = null;
export const getSmoother = () => instance;
export const setSmoother = (s: ScrollSmoother | null) => {
  instance = s;
};

/** Плавный переход к якорю (отступ под фиксированную навигацию — 76px, как раньше). */
export function scrollToId(id: string) {
  if (!id || id === "top") {
    if (instance) instance.scrollTo(0, false);
    else window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) instance.scrollTo(el, false, "top 76px");
  else window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 76), behavior: "auto" });
}
