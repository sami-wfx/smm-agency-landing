"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useUI } from "./UIProvider";
import { ChannelButtons } from "./ChannelButtons";
import { hasChannels, leadMessage } from "@/lib/site";

/**
 * Заявка уходит в мессенджер самого клиента: форма собирает текст и предлагает открыть
 * Telegram / WhatsApp с готовым сообщением. Серверной части нет, поэтому «успех» не выдумываем:
 * пока каналы не заполнены в lib/site.ts, форма честно сообщает, что приём не настроен.
 */
export function LeadModal() {
  const { modalOpen, closeModal, plan } = useUI();
  const [message, setMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const ready = hasChannels();

  // фокус: при открытии — в первое поле, при закрытии — возврат на кнопку, открывшую окно
  useEffect(() => {
    if (modalOpen) {
      opener.current = document.activeElement as HTMLElement | null;
      const t = setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("input, a, button")?.focus(), 60);
      return () => clearTimeout(t);
    }
    opener.current?.focus?.();
  }, [modalOpen]);

  // удерживаем Tab внутри окна
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const els = dialogRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, textarea");
    if (!els?.length) return;
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const note = plan
    ? `Выбранный тариф: ${plan}. Оставьте контакт — мы свяжемся в течение дня.`
    : "Оставьте контакт — подберём лучший тариф под вашу задачу.";

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ready) return;
    const f = new FormData(e.currentTarget);
    setMessage(
      leadMessage({
        plan,
        name: String(f.get("name") ?? "").trim(),
        contact: String(f.get("contact") ?? "").trim(),
        note: String(f.get("note") ?? "").trim(),
      }),
    );
  };

  return (
    <AnimatePresence onExitComplete={() => setMessage(null)}>
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
            ref={dialogRef}
            className={message ? "sent" : ""}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onKeyDown={onKeyDown}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 32, restDelta: 0.01 }}
          >
            <button className="close" aria-label="Закрыть" onClick={closeModal}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <form ref={formRef} onSubmit={onSubmit}>
              <h3 id="modal-title">Обсудим ваш проект</h3>
              <p className="plan-note">{note}</p>
              {!ready && (
                <p className="form-warn" role="status">
                  Приём заявок через сайт сейчас настраивается. Попробуйте чуть позже.
                </p>
              )}
              <div>
                <label htmlFor="f-name">Имя</label>
                <input id="f-name" name="name" type="text" autoComplete="name" placeholder="Как вас зовут?" required />
              </div>
              <div>
                <label htmlFor="f-contact">Телефон или Telegram</label>
                <input id="f-contact" name="contact" type="text" autoComplete="tel" placeholder="+992 ___ ___ ___ или @username" required />
              </div>
              <div>
                <label htmlFor="f-note">Комментарий</label>
                <textarea id="f-note" name="note" rows={3} placeholder="Коротко о проекте (необязательно)" />
              </div>
              <button type="submit" className="btn btn-primary submit" disabled={!ready}>
                Подготовить заявку
              </button>
            </form>

            <div className="success" aria-live="polite">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <circle cx="12" cy="12" r="10" />
                <path d="m8 12.5 2.5 2.5L16 9.5" />
              </svg>
              <h3>Заявка готова</h3>
              <p>Нажмите на мессенджер — сообщение с вашими данными уже написано, останется только отправить.</p>
              <div className="success-actions">
                {message && <ChannelButtons message={message} />}
              </div>
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
