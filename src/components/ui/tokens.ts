export const uiTokens = {
  transition: "transition duration-200",
  focusRing:
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
  radius: {
    sm: "rounded-xl",
    md: "rounded-2xl",
    lg: "rounded-3xl",
    full: "rounded-full",
  },
  border: {
    subtle: "border border-white/10",
    strong: "border border-white/15",
  },
  text: {
    title: "text-white",
    body: "text-neutral-300",
    muted: "text-neutral-400",
    subtle: "text-neutral-500",
  },
  surface: {
    default: "border-white/10 bg-white/[0.03]",
    muted: "border-white/10 bg-white/[0.02]",
    strong: "border-white/15 bg-white/[0.06]",
    elevated:
      "border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] shadow-[0_24px_80px_rgba(0,0,0,0.25)]",
  },
  input:
    "w-full border border-white/10 bg-white/[0.03] text-sm text-white outline-none placeholder:text-neutral-600 focus:border-white/30 focus:bg-white/[0.05]",
} as const;

export type UISurfaceTone = keyof typeof uiTokens.surface;
