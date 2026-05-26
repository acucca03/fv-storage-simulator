# Maintenance

## Obiettivo

Questo documento definisce come mantenere Site Foundation pulito, affidabile e riutilizzabile nel tempo.

La base madre deve rimanere piccola, solida e generica.

## Regole di manutenzione

### 1. Non aggiungere codice specifico

Non inserire nella base:

- sezioni camere hotel
- menu ristorante
- listini cliente
- contenuti commerciali specifici
- funzioni legate a un solo progetto
- logica business non generica

Queste cose appartengono ai progetti derivati.

### 2. Aggiungere solo elementi realmente comuni

Un nuovo componente puo entrare nella base solo se sara utile in molti progetti futuri.

Prima di aggiungere qualcosa chiedersi:

- serve spesso?
- e generico?
- migliora la qualita?
- riduce duplicazione?
- non appesantisce?
- non crea dipendenze inutili?

### 3. Tenere le dipendenze sotto controllo

Non aggiungere librerie solo per comodita.

Prima di installare una dipendenza chiedersi:

- e davvero necessaria?
- e mantenuta?
- e sicura?
- e pesante?
- si puo evitare con codice semplice?

### 4. Controllare sempre la qualita

Ogni modifica di codice deve passare:

pnpm check

Se pnpm check fallisce, la modifica non va salvata.

### 5. Commit piccoli e chiari

Esempi corretti:

- Add foundation UI primitives
- Add accessibility basics
- Centralize metadata configuration
- Document reuse workflow

Esempi da evitare:

- update
- fix
- roba varia
- modifiche sito

### 6. Documentare le decisioni importanti

Se viene presa una decisione strutturale, aggiornare:

- docs/decisions.md
- docs/architecture.md
- docs/tasks.md

### 7. Mantenere privata la base

Site Foundation deve restare:

- repository privato
- non deployato pubblicamente
- non indicizzato
- non collegato a un dominio pubblico

## Controllo periodico

Ogni tanto verificare:

- pnpm check passa
- git status e pulito
- docs aggiornati
- nessun codice specifico di settore
- nessun segreto nel repository
- componenti ancora generici
- struttura ancora comprensibile

## Obiettivo finale

La base deve essere affidabile oggi e comprensibile anche tra mesi.
