# Configuration

## Obiettivo

Site Foundation deve usare configurazioni centrali.

Questo evita dati sparsi nei componenti e rende piu semplice creare progetti derivati.

## Cartella config

La cartella principale e:

src/config/

## File attuali

- src/config/site.ts
- src/config/navigation.ts
- src/config/theme.ts
- src/config/metadata.ts

## site.ts

Contiene informazioni generali sul progetto.

Esempi:

- nome sito
- nome breve
- owner
- descrizione
- repository
- scopo del progetto

Nei progetti derivati questo file andra modificato subito.

## navigation.ts

Contiene la navigazione principale e la navigazione footer.

Serve per evitare link scritti direttamente dentro Header e Footer.

Nei progetti derivati modificare questo file per cambiare menu e link.

## theme.ts

Contiene impostazioni di tema e layout.

Esempi:

- larghezza massima
- padding pagina
- radius
- scelte visuali ricorrenti

Non deve diventare un file enorme. Deve contenere solo valori davvero condivisi.

## metadata.ts

Contiene la configurazione metadata di Next.js.

In Site Foundation i metadata hanno robots noindex e nofollow, perche questa base non deve essere pubblicata online.

Nei progetti reali derivati bisognera valutare:

- title
- description
- robots
- open graph
- favicon
- canonical
- sitemap
- eventuali metadata social

## Regola principale

Se un dato deve cambiare da progetto a progetto, probabilmente deve stare in src/config o src/content.

## Differenza tra config e content

### config

Usare config per impostazioni globali e strutturali.

Esempi:

- nome sito
- link navigazione
- metadata
- repository
- tema

### content

Usare content per testi e dati visualizzati nelle sezioni.

Esempi:

- titoli sezioni
- liste
- FAQ
- contenuti pagina
- descrizioni
