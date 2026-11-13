"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { IMG } from "@/lib/images";
import { TEAM, TONES } from "@/lib/team";
import { AnchorLink } from "./AnchorLink";

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
        st.classList.add("is-final");
        return;
      }
      const r = el.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      const p = range > 0 ? clamp01(-r.top / range) : 1;
      st.style.setProperty("--p", p.toFixed(4));
      [0, 1, 2].forEach((i) => {
        st.style.setProperty(`--in${i}`, back(clamp01((p - 0.04 - i * 0.2) / 0.3)).toFixed(4));
      });
      const fin = clamp01((p - 0.74) / 0.26);
      st.style.setProperty("--s", fin.toFixed(4));
      // финал сцены: появляются подпись, кнопка и роли
      st.classList.toggle("is-final", fin > 0.55);
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    // пока идёт прокрутка, декоративные бесконечные анимации (блик, «дыхание») ставятся на паузу —
    // освобождаем кадры под сам выход людей: на телефоне именно они давали лаги
    let idle = 0;
    const onScroll = () => {
      st.classList.add("is-scrolling");
      clearTimeout(idle);
      idle = window.setTimeout(() => st.classList.remove("is-scrolling"), 180);
      request();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || reduce.matches) return;
      st.style.setProperty("--mx", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      st.style.setProperty("--my", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", request);
    window.addEventListener("pointermove", onMove, { passive: true });
    reduce.addEventListener("change", request);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(idle);
      window.removeEventListener("resize", request);
      window.removeEventListener("pointermove", onMove);
      reduce.removeEventListener("change", request);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // «волна» надписи: буквы у курсора слегка вырастают (только мышь; сама волна — в CSS)
  useEffect(() => {
    const st = stage.current;
    if (!st) return;
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = Array.from(st.querySelectorAll<HTMLElement>(".hx-l"));
    let raf = 0;
    let mx = -1e4;
    let my = -1e4;
    const paint = () => {
      raf = 0;
      for (const l of letters) {
        const r = l.getBoundingClientRect();
        const dx = Math.abs(mx - (r.left + r.width / 2)) / (r.width * 2.2);
        const dy = Math.abs(my - (r.top + r.height / 2)) / (r.height * 1.4);
        l.style.setProperty("--lift", Math.max(0, 1 - Math.hypot(dx, dy)).toFixed(3));
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="hero" ref={root} className="hx" aria-labelledby="hero-title">
      <div className="hx-stage" ref={stage}>
        <div className="hx-giant" aria-hidden>
          {WORD.map((ch, i) => (
            <Fragment key={i}>
              <span className="hx-l" data-c={ch} style={{ ["--i" as string]: i } as CSSProperties}>
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
                <div className="hx-breathe">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={IMG.team[m.photo].src}
                    srcSet={IMG.team[m.photo].srcSet}
                    sizes="(max-width: 560px) 66vw, 48vw"
                    alt=""
                    width={IMG.team[m.photo].width}
                    height={IMG.team[m.photo].height}
                    draggable={false}
                    // главный (первый выходящий) кадр hero — самый приоритетный; остальные тоже сразу, но без повышенного приоритета
                    loading="eager"
                    fetchPriority={i === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                </div>
              </div>
              <span className="hx-role" aria-hidden>
                {ROLES[i]}
              </span>
              <span className="sr-only">{ROLES[i]}</span>
            </li>
          ))}
        </ul>

        <div className="hx-tag">
          <p className="hx-tag-t">Reels-продюсеры и бренд-продюсеры из Таджикистана. Снимаем на Sony FX30.</p>
          <AnchorLink href="#cases" className="hx-tag-a">
            Смотреть кейсы
            <i aria-hidden>→</i>
          </AnchorLink>
        </div>

        <div className="hx-cue" aria-hidden>
          <i />
          Листайте
        </div>
      </div>
    </section>
  );
}
