import React from 'react'
import {
  AutocompleteFilterFieldOptions,
  FilterFieldCommonProps,
  FilterFieldsValues,
  FilterOption,
} from '../filters.types'
import { AutocompleteBaseFilterField } from './AutocompleteBaseFilterField'

export const AutocompleteSingleFilterField: React.FC<FilterFieldCommonProps> = ({
  field: _field,
  onChangeActiveFilter,
}) => {
  const field = _field as AutocompleteFilterFieldOptions
  const filterKey = field.name

  const handleAutocompleteSingleChange = (data: FilterFieldsValues['string']) => {
    onChangeActiveFilter('autocomplete-single', filterKey, data)
  }

  return (
    <AutocompleteBaseFilterField<false>
      label={field.label}
      blurOnSelect
      value={null as unknown as FilterOption}
      options={field.options}
      onInputChange={field?.onTextInputChange}
      onChange={(_, data) => {
        handleAutocompleteSingleChange(data)
      }}
    />
  )
}
