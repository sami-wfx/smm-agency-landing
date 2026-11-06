"use client";

import { STATS } from "@/lib/content";
import { Counter } from "./Counter";
import { HeroCanvas } from "./HeroCanvas";
import { useUI } from "./UIProvider";
import { AnchorLink } from "./AnchorLink";

export function Hero() {
  const { openModal } = useUI();
  return (
    <section id="hero">
      <HeroCanvas />
      <div className="container inner">
        <div className="reveal-group">
          <span className="tag rise">
            <span className="dot" />
            Reels-продакшн · Таджикистан
          </span>
          <h1 className="hero-h1">
            <span className="reveal">
              <span className="reveal-inner">
                Ведём бизнес <span className="accent">с нуля</span> до узнаваемости
              </span>
            </span>
          </h1>
          <p className="hero-p rise">
            Мы не SMM-щики. Мы Reels-продюсеры и бренд-продюсеры: снимаем на кинокамеру Sony FX30, строим бренд с нуля и
            доводим его до узнаваемости в Таджикистане.
          </p>
          <div className="ctas rise">
            <button className="btn btn-primary with-arrow" onClick={() => openModal()}>
              Обсудить проект<span className="arrow">↗</span>
            </button>
            <AnchorLink href="#cases" className="btn btn-secondary">
              Смотреть кейсы
            </AnchorLink>
          </div>
          <div className="stats rise">
            {STATS.map((s) => (
              <div className="stat" key={s.label}>
                <b>
                  <Counter target={s.target} decimals={s.decimals} suffix={s.suffix} />
                </b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
