import { HomeHero } from "./home-hero";
import {
  HomeConsumptionMethods,
  HomeHowItWorks,
  HomeResultsPreview,
} from "./home-sections";
import { HomeMethodDisclosure } from "./home-method-disclosure";

export function HomePage() {
  return (
    <main className="bg-[#f7f4ec]">
      <HomeHero />
      <HomeHowItWorks />
      <HomeConsumptionMethods />
      <HomeResultsPreview />
      <HomeMethodDisclosure />
    </main>
  );
}
