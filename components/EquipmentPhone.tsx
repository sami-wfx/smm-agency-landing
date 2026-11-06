"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import type { Focus } from "./three/EquipmentPhoneScene";

const Scene = dynamic(() => import("./three/EquipmentPhoneScene"), { ssr: false });

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const TABS: { id: Focus; label: string }[] = [
  { id: "all", label: "Комплект" },
  { id: "camera", label: "Камера" },
  { id: "lens", label: "Объектив" },
  { id: "gimbal", label: "Ронин" },
];

// ракурс при выборе вкладки (угол поворота модели, рад.)
const FOCUS_YAW: Partial<Record<Focus, number>> = { camera: 0.3, lens: 0.1, gimbal: 0.95 };

const INFO: Record<Focus, { tag: string; title: string; text: string; specs: [string, string][] }> = {
  all: {
    tag: "Как мы снимаем",
    title: "Кинокамера на стабилизаторе",
    text: "Кинокамера с хорошим объективом на трёхосевом стабилизаторе. Так выглядит каждый наш ролик: ровная картинка, плавные проезды, кино-цвет.",
    specs: [
      ["Видео", "4K до 120 к/с"],
      ["Камера", "646 г"],
      ["Стабилизатор", "до 4,5 кг"],
    ],
  },
  camera: {
    tag: "Кинокамера · Cinema Line",
    title: "Sony FX30",
    text: "Компактная кинокамера: картинка как в кино прямо из камеры, без долгой цветокоррекции.",
    specs: [
      ["Сенсор", "Super 35 (APS-C)"],
      ["Видео", "4K до 120 к/с, 10 бит 4:2:2"],
      ["Цвет", "S-Cinetone"],
      ["Размер", "129,7 × 77,8 × 84,5 мм, 646 г"],
    ],
  },
  lens: {
    tag: "Байонет Sony E",
    title: "Светосильный объектив",
    text: "Красивое размытие фона, чистая картинка при слабом свете и быстрый автофокус — бренд выглядит дорого.",
    specs: [
      ["Байонет", "Sony E"],
      ["Тип", "зум-объектив"],
      ["Для чего", "портреты, интерьеры, Reels"],
    ],
  },
  gimbal: {
    tag: "3-осевой стабилизатор",
    title: "DJI Ronin RS 4 Pro",
    text: "Плавные проезды и «летящие» кадры без дрожи: Reels, который хочется досматривать до конца.",
    specs: [
      ["Оси", "3, панорама без ограничений"],
      ["Нагрузка", "до 4,5 кг"],
      ["Рычаги", "карбоновые"],
      ["Управление", "джойстик, спуск, диск, экран"],
    ],
  },
};

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Телефонная версия блока «Оборудование»: большая 3D-сцена, вкладки, карточка с характеристиками. */
export function EquipmentPhone() {
  const stage = useRef<HTMLDivElement>(null);
  const yaw = useRef(0.5);
  const drag = useRef<{ x: number; id: number } | null>(null);
  const [ok, setOk] = useState(false);
  const [visible, setVisible] = useState(false);
  const [focus, setFocus] = useState<Focus>("all");

  useEffect(() => {
    // WebGL определяется только в браузере
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOk(hasWebGL());
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "150px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const info = INFO[focus];
  return (
    <div className="eqp">
      <div
        ref={stage}
        className="eqp-stage"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, id: e.pointerId };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          yaw.current += (e.clientX - drag.current.x) * 0.012;
          drag.current.x = e.clientX;
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        {ok && (
          <Boundary>
            <Scene active={visible} focus={focus} getYaw={() => yaw.current} addYaw={(d) => { yaw.current += d; }} />
          </Boundary>
        )}
        <span className="eqp-hint" aria-hidden>Тяните, чтобы повернуть</span>
      </div>

      <div className="eqp-tabs" role="tablist" aria-label="Что показать">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={focus === t.id}
            className={focus === t.id ? "on" : ""}
            onClick={() => {
              const target = FOCUS_YAW[t.id];
              if (target !== undefined) {
                // ближайший эквивалентный угол, чтобы модель не делала лишних оборотов
                const full = Math.PI * 2;
                yaw.current = target + full * Math.round((yaw.current - target) / full);
              }
              setFocus(t.id);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="eqp-card" role="tabpanel" key={focus}>
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
