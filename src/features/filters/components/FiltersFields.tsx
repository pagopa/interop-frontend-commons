import React from 'react'
import { Stack } from '@mui/material'
import { FilterTextField } from './FilterTextField'
import { FilterAutocompleteMultiple } from './FilterAutocompleteMultiple'
import type {
  FilterFieldValue,
  FilterFieldsValues,
  FilterFields,
  FilterOption,
  FiltersHandler,
  FilterField,
} from '@/features/filters/filters.types'
import { FilterDatePicker } from './FilterDatePicker'
import { isValidDate } from '../filters.utils'

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
  const debounceRef = React.useRef<NodeJS.Timeout>()
  const dataQueueRef = React.useRef<Record<string, FilterOption[]>>({})

  const enableDebouncedMultipleFieldFilters = () => {
    Object.entries(dataQueueRef.current).forEach(([filterKey, value]) => {
      onChangeActiveFilter('autocomplete-multiple', filterKey, value)
    })
    dataQueueRef.current = {}
  }

  const handleTextFieldKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    const target = event.target as HTMLInputElement
    if (target.type === 'button') return
    const filterKey = target.name

    target.blur()
    enableTextFieldFilter(filterKey)
  }

  const enableTextFieldFilter = (filterKey: string) => {
    const value = fieldsValues[filterKey]

    onChangeActiveFilter('freetext', filterKey, value)
    onFieldsValuesChange(filterKey, '')
  }

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterKey = event.currentTarget.name
    const value = event.currentTarget.value
    onFieldsValuesChange(filterKey, value)
  }

  const handleAutocompleteMultipleChange = (
    filterKey: string,
    _: unknown,
    data: FilterFieldsValues['string']
  ) => {
    onFieldsValuesChange(filterKey, data)
    dataQueueRef.current = {
      ...dataQueueRef.current,
      [filterKey]: data as FilterOption[],
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(enableDebouncedMultipleFieldFilters, 300)
  }

  const enableDatePickerFilter = (filterKey: string) => {
    const value = fieldsValues[filterKey] as Date | null

    if (!value || !isValidDate(value)) return

    onChangeActiveFilter('datepicker', filterKey, value)
    onFieldsValuesChange(filterKey, null)
  }

  const handleDatePickerKeyDown = (
    filterKey: string,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== 'Enter') return
    const target = event.target as HTMLInputElement
    if (target.type === 'button') return

    target.blur()
    enableDatePickerFilter(filterKey)
  }

  const handleDatePickerChange = (filterKey: string, data: Date | null) => {
    onFieldsValuesChange(filterKey, data)
  }

  const getCommonProps = (field: FilterField) => {
    return {
      sx: { flex: 0.25 },
      key: field.name,
      label: field.label,
      name: field.name,
    }
  }

  return (
    <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
      {fields.map((field) => {
        if (field.type === 'freetext')
          return (
            <FilterTextField
              {...getCommonProps(field)}
              value={fieldsValues[field.name] as string}
              onChange={handleTextFieldChange}
              onKeyDown={handleTextFieldKeyDown}
              onIconClick={enableTextFieldFilter.bind(null, field.name)}
            />
          )
        if (field.type === 'autocomplete-multiple')
          return (
            <FilterAutocompleteMultiple
              {...getCommonProps(field)}
              value={fieldsValues[field.name] as FilterOption[]}
              options={field.options}
              onChange={handleAutocompleteMultipleChange.bind(null, field.name)}
              onTextInputChange={field.onTextInputChange}
            />
          )
        if (field.type === 'datepicker')
          return (
            <FilterDatePicker
              {...getCommonProps(field)}
              value={fieldsValues[field.name] as Date | null}
              onChange={handleDatePickerChange.bind(null, field.name)}
              onKeyDown={handleDatePickerKeyDown.bind(null, field.name)}
            />
          )
      })}
    </Stack>
  )
}
