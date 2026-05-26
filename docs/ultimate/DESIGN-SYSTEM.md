# Design System — Base Madre Ultimate

La Base Madre Ultimate usa un design system leggero, accessibile e controllabile.

L'obiettivo non è aggiungere una libreria UI esterna, ma rendere i componenti interni più coerenti, riutilizzabili e facili da adattare.

## Principi

- componenti server-first quando possibile;
- nessuna dipendenza UI inutile;
- varianti controllate;
- classi condivise tramite token interni;
- focus visibile;
- componenti responsive;
- design premium senza sacrificare performance.

## Design tokens

I token principali sono definiti in:

src/components/ui/tokens.ts

Questi token centralizzano:

- transizioni;
- focus ring;
- radius;
- bordi;
- superfici;
- testo;
- input.

## UI primitives

I componenti base devono rimanere generici e riutilizzabili:

- Badge;
- Button;
- Card;
- Container;
- FeatureList;
- Input;
- Textarea;
- ResponsiveGrid;
- Section;
- SectionHeading;
- StatusBadge;
- Surface.

## Regola

I componenti UI non devono conoscere contenuti business, SEO, configurazioni specifiche di progetto o sezioni applicative.

Devono essere primitives solide, componibili e facili da usare nei progetti reali.

## Composition primitives

La Base Madre Ultimate include anche primitive di composizione per ridurre classi ripetute nelle sezioni:

- Stack;
- Inline;
- Divider;
- Callout;
- Text.

Questi componenti non aggiungono peso client inutile e servono a mantenere coerenza tra sezioni diverse.

## Criterio premium

Un design system premium non deve essere complicato.

Deve rendere semplice costruire pagine coerenti, leggibili e accessibili usando pochi componenti solidi.
