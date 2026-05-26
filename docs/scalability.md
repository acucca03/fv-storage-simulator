# Scalability

## Obiettivo

Site Foundation deve essere progettato con mentalita scalability-ready.

La base non deve garantire da sola traffico illimitato, perche la scalabilita dipende anche da hosting, CDN, database, API, cache, monitoraggio e budget infrastrutturale.

Pero deve evitare scelte tecniche che renderebbero difficile scalare in futuro.

## Principi fondamentali

- Static-first quando possibile
- Performance-first
- Security-first
- Accessibilita by default
- Meno JavaScript client possibile
- Componenti leggeri e riutilizzabili
- Nessuna logica pesante nel frontend pubblico
- Separazione chiara tra sito pubblico, API, dashboard e funzioni dinamiche

## Strategia per siti pubblici

Le pagine pubbliche devono essere, quando possibile:

- statiche
- cacheabili
- veloci
- leggere
- servibili tramite CDN
- indipendenti da chiamate database a ogni visita

Esempi:

- Home
- Chi siamo
- Servizi
- Camere
- Menu
- Gallery
- FAQ
- Contatti
- Landing page

## Quando usare logica dinamica

Funzioni come:

- prenotazioni
- ordini
- pagamenti
- login
- dashboard
- area admin
- form avanzati
- dati in tempo reale

non devono essere mischiate senza controllo dentro la parte pubblica.

Devono essere progettate come moduli separati con:

- validazione dati
- rate limiting
- controllo errori
- logging
- cache
- gestione permessi
- database progettato bene
- monitoraggio

## Regole per il frontend

- Evitare componenti client inutili
- Usare componenti server quando possibile
- Evitare librerie pesanti senza motivo
- Evitare animazioni eccessive
- Ottimizzare immagini
- Usare font in modo controllato
- Mantenere bundle leggero
- Non duplicare codice
- Centralizzare configurazioni

## Regole per progetti futuri

Quando un progetto reale nasce da Site Foundation, bisogna decidere subito:

- tipo di traffico previsto
- hosting
- dominio
- CDN
- database se necessario
- funzioni dinamiche
- sistemi di cache
- monitoraggio errori
- analytics
- backup
- sicurezza

## Obiettivo finale

La base deve permettere di creare siti professionali che possano crescere senza dover essere riscritti da zero.
