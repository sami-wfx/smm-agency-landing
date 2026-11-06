/** Команда (порядок = порядок в Hero). Фото — в /public/team. */
export const TEAM = [
  // слева (выходит первым) → в центре → справа; цвет свечения привязан к месту
  { key: "production", tone: "purple", photo: "team/team-2" },
  { key: "editing", tone: "lime", photo: "team/team-3" },
  { key: "promotion", tone: "pink", photo: "team/team-1" },
] as const;

export const TONES = {
  pink: { solid: "#FF5FA8", soft: "rgba(255,95,168,.5)", grad: "linear-gradient(160deg,#FF9BCB,#FF5FA8 60%,#C2347A)" },
  lime: { solid: "#B6FF3D", soft: "rgba(182,255,61,.4)", grad: "linear-gradient(160deg,#E4FF9A,#B6FF3D 60%,#6FA10F)" },
  purple: { solid: "#8B5CF6", soft: "rgba(139,92,246,.55)", grad: "linear-gradient(160deg,#B79BFF,#8B5CF6 60%,#4C2DB3)" },
} as const;
