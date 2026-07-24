import { Header } from "@/components/layout/header";
import { MotionRoot } from "@/components/motion/motion-root";
import { DashboardSection } from "@/sections/dashboard";
import { HeroSection } from "@/sections/hero";
import { InsightFlowSection } from "@/sections/insight-flow";
import { WowSection } from "@/sections/wow";

export default function Home() {
  return (
    <MotionRoot>
      <Header />
      <main>
        <HeroSection />
        <InsightFlowSection />
        <DashboardSection />
        <WowSection />
      </main>
    </MotionRoot>
  );
}
