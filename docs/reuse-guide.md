# Reuse Guide

## Obiettivo

Questo documento spiega come usare Site Foundation come base madre per creare un nuovo sito reale.

Site Foundation non deve essere modificato direttamente per diventare un sito cliente.

La regola e:

1. mantenere Site Foundation privato e pulito
2. copiare la base
3. creare un nuovo progetto separato
4. personalizzare solo il progetto derivato
5. pubblicare online solo il progetto derivato

## Procedura sintetica

Per la procedura completa usare:

docs/duplication-procedure.md

## Procedura rapida

Da terminale, dentro `~/projects`:

cp -r site-foundation nome-nuovo-progetto
cd nome-nuovo-progetto
rm -rf .git
pnpm install
pnpm check
git init
git add .
git commit -m "Initial project from site foundation"

Poi creare un repository GitHub separato:

gh repo create nome-nuovo-progetto --private --source=. --remote=origin --push

## File da personalizzare nel progetto derivato

- src/config/site.ts
- src/config/navigation.ts
- src/config/theme.ts
- src/config/metadata.ts
- src/content/*
- README.md
- .env.example
- eventuali docs specifici del progetto reale

## Regola importante

Non aggiungere codice specifico del cliente o del settore dentro Site Foundation.

Se un elemento serve solo a un hotel, ristorante o professionista, va nel progetto derivato, non nella base madre.

## Quando aggiornare Site Foundation

Aggiornare Site Foundation solo quando si crea qualcosa che sara utile in quasi tutti i progetti futuri.

Esempi corretti:

- migliorare Button
- migliorare Container
- migliorare accessibilita
- migliorare SEO base
- aggiungere utility generica
- migliorare struttura progetto
- migliorare sicurezza base

Esempi da evitare:

- sezione camere hotel
- menu ristorante
- listino prezzi specifico
- testo commerciale cliente
- dashboard specifica
- API specifica del cliente
