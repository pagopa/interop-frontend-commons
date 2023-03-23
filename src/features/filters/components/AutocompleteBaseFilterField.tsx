import React from 'react'
import { Autocomplete, AutocompleteProps, Paper, TextField } from '@mui/material'
import { debounce, getLocalizedValue } from '../../../utils/common.utils'
import { FilterOption } from '../filters.types'

type AutocompleteBaseFilterFieldProps<Multiple extends boolean> = Omit<
  AutocompleteProps<FilterOption, Multiple, true, false>,
  | 'isOptionEqualToValue'
  | 'noOptionsText'
  | 'disableClearable'
  | 'renderTags'
  | 'PaperComponent'
  | 'size'
  | 'renderInput'
  | 'onInputChange'
> & { label: string; onInputChange?: (value: string) => void }

export const AutocompleteBaseFilterField = <Multiple extends boolean>(
  props: AutocompleteBaseFilterFieldProps<Multiple>
) => {
  const noOptionsText = getLocalizedValue({
    it: 'Nessun risultato trovato',
    en: 'No results',
  })

  const handleInputChange = React.useMemo(
    () =>
      debounce((value: string) => {
        if (value.length >= 3) {
          props?.onInputChange?.(value)
          return
        }
        props?.onInputChange?.('')
      }, 300),
    [props?.onInputChange]
  )

  return (
    <Autocomplete<FilterOption, Multiple, true, false>
      {...props}
      onInputChange={(_, value) => handleInputChange(value)}
      isOptionEqualToValue={(option, { value }) => option.value === value}
      noOptionsText={noOptionsText}
      disableClearable
      renderTags={() => null}
      PaperComponent={({ children }) => <Paper elevation={4}>{children}</Paper>}
      size="small"
      onChange={(event, data, reason) => {
        // Avoids default behaviour of filters being removed on backspace press
        if (
          event.type === 'keydown' &&
          (event as React.KeyboardEvent).key === 'Backspace' &&
          reason === 'removeOption'
        ) {
          return
        }
        props.onChange?.(event, data, reason)
      }}
      renderInput={(params) => {
        return <TextField variant="outlined" {...params} label={props.label} />
      }}
    />
  )
}
