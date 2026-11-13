import clients from "@/data/clients.json";
import type { ClientItem } from "@/lib/content";
import { asset } from "@/lib/asset";

/**
 * «Наши клиенты»: два ряда плашек (логотип + название), едут в разные стороны, по краям затухают.
 * Список — data/clients.json, логотипы — public/clients/.
 * Пока клиентов нет, вместо них показываются ниши (NICHES) с другим заголовком.
 */
const NICHES: ClientItem[] = [
  "Ресторан",
  "Beauty-бренд",
  "Личный бренд",
  "Блогер",
  "Кофейня",
  "Магазин",
  "Клиника",
  "Салон красоты",
  "Эксперт",
  "Фитнес",
  "Школа",
  "Отель",
].map((name) => ({ name }));

function Chip({ c }: { c: ClientItem }) {
  return (
    <li className="client">
      {c.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset(c.logo)} alt="" width={40} height={40} loading="lazy" decoding="async" draggable={false} />
      ) : (
        <span className="client-ph" aria-hidden>
          {c.name.trim().charAt(0).toUpperCase()}
        </span>
      )}
      <span className="client-n">{c.name}</span>
    </li>
  );
}

/** Одна лента: набор повторяется, чтобы заполнить ширину, и дублируется для бесшовной прокрутки на -50%. */
function Row({ items, reverse }: { items: ClientItem[]; reverse?: boolean }) {
  const reps = Math.max(1, Math.ceil(10 / items.length));
  const set = Array.from({ length: reps }, () => items).flat();
  return (
    <div className={`clients-row${reverse ? " rev" : ""}`}>
      <ul className="clients-track">
        {set.map((c, i) => (
          <Chip key={i} c={c} />
        ))}
        {set.map((c, i) => (
          <Chip key={`d${i}`} c={c} />
        ))}
      </ul>
    </div>
  );
}

export function Clients() {
  const real = clients as ClientItem[];
  const list = real.length ? real : NICHES;
  // чётные — в верхний ряд, нечётные — в нижний (при одном клиенте ряды одинаковые)
  const a = list.filter((_, i) => i % 2 === 0);
  const b = list.filter((_, i) => i % 2 === 1);
  return (
    <section id="clients" aria-label={real.length ? "Наши клиенты" : "С кем мы работаем"}>
      <div className="container">
        <div className="reveal-group clients-head">
          <span className="eyebrow reveal"><span className="reveal-inner">{real.length ? "Клиенты" : "Ниши"}</span></span>
          <h2 className="h2 reveal"><span className="reveal-inner">{real.length ? "Наши клиенты" : "С кем мы работаем"}</span></h2>
          <p className="clients-sub rise">{real.length ? "Бренды, компании и блогеры, с которыми мы работаем" : "Бизнесы и личные бренды, которым мы делаем Reels и узнаваемость"}</p>
        </div>
      </div>
      <div className="clients-rows rise">
        <Row items={a} />
        <Row items={b.length ? b : a} reverse />
      </div>
    </section>
  );
}
