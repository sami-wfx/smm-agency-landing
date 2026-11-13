export type Service = { num: string; title: string; text: string; icon: "target" | "video" | "palette" | "bolt" };
export type PlanItem = { text: string; isNew?: boolean };
export type PlanGroup = { title: string; items: PlanItem[] };
export type Plan = {
  name: string;
  tagline: string;
  /** эмоциональная фраза — крючок над ценой */
  hook: string;
  price: string;
  perVideo: string;
  tone: "dark" | "lime" | "cream";
  badge?: string;
  /** три цифры, которые считываются с первого взгляда */
  stats: { n: string; label: string }[];
  groups: PlanGroup[];
  /** что почувствует клиент (эмоция, а не гарантия цифр) */
  feel: string;
  result: string;
  cta: string;
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

export type ClientItem = {
  /** Название на плашке (например, «Яндекс Еда» или ник блогера). */
  name: string;
  /** Файл логотипа или аватара в /public/clients/, например "clients/zloy.png". Без файла — кружок с буквой. */
  logo?: string;
};

export const NAV_LINKS = [
  { href: "#services", label: "Услуги" },
  { href: "#equipment", label: "Оборудование" },
  { href: "#clients", label: "Клиенты" },
  { href: "#pricing", label: "Тарифы" },
  { href: "#process", label: "Процесс" },
  { href: "#contacts", label: "Контакты" },
];

/** «Они vs мы» — контраст в Hero. Только проверяемые факты о том, как мы работаем. */
export const HERO_VS = [
  { them: "Снимают на телефон", us: "Кинокамера Sony FX30 и стабилизатор Ronin RS4" },
  { them: "Постят «для галочки»", us: "Сценарий, режиссура и монтаж каждого Reels" },
  { them: "Ведут страницу", us: "Строим бренд с нуля до узнаваемости" },
];

/** Реальные ниши из кейсов — микро-доказательство под заголовком, без выдуманных цифр. */
export const HERO_NICHES = "beauty-брендами, ресторанами и блогерами";

export const SERVICES: Service[] = [
  { num: "01", icon: "target", title: "Бренд-стратегия и анализ", text: "Аудит, анализ конкурентов, позиционирование и целевая аудитория — фундамент перед запуском." },
  { num: "02", icon: "video", title: "Контент-продакшн", text: "Съёмка на кинокамеру Sony FX30, монтаж Reels и клипов, сценарии, которые удерживают внимание." },
  { num: "03", icon: "palette", title: "Дизайн и айдентика", text: "Оформление профиля, сторис, обложки и визуальный стиль, который запоминается." },
  { num: "04", icon: "bolt", title: "Автоматизация и продажи", text: "Чат-боты, CRM и воронки лидогенерации — превращаем подписчиков в клиентов." },
];

/**
 * Тарифы. Цены и базовые объёмы (дни съёмки, «до N видео») — прежние.
 * Пункты с isNew: true — новые предложения; перед публикацией подтвердите, что готовы их выполнять.
 */
export const PLANS: Plan[] = [
  {
    name: "Старт",
    tagline: "Для уверенного запуска",
    hook: "Первый шаг, после которого вам не стыдно показывать свою страницу",
    price: "6 000",
    perVideo: "≈ 750 сомони за готовое видео",
    tone: "dark",
    stats: [
      { n: "до 8", label: "Reels" },
      { n: "8", label: "Stories" },
      { n: "1", label: "съёмочный день" },
    ],
    groups: [
      {
        title: "Стратегия",
        items: [
          { text: "Аудит и упаковка профиля" },
          { text: "Анализ ниши и 5 конкурентов" },
          { text: "Позиционирование и целевая аудитория" },
          { text: "Контент-план на месяц" },
        ],
      },
      {
        title: "Съёмка и видео",
        items: [
          { text: "1 съёмочный день на кинокамеру (до 8 коротких видео)" },
          { text: "Сценарии, монтаж и субтитры" },
          { text: "Обложки Reels в едином стиле", isNew: true },
        ],
      },
      {
        title: "Stories",
        items: [
          { text: "8 Stories в месяц: сюжет и оформление", isNew: true },
          { text: "Шаблоны Stories под ваш бренд", isNew: true },
        ],
      },
    ],
    feel: "Гордость за свою страницу",
    result: "Оформленный блог и первый месяц контента, снятого как кино.",
    cta: "Начать со «Старт»",
  },
  {
    name: "Рост",
    tagline: "Для регулярного роста",
    hook: "Чтобы вас начали узнавать, сохранять и пересылать друзьям",
    price: "8 000",
    perVideo: "≈ 667 сомони за готовое видео",
    tone: "lime",
    badge: "ВЫБИРАЮТ ЧАЩЕ ВСЕГО",
    stats: [
      { n: "до 12", label: "Reels" },
      { n: "16", label: "Stories" },
      { n: "2", label: "съёмочных дня" },
    ],
    groups: [
      {
        title: "Стратегия",
        items: [
          { text: "Всё из тарифа «Старт»" },
          { text: "Глубокий анализ рынка и 10 конкурентов" },
        ],
      },
      {
        title: "Съёмка и видео",
        items: [
          { text: "2 съёмочных дня (до 12 коротких видео)" },
          { text: "Модель в кадре" },
          { text: "Плавные кадры со стабилизатором Ronin", isNew: true },
          { text: "Адаптация под YouTube Shorts и TikTok", isNew: true },
        ],
      },
      {
        title: "Stories и контент",
        items: [
          { text: "Обложки, тексты и хештеги" },
          { text: "16 Stories с сюжетной линией: опросы, вопросы, закулисье", isNew: true },
          { text: "Оформленные Highlights в профиле", isNew: true },
        ],
      },
      {
        title: "Рост",
        items: [
          { text: "Публикация контента и ежемесячная аналитика" },
          { text: "Разбор результатов и план на следующий месяц", isNew: true },
        ],
      },
    ],
    feel: "Уверенность, что контент выходит регулярно и работает на вас",
    result: "Системный контент, растущая узнаваемость и люди, которые начинают вам писать.",
    cta: "Хочу рост",
  },
  {
    name: "Лидер",
    tagline: "Для активного масштабирования",
    hook: "Бренд, о котором говорят в вашем городе, а контент продаёт за вас",
    price: "12 000",
    perVideo: "≈ 600 сомони за готовое видео",
    tone: "cream",
    stats: [
      { n: "до 20", label: "Reels" },
      { n: "24", label: "Stories" },
      { n: "4", label: "съёмочных дня" },
    ],
    groups: [
      {
        title: "Стратегия",
        items: [
          { text: "Всё из тарифа «Рост»" },
          { text: "Полная стратегия продвижения" },
          { text: "Фирменный стиль контента" },
        ],
      },
      {
        title: "Съёмка и видео",
        items: [
          { text: "4 съёмочных дня (до 20 коротких видео)" },
          { text: "Команда и модель в кадре" },
          { text: "Видео-визитка бренда на 60–90 секунд", isNew: true },
          { text: "Фотосъёмка для профиля и каталога", isNew: true },
        ],
      },
      {
        title: "Stories",
        items: [{ text: "24 Stories: прогрев аудитории и продающие серии", isNew: true }],
      },
      {
        title: "Рост и продажи",
        items: [
          { text: "Чат-бот, CRM и автоворонка" },
          { text: "Автопубликация и сбор заявок" },
          { text: "Личный менеджер на связи в мессенджере", isNew: true },
        ],
      },
    ],
    feel: "Спокойствие: всё снимаем, ведём и продаём за вас",
    result: "Медиа-система, которая привлекает клиентов, пока вы занимаетесь бизнесом.",
    cta: "Хочу стать лидером",
  },
];

export const PROCESS = [
  { n: "01", title: "Знакомство", text: "Обсуждаем цели, нишу и бюджет на коротком звонке." },
  { n: "02", title: "Стратегия", text: "Готовим анализ, позиционирование и контент-план." },
  { n: "03", title: "Продакшн", text: "Снимаем, монтируем и оформляем визуал бренда." },
  { n: "04", title: "Рост", text: "Публикуем, анализируем и масштабируем результат." },
];
