export const siteConfig = {
  name: "SolarScope",
  shortName: "SolarScope",
  owner: "Ascedu03",
  description:
    "Simulatore professionale per dimensionare in modo preliminare impianti fotovoltaici domestici con accumulo.",
  repository: {
    provider: "GitHub",
    visibility: "private",
    url: "https://github.com/Ascedu03/fv-storage-simulator",
  },
  project: {
    isPublicTemplate: false,
    shouldDeployPublicly: true,
    purpose:
      "Sito web professionale per simulare scenari energetici, fotovoltaico domestico, accumulo e report preliminari.",
  },
} as const;
