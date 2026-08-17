import Image from "next/image";
import { cn } from "@/lib/utils";

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
    <Image
      src="/mascots/dolly-wave.png"
      alt="Dolly, a ovelha da Morada, acenando"
      width={size}
      height={size}
      priority
      unoptimized
      className={cn(
        "object-contain",
        animation === "wave" && "animate-dolly-wave",
        animation === "idle" && "animate-dolly-idle",
        className,
      )}
    />
  );
}
