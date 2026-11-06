import { PROCESS } from "@/lib/content";

export function Process() {
  return (
    <section id="process">
      <div className="container">
        <div className="reveal-group">
          <span className="eyebrow reveal"><span className="reveal-inner">Как мы работаем</span></span>
          <h2 className="h2 reveal"><span className="reveal-inner">Прозрачный процесс от звонка до результата</span></h2>
        </div>

        <div className="process-line">
          <svg viewBox="0 0 1000 4" preserveAspectRatio="none">
            <defs>
              <linearGradient id="procGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#b8ff3c" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <path d="M0,2 H1000" />
            <path className="fg" id="procPath" d="M0,2 H1000" />
          </svg>
          <div className="process-steps">
            {PROCESS.map((s) => (
              <div className="pstep" key={s.n}>
                <span className="dot" />
                <b>{s.n}</b>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
