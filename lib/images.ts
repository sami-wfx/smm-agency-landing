/**
 * Все растровые картинки подключаются статическим импортом: сборка кладёт их в /_next/static/media
 * с хешем в имени (кеш «навсегда») и подставляет реальные width/height — layout не прыгает.
 * Исходники в высоком качестве лежат в /originals (вне сборки); оптимизация — scripts/optimize-images.mjs.
 */
import type { StaticImageData } from "next/image";
import team1 from "@/assets/team/team-1.webp";
import team1Hd from "@/assets/team/team-1-hd.webp";
import team2 from "@/assets/team/team-2.webp";
import team2Hd from "@/assets/team/team-2-hd.webp";
import team3 from "@/assets/team/team-3.webp";
import team3Hd from "@/assets/team/team-3-hd.webp";
import fx34s from "@/assets/equipment/fx30-34-800.webp";
import fx34l from "@/assets/equipment/fx30-34-1400.webp";
import lens from "@/assets/equipment/lens-solo.webp";
import fxFront from "@/assets/equipment/fx30-front.webp";
import fxTop from "@/assets/equipment/fx30-top.webp";
import rsFront from "@/assets/equipment/rs4-front.webp";
import rsLeft from "@/assets/equipment/rs4-left.webp";
import rsRight from "@/assets/equipment/rs4-right.webp";
import logo from "@/assets/brand/logo-triocrash.webp";

/** Картинка с адаптивным набором: src — базовая, srcSet — «w»-дескрипторы. */
export type Pic = { src: string; width: number; height: number; srcSet?: string };

const pic = (i: StaticImageData): Pic => ({ src: i.src, width: i.width, height: i.height });
const set = (small: StaticImageData, big: StaticImageData): Pic => ({
  ...pic(small),
  srcSet: `${small.src} ${small.width}w, ${big.src} ${big.width}w`,
});

export const IMG = {
  logo: pic(logo),
  team: {
    "team-1": set(team1, team1Hd),
    "team-2": set(team2, team2Hd),
    "team-3": set(team3, team3Hd),
  },
  fx34: set(fx34s, fx34l),
  lens: pic(lens),
  fxFront: pic(fxFront),
  fxTop: pic(fxTop),
  rsFront: pic(rsFront),
  rsLeft: pic(rsLeft),
  rsRight: pic(rsRight),
} as const;
