import { cn } from "@/lib/utils";

const ARM_SPRITE_FRAMES = 30;

// The arm-sprite overlay is authored on the same 1024px canvas as the body
// image, sitting at this box (aligned to her shoulder). Expressed as
// fractions of the canvas so it scales correctly with the `size` prop.
const ARM_BOX = { left: 88 / 1024, top: 248 / 1024, size: 416 / 1024 };

export function Dolly({
  size = 96,
  className,
  animation = "wave",
}: {
  size?: number;
  className?: string;
  animation?: "wave" | "idle" | "none";
}) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <img
        src="/mascots/dolly-body.png"
        alt="Dolly, a ovelha da Morada"
        width={size}
        height={size}
        className="absolute inset-0 size-full object-contain"
      />
      {animation !== "none" && (
        <div
          aria-hidden
          className={cn(
            "absolute bg-no-repeat",
            animation === "wave" ? "animate-dolly-arm-wave" : "animate-dolly-arm-idle",
          )}
          style={{
            left: `${ARM_BOX.left * 100}%`,
            top: `${ARM_BOX.top * 100}%`,
            width: `${ARM_BOX.size * 100}%`,
            height: `${ARM_BOX.size * 100}%`,
            backgroundImage: "url(/mascots/dolly-arm-sprite.png)",
            backgroundSize: `${ARM_SPRITE_FRAMES * 100}% 100%`,
          }}
        />
      )}
    </div>
  );
}
