/** Временный переключатель вариантов надписи Hero (виден только при ?w=… в адресе). Убрать после выбора. */
const VARIANTS = [
  ["0", "Как сейчас"],
  ["1", "Видоискатель"],
  ["2", "Склейки"],
  ["3", "Волна"],
] as const;

export function VariantPick() {
  return (
    <nav className="pick" aria-label="Варианты надписи">
      <span className="pick-t">Надпись</span>
      {VARIANTS.map(([v, name]) => (
        <a key={v} href={`?w=${v}`} data-v={v} title={name}>
          <b>{v}</b>
          <span>{name}</span>
        </a>
      ))}
    </nav>
  );
}
