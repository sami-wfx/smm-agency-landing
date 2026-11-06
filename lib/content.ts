export type Service = { num: string; title: string; text: string; icon: "target" | "video" | "palette" | "bolt" };
export type Plan = {
  name: string;
  tagline: string;
  price: string;
  tone: "dark" | "lime" | "cream";
  badge?: string;
  items: string[];
  result: string;
};
export type CaseItem = {
  id: string;
  niche: string;
  title: string;
  metricTarget: number;
  metricPrefix?: string;
  metricSuffix?: string;
  metricDecimals?: number;
  metricLabel: string;
  beforeImage?: string;
  afterImage?: string;
  youtubeUrl?: string;
};

export const NAV_LINKS = [
  { href: "#services", label: "Услуги" },
  { href: "#cases", label: "Кейсы" },
  { href: "#pricing", label: "Тарифы" },
  { href: "#process", label: "Процесс" },
  { href: "#contacts", label: "Контакты" },
];

export const STATS = [
  { target: 120, suffix: "+", label: "проектов запущено" },
  { target: 3.4, decimals: 1, suffix: "x", label: "средний рост охватов" },
  { target: 98, suffix: "%", label: "клиентов продлевают" },
];

export const SERVICES: Service[] = [
  { num: "01", icon: "target", title: "Бренд-стратегия и анализ", text: "Аудит, анализ конкурентов, позиционирование и целевая аудитория — фундамент перед запуском." },
  { num: "02", icon: "video", title: "Контент-продакшн", text: "Съёмка на кинокамеру Sony FX30, монтаж Reels и клипов, сценарии, которые удерживают внимание." },
  { num: "03", icon: "palette", title: "Дизайн и айдентика", text: "Оформление профиля, сторис, обложки и визуальный стиль, который запоминается." },
  { num: "04", icon: "bolt", title: "Автоматизация и продажи", text: "Чат-боты, CRM и воронки лидогенерации — превращаем подписчиков в клиентов." },
];

export const PLANS: Plan[] = [
  {
    name: "Старт", tagline: "Для уверенного запуска", price: "6 000", tone: "dark",
    items: ["Аудит и упаковка профиля", "Анализ ниши и 5 конкурентов", "Позиционирование и целевая аудитория", "Контент-план на месяц", "1 съёмочный день (до 8 коротких видео)", "Сценарии, монтаж и субтитры"],
    result: "Оформленный блог и первый месяц контента.",
  },
  {
    name: "Рост", tagline: "Для регулярного роста", price: "8 000", tone: "lime", badge: "ПОПУЛЯРНЫЙ",
    items: ["Всё из тарифа «Старт»", "Глубокий анализ рынка и 10 конкурентов", "2 съёмочных дня (до 12 коротких видео)", "Модель в кадре", "Обложки, тексты и хештеги", "Публикация контента и ежемесячная аналитика"],
    result: "Системный контент и рост узнаваемости.",
  },
  {
    name: "Лидер", tagline: "Для активного масштабирования", price: "12 000", tone: "cream",
    items: ["Всё из тарифа «Рост»", "Полная стратегия продвижения", "4 съёмочных дня (до 20 коротких видео)", "Команда и модель в кадре", "Фирменный стиль контента", "Чат-бот, CRM и автоворонка", "Автопубликация и сбор заявок"],
    result: "Медиа-система, которая привлекает клиентов.",
  },
];

export const PROCESS = [
  { n: "01", title: "Знакомство", text: "Обсуждаем цели, нишу и бюджет на коротком звонке." },
  { n: "02", title: "Стратегия", text: "Готовим анализ, позиционирование и контент-план." },
  { n: "03", title: "Продакшн", text: "Снимаем, монтируем и оформляем визуал бренда." },
  { n: "04", title: "Рост", text: "Публикуем, анализируем и масштабируем результат." },
];
