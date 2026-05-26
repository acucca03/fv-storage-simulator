# SEO e Local SEO — Base Madre Ultimate

La Base Madre Ultimate centralizza la SEO in un profilo dedicato:

`src/config/seo-profile.ts`

## Obiettivi

- metadata coerenti;
- Open Graph pronto;
- sitemap automatica;
- robots controllato;
- manifest configurato;
- dati strutturati JSON-LD;
- schema.org collegato al preset business attivo;
- keyword verticali collegate al project profile.

## Preset-aware SEO

Il tipo schema.org non deve essere fisso.

Deve seguire il verticale attivo:

- hotel -> LodgingBusiness;
- restaurant -> Restaurant;
- professional -> ProfessionalService;
- local-business -> LocalBusiness.

## Regola

I dati strutturati devono rappresentare informazioni realmente visibili nella pagina.

La SEO non deve aggiungere JavaScript client inutile.

## Local SEO readiness

La foundation include anche:

`src/config/local-seo.ts`

Questo file definisce:

- dati reali obbligatori prima della pubblicazione;
- controlli di coerenza local SEO;
- pattern SEO vietati;
- collegamento tra schema, CTA e verticale attivo.

La sezione collegata è:

`LocalSeoReadinessSection`

## Regola di pubblicazione

Un progetto derivato dalla foundation non deve andare online con:

- dominio placeholder;
- contatti placeholder;
- indirizzo placeholder;
- metadata generici;
- dati strutturati non coerenti;
- CTA non visibili nella pagina.
