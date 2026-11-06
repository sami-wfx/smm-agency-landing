"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { asset } from "@/lib/asset";
import { TEAM, TONES } from "@/lib/team";

/**
 * Hero «Команда в кадре» — спокойная версия.
 * Сцена приклеена (sticky) на 300vh. Скролл пишет в CSS-переменные:
 *   --in0/--in1/--in2 — «выход» каждого человека по очереди (0 — за краем, 1 — на месте),
 *   --s — лёгкий разъезд в конце, --p — общий прогресс; мышь — --mx/--my.
 * Всё оформление — в hero.css. Фото — /public/team, порядок и цвета — lib/team.ts.
 */
const WORD = "TRIOCRASH".split("");
const ROLES = ["Продакшн", "Монтаж", "Продвижение"];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const st = stage.current;
    if (!el || !st) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
    // easeOutBack: человек выходит и мягко встаёт на место
    const back = (x: number) => 1 + 1.6 * Math.pow(x - 1, 3) + 0.6 * Math.pow(x - 1, 2);

    const apply = () => {
      raf = 0;
      if (reduce.matches) {
        st.style.setProperty("--p", "0");
        st.style.setProperty("--s", "0");
        [0, 1, 2].forEach((i) => st.style.setProperty(`--in${i}`, "1"));
        return;
      }
      const r = el.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      const p = range > 0 ? clamp01(-r.top / range) : 1;
      st.style.setProperty("--p", p.toFixed(4));
      [0, 1, 2].forEach((i) => {
        st.style.setProperty(`--in${i}`, back(clamp01((p - 0.04 - i * 0.2) / 0.3)).toFixed(4));
      });
      st.style.setProperty("--s", clamp01((p - 0.74) / 0.26).toFixed(4));
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || reduce.matches) return;
      st.style.setProperty("--mx", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      st.style.setProperty("--my", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
    };

    apply();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    window.addEventListener("pointermove", onMove, { passive: true });
    reduce.addEventListener("change", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      window.removeEventListener("pointermove", onMove);
      reduce.removeEventListener("change", request);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="hero" ref={root} className="hx" aria-labelledby="hero-title">
      <div className="hx-stage" ref={stage}>
        <div className="hx-giant" aria-hidden>
          {WORD.map((ch, i) => (
            <Fragment key={i}>
              <span className="hx-l" style={{ ["--i" as string]: i } as CSSProperties}>
                {ch}
              </span>
              {/* на телефоне надпись переносится: TRIO / CRASH — так она крупнее */}
              {i === 3 && <span className="hx-br" />}
            </Fragment>
          ))}
        </div>
        <h1 id="hero-title" className="sr-only">
          TRIOCRASH — Reels-продюсеры и бренд-продюсеры из Таджикистана
        </h1>

        <ul className="hx-team">
          {TEAM.map((m, i) => (
            <li
              key={m.key}
              className="hx-fig"
              data-member={m.key}
              style={{ ["--tone" as string]: TONES[m.tone].soft, ["--d" as string]: `${i * -1.9}s` } as CSSProperties}
            >
              <div className="hx-in" aria-hidden>
                <div className="hx-glow" />
                <div className="hx-breathe">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(`${m.photo}.webp`)} alt="" width={720} height={960} draggable={false} decoding="async" />
                </div>
              </div>
              <span className="sr-only">{ROLES[i]}</span>
            </li>
          ))}
        </ul>

        <div className="hx-cue" aria-hidden>
          <i />
          Листайте
        </div>
      </div>
    </section>
  );
}
