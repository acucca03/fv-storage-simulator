# Design system v2

Il design system della base madre 2.0.0 deve essere minimale, veloce e facile da riutilizzare.

## Obiettivo

Creare componenti comuni per costruire siti professionali senza ricominciare ogni volta da zero.

## Regole

- I componenti devono essere server-first.
- Il JavaScript client deve essere evitato quando non necessario.
- Le varianti devono essere poche e chiare.
- I layout devono nascere mobile-first.
- I componenti devono essere leggibili anche dopo molti mesi.
- Ogni componente deve avere uno scopo preciso.

## Componenti aggiunti

- `ResponsiveGrid`
- `FeatureList`
- `MetricCard`
- `StatusBadge`
- `Surface`
- `DesignSystemSection`

## Uso previsto

Questi componenti servono per costruire più velocemente sezioni per:

- hotel;
- B&B;
- ristoranti;
- liberi professionisti;
- attività locali;
- landing page premium.

## Vincolo performance

Il design system non deve trasformare il sito in una web app pesante.

Ogni componente deve poter essere renderizzato staticamente, salvo casi specifici futuri.
