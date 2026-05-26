# Affidabilità — Base Madre Ultimate

La Base Madre Ultimate deve essere affidabile prima ancora di diventare un progetto reale.

## Obiettivi

- errori gestiti;
- not-found presente;
- form prudenti;
- dati minimi;
- integrazioni esterne documentate;
- controlli automatici;
- rilascio verificabile;
- nessun dettaglio tecnico esposto agli utenti.

## Reliability profile

Il profilo affidabilità è definito in:

`src/config/reliability-profile.ts`

Contiene:

- check richiesti;
- regole failure handling;
- regole form reliability;
- checklist operational readiness;
- collegamenti con security, privacy e stability profile.

## Verifica automatica

Il controllo principale è:

`pnpm verify:reliability`

Viene eseguito anche dentro:

`pnpm check:full`.

## Regola

Ogni progetto derivato deve poter essere pubblicato solo dopo controlli completi, dati reali, policy completate e integrazioni documentate.
