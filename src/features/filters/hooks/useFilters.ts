import React from 'react'
import type {
  FilterFields,
  FilterOption,
  FiltersHandler,
  FiltersHandlers,
  FiltersParams,
} from '@/features/filters/filters.types'
import { useSearchParams } from 'react-router-dom'
import {
  encodeMultipleFilterFieldValue,
  decodeMultipleFilterFieldValue,
  mapSearchParamsToActiveFiltersAndFilterParams,
} from '@/features/filters/filters.utils'

export function useFilters<TFiltersParams extends FiltersParams>(
  fields: FilterFields<Extract<keyof TFiltersParams, string>>
): FiltersHandlers & { filtersParams: TFiltersParams } {
  const [searchParams, setSearchParams] = useSearchParams()

  const onChangeActiveFilter = React.useCallback<FiltersHandler>(
    (type, filterKey, value) => {
      const newSearchParams = new URLSearchParams(searchParams)
      if (value === null || (!(value instanceof Date) && value.length === 0)) {
        newSearchParams.delete(filterKey)
        setSearchParams(newSearchParams)
        return
      }

      switch (type) {
        case 'freetext':
          newSearchParams.set(filterKey, value as string)
          break
        case 'autocomplete-multiple':
          const urlParamValue = encodeMultipleFilterFieldValue(value as Array<FilterOption>)
          newSearchParams.set(filterKey, urlParamValue)
          break
        case 'datepicker':
          newSearchParams.set(filterKey, (value as Date).toISOString())
          break
      }

      newSearchParams.delete('offset')
      setSearchParams(newSearchParams)
    },
    [searchParams, setSearchParams]
  )

  const onRemoveActiveFilter = React.useCallback<FiltersHandler>(
    (type, filterKey, value) => {
      const newSearchParams = new URLSearchParams(searchParams)

      switch (type) {
        case 'freetext':
        case 'datepicker':
          newSearchParams.delete(filterKey)
          break
        case 'autocomplete-multiple':
          const urlParamsValue = searchParams.get(filterKey)
          if (urlParamsValue) {
            const values = decodeMultipleFilterFieldValue(urlParamsValue)
            const filteredValues = values.filter((option) => option.value !== value)
            if (filteredValues.length === 0) {
              newSearchParams.delete(filterKey)
            } else {
              newSearchParams.set(filterKey, encodeMultipleFilterFieldValue(filteredValues))
            }
          }
          break
      }

      newSearchParams.delete('offset')
      setSearchParams(newSearchParams)
    },
    [searchParams, setSearchParams]
  )

  const onResetActiveFilters = React.useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams)
    const paramKeys = [...newSearchParams.keys()]
    paramKeys.forEach((paramKey) => {
      // Only delete the params that are related to filters
      const isFilterKey = fields.some((field) => field.name === paramKey)
      if (isFilterKey) {
        newSearchParams.delete(paramKey)
      }
    })
    setSearchParams(newSearchParams)
  }, [searchParams, setSearchParams, fields])

  const { activeFilters, filtersParams } = mapSearchParamsToActiveFiltersAndFilterParams(
    searchParams,
    fields
  )

  return {
    fields,
    filtersParams: filtersParams as TFiltersParams,
    activeFilters,
    onResetActiveFilters,
    onChangeActiveFilter,
    onRemoveActiveFilter,
  }
}
