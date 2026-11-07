"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { asset } from "@/lib/asset";

/**
 * «Наше оборудование» — фото-реалистичный просмотр: вырезанные студийные фото Sony FX30, объектива и Ronin RS 4 Pro.
 * Ракурсы переключаются поворотом (свайп / стрелки / кнопки), фото слегка наклоняются за курсором и «дышат»,
 * по ним пробегает блик, а на деталях стоят подсказки. Файлы — в /public/equipment.
 */
type Spot = { x: number; y: number; label: string; rec?: boolean };
type View = {
  id: string;
  label: string;
  src: string;
  ratio: number; // ширина / высота снимка
  spots: Spot[];
  zoom?: { x: number; y: number; s: number }; // приближение к точке (в % снимка)
};
type Tab = "all" | "camera" | "lens" | "gimbal";

const VIEWS: Record<Exclude<Tab, "all">, View[]> = {
  camera: [
    {
      id: "c34", label: "3/4", src: "equipment/fx30-34-hd.webp", ratio: 1900 / 1147,
      spots: [
        { x: 37, y: 60, label: "Объектив Sony E PZ 10–20 mm F4 G" },
        { x: 75, y: 85, label: "Кнопка REC", rec: true },
        { x: 10, y: 15, label: "Рычаг зума и спуск на хвате" },
        { x: 55, y: 8, label: "Мультиинтерфейсный башмак" },
        { x: 59, y: 46, label: "Рычаг Power Zoom W/T" },
        { x: 18, y: 67, label: "Фильтр Ø62 мм" },
      ],
    },
    {
      id: "cfront", label: "Спереди", src: "equipment/fx30-front.webp", ratio: 629 / 386,
      spots: [
        { x: 57, y: 53, label: "Байонет Sony E и матрица Super 35" },
        { x: 90, y: 88, label: "Кнопка REC", rec: true },
        { x: 15, y: 60, label: "Хват с текстурой" },
      ],
    },
    {
      id: "ctop", label: "Сверху", src: "equipment/fx30-top.webp", ratio: 655 / 562,
      spots: [
        { x: 40, y: 20, label: "E 4/PZ 10–20 G" },
        { x: 73, y: 70, label: "Кнопка REC", rec: true },
        { x: 78, y: 54, label: "Кнопки IRIS · WB · ISO" },
        { x: 40, y: 70, label: "Мультиинтерфейсный башмак" },
      ],
    },
  ],
  lens: [
    {
      id: "lsolo", label: "Объектив", src: "equipment/lens-solo.webp", ratio: 1100 / 1785,
      spots: [
        { x: 50, y: 20, label: "Бленда с лепестками" },
        { x: 50, y: 37, label: "Кольцо ручного зума" },
        { x: 50, y: 46, label: "E 4/PZ 10–20 G" },
        { x: 22, y: 45, label: "Линейка G (G Lens)" },
        { x: 14, y: 44, label: "Переключатель зума W/T" },
        { x: 50, y: 66, label: "Байонет Sony E" },
      ],
    },
    {
      id: "lfront", label: "На камере", src: "equipment/fx30-34-hd.webp", ratio: 1900 / 1147, zoom: { x: 37, y: 60, s: 1.55 },
      spots: [
        { x: 37, y: 60, label: "Передняя линза, фильтр Ø62 мм" },
        { x: 59, y: 46, label: "Кольцо зума (Power Zoom)" },
        { x: 18, y: 67, label: "Мин. дистанция 0,20 м" },
      ],
    },
    {
      id: "ltop", label: "Сверху", src: "equipment/fx30-top.webp", ratio: 655 / 562, zoom: { x: 40, y: 24, s: 1.35 },
      spots: [
        { x: 40, y: 20, label: "E 4/PZ 10–20 G" },
        { x: 20, y: 28, label: "Переключатели на объективе" },
      ],
    },
  ],
  gimbal: [
    {
      id: "gfront", label: "Спереди", src: "equipment/rs4-front.webp", ratio: 407 / 729,
      spots: [
        { x: 9, y: 17, label: "Мотор наклона" },
        { x: 42, y: 31, label: "Пластина быстрого крепления" },
        { x: 54, y: 48, label: "Мотор панорамы" },
        { x: 55, y: 74, label: "Рукоять" },
        { x: 27, y: 95, label: "Складные ножки-штатив" },
      ],
    },
    {
      id: "gleft", label: "Сбоку", src: "equipment/rs4-left.webp", ratio: 310 / 428,
      spots: [
        { x: 59, y: 24, label: "Карбоновый рычаг RONIN" },
        { x: 12, y: 37, label: "Боковая рукоять" },
        { x: 57, y: 70, label: "Рукоять: спуск, джойстик, экран" },
      ],
    },
    {
      id: "gright", label: "С другой стороны", src: "equipment/rs4-right.webp", ratio: 317 / 455,
      spots: [
        { x: 52, y: 67, label: "Рукоять" },
        { x: 83, y: 36, label: "Боковая рукоять" },
      ],
    },
  ],
};

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "Комплект" },
  { id: "camera", label: "Камера" },
  { id: "lens", label: "Объектив" },
  { id: "gimbal", label: "Ронин" },
];

const INFO: Record<Tab, { tag: string; title: string; text: string; specs: [string, string][] }> = {
  all: {
    tag: "Как мы снимаем",
    title: "Кинокамера на стабилизаторе",
    text: "Кинокамера с хорошим объективом на трёхосевом стабилизаторе. Так выглядит каждый наш ролик: ровная картинка, плавные проезды, кино-цвет.",
    specs: [["Видео", "4K до 120 к/с"], ["Камера", "646 г"], ["Стабилизатор", "до 4,5 кг"]],
  },
  camera: {
    tag: "Кинокамера · Cinema Line",
    title: "Sony FX30",
    text: "Компактная кинокамера: картинка как в кино прямо из камеры, без долгой цветокоррекции.",
    specs: [["Сенсор", "Super 35 (APS-C)"], ["Видео", "4K до 120 к/с, 10 бит 4:2:2"], ["Цвет", "S-Cinetone"], ["Размер", "129,7 × 77,8 × 84,5 мм, 646 г"]],
  },
  lens: {
    tag: "Байонет Sony E · G",
    title: "Sony E PZ 10–20 mm F4 G",
    text: "Широкоугольный зум с постоянной светосилой F4 и моторизованным зумом: в кадр помещаются интерьеры и люди, картинка остаётся чёткой по всему полю.",
    specs: [["Фокусное", "10–20 мм (APS-C)"], ["Светосила", "F4 на всём диапазоне"], ["Зум", "моторизованный (Power Zoom)"], ["Фильтр", "Ø62 мм"]],
  },
  gimbal: {
    tag: "3-осевой стабилизатор",
    title: "DJI Ronin RS 4 Pro",
    text: "Плавные проезды и «летящие» кадры без дрожи: Reels, который хочется досматривать до конца.",
    specs: [["Оси", "3, панорама без ограничений"], ["Нагрузка", "до 4,5 кг"], ["Рычаги", "карбоновые"], ["Управление", "джойстик, спуск, диск, экран"]],
  },
};

function Photo({ v, active }: { v: View; active: string | null }) {
  const src = asset(v.src);
  const z = v.zoom;
  return (
    <div
      className="eqv-photo"
      style={{
        ["--r" as string]: v.ratio,
        transform: z ? `scale(${z.s}) translate(${50 - z.x}%, ${50 - z.y}%)` : undefined,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" draggable={false} />
      <span className="eqv-shine" style={{ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }} />
      {v.spots.map((s) => (
        <button
          key={s.label}
          type="button"
          className={`eqv-spot${s.rec ? " rec" : ""}${active === s.label ? " open" : ""}`}
          data-side={s.x < 28 ? "l" : s.x > 72 ? "r" : "c"}
          style={{ left: `${s.x}%`, top: `${s.y}%`, ["--zi" as string]: z ? 1 / z.s : 1 }}
          aria-label={s.label}
        >
          <i />
          <span>{s.label}</span>
        </button>
      ))}
    </div>
  );
}

export function EquipmentViewer() {
  const [tab, setTab] = useState<Tab>("all");
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [open, setOpen] = useState<string | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);

  const list = tab === "all" ? null : VIEWS[tab];
  const view = list ? list[Math.min(idx, list.length - 1)] : null;

  const go = (d: number) => {
    if (!list) return;
    setDir(d);
    setIdx((i) => (i + d + list.length) % list.length);
    setOpen(null);
  };
  const pick = (i: number) => {
    if (!list || i === idx) return;
    setDir(i > idx ? 1 : -1);
    setIdx(i);
    setOpen(null);
  };
  const info = INFO[tab];

  return (
    <div className="eqp">
      <div
        ref={stage}
        className="eqv-stage"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, moved: false };
        }}
        onPointerMove={(e) => {
          const el = stage.current;
          if (el && e.pointerType === "mouse") {
            const r = el.getBoundingClientRect();
            el.style.setProperty("--tx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
            el.style.setProperty("--ty", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
          }
        }}
        onPointerLeave={() => {
          stage.current?.style.setProperty("--tx", "0");
          stage.current?.style.setProperty("--ty", "0");
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          if (!d) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
        onPointerCancel={() => (drag.current = null)}
      >
        <div className="eqv-floor" aria-hidden />
        <div className="eqv-tilt">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={tab + (view?.id ?? "kit")}
              className="eqv-slide"
              custom={dir}
              initial={{ opacity: 0, rotateY: 26 * dir, x: 56 * dir, scale: 0.94 }}
              animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -26 * dir, x: -56 * dir, scale: 0.94 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => {
                const t = (e.target as HTMLElement).closest(".eqv-spot") as HTMLElement | null;
                setOpen(t ? t.getAttribute("aria-label") : null);
              }}
            >
              {view ? (
                <div className={`eqv-frame${view.zoom ? " zoomed" : ""}`}>
                  <Photo v={view} active={open} />
                </div>
              ) : (
                <div className="eqv-kit">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="eqv-kit-gimbal" src={asset("equipment/rs4-front.webp")} alt="DJI Ronin RS 4 Pro" draggable={false} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="eqv-kit-cam" src={asset("equipment/fx30-34-hd.webp")} alt="Sony FX30 с объективом" draggable={false} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {list && list.length > 1 && (
          <>
            <button type="button" className="eqv-arrow l" aria-label="Предыдущий ракурс" onClick={() => go(-1)}>‹</button>
            <button type="button" className="eqv-arrow r" aria-label="Следующий ракурс" onClick={() => go(1)}>›</button>
          </>
        )}
        <div className="eqv-views" role="tablist" aria-label="Ракурс">
          {list?.map((v, i) => (
            <button key={v.id} role="tab" aria-selected={i === idx} className={i === idx ? "on" : ""} onClick={() => pick(i)}>
              {v.label}
            </button>
          ))}
        </div>
        <span className="eqp-hint" aria-hidden>{list ? "Листайте ракурсы · нажмите на точку" : "Выберите вкладку, чтобы рассмотреть"}</span>
      </div>

      <div className="eqp-tabs" role="tablist" aria-label="Что показать">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? "on" : ""}
            onClick={() => {
              setTab(t.id);
              setIdx(0);
              setDir(1);
              setOpen(null);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="eqp-card" role="tabpanel" key={tab}>
        <span className="eqp-tag">{info.tag}</span>
        <h3>{info.title}</h3>
        <p>{info.text}</p>
        <dl>
          {info.specs.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
