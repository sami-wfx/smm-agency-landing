"use client";

import { useEffect, useRef } from "react";

/**
 * Космос — фиксированный фон всей страницы: один 2D-canvas со звёздами (без цветных пятен-туманностей).
 * — без WebGL и тяжёлых фильтров; цикл стоит, пока вкладка скрыта;
 * — глубина: дальние звёзды двигаются медленнее (мышь + прокрутка страницы);
 * — раз в 6–10 секунд пролетает одна падающая звезда (не во время прокрутки);
 * — в покое рисуем 30 кадров/с, при прокрутке и движении мыши — по частоте экрана;
 * — prefers-reduced-motion: один статичный кадр, без цикла.
 */
type Star = { x: number; y: number; z: number; r: number; a: number; ph: number; sp: number; c: string; big: boolean };

// белые, холодно-белые, фиолетовые и редкие розовые — в тон палитре сайта
const COLORS = [
  "255,255,255",
  "255,255,255",
  "255,255,255",
  "206,216,255",
  "206,216,255",
  "190,170,255",
  "255,196,240",
];

// детерминированный генератор — раскладка звёзд не «прыгает» при ресайзе
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeStars(n: number): Star[] {
  const rnd = rng(20260713);
  const out: Star[] = [];
  for (let i = 0; i < n; i++) {
    const z = Math.pow(rnd(), 1.6); // больше далёких, мало ближних
    out.push({
      x: rnd(),
      y: rnd(),
      z,
      r: 0.5 + z * 1.2,
      a: (0.5 + rnd() * 0.5) * (0.65 + z * 0.35),
      ph: rnd() * Math.PI * 2,
      sp: 0.6 + rnd() * 1.8,
      c: COLORS[Math.floor(rnd() * COLORS.length)],
      big: z > 0.8,
    });
  }
  return out;
}

export function SpaceBg() {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = wrap.current;
    const canvas = cv.current;
    const ctx = canvas?.getContext("2d");
    if (!box || !canvas || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const small = matchMedia("(max-width: 560px)");

    // мягкий ореол для самых ярких звёзд — рисуем один раз
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 48;
    const sc = sprite.getContext("2d");
    if (sc) {
      const g = sc.createRadialGradient(24, 24, 0, 24, 24, 24);
      g.addColorStop(0, "rgba(255,255,255,.9)");
      g.addColorStop(0.25, "rgba(210,200,255,.28)");
      g.addColorStop(1, "rgba(210,200,255,0)");
      sc.fillStyle = g;
      sc.fillRect(0, 0, 48, 48);
    }

    let W = 0;
    let H = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let raf = 0;
    let running = false;
    let last = 0;
    let scrolling = false;
    let scrollIdle = 0;
    let lastMove = 0;
    // сглаженное смещение от мыши (−1…1)
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    // падающая звезда
    let nextShot = 3500 + Math.random() * 3000;
    let shot: { x: number; y: number; vx: number; vy: number; len: number; t0: number; dur: number } | null = null;

    const resize = () => {
      W = box.clientWidth;
      H = box.clientHeight;
      if (!W || !H) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(260, Math.max(70, (W * H) / 5200)));
      if (n !== stars.length) stars = makeStars(n);
      if (!running) draw(performance.now());
    };

    const wrapN = (v: number, m: number) => ((v % m) + m) % m;

    function draw(t: number) {
      if (!W || !H) return;
      ctx!.clearRect(0, 0, W, H);
      const animate = !reduce.matches;
      // прокрутка страницы (px) — для параллакса звёзд
      let sy = 0;
      if (animate) {
        sy = window.scrollY;
        mx += (tx - mx) * 0.06;
        my += (ty - my) * 0.06;
      }
      const ox = mx * -16;
      const oy = my * -10 - sy * 0.1; // звёзды уплывают медленнее контента; края замыкаются через wrapN

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const d = 0.25 + s.z * 0.75;
        const x = wrapN(s.x * W + ox * d, W);
        const y = wrapN(s.y * H + oy * d, H);
        const tw = animate ? 0.65 + 0.35 * Math.sin(t * 0.001 * s.sp + s.ph) : 1;
        const al = s.a * tw;
        if (al <= 0.01) continue;
        if (s.big) {
          const g = s.r * 9;
          ctx!.globalAlpha = al * 0.55;
          ctx!.drawImage(sprite, x - g / 2, y - g / 2, g, g);
        }
        ctx!.globalAlpha = al;
        ctx!.fillStyle = `rgb(${s.c})`;
        if (s.r < 0.9) {
          ctx!.fillRect(x - s.r, y - s.r, s.r * 2, s.r * 2);
        } else {
          ctx!.beginPath();
          ctx!.arc(x, y, s.r, 0, 6.2832);
          ctx!.fill();
        }
      }

      // падающая звезда
      if (animate) {
        if (!shot && t > nextShot && !scrolling) {
          const ang = ((20 + Math.random() * 18) * Math.PI) / 180;
          const sp = W * (0.7 + Math.random() * 0.3); // px/сек
          shot = {
            x: W * (0.05 + Math.random() * 0.55),
            y: H * (0.06 + Math.random() * 0.3),
            vx: Math.cos(ang) * sp,
            vy: Math.sin(ang) * sp,
            len: 110 + Math.random() * 90,
            t0: t,
            dur: 900,
          };
        }
        if (shot) {
          const k = (t - shot.t0) / shot.dur;
          if (k >= 1) {
            shot = null;
            nextShot = t + 6000 + Math.random() * 4000;
          } else {
            const sec = (t - shot.t0) / 1000;
            const hx = shot.x + shot.vx * sec;
            const hy = shot.y + shot.vy * sec;
            const m = Math.hypot(shot.vx, shot.vy);
            const tailX = hx - (shot.vx / m) * shot.len;
            const tailY = hy - (shot.vy / m) * shot.len;
            const env = Math.sin(Math.PI * k); // появилась → пролетела → погасла
            const g = ctx!.createLinearGradient(tailX, tailY, hx, hy);
            g.addColorStop(0, "rgba(190,170,255,0)");
            g.addColorStop(1, "rgba(255,255,255,1)");
            ctx!.globalAlpha = env * 0.9;
            ctx!.strokeStyle = g;
            ctx!.lineWidth = 1.6;
            ctx!.lineCap = "round";
            ctx!.beginPath();
            ctx!.moveTo(tailX, tailY);
            ctx!.lineTo(hx, hy);
            ctx!.stroke();
            ctx!.fillStyle = "#fff";
            ctx!.beginPath();
            ctx!.arc(hx, hy, 1.4, 0, 6.2832);
            ctx!.fill();
          }
        }
      }
      ctx!.globalAlpha = 1;
    }

    const loop = (t: number) => {
      raf = 0;
      if (!running) return;
      // в покое (и всегда на телефоне) 30 кадров/с: мерцанию больше не нужно, а батарея скажет спасибо
      const active = scrolling || t - lastMove < 500;
      if ((small.matches || !active) && t - last < 32) {
        raf = requestAnimationFrame(loop);
        return;
      }
      last = t;
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || document.hidden || reduce.matches) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      lastMove = performance.now();
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    // пока на экране Hero — прежние цветные пятна сайта (.bg-fx .glow) гасим: фон там чисто звёздный
    const hero = document.getElementById("hero");
    const root = document.documentElement;
    const syncHero = () => {
      if (!hero) return;
      root.classList.toggle("in-hero", hero.getBoundingClientRect().bottom > window.innerHeight * 0.6);
    };
    const onScroll = () => {
      syncHero();
      scrolling = true;
      box.classList.add("is-scrolling");
      clearTimeout(scrollIdle);
      scrollIdle = window.setTimeout(() => {
        scrolling = false;
        box.classList.remove("is-scrolling");
      }, 180);
    };
    const onVis = () => (document.hidden ? stop() : start());
    const onReduce = () => {
      if (reduce.matches) {
        stop();
        draw(performance.now());
      } else {
        start();
      }
    };

    const ro = new ResizeObserver(resize);

    resize();
    ro.observe(box);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    reduce.addEventListener("change", onReduce);
    syncHero();
    start();
    canvas.classList.add("is-on");

    return () => {
      stop();
      clearTimeout(scrollIdle);
      root.classList.remove("in-hero");
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      reduce.removeEventListener("change", onReduce);
    };
  }, []);

  return (
    <div className="sp" ref={wrap} aria-hidden>
      <canvas className="sp-stars" ref={cv} />
    </div>
  );
}
