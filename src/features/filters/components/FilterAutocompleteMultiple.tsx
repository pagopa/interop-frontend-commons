import React from 'react'
import { Autocomplete, Checkbox, Paper, TextField, Typography } from '@mui/material'
import type { AutocompleteProps } from '@mui/material'
import { getLocalizedValue } from '@/utils/common.utils'
import { debounce } from '../filters.utils'

type FilterAutocompleteMultipleProps = Omit<
  AutocompleteProps<{ label: string; value: string }, true, true, false>,
  'renderInput' | 'onInputChange'
> & {
  name: string
  label: string
  onTextInputChange?: (value: string) => void
}

export const FilterAutocompleteMultiple: React.FC<FilterAutocompleteMultipleProps> = ({
  label,
  options,
  onTextInputChange,
  ...props
}) => {
  const defaultNoOptionsText = getLocalizedValue({
    it: 'Nessun risultato trovato',
    en: 'No results',
  })

  const handleAutocompleteInputChange = React.useMemo(
    () =>
      debounce((_: unknown, value: string) => {
        if (value.length >= 3) {
          onTextInputChange?.(value)
          return
        }
        onTextInputChange?.('')
      }, 300),
    [onTextInputChange]
  )

  return (
    <Autocomplete<{ label: string; value: string }, true, true, false>
      multiple
      options={options}
      isOptionEqualToValue={(option, { value }) => option.value === value}
      noOptionsText={props.noOptionsText || defaultNoOptionsText}
      disableCloseOnSelect
      disableClearable
      renderTags={() => null}
      PaperComponent={({ children }) => <Paper elevation={4}>{children}</Paper>}
      size="small"
      {...props}
      onInputChange={handleAutocompleteInputChange}
      onChange={(event, data, reason) => {
        if (
          event.type === 'keydown' &&
          (event as React.KeyboardEvent).key === 'Backspace' &&
          reason === 'removeOption'
        ) {
          return
        }
        props?.onChange?.(event, data, reason)
      }}
      renderInput={(params) => {
        return <TextField variant="outlined" {...params} label={label} />
      }}
      renderOption={(props, option, { selected, index }) => {
        const label = option.label
        if (!label) return null

        return (
          <Typography component="li" {...props} sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox sx={{ mr: 1 }} key={index} checked={selected} name={label} />
            <span>{label}</span>
          </Typography>
        )
      }}
    />
  )
}
