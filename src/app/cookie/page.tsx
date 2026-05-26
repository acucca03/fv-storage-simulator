import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Cookie policy | SolarScope",
  description:
    "Informativa cookie essenziale del simulatore fotovoltaico con accumulo SolarScope.",
};

export default function CookiePage() {
  return (
    <LegalDocumentPage
      eyebrow="Cookie"
      title="Cookie policy"
      description="Questa pagina riassume l'uso dei cookie e delle tecnologie simili previste per il sito."
      sections={[
        {
          title: "Cookie tecnici",
          paragraphs: [
            "Il sito può utilizzare strumenti tecnici necessari al funzionamento delle pagine, alla sicurezza e alla corretta fruizione del simulatore.",
            "Questi strumenti servono a rendere il servizio disponibile, stabile e utilizzabile sui diversi dispositivi.",
          ],
        },
        {
          title: "Cookie analitici e marketing",
          paragraphs: [
            "In questa fase il sito non dichiara strumenti di marketing o profilazione.",
            "Se in futuro verranno aggiunti analytics, pixel pubblicitari, mappe incorporate, chat esterne o altri servizi terzi, questa pagina dovrà essere aggiornata e dovranno essere configurate le relative preferenze di consenso.",
          ],
        },
        {
          title: "Gestione delle preferenze",
          paragraphs: [
            "L'utente può gestire o eliminare i cookie anche dalle impostazioni del proprio browser.",
            "Prima della messa online commerciale, dovrà essere valutata la necessità di un banner cookie e di un sistema di gestione del consenso coerente con gli strumenti effettivamente installati.",
          ],
        },
      ]}
    />
  );
}
