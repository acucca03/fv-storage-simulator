# Performance verification v2

La base include uno script di verifica performance.

Comando:

pnpm verify:performance

## Cosa controlla

- Presenza di client component non autorizzati.
- Dipendenze pesanti non adatte alla base madre.
- Presenza di header importanti.
- Uso di dangerouslySetInnerHTML fuori dal componente SEO consentito.

## Eccezioni consentite

Il file src/app/error.tsx è autorizzato come client component perché in Next.js le error boundary possono richiedere logica lato client, per esempio il reset dello stato di errore.

Questa eccezione è considerata accettabile perché:

1. è isolata;
2. non impatta il rendering statico della homepage;
3. non introduce librerie esterne;
4. serve alla gestione corretta degli errori.

## Perché serve

La performance non deve dipendere solo da controlli manuali.

Lo script non sostituisce Lighthouse o PageSpeed, ma impedisce che nella base madre entrino scelte tecniche chiaramente pesanti o rischiose.

## Regola per componenti client

La base deve restare server-first.

Un componente con "use client" può essere aggiunto solo se:

1. serve davvero interattività lato browser;
2. non esiste soluzione server-first equivalente;
3. viene documentato;
4. viene inserito nella lista consentita dello script di verifica.
