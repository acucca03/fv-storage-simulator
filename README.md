# SolarScope - FV Storage Simulator

Sito web professionale per stimare in modo preliminare il dimensionamento di impianti fotovoltaici domestici con accumulo.

Il progetto permette di simulare scenari energetici partendo da consumi manuali o da file consumi, stimando produzione solare, autoconsumo, utilizzo della batteria, risultati economici e report PDF scaricabile.

## Funzionalità principali

- Homepage premium e responsive.
- Simulatore fotovoltaico domestico con accumulo.
- Inserimento manuale dei consumi annui.
- Upload file consumi ARERA/CSV.
- Slider interattivi per potenza FV e capacità batteria.
- Risultati energetici ed economici.
- Report PDF scaricabile con grafici, ipotesi e disclaimer.
- Pagine legal minime: Privacy, Cookie, Termini e Disclaimer tecnico.

## Disclaimer

Le simulazioni sono stime preliminari e non sostituiscono progetto tecnico, sopralluogo, verifica strutturale o elettrica, pratica di connessione alla rete o preventivo commerciale.

Prima di utilizzare il sito per proposte reali verso clienti, vanno completati:

- dati del titolare;
- condizioni commerciali;
- privacy e cookie policy definitive;
- eventuali strumenti di analytics o tracciamento;
- validazione tecnica delle ipotesi economiche e progettuali.

## Stack tecnico

- Next.js
- TypeScript
- React
- Tailwind CSS
- pnpm
- jsPDF

## Comandi principali

Installazione dipendenze:

    pnpm install

Sviluppo locale:

    pnpm dev

Controllo completo:

    pnpm check:full

Build produzione:

    pnpm build

## Deploy

Il progetto è pensato per essere pubblicato online tramite piattaforme compatibili con Next.js, come Vercel o Cloudflare Pages.

Prima del deploy eseguire sempre:

    pnpm check:full
    pnpm build
    git status --short
