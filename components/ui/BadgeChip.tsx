import { BADGES } from "@/lib/constants";
import type { BadgeKey } from "@/lib/badges";

type BadgeChipProps = {
  badgeKey: BadgeKey;
};

export function BadgeChip({ badgeKey }: BadgeChipProps) {
  const badge = BADGES[badgeKey];
  return (
    <span className="chip border-rz-amber-400/30">
      {badge.emoji} {badge.label}
    </span>
  );
}
