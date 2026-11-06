"use client";

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
            <span className="btn-disabled" title="Скоро здесь появится ссылка на Telegram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
              </svg>
              Telegram скоро
            </span>
            <button className="btn btn-secondary" onClick={() => openModal()}>
              Оставить заявку
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
