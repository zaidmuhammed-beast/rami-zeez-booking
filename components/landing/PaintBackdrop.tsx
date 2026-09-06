/**
 * Decorative blurred colour washes behind the hero. Purely visual — hidden
 * from assistive tech and never intercepts pointer events.
 */
export function PaintBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <span className="paint-blob animate-drift -top-24 -left-16 h-72 w-72 bg-hue-pink/35" />
      <span className="paint-blob animate-drift top-10 right-0 h-80 w-80 bg-hue-sky/25 [animation-delay:-4s]" />
      <span className="paint-blob animate-drift bottom-0 left-1/3 h-64 w-64 bg-hue-mint/25 [animation-delay:-8s]" />
      <span className="paint-blob animate-drift -bottom-16 right-1/4 h-72 w-72 bg-hue-yellow/20 [animation-delay:-11s]" />
    </div>
  );
}
