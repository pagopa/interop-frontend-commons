![CI](https://github.com/pagopa/interop-fe-commons/actions/workflows/ci.yml/badge.svg)
![NPM](https://img.shields.io/npm/v/@pagopa/interop-fe-commons)


# PDND Interoperabilità: commons

Raccolta di componenti e funzionalità utilizzati da progetti PDND Interoperabilità.

- [Filtri](#filtri)
- [Paginazione](#paginazione)
- [Componenti](#componenti)
  - [Table e TableRow](#table-e-tablerow)
  - [InformationContainer](#informationcontainer)
  - [CodeBlock](#codeblock)
- [Hooks](#hooks)
  - [useAutocompleteTextInput](#useautocompletetextinput)

## Installazione

```bash
npm install @pagopa/interop-fe-commons
```
> ⚠️ Accertarsi di avere installato tutte le `peerDependencies` richieste.
```bash
npm install @pagopa/mui-italia @mui/material @mui/lab @mui/icons-material @emotion/react @emotion/styled date-fns @mui/x-date-pickers react-router-dom
```


## Filtri
I filtri vengono gestiti attraverso un hook, `useFilters`, e un componente `Filters`.

`useFilters` mantiene lo stato dei filtri in sync con i parametri url. Ritorna l'oggetto contenente i dati da passare alla query e ciò che serve al componente `Filters` per renderizzare i campi, i filtri attivi e gestire le interazioni con l'utente.

L'hook accetta un array di oggetti che descrivono i filtri disponibili. Ogni oggetto deve essere costituito dai seguenti campi obbligatori:
- `label`: Etichetta del filtro
- `name`: Nome del filtro, usato internamente per identificare il filtro e per costruire i parametri url.
- `type`: Tipo del filto. Può essere 
    - `freetext`
    - `numeric`
    - `autocomplete-multiple`
    - `autocomplete-single`
    - `datepicker`

I filtri di tipo `autocomplete-multiple` e `autocomplete-single`, oltre ai campi obbligatori, accettano anche i seguenti campi:
- `options`: Richiesto. Deve contenere un array di oggetti con i seguenti campi:
  - `value`: valore dell'opzione
  - `label`: etichetta dell'opzione
- `onTextInputChange`: opzionale. Callback che viene chiamata quando l'utente modifica il testo inserito nel campo di testo. Può essere usata per aggiornare l'array di opzioni passato al filtro.

I filtri di tipo `numeric`, oltre ai campi obbligatori, accettano opzionalmente, i seguenti campi:
- `min`: valore minimo accettato
- `max`: valore massimo accettato

Esempio di utilizzo:

```tsx
import React from "react";
import { useFilters, Filters } from "@pagopa/interop-fe-commons";

const FiltersExample: React.FC = () => {
  const { filtersParams, ...handlers } = useFilters<EServiceListQueryFilters>([
    { name: "q", type: "freetext", label: "Find by name" },
    {
      name: "version",
      type: "numeric",
      label: "Find by version number",
      min: 10,
      max: 20,
    },
    {
      name: "consumerId",
      type: "autocomplete-multiple",
      label: "Find by consumer",
      options: [
        { value: "option-1", label: "PagoPA S.p.A." },
        { value: "option-2", label: "Agenzia delle Entrate" },
      ],
      onTextInputChange: (value) => console.log(value),
    },
    {
      name: "state",
      type: "autocomplete-single",
      label: "Find by State",
      options: [
        { value: "option-1", label: "PagoPA S.p.A." },
        { value: "option-2", label: "Agenzia delle Entrate" },
      ],
      onTextInputChange: (value) => console.log(value),
    },
    {
      name: "createdAt",
      type: "datepicker",
      label: "Find by creation date",
    },
  ]);
  
  return <Filters {...handlers} />
}
  ```

## Paginazione
La paginazione viene gestita attraverso un hook, `usePagination`, e un componente `Pagination`.

`usePagination` è un hook che mantiene lo stato della paginazione in sync con i parametri url. Accetta in input un oggetto con una proprietà `limit` che indica il numero di elementi desiderati per pagina e ritorna un oggetto contente:
- `paginationParams`: oggetto contenente i parametri da passare alla query.
- `paginatinoProps`: le props da passare al componente `Pagination`.
- `getTotalPageCount`: funzione che prende in input il numero totale di elementi e ritorna il numero totale di pagine.

Il componente `Pagination` è di default allineato a destra e non viene renderizzato se il numero di pagine è inferiore a 2. 
Esso accetta tutte le props di un componente `Stack` di `MUI` nel caso si voglia personalizzare il layout.

Esempio di utilizzo:

```tsx
import React from "react";
import { usePagination, Pagination } from "@pagopa/interop-fe-commons";
import { useQuery } from '@tanstack/react-query'

const PaginationExample: React.FC = () => {
  const { 
    paginationParams, 
    paginationProps, 
    getTotalPageCount 
  } = usePagination({ limit: 10 });

  const { data } = useQuery(
    ["Records", paginationParams], 
    /* ... */
  ) 
  const totalPages = getTotalPageCount(data.totalCount);

  return (
    <Pagination 
      totalPages={totalPages} 
      {...paginationProps} 
    />
  );
}
```

## Componenti
### Table e TableRow

`Table` accetta come props:
- `headLabels`: array di stringhe che vanno a comporre l'intestazione della tabella. Il numero di elementi sarà uguale al numero di colonne.
- `isEmpty`: booleano opzionale che indica se la tabella è vuota. Se è `true`, viene renderizzato una alert di `MUI` con messaggio di avviso.
- `noDataLabel`: stringa opzionale che indica il messaggio da mostrare nel renderizzato nel caso `isEmpty` sia `true`. Di default è 'La ricerca corrente non ha prodotto risultati' che viene tradotto in base alla lingua impostata (italiano o inglese).

`TableRow`, vanno inserite come `children` del componente `Table`. Accetta come props: 
- `cellData`: array di stringhe o elementi JSX che vanno a comporre una riga della tabella. **Attenzione: nel caso di elementi JSX, è necessario passare un `key` univoco per ogni elemento.**
- `children`: opzionale, se viene passato, viene renderizzato come ultima colonna della tabella, allineata a destra. Può essere usato per renderizzare un azione (es. un bottone) per ogni riga.

Esempio di utilizzo:

```tsx
import React from "react";
import { Table, TableRow } from "@pagopa/interop-fe-commons";
import { Button, Chip } from "@mui/material";

const tableData = [
  { name: "e-service 1", state: "ACTIVE" },
  { name: "e-service 2", state: "SUSPENDED" },
  { name: "e-service 3", state: "ARCHIVED" },
];

export const TableExample: React.FC = () => {
  const headLabels = ["Nome", "Stato", ""];
  const isEmpty = tableData.length === 0;

  return (
    <Table isEmpty={isEmpty} headLabels={headLabels}>
      {tableData.map((data) => (
        <TableRow
          key={data.name}
          cellData={[data.name, <Chip key={data.name} label={data.state} />]}
        >
          <Button size="small" variant="outlined">
            Ispeziona
          </Button>
        </TableRow>
      ))}
    </Table>
  );
};
```

### InformationContainer

Componente che viene generalmente utilizzato per mostrare un informazione costituita da una label ed un contenuto. Accetta come props:

- `label`: stringa che indica il titolo da mostrare.
- `labelDescription`: stringa opzionale che indica una descrizione del titolo.
- `content`: stringa o elemento JSX che indica il contenuto da mostrare.
- `copyToClipboard`: opzionale, prende un oggetto con le props del componente `CopyToClipboard` di `@pagopa/mui-italia` che vengono passate al componente stesso. Se non viene passato, il componente non viene renderizzato.

Esempio di utilizzo:

```tsx
import React from "react";
import { InformationContainer } from "@pagopa/interop-fe-commons";

const InformationContainerExample: React.FC = () => {
  return (
    <InformationContainer
      label="E-Service"
      labelDescription="This is the e-service name"
      content="Service"
    />
  )
}
```

### CodeBlock

Accetta come props:
- `code`: stringa che indica il codice da mostrare. Se viene passato un oggetto, viene serializzato tramite `JSON.stringify`.
- `hideCopyButton`: booleano opzionale che indica se il bottone per copiare il codice deve essere nascosto. Di default viene mostrato.

### Spinner

Accetta come props:

- `label`: opzionale, stringa che indica il testo da mostrare vicino lo spinner.
- `direction`: opzionale, stringa che indica la direzione dello spinner in base al testo. 
Accetta: 
  - `row` 
  - `column` (default)
  - `row-reverse`
  - `column-reverse`
- `sx`: opzionale, oggetto che indica le props `sx` di `MUI` da passare allo spinner. 

## Hooks

### useAutocompleteTextInput

Hook che gestisce il caso in cui ci sia bisogno di effettuare query per filtrare le opzioni di un Autocomplete di `MUI`.

Per il filtraggio dinamico delle opzioni utilizziamo la seguente logica:

- se il valore del campo di testo contiene meno di 3 caratteri, dal backend ci tornano tutte le opzioni (max 50) ed il filtraggio delle opzioni avviene client-side (svolto in automatico dall'Autocomplete di `MUI`).
- se il valore del campo di testo contiene almeno 3 caratteri, il filtraggio delle opzioni avviene tramite query al backend.

L'hook si comporta analogamente a `useState` di React, l'unica differenza è la funzione di `setState` che implementa il comportamento descritto sopra, applicando un debounce di 300ms al cambio di stato.

Esempio di utilizzo:

```tsx
import React from "react";
import { useAutocompleteTextInput } from "@pagopa/interop-fe-commons";
import { Autocomplete } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

const AutocompleteExample: React.FC = () => {
  const [optionsSearchQuery, setInputTextValue] = useAutocompleteTextInput();

  const { data: options } = useQuery(
    ["Options", { q: optionsSearchQuery }],
    /* ... */
  )

  return (
    <Autocomplete
      value={value}
      options={options}
      onInputChange={setInputTextValue}
      {/** ... */}
    />
  );
};
```
