import Image from "next/image";

type MascotProps = {
  size?: number;
  className?: string;
  float?: boolean;
  /** Preloads the image — use on the hero mascot only. */
  preload?: boolean;
};

export function Mascot({
  size = 320,
  className = "",
  float = false,
  preload = false,
}: MascotProps) {
  return (
    <Image
      src="/images/rami-zeez-mascot.png"
      alt="Rami ZeeZ mascot leaning on his guitar"
      width={size}
      height={size * 1.6}
      preload={preload}
      className={`select-none drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)] ${
        float ? "animate-float-slow" : ""
      } ${className}`}
    />
  );
}
