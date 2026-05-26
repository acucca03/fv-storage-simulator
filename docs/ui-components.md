# UI Components

## Obiettivo

I componenti UI sono i mattoni base di Site Foundation.

Devono essere:

- generici
- leggeri
- riutilizzabili
- accessibili
- facili da modificare
- non legati a un settore specifico

Non devono contenere testi specifici per hotel, ristoranti, professionisti o clienti.

## Regola generale

Un componente UI deve risolvere un problema comune.

Se un componente serve solo a un progetto specifico, non appartiene alla base madre.

## Componenti attuali

- Container
- Section
- SectionHeading
- Card
- Badge
- Button
- LinkButton
- Input
- Textarea
- Label
- Field
- FormMessage
- SkipLink

## Container

Gestisce larghezza massima e padding laterale.

Serve per mantenere allineati i contenuti in modo coerente su tutte le pagine.

## Section

Gestisce lo spazio verticale delle sezioni.

Serve per avere una distanza coerente tra blocchi principali della pagina.

## SectionHeading

Gestisce il titolo standard di una sezione.

Supporta:

- eyebrow
- title
- description
- allineamento centrale opzionale

## Card

Gestisce lo stile base dei riquadri.

Serve per contenuti come:

- caratteristiche
- servizi
- vantaggi
- step
- FAQ
- informazioni rapide

## Badge

Gestisce piccole etichette evidenziate.

## Button

Gestisce pulsanti reali di tipo button.

Varianti attuali:

- primary
- secondary
- ghost

## LinkButton

Gestisce link che hanno aspetto da pulsante.

## Input

Gestisce campi input standard.

Ogni Input usato in un form reale deve avere label associata.

## Textarea

Gestisce campi testo lunghi.

## Label

Gestisce label per form.

Ogni campo form importante deve avere una label chiara.

## Field

Gestisce il contenitore di un campo form.

Serve per raggruppare:

- label
- input
- textarea
- messaggio di aiuto
- messaggio di errore

## FormMessage

Gestisce messaggi collegati a un campo o a un form.

Varianti:

- default
- error
- success

## SkipLink

Permette di saltare direttamente al contenuto principale usando tastiera o screen reader.

## Criteri per modificare componenti UI

Prima di modificare un componente UI chiedersi:

1. La modifica migliora tutti o quasi tutti i progetti futuri?
2. Resta generica?
3. Non rompe l'accessibilita?
4. Non rende il componente troppo specifico?
5. Non aggiunge complessita inutile?

Se la risposta non e chiara, creare la personalizzazione nel progetto derivato, non nella base madre.

## Criteri per aggiungere nuovi componenti UI

Un nuovo componente UI puo entrare nella base solo se:

- serve spesso
- e generico
- riduce duplicazione
- migliora coerenza
- non e specifico di settore
- e semplice da mantenere
