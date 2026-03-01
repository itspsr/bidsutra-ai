import { StickyNav } from "@/components/landing/StickyNav";
import { Hero } from "@/components/landing/Hero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";

export const dynamic = "force-dynamic";

export default function MarketingLanding() {
  return (
    <div>
      <StickyNav />
      <Hero />
      <FeatureGrid />
      <HowItWorks />
      <Pricing />

      <div className="container-max py-14">
        <div className="hr-soft" />
        <div className="mt-8 flex items-center justify-between text-sm text-white/55">
          <div>© {new Date().getFullYear()} BidSutra AI Systems</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/85">Security</a>
            <a href="#" className="hover:text-white/85">Compliance</a>
            <a href="#" className="hover:text-white/85">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
}
