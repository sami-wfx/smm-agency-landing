"use client";

import { PLANS } from "@/lib/content";
import { useUI } from "./UIProvider";

const Check = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export function Pricing() {
  const { openModal } = useUI();
  return (
    <section id="pricing">
      <div className="container">
        <div className="reveal-group" style={{ textAlign: "center" }}>
          <span className="eyebrow reveal"><span className="reveal-inner">Тарифы</span></span>
          <h2 className="h2 reveal"><span className="reveal-inner">Продвижение блога под ключ</span></h2>
        </div>

        <div className="pricing-grid">
          {PLANS.map((p, i) => (
            <div
              key={p.name}
              className={`plan plan-${p.tone} rise${p.badge ? " featured" : ""}`}
              style={i ? { transitionDelay: `${i * 0.1}s` } : undefined}
            >
              {p.badge && <span className="badge">{p.badge}</span>}
              <h3>{p.name}</h3>
              <p className="tagline">{p.tagline}</p>
              <div className="price">
                <b>{p.price}</b>
                <span>сомони / месяц</span>
              </div>
              <ul>
                {p.items.map((it) => (
                  <li key={it}>
                    <Check />
                    {it}
                  </li>
                ))}
              </ul>
              <p className="result"><b>Результат:</b> {p.result}</p>
              <button
                className={`btn ${p.tone === "cream" ? "btn-secondary" : "btn-primary"}`}
                onClick={() => openModal(p.name)}
              >
                Выбрать тариф
              </button>
            </div>
          ))}
        </div>

        <div className="pricing-note rise">
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="1.8">
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
