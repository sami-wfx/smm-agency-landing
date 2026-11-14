"use client";

import { ChannelButtons } from "./ChannelButtons";
import { useUI } from "./UIProvider";

export function Contacts() {
  const { openModal } = useUI();
  return (
    <section id="contacts">
      <div className="container">
        <div className="cta reveal-group">
          <span className="eyebrow reveal"><span className="reveal-inner">Следующий шаг</span></span>
          <h2 className="cta-h reveal">
            <span className="reveal-inner">
              Давайте сделаем бренд, о&nbsp;котором <em>заговорят</em>
            </span>
          </h2>
          <p className="cta-p rise">Расскажите о проекте — предложим стратегию и просчитаем результат под ваш бюджет.</p>
          <div className="ctas rise">
            <button className="btn btn-primary with-arrow" onClick={() => openModal()}>
              Обсудить проект
              <span className="arrow" aria-hidden>→</span>
            </button>
            <ChannelButtons primaryFirst={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
