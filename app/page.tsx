import { UIProvider } from "@/components/UIProvider";
import { SpaceBg } from "@/components/SpaceBg";
import { BgFx } from "@/components/BgFx";
import { CursorGlow } from "@/components/CursorGlow";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Equipment } from "@/components/Equipment";
import { Services } from "@/components/Services";
import { Cases } from "@/components/Cases";
import { Pricing } from "@/components/Pricing";
import { Process } from "@/components/Process";
import { Contacts } from "@/components/Contacts";
import { Footer } from "@/components/Footer";
import { Overlays } from "@/components/Overlays";
import { VariantPick } from "@/components/VariantPick";
import { MotionRig } from "@/components/MotionRig";
import { SkipLink } from "@/components/SkipLink";

export default function Home() {
  return (
    <UIProvider>
      <SkipLink />
      <SpaceBg />
      <BgFx />
      <CursorGlow />
      <Nav />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main id="top" tabIndex={-1}>
            <Hero />
            <Marquee />
            <Equipment />
            <Services />
            <Cases />
            <Pricing />
            <Process />
            <Contacts />
          </main>
          <Footer />
        </div>
      </div>
      <Overlays />
      <VariantPick />
      <MotionRig />
    </UIProvider>
  );
}
