# Sicurezza e privacy — Base Madre Ultimate

La Base Madre Ultimate parte con una base difensiva e prudente.

## Obiettivi

- security headers attivi;
- CSP controllata;
- nessun segreto nel repository;
- env hygiene;
- validazione input;
- privacy by design;
- nessun tracking di default;
- nessun dato sensibile raccolto dalla foundation;
- checklist pubblicazione per progetti reali.

## Security profile

Il profilo sicurezza è definito in:

`src/config/security-profile.ts`

Contiene:

- header richiesti;
- direttive CSP richieste;
- pattern CSP vietati;
- regole ambiente;
- utility validazione richieste;
- default vietati.

## Privacy profile

Il profilo privacy è definito in:

`src/config/privacy-profile.ts`

Contiene:

- minimizzazione dati;
- campi ammessi nei form;
- campi vietati;
- checklist pubblicazione;
- regole affidabilità.

## Verifica automatica

Il controllo principale è:

`pnpm verify:security`

Viene eseguito anche dentro:

`pnpm check:full`.

## Regola

Ogni progetto reale dovrà completare policy, cookie, consenso e gestione dati in base al cliente e agli strumenti effettivamente usati.
