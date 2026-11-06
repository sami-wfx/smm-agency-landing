import { formatCounter } from "@/lib/format";

type Props = { target: number; decimals?: number; prefix?: string; suffix?: string };

/**
 * Число, которое «набегает» при появлении (анимацию запускает MotionRig).
 * В HTML сразу лежит итоговое значение — без JS и у поисковиков метрика не превращается в «0».
 */
export function Counter({ target, decimals, prefix, suffix }: Props) {
  return (
    <span
      data-counter
      data-target={target}
      data-decimals={decimals || undefined}
      data-prefix={prefix || undefined}
      data-suffix={suffix || undefined}
    >
      {formatCounter(target, { decimals, prefix, suffix })}
    </span>
  );
}
