const ITEMS = ["Reels-продакшн", "Sony FX30", "Бренд-продюсеры", "Ronin RS4", "4K · 120 fps", "S-Cinetone", "С нуля до узнаваемости", "Таджикистан"];

/** Бегущая строка под первым экраном. Строка продублирована, чтобы цикл был бесшовным. */
export function Marquee() {
  const row = (aria?: boolean) => (
    <div className="marquee-item" aria-hidden={aria}>
      {ITEMS.map((t, i) => (
        <span key={t} className="contents">
          {i % 2 === 1 ? <b>{t}</b> : t}
          <i />
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee" role="presentation">
      <div className="marquee-track">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
