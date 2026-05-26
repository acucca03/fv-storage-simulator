# Forms

## Obiettivo

Site Foundation include componenti base per costruire form accessibili e coerenti.

Non include logica di invio, validazione avanzata o backend, perche queste parti dipendono dal progetto reale.

## Componenti disponibili

- Label
- Input
- Textarea
- Field
- FormMessage
- Button

## Field

Percorso:

src/components/ui/Field.tsx

### Scopo

Field serve come contenitore per un campo form.

Aiuta a mantenere spaziatura coerente tra:

- label
- input
- textarea
- messaggi di aiuto
- messaggi di errore

## FormMessage

Percorso:

src/components/ui/FormMessage.tsx

### Scopo

FormMessage serve per mostrare messaggi collegati a un campo o a un form.

Varianti:

- default
- error
- success

## Regole accessibilita form

Ogni form reale deve rispettare queste regole:

- ogni campo importante deve avere una Label
- usare htmlFor nella Label e id nel campo
- mostrare errori chiari
- non usare solo il colore per comunicare errore o successo
- garantire focus visibile
- permettere navigazione da tastiera
- validare lato client e lato server

## Regole sicurezza form

Nei progetti reali, i form devono prevedere:

- validazione input lato server
- protezione spam
- rate limiting
- messaggi errore non sensibili
- nessun segreto nel frontend
- logging o monitoraggio se necessario

## Cosa NON fa Site Foundation

La base madre non invia email.
La base madre non salva dati.
La base madre non contiene API form.
La base madre non include servizi esterni.

Queste decisioni verranno prese nei progetti reali derivati.
