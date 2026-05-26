# Release Playbook — Base Madre Ultimate 3.0.0

Questo documento descrive i passaggi finali per chiudere la release stabile 3.0.0.

## Prima della release

Controllare:

    git status
    git branch --show-current
    pnpm health
    pnpm check:full

Il branch deve essere pulito.

## Aggiornamento versione

Nel blocco finale la versione in package.json dovrà diventare:

    3.0.0

## Commit finale

Il commit finale dovrà essere chiaro, per esempio:

    chore: release ultimate foundation 3.0.0

## Tag finale

Il tag finale sarà:

    v3.0.0

## Push finale

Dopo commit e tag:

    git push
    git push origin v3.0.0

## Criterio di chiusura

La release è chiusa solo quando:

- package.json è aggiornato a 3.0.0;
- pnpm health passa;
- pnpm check:full passa;
- il commit finale è pushato;
- il tag v3.0.0 è creato e pushato;
- il working tree è pulito.
