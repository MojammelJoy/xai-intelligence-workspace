import { WowHeading } from "./wow-heading";
import { WowOutro } from "./wow-outro";
import { WowSceneCanvas } from "./wow-scene-canvas";
import { WowStages } from "./wow-stages";

export function WowSection() {
  return (
    <section aria-labelledby="wow-heading" className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
      <WowHeading />

      <div className="mt-12">
        <WowSceneCanvas />
      </div>

      <WowStages />

      <WowOutro />
    </section>
  );
}
