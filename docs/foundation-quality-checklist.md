# Foundation Quality Checklist

## Obiettivo

Questa checklist serve per verificare che Site Foundation resti una base madre professionale, solida, privata e riutilizzabile.

Va usata prima di considerare la base pronta per generare nuovi progetti reali.

## Identita della base

- [ ] Il progetto resta privato
- [ ] Il progetto non e collegato a deploy pubblico
- [ ] Il progetto non contiene contenuti specifici cliente
- [ ] Il progetto non contiene funzioni specifiche di settore
- [ ] Il README spiega chiaramente lo scopo della base
- [ ] La documentazione e aggiornata

## Qualita codice

- [ ] pnpm check passa
- [ ] git status e pulito
- [ ] I componenti sono piccoli e leggibili
- [ ] Non ci sono duplicazioni inutili
- [ ] Le configurazioni sono centralizzate
- [ ] I contenuti sono separati dalla struttura
- [ ] Le utility sono generiche
- [ ] Non ci sono librerie inutili

## Componenti UI

- [ ] Button e LinkButton sono generici
- [ ] Container gestisce padding responsive
- [ ] Section gestisce spaziature responsive
- [ ] Card resta neutra
- [ ] SectionHeading resta riutilizzabile
- [ ] Input, Textarea, Label, Field e FormMessage sono accessibili
- [ ] SkipLink e presente
- [ ] Nessun componente UI contiene testi specifici cliente

## Layout

- [ ] Header e neutro
- [ ] Footer e neutro
- [ ] MainLayout contiene Header, main e Footer
- [ ] La navigazione arriva da config
- [ ] Il contenuto principale ha id main-content
- [ ] Non esiste overflow orizzontale evidente

## Responsive

- [ ] Mobile controllato
- [ ] Tablet controllato
- [ ] Desktop controllato
- [ ] I pulsanti sono comodi su mobile
- [ ] Le griglie partono da una colonna su mobile
- [ ] I testi restano leggibili

## Accessibilita

- [ ] Focus visibile
- [ ] Navigazione da tastiera possibile
- [ ] Link riconoscibili
- [ ] Struttura titoli coerente
- [ ] Form con label
- [ ] Skip link funzionante
- [ ] Contrasti leggibili

## Sicurezza

- [ ] Nessun segreto nel repository
- [ ] .env.example non contiene valori reali
- [ ] .env.local non e committato
- [ ] Security headers presenti
- [ ] Robots disallow presente
- [ ] Metadata noindex presenti
- [ ] Nessun messaggio errore espone stack trace pubblici

## Scalabilita

- [ ] La base resta static-first
- [ ] JavaScript client minimo
- [ ] Nessuna logica pesante nel frontend pubblico
- [ ] Nessuna dipendenza pesante non necessaria
- [ ] Separazione chiara tra base, progetto derivato e future API
- [ ] Documentazione scalabilita presente

## Documentazione

- [ ] project-brief aggiornato
- [ ] architecture aggiornata
- [ ] decisions aggiornato
- [ ] roadmap aggiornata
- [ ] tasks aggiornato
- [ ] reuse-guide presente
- [ ] pre-project-checklist presente
- [ ] pre-deploy-checklist presente
- [ ] ui-components documentato
- [ ] security documentato
- [ ] scalability documentato
- [ ] accessibility documentato
- [ ] responsive documentato

## Decisione finale

La base e pronta per essere usata solo se:

- pnpm check passa
- git status e pulito
- non ci sono contenuti specifici
- non ci sono segreti
- la struttura e comprensibile
- la documentazione e aggiornata
