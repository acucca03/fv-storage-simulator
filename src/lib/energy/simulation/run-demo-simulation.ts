import { generateStatisticalConsumptionProfile } from "@/lib/energy/consumption/generate-statistical-profile";
import { optimizeSystem } from "@/lib/energy/optimizer/optimize-system";

export function runDemoSimulation() {
  const consumptionProfile = generateStatisticalConsumptionProfile({
    annualConsumptionKwh: 4500,
    days: 30,
    people: "4 persone",
    daytimePresence: "Qualche volta",
    mainUsage: "Sera",
    cooling: "Sì, spesso",
    heating: "No",
    cooking: "Induzione",
    ev: "No",
  });

  return optimizeSystem({
    consumptionProfile,
    targetSelfConsumptionPercent: 45,
    goal: "target_self_consumption",
  });
}
