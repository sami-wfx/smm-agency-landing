"use client";

import { EquipmentViewer } from "./EquipmentViewer";

const BENEFITS = ["Кино-картинка в каждом Reels", "Слоу-мо 120 к/с для ярких акцентов", "Плавные проезды вместо «тряски с телефона»"];

/** Блок «Наше оборудование»: 3D-сцена . */
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

        <p className="eq-credit">
          Фото камеры и объектива: Henry Söderlund,{" "}
          <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">CC BY 2.0</a> (
          <a href="https://commons.wikimedia.org/wiki/File:Sony_FX30_with_Sony_E_10-20mm_F4_PZ_G_-_by_Henry_S%C3%B6derlund_(52445895581).jpg" target="_blank" rel="noopener noreferrer">камера</a>,{" "}
          <a href="https://commons.wikimedia.org/wiki/File:Sony_E_10-20mm_F4_PZ_G_-_by_Henry_S%C3%B6derlund_(52177409524).jpg" target="_blank" rel="noopener noreferrer">объектив</a>
          ). Фон удалён, кадр обрезан.
        </p>
      </div>
    </section>
  );
}
