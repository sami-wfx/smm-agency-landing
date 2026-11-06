"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useUI } from "./UIProvider";

export function LeadModal() {
  const { modalOpen, closeModal, plan } = useUI();
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (modalOpen) {
      setSent(false);
      formRef.current?.reset();
    }
  }, [modalOpen]);

  const note = plan
    ? `Выбранный тариф: ${plan}. Оставьте контакт — мы свяжемся в течение дня.`
    : "Оставьте контакт — подберём лучший тариф под вашу задачу.";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: подключить реальную отправку заявки (API / Telegram-бот), когда будет готов бэкенд.
    setSent(true);
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          id="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <motion.div
            id="modal"
            className={sent ? "sent" : ""}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 32, restDelta: 0.01 }}
          >
            <button className="close" aria-label="Закрыть" onClick={closeModal}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <form ref={formRef} onSubmit={onSubmit}>
              <h3 id="modal-title">Обсудим ваш проект</h3>
              <p className="plan-note">{note}</p>
              <div>
                <label htmlFor="f-name">Имя</label>
                <input id="f-name" name="name" type="text" placeholder="Как вас зовут?" required />
              </div>
              <div>
                <label htmlFor="f-contact">Телефон или Telegram</label>
                <input id="f-contact" name="contact" type="text" placeholder="+992 ___ ___ ___ или @username" required />
              </div>
              <div>
                <label htmlFor="f-note">Комментарий</label>
                <textarea id="f-note" name="note" rows={3} placeholder="Коротко о проекте (необязательно)" />
              </div>
              <button type="submit" className="btn btn-primary submit">
                Отправить заявку
              </button>
            </form>
            <div className="success">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="10" />
                <path d="m8 12.5 2.5 2.5L16 9.5" />
              </svg>
              <h3>Заявка отправлена!</h3>
              <p>Мы свяжемся с вами в ближайшее время. Спасибо за интерес к TRIOCRASH.</p>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Закрыть
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
