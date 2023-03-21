import React from 'react'
import { Stack } from '@mui/material'
import { ActiveFilterChips } from './ActiveFiltersChips'
import { FiltersFields } from './FiltersFields'
import type {
  FilterOption,
  FiltersHandler,
  FiltersHandlers,
  FilterFieldValue,
  FilterFieldsValues,
} from '@/features/filters/filters.types'
import {
  getFiltersFieldsInitialValues,
  getFiltersFieldsDefaultValue,
} from '@/features/filters/filters.utils'
import { useSearchParams } from 'react-router-dom'

export type FiltersProps = FiltersHandlers

export const Filters: React.FC<FiltersProps> = ({
  activeFilters,
  onChangeActiveFilter,
  onRemoveActiveFilter,
  onResetActiveFilters,
  fields,
}) => {
  const [searchParams] = useSearchParams()
  const [fieldsValues, setFieldsValues] = React.useState<FilterFieldsValues>(() =>
    getFiltersFieldsInitialValues(searchParams, fields)
  )

  const handleFieldsValuesChange = React.useCallback((name: string, value: FilterFieldValue) => {
    setFieldsValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleRemoveActiveFilter: FiltersHandler = (type, filterKey, value) => {
    if (type === 'autocomplete-multiple') {
      const fieldValue = fieldsValues[filterKey] as Array<FilterOption>
      handleFieldsValuesChange(
        filterKey,
        fieldValue.filter(({ value: v }) => v !== value)
      )
    }
    onRemoveActiveFilter(type, filterKey, value)
  }

  const handleResetActiveFilters = () => {
    setFieldsValues(getFiltersFieldsDefaultValue(fields))
    onResetActiveFilters()
  }

  return (
    <Stack direction="column" spacing={2} justifyContent="space-between" sx={{ mb: 4 }}>
      <FiltersFields
        fields={fields}
        fieldsValues={fieldsValues}
        onFieldsValuesChange={handleFieldsValuesChange}
        onChangeActiveFilter={onChangeActiveFilter}
      />
      <ActiveFilterChips
        activeFilters={activeFilters}
        onRemoveActiveFilter={handleRemoveActiveFilter}
        onResetActiveFilters={handleResetActiveFilters}
      />
    </Stack>
  )
}
