# PDND Interoperabilità: libreria commons

Raccolta di componenti e funzionalità utilizzati da progetti PDND Interoperabilità.

## Installazione

```bash
npm install @italia/pdnd-interop-commons
```
> ⚠️ Accertarsi di avere installato tutte le `peerDependencies` richieste.

## Componenti

### `useFilters` e `Filters`
Permettono di gestire i filtri di ricerca. Essi vanno utilizzati in coppia.

`useFilters` è un hook che mantiene in sync lo stato dei filtri con i parametri url. Ritorna l'oggetto contenente i dati da passare alla query e ciò che serve al componente `Filters` per renderizzare i campi, i filtri attivi e gestire le interazioni con l'utente.

L'hook accetta un array di oggetti che descrivono i filtri disponibili. Ogni oggetto deve avere i seguenti campi obbligatori:
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
const [autocompleteConsumerIdTextInput, setAutocompleteConsumerIdTextInput] =
    useAutocompleteTextInput("");
  const [autocompleteStateTextInput, setAutocompleteStateTextInput] =
    useAutocompleteTextInput("");

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
      onTextInputChange: setAutocompleteConsumerIdTextInput,
    },
    {
      name: "state",
      type: "autocomplete-single",
      label: "Find by State",
      options: [
        { value: "option-1", label: "PagoPA S.p.A." },
        { value: "option-2", label: "Agenzia delle Entrate" },
      ],
      onTextInputChange: setAutocompleteStateTextInput,
    },
    {
      name: "createdAt",
      type: "datepicker",
      label: "Find by creation date",
    },
  ]);
  
  return <Filters {...handlers} />
  ```

## `usePagination` e `Pagination`
Permettono di gestire la paginazione. Analogamente a `useFilters` e `Filters`, vanno utilizzati in coppia.

`usePagination` è un hook che mantiene in sync lo stato della paginazione con i parametri url. Accetta in input un oggetto con una proprietà `limit` che indica il numero di elementi desiderati per pagina e ritorna un oggetto contente:
- `paginationParams`: oggetto contenente i parametri da passare alla query.
- `paginatinoProps`: oggetto contenente le props da passare al componente `Pagination`.
- `getTotalPageCount`: funzione che prende in input il numero totale di elementi e ritorna il numero totale di pagine.

Il componente `Pagination` è di default allineato a destra e non viene renderizzato se il numero di pagine è inferiore a 2. 
Esso accetta tutte le props di un componente `Stack` di `MUI` nel caso si voglia personalizzare il layout.

Esempio di utilizzo:

```tsx
const { 
  paginationParams, 
  paginationProps, 
  getTotalPageCount 
} = usePagination({ limit: 10 });

const totalPages = getTotalPageCount(response.totalCount);

return (
  <Pagination 
    totalPages={totalPages} 
    {...paginationProps} 
  />
);
```