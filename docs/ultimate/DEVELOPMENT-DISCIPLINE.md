# Development Discipline

## Metodo

La Base Madre Ultimate deve essere sviluppata per blocchi grandi, controllati e committabili.

Ogni blocco deve avere:

- obiettivo chiaro;
- modifiche coerenti;
- controlli automatici superati;
- commit dedicato;
- push remoto;
- progresso aggiornato.

## Regole operative

1. Non aggiungere codice senza uno scopo preciso.
2. Non installare librerie se non sono davvero necessarie.
3. Non duplicare componenti se si può generalizzare.
4. Non creare cartelle senza un motivo chiaro.
5. Non sacrificare performance per estetica inutile.
6. Non rompere SEO, accessibilità o sicurezza.
7. Non fare refactor enormi senza controlli intermedi.
8. Non trasformare la foundation in un progetto specifico.
9. Non aggiungere funzionalità che appartengono ai singoli siti reali.
10. Ogni modifica deve aumentare qualità, riuso o stabilità.

## Comandi obbligatori dopo ogni blocco

pnpm check
pnpm build
pnpm check:full
git status

Se tutto passa:

git add .
git commit -m "messaggio chiaro"
git push
git status

## Criterio di avanzamento

La percentuale aumenta solo quando:

- i controlli passano;
- il commit è stato creato;
- il push è stato completato;
- il working tree torna pulito.
