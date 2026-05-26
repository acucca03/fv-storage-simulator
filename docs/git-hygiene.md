# Git Hygiene

## Obiettivo

Site Foundation deve mantenere una cronologia Git pulita, sicura e utile.

Il repository e una base madre privata: deve restare ordinato, comprensibile e privo di file sensibili.

## Regole principali

- Non committare segreti
- Non committare file `.env.local`
- Non committare cartelle build
- Non committare `node_modules`
- Non committare file temporanei o log
- Fare commit piccoli e chiari
- Controllare sempre `git status` prima e dopo ogni milestone

## File ignorati

Il file `.gitignore` protegge da commit accidentali di:

- node_modules
- .next
- out
- build
- dist
- file .env reali
- log
- file sistema
- cartella .vercel

## Eccezione importante

Il file `.env.example` puo essere committato.

Serve per documentare quali variabili ambiente sono previste, ma non deve contenere valori segreti reali.

## Flusso Git consigliato

Prima di iniziare una modifica:

git status

Dopo una modifica di codice:

pnpm check

Poi:

git status
git add ...
git commit -m "Messaggio chiaro"
git push
git status

## Commit message

Un buon commit dice cosa e cambiato.

Esempi buoni:

- Add foundation UI primitives
- Add accessibility basics
- Add security headers and environment docs
- Document reuse workflow

Esempi da evitare:

- update
- fix
- modifiche
- roba
- prova

## Regola finale

Se `git status` non e pulito alla fine del lavoro, non spegnere senza capire cosa e rimasto modificato.
