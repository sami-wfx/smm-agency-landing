export type CounterFmt = { decimals?: number; prefix?: string; suffix?: string };

/** Единое форматирование числа: используется и при серверной сборке, и в анимации счётчика. */
export function formatCounter(v: number, { decimals = 0, prefix = "", suffix = "" }: CounterFmt = {}) {
  return prefix + (decimals ? v.toFixed(decimals) : Math.round(v).toString()) + suffix;
}
