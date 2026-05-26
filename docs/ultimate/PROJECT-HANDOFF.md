# Project Handoff — Base Madre Ultimate

Questo documento spiega come usare la Base Madre Ultimate come punto di partenza per un progetto reale.

## Prima di iniziare un progetto reale

Controllare:

    git status
    pnpm health

Il working tree deve essere pulito e tutti i controlli devono passare.

## Dati da sostituire

Ogni progetto reale deve configurare:

- nome sito;
- URL reale;
- descrizione;
- metadata;
- contatti;
- indirizzo o area servita;
- verticale business;
- CTA principali;
- contenuti reali;
- privacy policy;
- eventuale cookie policy;
- immagini reali;
- dati strutturati coerenti.

## File principali da adattare

- src/config/site.ts
- src/config/seo-v2.ts
- src/config/project-presets.ts
- src/config/project.ts
- src/config/business-content.ts
- src/content/foundation.ts

## Controlli prima della pubblicazione

    pnpm check
    pnpm build
    pnpm check:full

## Regola

Un progetto derivato non deve andare online con:

- dominio placeholder;
- contatti placeholder;
- indirizzo placeholder;
- metadata generici;
- policy mancanti;
- dati strutturati non coerenti;
- tracking non documentato.
