export type BusinessVerticalId =
  | "hotel"
  | "restaurant"
  | "professional"
  | "local-business";

export type ProjectActionId =
  | "booking"
  | "availability"
  | "contact"
  | "quote"
  | "menu"
  | "call";

export type ProjectAction = {
  id: ProjectActionId;
  label: string;
  href: string;
  intent: string;
};

export type ProjectPreset = {
  id: BusinessVerticalId;
  label: string;
  businessType: string;
  headline: string;
  description: string;
  primaryAction: ProjectAction;
  secondaryAction: ProjectAction;
  sections: readonly string[];
  seoFocus: readonly string[];
  conversionGoals: readonly string[];
};
