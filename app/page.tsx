import { UIProvider } from "@/components/UIProvider";
import { BgFx } from "@/components/BgFx";
import { CursorGlow } from "@/components/CursorGlow";
import { Nav } from "@/components/Nav";
import { Drawer } from "@/components/Drawer";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Equipment } from "@/components/Equipment";
import { Services } from "@/components/Services";
import { Cases } from "@/components/Cases";
import { Pricing } from "@/components/Pricing";
import { Process } from "@/components/Process";
import { Contacts } from "@/components/Contacts";
import { Footer } from "@/components/Footer";
import { LeadModal } from "@/components/LeadModal";
import { MotionRig } from "@/components/MotionRig";

export default function Home() {
  return (
    <UIProvider>
      <BgFx />
      <CursorGlow />
      <Nav />
      <Drawer />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main id="top">
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
      <LeadModal />
      <MotionRig />
    </UIProvider>
  );
}
