type Props = { target: number; decimals?: number; prefix?: string; suffix?: string };

/** Число, которое «набегает» при появлении (анимацию запускает MotionRig). */
export function Counter({ target, decimals, prefix, suffix }: Props) {
  return (
    <span
      data-counter
      data-target={target}
      data-decimals={decimals || undefined}
      data-prefix={prefix || undefined}
      data-suffix={suffix || undefined}
    >
      0
    </span>
  );
}
