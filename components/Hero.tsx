"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { asset } from "@/lib/asset";
import { TEAM, TONES } from "@/lib/team";

/**
 * Hero «Команда в кадре».
 * Сцена приклеена (sticky) к экрану на 300vh. Скролл пишет в CSS-переменные:
 *   --in0/--in1/--in2 — «выход» каждого человека по очереди (0 — за краем экрана, 1 — стоит),
 *   --s — разъезд людей в стороны в конце, --p — общий прогресс (0…1);
 * положение мыши — --mx/--my (−1…1). Остальное (анимации, параллакс) делает CSS.
 * Фото в /public/team, порядок и цвета — в lib/team.ts. Фигуры помечены data-member.
 */
const WORD = "TRIOCRASH".split("");
const LETTER_GLOW = ["182,255,61", "139,92,246", "255,95,168"];
// детерминированные «искры» (чтобы сервер и браузер строили одинаковый HTML)
const SPARKS = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  size: 2 + ((i * 5) % 4),
  dur: 10 + ((i * 7) % 9),
  delay: -((i * 11) % 18),
  dx: ((i * 13) % 9) - 4,
  tone: i % 3,
}));
const SPARK_COLOR = ["#B6FF3D", "#8B5CF6", "#FF5FA8"];

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
    // easeOutBack: человек «выскакивает» и мягко встаёт на место
    const back = (x: number) => 1 + 2.1 * Math.pow(x - 1, 3) + 1.1 * Math.pow(x - 1, 2);

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
      // выходят по очереди: первый, второй, третий
      [0, 1, 2].forEach((i) => {
        const e = back(clamp01((p - 0.04 - i * 0.2) / 0.3));
        st.style.setProperty(`--in${i}`, e.toFixed(4));
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
        <div className="hx-rays" aria-hidden />

        {/* крупная надпись сзади: побуквенное появление + бегущая волна света */}
        <div className="hx-giant" aria-hidden>
          {WORD.map((ch, i) => (
            <Fragment key={i}>
              <span className="hx-l" style={{ ["--i" as string]: i, ["--g" as string]: LETTER_GLOW[i % 3] } as CSSProperties}>
                <i>{ch}</i>
              </span>
              {/* на телефоне надпись переносится: TRIO / CRASH — так она крупнее */}
              {i === 3 && <span className="hx-br" />}
            </Fragment>
          ))}
        </div>
        <h1 id="hero-title" className="sr-only">
          TRIOCRASH — Reels-продюсеры и бренд-продюсеры из Таджикистана
        </h1>

        <div className="hx-sparks" aria-hidden>
          {SPARKS.map((s, i) => (
            <span
              key={i}
              style={{
                left: `${s.x}%`,
                width: s.size,
                height: s.size,
                background: SPARK_COLOR[s.tone],
                boxShadow: `0 0 ${s.size * 4}px ${SPARK_COLOR[s.tone]}`,
                animationDuration: `${s.dur}s`,
                animationDelay: `${s.delay}s`,
                ["--dx" as string]: `${s.dx * 3}vw`,
              } as CSSProperties}
            />
          ))}
        </div>

        <ul className="hx-team">
          {TEAM.map((m, i) => (
            <li
              key={m.key}
              className="hx-fig"
              data-member={m.key}
              style={{ ["--tone" as string]: TONES[m.tone].soft, ["--d" as string]: `${i * -1.9}s`, ["--e" as string]: `${i === 1 ? 0.35 : 0.6}s` } as CSSProperties}
            >
              <div className="hx-in" aria-hidden>
                <div className="hx-glow" />
                <div className="hx-breathe">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(`${m.photo}.webp`)} alt="" width={720} height={960} draggable={false} decoding="async" />
                  <span
                    className="hx-shine"
                    style={{ WebkitMaskImage: `url(${asset(`${m.photo}.webp`)})`, maskImage: `url(${asset(`${m.photo}.webp`)})`, animationDelay: `${i * 1.4 + 1.2}s` }}
                  />
                </div>
              </div>
              <span className="sr-only">{["Продакшн", "Монтаж", "Продвижение"][i]}</span>
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
