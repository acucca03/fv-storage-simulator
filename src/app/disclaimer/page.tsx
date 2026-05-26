import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Disclaimer tecnico | SolarScope",
  description:
    "Disclaimer tecnico sul carattere preliminare delle simulazioni fotovoltaiche con accumulo.",
};

export default function DisclaimerPage() {
  return (
    <LegalDocumentPage
      eyebrow="Disclaimer"
      title="Disclaimer tecnico"
      description="La simulazione è uno strumento di orientamento e non sostituisce verifiche tecniche, normative o commerciali."
      sections={[
        {
          title: "Stima preliminare",
          paragraphs: [
            "I risultati del simulatore sono generati automaticamente sulla base dei dati disponibili e delle ipotesi selezionate.",
            "Produzione solare, autoconsumo, ritorno economico e utilizzo della batteria possono variare in modo significativo in base a orientamento, inclinazione, ombreggiamenti, profilo reale dei consumi e condizioni locali.",
          ],
        },
        {
          title: "Verifiche necessarie",
          paragraphs: [
            "Il simulatore non sostituisce un sopralluogo, un progetto elettrico, una verifica strutturale, una pratica di connessione alla rete o un'offerta commerciale.",
            "Per procedere con un impianto reale servono valutazioni tecniche, normative ed economiche svolte da soggetti qualificati.",
          ],
        },
        {
          title: "Dati e ipotesi economiche",
          paragraphs: [
            "Prezzi di installazione, costi di manutenzione, tariffe energetiche, incentivi, fiscalità e disponibilità dei componenti possono cambiare nel tempo.",
            "Le ipotesi mostrate nel sito devono essere aggiornate e validate prima di usare il servizio per proposte commerciali reali.",
          ],
        },
      ]}
    />
  );
}
