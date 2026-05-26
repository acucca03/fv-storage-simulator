export type BusinessVerticalId =
  | "hotel"
  | "restaurant"
  | "professional"
  | "local-business";

export type BusinessVertical = {
  id: BusinessVerticalId;
  label: string;
  title: string;
  description: string;
  modules: string[];
};

export type QualityPillar = {
  title: string;
  description: string;
  checks: string[];
};

export type PerformanceTarget = {
  metric: string;
  target: string;
  reason: string;
};

export type V2Milestone = {
  title: string;
  description: string;
  status: "ready" | "in-progress" | "planned";
};
