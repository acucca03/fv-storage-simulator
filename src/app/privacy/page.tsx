import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Privacy policy | SolarScope",
  description:
    "Informativa privacy essenziale del simulatore fotovoltaico con accumulo SolarScope.",
};

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      eyebrow="Privacy"
      title="Privacy policy"
      description="Questa pagina spiega in modo semplice quali dati possono essere trattati durante l'utilizzo del simulatore e con quali finalità."
      sections={[
        {
          title: "Finalità del trattamento",
          paragraphs: [
            "Il sito permette di stimare in modo preliminare il dimensionamento di un impianto fotovoltaico domestico con accumulo.",
            "I dati inseriti nel simulatore vengono usati per generare i risultati energetici, economici e il report PDF richiesto dall'utente.",
          ],
        },
        {
          title: "Dati inseriti nel simulatore",
          paragraphs: [
            "Il simulatore può richiedere consumi energetici, località indicativa, caratteristiche dell'abitazione, abitudini di utilizzo e preferenze di dimensionamento.",
            "Quando viene caricato un file consumi, il contenuto viene utilizzato per elaborare la simulazione. Prima della pubblicazione commerciale, il titolare del sito dovrà definire tempi di conservazione, responsabilità e modalità tecniche di trattamento.",
          ],
        },
        {
          title: "Dati tecnici",
          paragraphs: [
            "Come ogni sito web, possono essere trattati dati tecnici necessari al funzionamento, alla sicurezza e alla corretta erogazione delle pagine.",
            "Eventuali strumenti di analytics, tracciamento, newsletter o form di contatto dovranno essere dichiarati e configurati prima della messa online definitiva.",
          ],
        },
        {
          title: "Titolare e contatti",
          paragraphs: [
            "Prima della pubblicazione per clienti reali, questa informativa dovrà essere completata con i dati del titolare, i riferimenti di contatto e le eventuali basi giuridiche applicabili.",
            "Questa versione è una base informativa iniziale pensata per accompagnare una fase di test e validazione del servizio.",
          ],
        },
      ]}
    />
  );
}
