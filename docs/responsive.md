# Responsive

## Obiettivo

Site Foundation deve essere progettato mobile-first.

Ogni componente base deve funzionare bene su:

- smartphone
- tablet
- desktop
- schermi grandi

## Principi

- Partire dal mobile
- Aggiungere complessita solo con breakpoint superiori
- Evitare larghezze fisse fragili
- Evitare overflow orizzontale
- Usare padding responsive
- Usare griglie adattive
- Mantenere testi leggibili
- Garantire pulsanti comodi da usare su touch

## Container

Container usa padding responsive:

- px-4 su mobile
- px-6 su schermi medi
- px-8 su schermi grandi

Questo evita contenuti troppo attaccati ai bordi su smartphone.

## Section

Section usa spaziatura verticale responsive:

- py-16 su mobile
- py-20 su tablet
- py-24 su desktop

## Header

Header deve funzionare anche quando la navigazione va su piu righe.

Regole:

- logo leggibile
- nav accessibile
- link con focus visibile
- nessun overflow orizzontale
- layout flessibile su mobile

## Hero

La hero non deve dipendere da dimensioni fisse.

Regole:

- titolo scalabile
- testo leggibile
- pulsanti full-width su mobile se necessario
- niente elementi che escano dallo schermo

## Griglie

Le griglie devono partire da una colonna su mobile.

Poi possono diventare:

- due colonne su tablet
- quattro colonne su desktop, se il contenuto lo permette

## Progetti derivati

Ogni sito reale derivato deve essere testato almeno su:

- smartphone reale
- larghezza browser stretta
- tablet o simulazione tablet
- desktop

## Regola finale

Un sito professionale non deve essere solo bello su desktop.

Il mobile deve essere considerato una parte centrale del progetto.
