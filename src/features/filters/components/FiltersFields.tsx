import React from 'react'
import { Box, Stack } from '@mui/material'
import type {
  FilterFieldValue,
  FilterFieldsValues,
  FilterFields,
  FiltersHandler,
} from '../filters.types'
import { AutocompleteMultipleFilterField } from './AutocompleteMultipleFilterField'
import { AutocompleteSingleFilterField } from './AutocompleteSingleFilterField'
import { DatepickerFilterField } from './DatepickerFilterField'
import { NumericFilterField } from './NumericFilterField'
import { FreetextFilterField } from './FreetextFilterField'

type FiltersFieldsProps = {
  fields: FilterFields
  onChangeActiveFilter: FiltersHandler
  fieldsValues: FilterFieldsValues
  onFieldsValuesChange: (name: string, value: FilterFieldValue) => void
}

export const FiltersFields: React.FC<FiltersFieldsProps> = ({
  fields,
  fieldsValues,
  onFieldsValuesChange,
  onChangeActiveFilter,
}) => {
  return (
    <Stack gap={2} direction={{ sm: 'row' }}>
      {fields.map((field) => {
        const fieldProps = {
          field,
          value: fieldsValues[field.name],
          onChangeActiveFilter,
          onFieldsValuesChange,
        }
        return (
          <Box key={field.name} flex={1}>
            {field.type === 'freetext' && <FreetextFilterField {...fieldProps} />}
            {field.type === 'numeric' && <NumericFilterField {...fieldProps} />}
            {field.type === 'autocomplete-multiple' && (
              <AutocompleteMultipleFilterField {...fieldProps} />
            )}
            {field.type === 'autocomplete-single' && (
              <AutocompleteSingleFilterField {...fieldProps} />
            )}
            {field.type === 'datepicker' && <DatepickerFilterField {...fieldProps} />}
          </Box>
        )
      })}
    </Stack>
  )
}
