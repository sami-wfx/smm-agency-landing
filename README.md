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
