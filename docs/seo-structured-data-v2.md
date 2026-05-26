# SEO e dati strutturati v2

La base madre 2.0.0 include una fondazione SEO centralizzata e leggera.

## File principali

- `src/config/seo-v2.ts`
- `src/config/metadata.ts`
- `src/lib/structured-data.ts`
- `src/components/seo/StructuredData.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/app/manifest.ts`

## Cosa viene gestito

- Metadata globali
- Title template
- Description
- Keywords base
- Open Graph
- Twitter card
- Sitemap
- Robots
- Manifest
- JSON-LD
- WebSite schema
- Organization schema
- LocalBusiness schema
- Breadcrumb schema

## Regola fondamentale

I dati strutturati devono descrivere solo informazioni realmente presenti o coerenti con il sito pubblicato.

Prima della consegna di un sito reale bisogna configurare:

- dominio reale;
- nome attività;
- descrizione reale;
- indirizzo;
- contatti;
- immagini social;
- tipo di attività;
- pagine realmente pubblicate.

## Performance

La SEO della base non deve introdurre JavaScript client non necessario.

Gli script JSON-LD vengono renderizzati lato server.
