import { asset } from "@/lib/asset";

export function Footer() {
  return (
    <footer>
      <div className="container row">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("logo-triocrash.png")} alt="TRIOCRASH" />
        <p className="copy">© {new Date().getFullYear()} TRIOCRASH. Все права защищены.</p>
        <div className="social">
          <span title="Скоро здесь появится ссылка на Instagram" aria-label="Instagram (скоро)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" />
            </svg>
          </span>
          <span title="Скоро здесь появится ссылка на Telegram" aria-label="Telegram (скоро)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
            </svg>
          </span>
        </div>
      </div>
    </footer>
  );
}
