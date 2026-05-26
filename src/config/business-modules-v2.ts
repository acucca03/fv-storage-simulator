export const businessModulesV2 = {
  goal:
    "Moduli riutilizzabili per costruire rapidamente siti professionali per hotel, ristoranti, liberi professionisti e attività locali.",
  rules: [
    "Ogni modulo deve poter essere rimosso senza rompere la pagina.",
    "Ogni modulo deve avere uno scopo di conversione chiaro.",
    "Ogni modulo deve funzionare prima da mobile.",
    "Ogni modulo deve usare contenuti configurabili.",
    "Ogni modulo deve restare static-first quando possibile.",
    "Ogni modulo deve evitare dipendenze client inutili.",
  ],
  modules: [
    {
      name: "Hero commerciale",
      purpose:
        "Presentare subito valore, categoria dell'attività e azione principale.",
      usefulFor: ["Hotel", "Ristoranti", "Professionisti", "Attività locali"],
      conversion: "Portare l'utente verso prenotazione, contatto o preventivo.",
    },
    {
      name: "Servizi / Offerta",
      purpose:
        "Mostrare cosa offre l'attività con blocchi chiari e confrontabili.",
      usefulFor: ["Hotel", "Professionisti", "Attività locali"],
      conversion: "Ridurre dubbi e aumentare interesse verso la CTA.",
    },
    {
      name: "Camere / Menu / Prestazioni",
      purpose:
        "Mostrare elementi principali dell'offerta con dettagli essenziali.",
      usefulFor: ["Hotel", "Ristoranti", "Professionisti"],
      conversion: "Aiutare l'utente a scegliere rapidamente.",
    },
    {
      name: "Fiducia",
      purpose:
        "Rendere credibile l'attività con recensioni, numeri, metodo o garanzie.",
      usefulFor: ["Hotel", "Ristoranti", "Professionisti", "Attività locali"],
      conversion: "Ridurre la distanza tra visita e contatto.",
    },
    {
      name: "FAQ",
      purpose:
        "Rispondere alle domande frequenti prima che diventino ostacoli.",
      usefulFor: ["Hotel", "Ristoranti", "Professionisti", "Attività locali"],
      conversion: "Eliminare frizioni prima della richiesta.",
    },
    {
      name: "Contatto rapido",
      purpose:
        "Chiudere la pagina con una CTA chiara e contatti facilmente accessibili.",
      usefulFor: ["Hotel", "Ristoranti", "Professionisti", "Attività locali"],
      conversion: "Portare l'utente all'azione finale.",
    },
  ],
  verticalBlueprints: [
    {
      vertical: "Hotel / B&B",
      primaryAction: "Richiedi disponibilità",
      secondaryAction: "Guarda camere e servizi",
      sections: [
        "Hero con promessa chiara",
        "Camere o soluzioni disponibili",
        "Servizi principali",
        "Gallery",
        "Recensioni",
        "FAQ ospiti",
        "Contatto o richiesta disponibilità",
      ],
    },
    {
      vertical: "Ristorante",
      primaryAction: "Prenota un tavolo",
      secondaryAction: "Scopri il menu",
      sections: [
        "Hero con identità del locale",
        "Piatti o menu in evidenza",
        "Esperienza e ambiente",
        "Orari",
        "Eventi o serate",
        "Recensioni",
        "Prenotazione rapida",
      ],
    },
    {
      vertical: "Libero professionista",
      primaryAction: "Richiedi una consulenza",
      secondaryAction: "Scopri i servizi",
      sections: [
        "Hero con problema risolto",
        "Servizi principali",
        "Metodo di lavoro",
        "Profilo e competenze",
        "Testimonianze",
        "FAQ",
        "Modulo contatto",
      ],
    },
    {
      vertical: "Attività locale",
      primaryAction: "Contattaci",
      secondaryAction: "Scopri cosa facciamo",
      sections: [
        "Hero territoriale",
        "Servizi o prodotti",
        "Portfolio o esempi",
        "Area coperta",
        "Valori aziendali",
        "Recensioni",
        "Contatto rapido",
      ],
    },
  ],
  conversionFlow: [
    {
      step: "1",
      title: "Capire subito l'attività",
      description:
        "L'utente deve comprendere in pochi secondi cosa offre il sito e perché dovrebbe restare.",
    },
    {
      step: "2",
      title: "Mostrare valore reale",
      description:
        "Servizi, camere, menu, metodo o risultati devono essere visibili senza navigazione complessa.",
    },
    {
      step: "3",
      title: "Costruire fiducia",
      description:
        "Recensioni, chiarezza, FAQ, posizione e tono professionale riducono l'incertezza.",
    },
    {
      step: "4",
      title: "Portare all'azione",
      description:
        "La CTA finale deve essere coerente con il tipo di cliente: prenotare, contattare, chiedere disponibilità o richiedere preventivo.",
    },
  ],
} as const;
