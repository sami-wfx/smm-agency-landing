"use client";

import { ChannelButtons } from "./ChannelButtons";
import { useUI } from "./UIProvider";

export function Contacts() {
  const { openModal } = useUI();
  return (
    <section id="contacts">
      <div className="container">
        <div className="panel reveal-group">
          <h2 className="reveal"><span className="reveal-inner">Напишите нам — подберём лучший тариф</span></h2>
          <p className="rise">Расскажите о проекте — предложим стратегию и просчитаем результат под ваш бюджет.</p>
          <div className="ctas rise">
            <ChannelButtons />
            <button className="btn btn-secondary" onClick={() => openModal()}>
              Оставить заявку
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
