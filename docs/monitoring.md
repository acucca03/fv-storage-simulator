# Monitoring

## Obiettivo

Site Foundation non include strumenti di monitoraggio installati di default.

La base deve restare leggera, privata e generica.

Pero ogni progetto reale derivato da Site Foundation dovra valutare monitoraggio, analytics e gestione errori in base al livello del sito.

## Perche il monitoraggio e importante

Un sito professionale non deve solo funzionare al momento del deploy.

Deve poter essere controllato nel tempo.

Il monitoraggio serve per capire:

- se il sito e online
- se ci sono errori runtime
- se le pagine sono lente
- se gli utenti incontrano problemi
- se form o API falliscono
- se il traffico cresce
- se servono ottimizzazioni

## Tipi di monitoraggio

### 1. Error monitoring

Serve per intercettare errori JavaScript, errori server e problemi runtime.

Nei progetti reali si potra valutare uno strumento come:

- Sentry
- Logtail
- Axiom
- strumenti integrati dell'hosting

Regole:

- non mostrare stack trace agli utenti
- non salvare dati sensibili inutilmente
- filtrare informazioni personali
- configurare alert solo per errori importanti

### 2. Analytics

Serve per capire uso e traffico.

Nei progetti reali si potra valutare:

- Vercel Analytics
- Google Analytics
- Plausible
- Umami

Regole:

- rispettare privacy e cookie policy
- non tracciare dati inutili
- documentare cosa viene tracciato

### 3. Performance monitoring

Serve per controllare velocita e stabilita.

Metriche importanti:

- Core Web Vitals
- tempo caricamento pagina
- dimensione bundle
- immagini pesanti
- JavaScript client
- errori di rete

### 4. Uptime monitoring

Serve per verificare se il sito e raggiungibile.

Utile soprattutto per siti business critical.

Esempi:

- siti con prenotazioni
- siti con ordini
- siti aziendali importanti
- landing ad alto traffico

### 5. Logging

Nei progetti con API o backend, i log servono per capire cosa succede lato server.

Regole:

- non loggare password
- non loggare token
- non loggare dati sensibili non necessari
- strutturare i log in modo leggibile
- separare log tecnici da dati utente

## Quando aggiungere monitoraggio

Non tutti i siti hanno bisogno dello stesso livello di monitoraggio.

### Sito statico semplice

Possibile monitoraggio minimo:

- analytics base
- controllo uptime
- performance check manuale

### Sito professionale con form

Aggiungere:

- error monitoring
- controllo invii form
- protezione spam
- log errori lato server se presenti

### Sito con prenotazioni, ordini o pagamenti

Aggiungere:

- error monitoring serio
- uptime monitoring
- alert
- logging backend
- backup dati
- controllo performance
- controllo sicurezza

## Regola per Site Foundation

Non installare strumenti di monitoraggio direttamente nella base madre.

Aggiungerli solo nei progetti derivati, quando il caso reale lo richiede.

## Checklist monitoraggio per progetto reale

- [ ] Il sito ha bisogno di analytics?
- [ ] Il sito ha form?
- [ ] Il sito ha API?
- [ ] Il sito ha pagamenti?
- [ ] Il sito ha prenotazioni o ordini?
- [ ] Serve monitoraggio errori?
- [ ] Serve uptime monitoring?
- [ ] Serve logging backend?
- [ ] Serve alert in caso di errore?
- [ ] Sono rispettate privacy e cookie policy?

## Obiettivo finale

I progetti derivati da Site Foundation devono poter crescere con strumenti di controllo adeguati, senza appesantire inutilmente la base madre.
