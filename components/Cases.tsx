"use client";

import { useState } from "react";
import cases from "@/data/cases.json";
import type { CaseItem } from "@/lib/content";
import { asset } from "@/lib/asset";
import { Counter } from "./Counter";

function CaseCard({ c, i }: { c: CaseItem; i: number }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="case rise" style={{ transitionDelay: `${((i % 3) * 0.1).toFixed(1)}s` }}>
      {c.beforeImage && c.afterImage && (
        <div className="ba">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ba-after" src={asset(c.afterImage)} alt="После" loading="lazy" />
          <div className="ba-before-wrap" style={{ width: `${pos}%` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ba-before" src={asset(c.beforeImage)} alt="До" loading="lazy" />
          </div>
          <div className="ba-divider" style={{ left: `${pos}%` }} />
          <span className="ba-tag ba-tag-before">До</span>
          <span className="ba-tag ba-tag-after">После</span>
          <input
            type="range"
            className="ba-range"
            min={0}
            max={100}
            value={pos}
            aria-label="Сравнить до и после"
            onChange={(e) => setPos(Number(e.target.value))}
          />
        </div>
      )}
      <span className="niche">{c.niche}</span>
      <h3>{c.title}</h3>
      {c.youtubeUrl && (
        <a className="case-video" href={c.youtubeUrl} target="_blank" rel="noopener noreferrer">
          Смотреть видео
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17 17 7M7 7h10v10" />
          </svg>
        </a>
      )}
      <div className="metric">
        <Counter target={c.metricTarget} prefix={c.metricPrefix} suffix={c.metricSuffix} decimals={c.metricDecimals} />
      </div>
      <div className="metric-label">{c.metricLabel}</div>
    </div>
  );
}

export function Cases() {
  return (
    <section id="cases">
      <div className="container">
        <div className="reveal-group">
          <span className="eyebrow reveal"><span className="reveal-inner">Кейсы</span></span>
          <h2 className="h2 reveal"><span className="reveal-inner">Результаты, а не обещания</span></h2>
        </div>
        <div className="cases-grid">
          {(cases as CaseItem[]).map((c, i) => (
            <CaseCard key={c.id} c={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
