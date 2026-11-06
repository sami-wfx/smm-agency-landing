"use client";

import { EquipmentPhone as EquipmentViewer } from "./EquipmentPhone";

const BENEFITS = ["Кино-картинка в каждом Reels", "Слоу-мо 120 к/с для ярких акцентов", "Плавные проезды вместо «тряски с телефона»"];

/** Блок «Наше оборудование»: 3D-сцена Sony FX30 + объектив + Ronin RS 4 Pro, вкладки и характеристики. */
export function Equipment() {
  return (
    <section id="equipment">
      <div className="container">
        <div className="reveal-group">
          <span className="eyebrow reveal"><span className="reveal-inner">Наше оборудование</span></span>
          <h2 className="h2 reveal">
            <span className="reveal-inner">Снимаем как в кино: FX30 и Ronin RS 4 Pro</span>
          </h2>
          <p className="lede rise">
            Это не телефон и не «любительская камера». Мы снимаем на кинокамеру с хорошим объективом и стабилизатором — поэтому
            ваш бренд в ленте выглядит дороже конкурентов.
          </p>
        </div>

        <div className="eq-view">
          <EquipmentViewer />
        </div>

        <ul className="rise mt-6 flex flex-wrap gap-3">
          {BENEFITS.map((b) => (
            <li
              key={b}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-[13px] text-[var(--fg2)]"
            >
              <span className="h-1.5 w-1.5 rotate-45 bg-[var(--lime)]" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
