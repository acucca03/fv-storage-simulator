export const designSystemV2 = {
  version: "2.0.0",
  goal:
    "Design system minimale, performante e riutilizzabile per siti professionali veloci.",
  rules: [
    "Ogni componente deve funzionare bene da mobile.",
    "Ogni componente deve avere HTML semantico quando possibile.",
    "Ogni variante deve essere limitata e utile.",
    "Nessun componente deve introdurre JavaScript client se non necessario.",
    "Le classi devono restare leggibili e facili da modificare.",
    "Le sezioni devono poter essere spostate, rimosse o duplicate senza effetti collaterali.",
  ],
  componentStandards: [
    {
      name: "Container",
      purpose: "Controlla larghezza massima e padding laterale.",
      quality: "Evita layout troppo larghi e mantiene leggibilità.",
    },
    {
      name: "Section",
      purpose: "Gestisce ritmo verticale e ancore di pagina.",
      quality: "Rende ogni blocco indipendente e navigabile.",
    },
    {
      name: "Card / Surface",
      purpose: "Crea contenitori visivi coerenti e leggeri.",
      quality: "Permette gerarchie chiare senza componenti pesanti.",
    },
    {
      name: "ResponsiveGrid",
      purpose: "Standardizza griglie responsive a 2, 3 o 4 colonne.",
      quality: "Riduce duplicazioni e protegge la coerenza del layout.",
    },
    {
      name: "FeatureList",
      purpose: "Mostra liste di vantaggi, servizi o controlli qualità.",
      quality: "Migliora leggibilità e riuso nelle sezioni business.",
    },
    {
      name: "MetricCard",
      purpose: "Evidenzia KPI, target performance e numeri importanti.",
      quality: "Rende misurabili obiettivi e vincoli della base.",
    },
  ],
  tokens: [
    {
      name: "Spaziatura",
      value: "gap-4 / gap-5 / py responsive",
      reason: "Mantiene ritmo visivo senza CSS custom eccessivo.",
    },
    {
      name: "Raggi",
      value: "rounded-2xl / rounded-3xl",
      reason: "Crea identità premium senza caricare asset.",
    },
    {
      name: "Bordi",
      value: "border-white/10",
      reason: "Separa i blocchi senza appesantire il contrasto.",
    },
    {
      name: "Superfici",
      value: "bg-white/[0.02] - bg-white/[0.06]",
      reason: "Permette profondità visiva leggera e performante.",
    },
  ],
} as const;
