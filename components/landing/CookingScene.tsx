import { Mascot } from "@/components/ui/Mascot";

/**
 * The mascot at the stove: a glass pot bubbling away, steam lifting past him,
 * and the next events dropping in as ingredients. Pure CSS — no JS, and it
 * holds still for anyone who asks for reduced motion.
 *
 * Everything is absolutely positioned against one centre line so the chef,
 * the pot and the falling ingredients stay lined up at every width.
 */

// Delays are staggered so nothing moves in lockstep.
const STEAM = [
  { left: "26%", delay: "0s", size: "h-20 w-7" },
  { left: "46%", delay: "1.3s", size: "h-24 w-8" },
  { left: "66%", delay: "2.5s", size: "h-20 w-6" },
];

const BUBBLES = [
  { left: "20%", delay: "0s", size: "h-2 w-2" },
  { left: "38%", delay: "0.7s", size: "h-2.5 w-2.5" },
  { left: "56%", delay: "1.4s", size: "h-1.5 w-1.5" },
  { left: "72%", delay: "2s", size: "h-2 w-2" },
];

const INGREDIENTS = [
  { emoji: "🎬", left: "32%", delay: "0s" },
  { emoji: "🎭", left: "44%", delay: "1.6s" },
  { emoji: "🪁", left: "56%", delay: "3.2s" },
  { emoji: "💍", left: "66%", delay: "4.4s" },
];

export function CookingScene() {
  return (
    <div className="relative mx-auto h-[330px] w-full max-w-[380px] select-none sm:h-[380px]">
      {/* Heat glow off the stove */}
      <span
        aria-hidden
        className="absolute inset-x-6 bottom-4 h-44 rounded-full bg-gradient-to-t from-hue-coral/45 via-hue-yellow/25 to-transparent blur-3xl"
      />

      {/* The chef, standing behind the pot */}
      <Mascot
        size={280}
        preload
        className="animate-stir absolute bottom-[76px] left-1/2 z-10 w-40 -translate-x-1/2 origin-bottom h-auto sm:w-48"
      />

      {/* Ingredients dropping in from above the pot */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-[148px] z-30 h-0 sm:bottom-[158px]"
      >
        {INGREDIENTS.map((item) => (
          <span
            key={item.emoji}
            className="animate-drop absolute bottom-0 text-2xl"
            style={{ left: item.left, animationDelay: item.delay }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* Pot */}
      <div className="absolute bottom-10 left-1/2 z-20 w-52 -translate-x-1/2 sm:w-60">
        {/* Steam, drifting up past him */}
        <div aria-hidden className="absolute inset-x-0 -top-2 h-0">
          {STEAM.map((wisp) => (
            <span
              key={wisp.left}
              className={`animate-steam absolute bottom-0 rounded-full bg-white/70 blur-[10px] ${wisp.size}`}
              style={{ left: wisp.left, animationDelay: wisp.delay }}
            />
          ))}
        </div>

        {/* Rim, with the bubbling surface inside it */}
        <div className="relative h-9 rounded-full border border-white/35 bg-white/20 backdrop-blur-xl">
          <div className="absolute inset-x-3 inset-y-[7px] overflow-hidden rounded-full bg-gradient-to-r from-hue-pink via-hue-yellow to-hue-mint">
            {BUBBLES.map((bubble) => (
              <span
                key={bubble.left}
                className={`animate-bubble absolute bottom-0 rounded-full bg-white/80 ${bubble.size}`}
                style={{ left: bubble.left, animationDelay: bubble.delay }}
              />
            ))}
          </div>

          {/* Handles, at rim height */}
          <span
            aria-hidden
            className="absolute -left-6 top-2 h-5 w-9 rounded-full border border-white/30 bg-white/15"
          />
          <span
            aria-hidden
            className="absolute -right-6 top-2 h-5 w-9 rounded-full border border-white/30 bg-white/15"
          />
        </div>

        {/* Body */}
        <div className="mx-auto -mt-2 h-20 w-[88%] rounded-b-[2.25rem] border border-t-0 border-white/25 bg-gradient-to-b from-white/20 to-white/[0.06] shadow-2xl shadow-purple-950/50 backdrop-blur-xl" />
      </div>
    </div>
  );
}
