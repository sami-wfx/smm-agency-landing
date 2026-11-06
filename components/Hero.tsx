"use client";

import { HERO_NICHES, HERO_VS } from "@/lib/content";
import { HeroCanvas } from "./HeroCanvas";
import { useUI } from "./UIProvider";
import { AnchorLink } from "./AnchorLink";

export function Hero() {
  const { openModal } = useUI();
  return (
    <section id="hero">
      <HeroCanvas />
      <div className="container inner">
        <div className="reveal-group hero-copy">
          <span className="tag rise">
            <span className="dot" />
            Reels-продюсеры · Таджикистан
          </span>

          <h1 className="hero-h1">
            <span className="reveal">
              <span className="reveal-inner hero-neg">
                Не <s>SMM-щики</s>.
              </span>
            </span>
            <span className="reveal">
              <span className="reveal-inner">
                Ведём бизнес <span className="accent">с нуля</span> до узнаваемости
              </span>
            </span>
          </h1>

          <p className="hero-p rise">
            Снимаем Reels на кинокамеру, а не на телефон: сценарий, свет, стабилизатор и монтаж — как в рекламном ролике.
          </p>

          <div className="ctas rise">
            <button className="btn btn-primary with-arrow" onClick={() => openModal()}>
              Обсудить проект<span className="arrow">↗</span>
            </button>
            <AnchorLink href="#cases" className="link-quiet">
              Смотреть кейсы <span aria-hidden>↓</span>
            </AnchorLink>
          </div>

          <ul className="vs rise" aria-label="Чем мы отличаемся от обычных SMM-щиков">
            {HERO_VS.map((r) => (
              <li key={r.us}>
                <span className="vs-them">{r.them}</span>
                <span className="vs-arrow" aria-hidden>→</span>
                <span className="vs-us">{r.us}</span>
              </li>
            ))}
          </ul>

          <p className="hero-proof rise">
            Уже работаем с {HERO_NICHES} · тарифы от 6 000 сомони в месяц
          </p>
        </div>
      </div>

      <AnchorLink href="#equipment" className="scroll-cue" aria-label="Листайте вниз: оборудование и кейсы">
        <span className="scroll-mouse" aria-hidden><i /></span>
        <span>Листайте — дальше наше оборудование</span>
      </AnchorLink>
    </section>
  );
}
