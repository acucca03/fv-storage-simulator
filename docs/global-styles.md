# Global Styles

## Obiettivo

Gli stili globali definiscono una base minima e sicura per tutti i progetti futuri.

Non devono contenere design specifico di un cliente o di un settore.

## File

src/app/globals.css

## Cosa gestisce

- import Tailwind CSS
- color scheme scuro di base
- background globale
- colore testo globale
- prevenzione overflow orizzontale
- comportamento immagini e media
- font ereditato nei campi form
- selezione testo
- rispetto preferenza reduced motion

## Reduced motion

La base rispetta `prefers-reduced-motion`.

Se un utente preferisce meno animazioni, transizioni e animazioni vengono ridotte.

Questa scelta migliora accessibilita e qualita percepita.

## Regole

Gli stili globali devono restare pochi e generici.

Non inserire qui:

- layout specifici cliente
- colori brand specifici
- sezioni specifiche
- hack legati a una singola pagina
- codice CSS non documentato

## Progetti derivati

Nei progetti reali si potranno modificare colori, font e tema, ma mantenendo:

- accessibilita
- leggibilita
- assenza di overflow orizzontale
- supporto reduced motion
