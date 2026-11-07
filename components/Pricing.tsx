"use client";

import { useEffect, useRef, useState } from "react";
import { PLANS, type Plan } from "@/lib/content";
import { useUI } from "./UIProvider";

const Check = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const Spark = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2l2.2 6.3L21 10l-6.8 1.7L12 18l-2.2-6.3L3 10l6.8-1.7L12 2z" />
  </svg>
);

/** Полоска «Stories»: столько сегментов, сколько историй в тарифе, они «проигрываются» по очереди. */
function StoryStrip({ count, plan }: { count: number; plan: Plan }) {
  return (
    <div className={`pl-strip pl-strip-${plan.tone}`} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <i key={i} style={{ ["--k" as string]: i, ["--n" as string]: count }} />
      ))}
    </div>
  );
}

const Lock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <rect x="4" y="11" width="16" height="10" rx="2.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

const fmt = (v: number) => Math.round(v).toLocaleString("ru-RU").replace(/\s/g, "\u00A0");

/** Цена «набегает» от нуля, когда карточка попадает в экран. В HTML сразу лежит итог (поиск, без JS). */
function PriceCount({ value }: { value: number }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    let raf = 0;
    el.textContent = fmt(0);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0 - 250) / 1300);
          const eased = 1 - Math.pow(1 - Math.max(0, k), 4);
          el.textContent = fmt(value * eased);
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return <b ref={ref}>{fmt(value)}</b>;
}

function PlanCard({ p, i }: { p: Plan; i: number }) {
  const { openModal } = useUI();
  const [sealed, setSealed] = useState(true);
  const spot = useRef<HTMLSpanElement>(null);
  const stories = parseInt(p.stats[1].n, 10);
  let idx = 0;
  return (
    <article
      className={`plan plan-${p.tone === "lime" ? "dark" : p.tone} pl rise${p.tone === "lime" ? " pl-grow" : ""}${p.badge ? " featured" : ""}`}
      style={i ? { transitionDelay: `${i * 0.12}s` } : undefined}
      aria-label={`Тариф «${p.name}»`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !spot.current) return;
        const r = e.currentTarget.getBoundingClientRect();
        spot.current.style.transform = `translate3d(${e.clientX - r.left}px,${e.clientY - r.top}px,0)`;
      }}
    >
      <span className="pl-edge" aria-hidden />
      <span className="pl-spot" ref={spot} aria-hidden />
      {p.badge && <span className="badge">{p.badge}</span>}

      <div className="pl-top" aria-hidden>
        <span className="pl-lvl">Уровень 0{i + 1}</span>
        <span className="pl-pips">
          {PLANS.map((_, k) => (
            <i key={k} className={k <= i ? "on" : undefined} />
          ))}
        </span>
      </div>

      <StoryStrip count={stories} plan={p} />

      <div className="pl-head">
        <h3>{p.name}</h3>
        <span className="pl-tag">{p.tagline}</span>
      </div>
      <p className="pl-hook">{p.hook}</p>

      <div className="price">
        <PriceCount value={parseInt(p.price.replace(/\D/g, ""), 10)} />
        <span>сомони / месяц</span>
      </div>
      <p className="pl-per">{p.perVideo}</p>

      <dl className="pl-stats">
        {p.stats.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>{s.n}</dd>
          </div>
        ))}
      </dl>

      <div className="pl-groups">
        {p.groups.map((g) => (
          <div key={g.title} className="pl-group">
            <h4>{g.title}</h4>
            <ul>
              {g.items.map((it) => (
                <li key={it.text} className={it.isNew ? "is-new" : undefined} style={{ ["--i" as string]: idx++ }}>
                  {it.isNew ? <Spark /> : <Check />}
                  <span>{it.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pl-feel">
        <span>Что вы почувствуете</span>
        <b>{p.feel}</b>
      </div>

      {/* «запечатанный» результат: интрига — нажмите, чтобы увидеть, что будет через 30 дней */}
      <div className={`pl-seal${sealed ? "" : " open"}`}>
        <p className="result" aria-hidden={sealed}>
          <b>Через 30 дней:</b> {p.result}
        </p>
        <button
          type="button"
          className="pl-seal-cover"
          aria-expanded={!sealed}
          tabIndex={sealed ? 0 : -1}
          onClick={() => setSealed(false)}
        >
          <i className="pl-lock">
            <Lock />
          </i>
          <span>
            <b>Запечатано</b>
            Что изменится через 30 дней? Нажмите
          </span>
        </button>
      </div>

      <button className={`btn ${p.badge ? "btn-primary" : "btn-secondary"}`} onClick={() => openModal(p.name)}>
        {p.cta}
      </button>
    </article>
  );
}

export function Pricing() {
  const { openModal } = useUI();
  return (
    <section id="pricing">
      <div className="pl-aura" aria-hidden />
      <div className="container">
        <div className="reveal-group" style={{ textAlign: "center" }}>
          <span className="eyebrow reveal"><span className="reveal-inner">Тарифы</span></span>
          <h2 className="h2 reveal">
            <span className="reveal-inner">Выберите свой уровень</span>
          </h2>
          <p className="lede rise" style={{ margin: "14px auto 0" }}>
            Не набор услуг, а система: стратегия, съёмка на кинокамеру и продвижение в одном пакете. Чем выше уровень — тем меньше вы делаете сами.
          </p>
          <p className="pl-hint rise">
            <i /> В каждом тарифе есть запечатанный результат — откройте его
          </p>
        </div>

        <div className="pricing-grid">
          {PLANS.map((p, i) => (
            <PlanCard key={p.name} p={p} i={i} />
          ))}
        </div>

        <div className="pl-help rise">
          <p>Не знаете, какой тариф ваш? Расскажите о бизнесе, и мы подскажем, с чего начать.</p>
          <button type="button" className="btn btn-secondary" onClick={() => openModal()}>
            Получить совет бесплатно
          </button>
        </div>

        <div className="pricing-note rise">
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="1.8" aria-hidden>
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
            Старт работы — после предоплаты
          </span>
        </div>
      </div>
    </section>
  );
}
