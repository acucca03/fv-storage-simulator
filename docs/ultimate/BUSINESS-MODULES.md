# Business Modules — Base Madre Ultimate

La Base Madre Ultimate include sezioni business configurabili, pensate per trasformare la foundation in siti reali senza duplicare codice.

## Preset supportati

I preset disponibili sono:

- hotel;
- restaurant;
- professional;
- local-business.

Ogni preset definisce:

- headline;
- descrizione;
- azione primaria;
- azione secondaria;
- sezioni consigliate;
- focus SEO;
- obiettivi di conversione.

## Sezioni business configurabili

Le sezioni principali sono:

- ActiveBusinessPresetSection;
- BusinessSectionsSection;
- BusinessConversionGoalsSection;
- BusinessVerticalsSection;
- VerticalBlueprintsSection.

Queste sezioni leggono dal `projectProfile.business` e quindi cambiano comportamento in base al verticale attivo.

## Regola

I moduli business non devono essere copie separate per ogni settore.

Devono usare configurazioni, preset e componenti riutilizzabili.

## Real business modules

La foundation include anche un catalogo di moduli reali in:

`src/config/business-content.ts`

Questo catalogo definisce:

- moduli di offerta;
- segnali di fiducia;
- blueprint FAQ;
- blueprint contatto;
- regole CTA.

Le sezioni collegate sono:

- RealBusinessModulesSection;
- BusinessReadinessSection.

## Obiettivo

Questi moduli servono a evitare che ogni nuovo progetto reale riparta da zero.

La foundation fornisce struttura, logica e criteri, mentre i contenuti finali vengono adattati al cliente specifico.
