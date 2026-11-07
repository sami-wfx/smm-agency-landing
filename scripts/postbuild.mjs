// После `next build` (output: export): добавляет <link rel="preload"> для критичных шрифтов на первом экране.
// Имена файлов хешируются сборкой, поэтому ищем их по префиксу в out/_next/static/media.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = "out";
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const CRITICAL = ["ChakraPetch-700-lat", "Unbounded-800-cyr", "Manrope-500-cyr"]; // надпись TRIOCRASH, кнопки, основной текст
const media = readdirSync(join(out, "_next/static/media"));

const links = CRITICAL.map((name) => {
  const f = media.find((m) => m.startsWith(name + ".") && m.endsWith(".woff2"));
  if (!f) throw new Error(`postbuild: не найден шрифт ${name}`);
  return `<link rel="preload" href="${base}/_next/static/media/${f}" as="font" type="font/woff2" crossorigin=""/>`;
}).join("");

for (const file of ["index.html", "404.html"]) {
  const p = join(out, file);
  let html;
  try {
    html = readFileSync(p, "utf8");
  } catch {
    continue;
  }
  if (html.includes('as="font"')) continue;
  // после <meta name="viewport"> (кодировка должна остаться в первых 1024 байтах)
  const m = html.match(/<meta name="viewport"[^>]*>/);
  writeFileSync(p, m ? html.replace(m[0], m[0] + links) : html.replace("<head>", "<head>" + links));
  console.log(`postbuild: preload шрифтов → ${file}`);
}
