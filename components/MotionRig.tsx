"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { setSmoother } from "@/lib/smoother";

/**
 * Ядро анимаций на GSAP + ScrollTrigger:
 *  - плавный скролл (ScrollSmoother) на устройствах с мышью;
 *  - появление блоков (.reveal-group / .rise), счётчики, линия процесса, параллакс свечений.
 * Ничего не рендерит.
 */
export function MotionRig() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(pointer: fine)").matches;
    document.documentElement.classList.toggle("reduced", reduce);

    const ctx = gsap.context(() => {
      if (!reduce && fine) {
        setSmoother(
          ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 1.1,
          }),
        );
      }

      // появление блоков
      gsap.utils.toArray<HTMLElement>(".reveal-group, .rise").forEach((el) => {
        if (reduce) return el.classList.add("in-view");
        ScrollTrigger.create({ trigger: el, start: "top 80%", once: true, onEnter: () => el.classList.add("in-view") });
      });

      // счётчики
      gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((el) => {
        const target = parseFloat(el.dataset.target ?? "0");
        const decimals = parseInt(el.dataset.decimals ?? "0", 10);
        const { prefix = "", suffix = "" } = el.dataset;
        const fmt = (v: number) => prefix + (decimals ? v.toFixed(decimals) : Math.round(v).toString()) + suffix;
        if (reduce) return void (el.textContent = fmt(target));
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
