import React from 'react'
import { Autocomplete, Checkbox, Paper, TextField, Typography } from '@mui/material'
import { getLocalizedValue } from '../../../utils/common.utils'
import { debounce } from '../filters.utils'
import {
  AutocompleteMultipleFilterFieldOptions,
  FilterFieldCommonProps,
  FilterFieldsValues,
  FilterOption,
} from '../filters.types'

export const AutocompleteMultipleFilterField: React.FC<FilterFieldCommonProps> = ({
  field: _field,
  value,
  onChangeActiveFilter,
  onFieldsValuesChange,
}) => {
  const field = _field as AutocompleteMultipleFilterFieldOptions
  const filterKey = field.name

  const debounceRef = React.useRef<NodeJS.Timeout>()

  const noOptionsText = getLocalizedValue({
    it: 'Nessun risultato trovato',
    en: 'No results',
  })

  const handleAutocompleteMultipleChange = (data: FilterFieldsValues['string']) => {
    onFieldsValuesChange(filterKey, data)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(
      () => onChangeActiveFilter('autocomplete-multiple', filterKey, data),
      300
    )
  }

  const handleAutocompleteInputChange = React.useMemo(
    () =>
      debounce((_: unknown, value: string) => {
        if (value.length >= 3) {
          field?.onTextInputChange?.(value)
          return
        }
        field?.onTextInputChange?.('')
      }, 300),
    [field?.onTextInputChange]
  )

  return (
    <Autocomplete<FilterOption, true, true, false>
      multiple
      value={value as FilterOption[]}
      options={field.options}
      isOptionEqualToValue={(option, { value }) => option.value === value}
      noOptionsText={noOptionsText}
      disableCloseOnSelect
      disableClearable
      renderTags={() => null}
      PaperComponent={({ children }) => <Paper elevation={4}>{children}</Paper>}
      size="small"
      onInputChange={handleAutocompleteInputChange}
      onChange={(event, data, reason) => {
        if (
          event.type === 'keydown' &&
          (event as React.KeyboardEvent).key === 'Backspace' &&
          reason === 'removeOption'
        ) {
          return
        }
        handleAutocompleteMultipleChange(data)
      }}
      renderInput={(params) => {
        return <TextField variant="outlined" {...params} label={field.label} />
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
