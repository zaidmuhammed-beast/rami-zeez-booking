import type { GroupType } from "./constants";

export const WRISTBAND_COLORS: Record<GroupType, { name: string; hex: string }> = {
  single: { name: "Purple", hex: "#8B5CF6" },
  duo: { name: "Teal", hex: "#2DD4BF" },
  couple: { name: "Rose", hex: "#FB7185" },
};

export function wristbandFor(groupType: GroupType) {
  return WRISTBAND_COLORS[groupType];
}
