# Duplication Procedure

## Obiettivo

Questa procedura spiega come creare un nuovo sito reale partendo da Site Foundation.

Site Foundation deve restare privata, pulita e generica.

Ogni sito reale deve nascere come progetto separato.

## Regola fondamentale

Non trasformare direttamente Site Foundation in un sito cliente.

La base madre serve per generare nuovi progetti, non per essere modificata con contenuti specifici.

## Procedura completa

### 1. Andare nella cartella projects

cd ~/projects

### 2. Copiare Site Foundation

Sostituire `nome-nuovo-progetto` con il nome reale del nuovo sito.

Esempio:

cp -r site-foundation nome-nuovo-progetto

Esempio reale:

cp -r site-foundation hotel-cardedu

### 3. Entrare nel nuovo progetto

cd nome-nuovo-progetto

### 4. Rimuovere la storia Git della base

rm -rf .git

Questo evita che il nuovo progetto resti collegato alla cronologia di Site Foundation.

### 5. Installare o verificare dipendenze

pnpm install

### 6. Verificare che la copia funzioni

pnpm check

Se `pnpm check` fallisce, sistemare prima di andare avanti.

### 7. Personalizzare configurazioni principali

Modificare subito:

- src/config/site.ts
- src/config/navigation.ts
- src/config/theme.ts
- src/config/metadata.ts
- src/content/*
- README.md
- .env.example

### 8. Aggiornare identita progetto

Nel progetto derivato cambiare:

- nome sito
- descrizione
- owner
- repository
- link navigazione
- metadata
- contenuti
- eventuale tono comunicativo

### 9. Inizializzare nuovo Git

git init
git add .
git commit -m "Initial project from site foundation"

### 10. Creare repository GitHub separato

Esempio privato:

gh repo create nome-nuovo-progetto --private --source=. --remote=origin --push

### 11. Decidere se collegare Vercel

Site Foundation non va collegato a Vercel.

Il progetto derivato invece puo essere collegato a Vercel solo quando e pronto per diventare un sito reale.

### 12. Prima del deploy

Usare:

- docs/pre-project-checklist.md
- docs/pre-deploy-checklist.md
- docs/foundation-quality-checklist.md

## Cosa modificare nel progetto derivato

Nel nuovo sito si possono aggiungere:

- sezioni specifiche
- immagini cliente
- testi reali
- funzionalita specifiche
- database se necessario
- API se necessarie
- form reali
- analytics
- dominio
- monitoraggio errori

## Cosa non riportare nella base madre

Se durante un progetto reale crei qualcosa di specifico, non copiarlo automaticamente in Site Foundation.

Prima chiedersi:

- serve davvero a quasi tutti i siti futuri?
- e generico?
- migliora la base?
- non appesantisce?
- non contiene logica cliente?

Solo se la risposta e si, allora puo essere riportato nella base madre.

## Obiettivo finale

Ogni progetto derivato deve poter crescere in modo indipendente, mentre Site Foundation resta una base pulita e affidabile.
