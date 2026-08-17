import { Dolly } from "./dolly";

/** Sits in its own row on Home, in normal page flow — not a viewport-fixed
 * overlay, so ad-blockers/"annoyance" filters that hide floating corner
 * widgets don't catch her, and she can't overlap other content. */
export function DollyCorner() {
  return (
    <div aria-hidden className="pointer-events-none -my-2 flex justify-start pl-1">
      <Dolly size={64} animation="idle" />
    </div>
  );
}
