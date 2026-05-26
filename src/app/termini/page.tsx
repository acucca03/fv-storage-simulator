import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Termini di utilizzo | SolarScope",
  description:
    "Termini essenziali di utilizzo del simulatore fotovoltaico con accumulo SolarScope.",
};

export default function TermsPage() {
  return (
    <LegalDocumentPage
      eyebrow="Termini"
      title="Termini di utilizzo"
      description="Questi termini definiscono le condizioni generali di utilizzo del simulatore."
      sections={[
        {
          title: "Uso del servizio",
          paragraphs: [
            "Il sito offre una simulazione preliminare per orientare l'utente nella valutazione di un impianto fotovoltaico domestico con accumulo.",
            "I risultati dipendono dai dati inseriti, dalle ipotesi economiche, dalle stime di produzione e dai parametri tecnici utilizzati dal modello.",
          ],
        },
        {
          title: "Limiti della simulazione",
          paragraphs: [
            "La simulazione non costituisce un progetto tecnico, una diagnosi energetica certificata, un preventivo vincolante o una garanzia di risparmio.",
            "Prima di acquistare, installare o modificare un impianto, è necessario il supporto di professionisti qualificati e la verifica delle condizioni reali dell'immobile.",
          ],
        },
        {
          title: "Responsabilità",
          paragraphs: [
            "L'utente resta responsabile dei dati inseriti e delle decisioni prese sulla base dei risultati ottenuti.",
            "Il gestore del sito dovrà completare questi termini con i propri dati aziendali, condizioni commerciali, responsabilità e canali di assistenza prima della pubblicazione definitiva.",
          ],
        },
      ]}
    />
  );
}
