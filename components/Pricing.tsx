"use client";

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

function PlanCard({ p, i }: { p: Plan; i: number }) {
  const { openModal } = useUI();
  const stories = parseInt(p.stats[1].n, 10);
  let idx = 0;
  return (
    <article
      className={`plan plan-${p.tone} pl rise${p.badge ? " featured" : ""}`}
      style={i ? { transitionDelay: `${i * 0.1}s` } : undefined}
      aria-label={`Тариф «${p.name}»`}
    >
      {p.badge && <span className="badge">{p.badge}</span>}

      <StoryStrip count={stories} plan={p} />

      <div className="pl-head">
        <h3>{p.name}</h3>
        <span className="pl-tag">{p.tagline}</span>
      </div>
      <p className="pl-hook">{p.hook}</p>

      <div className="price">
        <b>{p.price}</b>
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
      <p className="result">
        <b>Через 30 дней:</b> {p.result}
      </p>

      <button className={`btn ${p.tone === "cream" ? "btn-secondary" : "btn-primary"}`} onClick={() => openModal(p.name)}>
        {p.cta}
      </button>
    </article>
  );
}

export function Pricing() {
  const { openModal } = useUI();
  return (
    <section id="pricing">
      <div className="container">
        <div className="reveal-group" style={{ textAlign: "center" }}>
          <span className="eyebrow reveal"><span className="reveal-inner">Тарифы</span></span>
          <h2 className="h2 reveal">
            <span className="reveal-inner">Каким станет ваш бренд через 30 дней?</span>
          </h2>
          <p className="lede rise" style={{ margin: "14px auto 0" }}>
            Команда, кинокамера и система в одном пакете. Вы платите раз в месяц, а контент работает на вас каждый день.
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
