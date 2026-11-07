# TRIOCRASH — лендинг

Next.js (App Router) + React + TypeScript, Tailwind CSS, GSAP + ScrollTrigger/ScrollSmoother,
Motion for React, Three.js + React Three Fiber + Drei (3D-камера в первом экране).

## Запуск
```bash
npm install
npm run dev          # http://localhost:3000
```

## Публикация (GitHub Pages)
```bash
npm run build:pages  # собирает статический сайт в docs/
git add -A && git commit -m "..." && git push
```
GitHub Pages раздаёт папку `docs/` ветки `main`.

## Где что менять
- Тексты, тарифы, услуги, этапы — `lib/content.ts`
- Кейсы — `data/cases.json`
- Заголовок первого экрана — `components/Hero.tsx`
- 3D-сцена — `components/three/HeroScene.tsx`
- Стили — `app/legacy.css` (прежние), классы Tailwind в новых компонентах

Предыдущая версия сайта (один HTML-файл) сохранена в `legacy/`.

## Производительность

- **Картинки**: исходники — в `originals/` (вне сборки, в git не попадают). `npm run images` → `scripts/optimize-images.mjs` делает WebP (q≈78–80, под реальный размер показа) в `assets/`. Подключаются через `lib/images.ts` (статический импорт → хеш в имени + реальные width/height).
- **Шрифты**: локальные woff2 (latin + cyrillic) в `app/fonts`, `font-display: swap`, запасные шрифты с `size-adjust`/`ascent-override` (`app/fonts.css`). Критичные 3 файла предзагружаются скриптом `scripts/postbuild.mjs` (он запускается в `npm run build` и `npm run build:pages`).
- **JS**: GSAP (`MotionRig`), меню/форма (`Overlays`) и просмотрщик оборудования (`LazyOnView`) — отдельные чанки, грузятся после первой отрисовки / при приближении к экрану.
- **Анимации**: только `transform`/`opacity`; есть `prefers-reduced-motion`.
- **Кеш**: `public/_headers` (Netlify/Cloudflare Pages), `vercel.json`, `netlify.toml`: `/_next/static/*` — `immutable`, HTML — `max-age=0, must-revalidate`. GitHub Pages заголовки не поддерживает (кеш там фиксированный, 10 минут).
