// Конвертация исходников из /originals в оптимизированные WebP в /assets (хешируются сборкой).
// Запуск: node scripts/optimize-images.mjs
import sharp from "sharp";
import { statSync } from "node:fs";

const prev = "originals/previous-webp";
const jobs = [
  // команда: srcset 720 / 1086
  ...[1, 2, 3].flatMap((n) => [
    [`${prev}/team/team-${n}.webp`, `assets/team/team-${n}.webp`, { w: 720, q: 78 }],
    [`${prev}/team/team-${n}-hd.webp`, `assets/team/team-${n}-hd.webp`, { w: 1086, q: 78 }],
  ]),
  // оборудование
  [`${prev}/equipment/fx30-34-hd.webp`, "assets/equipment/fx30-34-800.webp", { w: 800, q: 80 }],
  [`${prev}/equipment/fx30-34-hd.webp`, "assets/equipment/fx30-34-1400.webp", { w: 1400, q: 78 }],
  [`${prev}/equipment/lens-solo.webp`, "assets/equipment/lens-solo.webp", { w: 640, q: 80 }],
  [`${prev}/equipment/fx30-front.webp`, "assets/equipment/fx30-front.webp", { w: 629, q: 80 }],
  [`${prev}/equipment/fx30-top.webp`, "assets/equipment/fx30-top.webp", { w: 655, q: 80 }],
  [`${prev}/equipment/rs4-front.webp`, "assets/equipment/rs4-front.webp", { w: 407, q: 80 }],
  [`${prev}/equipment/rs4-left.webp`, "assets/equipment/rs4-left.webp", { w: 310, q: 80 }],
  [`${prev}/equipment/rs4-right.webp`, "assets/equipment/rs4-right.webp", { w: 317, q: 80 }],
  // логотип 480×76 → WebP с прозрачностью
  ["originals/branding/logo-triocrash.png", "assets/brand/logo-triocrash.webp", { w: 480, q: 85 }],
];

let before = 0, after = 0;
for (const [src, dst, { w, q }] of jobs) {
  const meta = await sharp(src).metadata();
  const out = await sharp(src)
    .resize({ width: Math.min(w, meta.width), withoutEnlargement: true })
    .webp({ quality: q, alphaQuality: 85, effort: 6, smartSubsample: true })
    .toFile(dst);
  const b = statSync(src).size;
  before += b; after += out.size;
  console.log(dst.padEnd(40), `${meta.width}×${meta.height} → ${out.width}×${out.height}`, `${(b / 1024).toFixed(0)}KB → ${(out.size / 1024).toFixed(0)}KB`);
}
console.log("итого", (before / 1024).toFixed(0), "KB →", (after / 1024).toFixed(0), "KB");
