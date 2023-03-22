import React from 'react'
import { Grid } from '@mui/material'
import { AutocompleteMultipleFilterField } from './AutocompleteMultipleFilterField'
import type {
  FilterFieldValue,
  FilterFieldsValues,
  FilterFields,
  FiltersHandler,
} from '../filters.types'
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
    <Grid container spacing={2}>
      {fields.map((field) => {
        const fieldProps = {
          field,
          value: fieldsValues[field.name],
          onChangeActiveFilter,
          onFieldsValuesChange,
        }
        return (
          <Grid item xs={3} key={field.name}>
            {field.type === 'freetext' && <FreetextFilterField {...fieldProps} />}
            {field.type === 'numeric' && <NumericFilterField {...fieldProps} />}
            {field.type === 'autocomplete-multiple' && (
              <AutocompleteMultipleFilterField {...fieldProps} />
            )}
            {field.type === 'datepicker' && <DatepickerFilterField {...fieldProps} />}
          </Grid>
        )
      })}
    </Grid>
  )
}
