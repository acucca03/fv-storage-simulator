# Release Process

## Obiettivo

Questo documento spiega come congelare una versione stabile di Site Foundation.

Le versioni servono per avere punti di riferimento sicuri.

## Quando creare una versione

Creare una versione solo quando:

- pnpm check:full passa
- git status e pulito
- la documentazione e aggiornata
- non ci sono contenuti specifici
- non ci sono segreti
- la base e stabile

## Procedura

### 1. Controllo completo

pnpm check:full

### 2. Controllo Git

git status

Deve uscire:

nothing to commit, working tree clean

### 3. Creare commit finale se necessario

Se ci sono modifiche documentali o tecniche:

git add .
git commit -m "Prepare stable foundation release"

### 4. Creare tag versione

Esempio:

git tag -a v0.1.0 -m "Stable foundation v0.1.0"

### 5. Pubblicare tag su GitHub

git push origin v0.1.0

## Regole

- Non creare tag se pnpm check:full fallisce
- Non creare tag se git status non e pulito
- Non creare tag per modifiche incomplete
- Non usare Site Foundation come sito cliente
- Ogni sito reale deve nascere come progetto separato

## Versionamento

Schema consigliato:

- v0.1.0 prima base stabile
- v0.2.0 miglioramenti importanti alla base
- v0.3.0 nuovi componenti generici
- v1.0.0 base considerata matura per uso stabile continuativo
