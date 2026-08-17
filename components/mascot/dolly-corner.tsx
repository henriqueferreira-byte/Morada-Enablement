import { Dolly } from "./dolly";

export function DollyCorner() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-4 left-4 z-40 hidden drop-shadow-md sm:block"
    >
      <Dolly size={84} animation="idle" />
    </div>
  );
}
