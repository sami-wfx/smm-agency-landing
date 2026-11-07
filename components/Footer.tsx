import { IMG } from "@/lib/images";
import { CHANNEL_LABEL, channelLink, channels, leadMessage, type Channel } from "@/lib/site";

const ICON: Record<Channel, React.ReactNode> = {
  telegram: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />,
  whatsapp: (
    <>
      <path d="M3 21l1.6-4.9A8.5 8.5 0 1 1 8 19.4L3 21Z" />
      <path d="M9 9.5c.3 2.2 2.3 4.2 4.5 4.5l1.2-1.2-1.8-1-.8.6a3 3 0 0 1-1.6-1.6l.6-.8-1-1.8L9 9.5Z" />
    </>
  ),
};

export function Footer() {
  const list = channels();
  return (
    <footer>
      <div className="container row">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG.logo.src} alt="TRIOCRASH" width={IMG.logo.width} height={IMG.logo.height} loading="lazy" decoding="async" />
        <p className="copy">© {new Date().getFullYear()} TRIOCRASH. Reels-продакшн, Таджикистан.</p>
        {list.length > 0 && (
          <div className="social">
            {list.map((ch) => (
              <a key={ch} href={channelLink(ch, leadMessage({}))} target="_blank" rel="noopener noreferrer" aria-label={CHANNEL_LABEL[ch]}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>{ICON[ch]}</svg>
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
