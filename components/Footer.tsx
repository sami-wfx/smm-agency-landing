import { IMG } from "@/lib/images";
import { NAV_LINKS } from "@/lib/content";
import { CHANNEL_LABEL, channelLink, channels, leadMessage } from "@/lib/site";
import { AnchorLink } from "./AnchorLink";

export function Footer() {
  const list = channels();
  return (
    <footer>
      <div className="container">
        <div className="f-grid">
          <div className="f-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.logo.src} alt="TRIOCRASH" width={IMG.logo.width} height={IMG.logo.height} loading="lazy" decoding="async" />
            <p>Reels-продюсеры и бренд-продюсеры из Таджикистана. Делаем бренды, о которых говорят.</p>
          </div>
          <nav className="f-col" aria-label="Разделы сайта">
            <span className="f-t">Разделы</span>
            {NAV_LINKS.map((l) => (
              <AnchorLink key={l.href} href={l.href}>
                {l.label}
              </AnchorLink>
            ))}
          </nav>
          <div className="f-col">
            <span className="f-t">Связаться</span>
            {list.map((ch) => (
              <a key={ch} href={channelLink(ch, leadMessage({}))} target="_blank" rel="noopener noreferrer">
                {CHANNEL_LABEL[ch]}
              </a>
            ))}
            <AnchorLink href="#contacts">Оставить заявку</AnchorLink>
          </div>
        </div>
        <div className="f-word" aria-hidden>
          TRIOCRASH
        </div>
        <div className="f-bottom">
          <p>© {new Date().getFullYear()} TRIOCRASH. Reels-продакшн, Таджикистан.</p>
          <AnchorLink href="#top" className="f-up">
            Наверх <i aria-hidden>↑</i>
          </AnchorLink>
        </div>
      </div>
    </footer>
  );
}
