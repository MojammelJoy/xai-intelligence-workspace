import { WowReveal } from "./wow-reveal";

export function WowHeading() {
  return (
    <WowReveal className="text-center">
      <h2 id="wow-heading" className="text-foreground text-sm font-medium">
        The Intelligence Engine
      </h2>
      <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base sm:text-lg">
        Watch raw data become structured intelligence — and structured intelligence become automated
        action.
      </p>
    </WowReveal>
  );
}
