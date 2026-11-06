"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const EquipmentScene = dynamic(() => import("./three/EquipmentScene"), { ssr: false });

class Boundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const GEAR = [
  {
    n: "01",
    title: "Sony FX30",
    tag: "Кинокамера · Cinema Line",
    text: "Сенсор Super 35, 4K до 120 к/с, 10 бит 4:2:2 и профиль S-Cinetone — картинка как в кино, прямо из камеры.",
    spec: "129,7 × 77,8 × 84,5 мм · 646 г",
  },
  {
    n: "02",
    title: "Светосильный объектив",
    tag: "Байонет Sony E",
    text: "Красивое размытие фона, чистая картинка в тёмном помещении и быстрый автофокус — бренд выглядит дорого.",
    spec: "E-mount · зум-объектив",
  },
  {
    n: "03",
    title: "DJI Ronin RS4",
    tag: "3-осевой стабилизатор",
    text: "Плавные проезды и «летящие» кадры без дрожи: Reels, который хочется досматривать до конца.",
    spec: "3 оси · до 3 кг",
  },
];

const BENEFITS = ["Кино-картинка в каждом Reels", "Слоу-мо 120 к/с для ярких акцентов", "Плавные проезды вместо «тряски с телефона»"];

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Видоискатель: REC, таймкод, экспозиция и «ищущая» рамка фокуса вокруг 3D-сцены. */
function ViewfinderHud() {
  const tc = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const pad = (n: number) => String(n).padStart(2, "0");
    const tick = (t: number) => {
      const ms = t - t0;
      const f = Math.floor((ms % 1000) / (1000 / 24));
      const s = Math.floor(ms / 1000);
      if (tc.current) tc.current.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const corner = "absolute h-6 w-6 border-[var(--lime)]";
  return (
    <div className="pointer-events-none absolute inset-0 font-mono text-[11px] uppercase tracking-wider text-white/85 sm:text-xs">
      <span className={`${corner} left-4 top-4 border-l-2 border-t-2`} />
      <span className={`${corner} right-4 top-4 border-r-2 border-t-2`} />
      <span className={`${corner} bottom-4 left-4 border-b-2 border-l-2`} />
      <span className={`${corner} bottom-4 right-4 border-b-2 border-r-2`} />

      <div className="absolute left-8 top-7 flex items-center gap-2">
        <span className="vf-rec h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#ff2a2a]" />
        <span className="font-bold">REC</span>
        <span ref={tc} className="text-white/70">00:00:00:00</span>
      </div>
      <div className="absolute right-8 top-7 flex items-center gap-3 text-[var(--lime)]">
        <span>4K 120p</span>
        <span className="relative h-3 w-6 rounded-[3px] border border-current after:absolute after:-right-[3px] after:top-[3px] after:h-1 after:w-[2px] after:bg-current">
          <span className="absolute inset-[2px] right-[5px] bg-current" />
        </span>
      </div>

      <div className="vf-focus absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 border border-[var(--lime)]/70 opacity-70">
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--lime)]" />
      </div>

      <div className="absolute bottom-7 left-8 right-8 flex items-center justify-between gap-3">
        <span>S-Cinetone</span>
        <span className="hidden text-white/60 sm:inline">ISO 800 · 1/240 · f/2.8</span>
        <span className="text-white/60">Тяните, чтобы вращать</span>
      </div>
    </div>
  );
}

export function Equipment() {
  const stage = useRef<HTMLDivElement>(null);
  const explode = useRef(0);
  const [ok, setOk] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // WebGL можно определить только в браузере, иначе будет расхождение с серверным HTML
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOk(hasWebGL());
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(el);

    // «Разбор» камеры на части по мере прокрутки: сначала разлетается, потом собирается обратно.
    gsap.registerPlugin(ScrollTrigger);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const st = reduce
      ? null
      : ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          end: "bottom 15%",
          onUpdate: (self) => {
            const p = self.progress;
            explode.current = Math.sin(Math.min(Math.max((p - 0.1) / 0.8, 0), 1) * Math.PI);
          },
        });
    return () => {
      io.disconnect();
      st?.kill();
    };
  }, []);

  return (
    <section id="equipment">
      <div className="container">
        <div className="reveal-group">
          <span className="eyebrow reveal"><span className="reveal-inner">Наше оборудование</span></span>
          <h2 className="h2 reveal">
            <span className="reveal-inner">Снимаем как в кино: Sony FX30 и Ronin RS4</span>
          </h2>
          <p className="lede rise">
            Это не телефон и не «любительская камера». Мы снимаем на кинокамеру с хорошим объективом и стабилизатором — поэтому
            ваш бренд в ленте выглядит дороже конкурентов.
          </p>
        </div>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div
            ref={stage}
            className="rise relative min-h-[420px] overflow-hidden rounded-[24px] border border-[var(--line-soft)] bg-[radial-gradient(ellipse_at_50%_35%,rgba(139,92,246,.22),transparent_62%),#08080b] sm:min-h-[560px]"
          >
            {ok && (
              <Boundary fallback={null}>
                <EquipmentScene active={visible} explode={explode} />
              </Boundary>
            )}
            <ViewfinderHud />
          </div>

          <div className="flex flex-col gap-4">
            {GEAR.map((g, i) => (
              <div key={g.n} className="rise" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="card h-full">
                  <div className="num">{g.n}</div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--lime)]">{g.tag}</span>
                  <h3 className="!mt-2">{g.title}</h3>
                  <p>{g.text}</p>
                  <p className="!mt-3 font-mono text-[11px] uppercase tracking-wide text-white/40">{g.spec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ul className="rise mt-6 flex flex-wrap gap-3">
          {BENEFITS.map((b) => (
            <li
              key={b}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-[13px] text-[var(--fg2)]"
            >
              <span className="h-1.5 w-1.5 rotate-45 bg-[var(--lime)]" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
