"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setSmoother } from "@/lib/smoother";
import { formatCounter } from "@/lib/format";

/**
 * Ядро анимаций на GSAP + ScrollTrigger:
 *  - появление блоков (.reveal-group / .rise), переходы между блоками, счётчики, линия процесса, параллакс свечений.
 * Ничего не рендерит.
 */
export function MotionRig() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.toggle("reduced", reduce);

    const ctx = gsap.context(() => {
      // появление блоков
      gsap.utils.toArray<HTMLElement>(".reveal-group, .rise").forEach((el) => {
        if (reduce) return el.classList.add("in-view");
        ScrollTrigger.create({ trigger: el, start: "top 80%", once: true, onEnter: () => el.classList.add("in-view") });
      });

      // переходы между блоками: следующий блок «выплывает» снизу, а уходящий мягко уменьшается и притихает
      if (!reduce)
        gsap.utils.toArray<HTMLElement>("main > section:not(#hero)").forEach((sec) => {
          gsap.fromTo(
            sec,
            { y: 48, scale: 0.985, opacity: 0.62, transformOrigin: "50% 0%" },
            { y: 0, scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: sec, start: "top 104%", end: "top 58%", scrub: 0.5 } },
          );
          gsap.fromTo(
            sec,
            { scale: 1, opacity: 1, transformOrigin: "50% 100%" },
            { scale: 0.988, opacity: 0.72, ease: "none", immediateRender: false, scrollTrigger: { trigger: sec, start: "bottom 42%", end: "bottom -5%", scrub: 0.5 } },
          );
        });

      // счётчики
      gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((el) => {
        const target = parseFloat(el.dataset.target ?? "0");
        const decimals = parseInt(el.dataset.decimals ?? "0", 10);
        const { prefix = "", suffix = "" } = el.dataset;
        const fmt = (v: number) => formatCounter(v, { decimals, prefix, suffix });
        if (reduce) return void (el.textContent = fmt(target));
        el.textContent = fmt(0); // стартуем с нуля только когда JS уже работает; блок ещё скрыт (.rise)
        const state = { v: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 95%",
          once: true,
          onEnter: () =>
            gsap.to(state, { v: target, duration: 1.4, ease: "power3.out", onUpdate: () => void (el.textContent = fmt(state.v)) }),
        });
      });

      // линия «Как мы работаем»
      const path = document.querySelector<SVGPathElement>("#procPath");
      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: reduce ? 0 : len });
        if (!reduce)
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: "#process", start: "top 85%", end: "bottom 45%", scrub: 0.6 },
          });
      }

      // параллакс фоновых свечений
      if (!reduce)
        gsap.utils.toArray<HTMLElement>(".bg-fx [data-parallax]").forEach((el) => {
          const f = parseFloat(el.dataset.parallax ?? "0");
          gsap.to(el, {
            y: () => -f * ScrollTrigger.maxScroll(window),
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: true, invalidateOnRefresh: true },
          });
        });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
      setSmoother(null);
    };
  }, []);

  return null;
}
