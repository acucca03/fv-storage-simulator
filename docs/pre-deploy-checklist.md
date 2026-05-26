# Pre Deploy Checklist

## Obiettivo

Questa checklist vale per i progetti reali derivati da Site Foundation, non per Site Foundation stesso.

Site Foundation non deve essere deployato pubblicamente.

## Controlli tecnici

- [ ] pnpm lint passato
- [ ] pnpm build passato
- [ ] git status pulito
- [ ] ultimo commit caricato su GitHub
- [ ] nessun errore visibile in console
- [ ] responsive controllato su mobile
- [ ] responsive controllato su desktop
- [ ] link principali funzionanti
- [ ] immagini ottimizzate

## SEO base

- [ ] title corretto
- [ ] description corretta
- [ ] metadata coerenti
- [ ] lingua corretta in html lang
- [ ] favicon corretta
- [ ] robots configurato correttamente
- [ ] sitemap se necessaria

## Accessibilita

- [ ] struttura titoli coerente
- [ ] contrasto leggibile
- [ ] focus visibile
- [ ] link riconoscibili
- [ ] form con label
- [ ] immagini con alt quando necessario

## Sicurezza

- [ ] nessun segreto nel codice
- [ ] nessun .env reale committato
- [ ] variabili ambiente impostate su hosting
- [ ] form protetti da spam o rate limit se necessari
- [ ] errori pubblici non espongono dati sensibili

## Performance

- [ ] immagini compresse
- [ ] JavaScript client minimo
- [ ] librerie pesanti evitate se non necessarie
- [ ] pagine statiche dove possibile
- [ ] font usati con attenzione

## Prima del go-live

- [ ] dominio collegato
- [ ] HTTPS attivo
- [ ] analytics se richiesti
- [ ] monitoraggio errori se richiesto
- [ ] backup o gestione dati se ci sono database
- [ ] test finale da smartphone reale
