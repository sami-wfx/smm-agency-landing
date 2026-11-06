import { SERVICES, type Service } from "@/lib/content";
import { TiltCard } from "./TiltCard";

const ICONS: Record<Service["icon"], React.ReactNode> = {
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="M16 10l5-3v10l-5-3" />
    </>
  ),
  palette: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="9.5" cy="10" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="9" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
};

export function Services() {
  return (
    <section id="services">
      <div className="container">
        <div className="reveal-group">
          <span className="eyebrow reveal"><span className="reveal-inner">Что мы делаем</span></span>
          <h2 className="h2 reveal">
            <span className="reveal-inner">Профессиональный продакшн: контент, который невозможно пролистать</span>
          </h2>
        </div>
        <div className="grid-4">
          {SERVICES.map((s, i) => (
            <div key={s.num} className="rise" style={{ transitionDelay: `${i * 0.1}s` }}>
              <TiltCard>
                <div className="card">
                  <div className="num">{s.num}</div>
                  <div className="icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      {ICONS[s.icon]}
                    </svg>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
