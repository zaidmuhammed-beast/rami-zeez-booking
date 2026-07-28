import type { HTMLAttributes } from "react";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  strong?: boolean;
};

export function GlassCard({
  className = "",
  strong = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={`${strong ? "glass-strong" : "glass-card"} ${className}`}
      {...props}
    />
  );
}
