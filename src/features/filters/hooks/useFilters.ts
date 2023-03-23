import React from 'react'
import type {
  FilterFields,
  FilterOption,
  FiltersHandler,
  FiltersHandlers,
  FiltersParams,
} from '../filters.types'
import { useSearchParams } from 'react-router-dom'
import {
  encodeMultipleFilterFieldValue,
  decodeMultipleFilterFieldValue,
  mapSearchParamsToActiveFiltersAndFilterParams,
  encodeSingleFilterFieldValue,
} from '../filters.utils'

export function useFilters<TFiltersParams extends FiltersParams>(
  fields: FilterFields<Extract<keyof TFiltersParams, string>>
): FiltersHandlers & { filtersParams: TFiltersParams } {
  const [searchParams, setSearchParams] = useSearchParams()

  const onChangeActiveFilter = React.useCallback<FiltersHandler>(
    (type, filterKey, value) => {
      const newSearchParams = new URLSearchParams(searchParams)

      let shouldBeRemoved = false
      if (type === 'datepicker' && value === null) {
        shouldBeRemoved = true
      }
      if (
        ['freetext', 'autocomplete-multiple', 'numeric'].includes(type) &&
        (value as string | Array<FilterOption>).length === 0
      ) {
        shouldBeRemoved = true
      }
      if (shouldBeRemoved) {
        newSearchParams.delete(filterKey)
        setSearchParams(newSearchParams)
        return
      }

      switch (type) {
        case 'numeric':
        case 'freetext':
          newSearchParams.set(filterKey, String(value))
          break
        case 'autocomplete-multiple':
          const urlParamMultipleFilterValue = encodeMultipleFilterFieldValue(
            value as Array<FilterOption>
          )
          newSearchParams.set(filterKey, urlParamMultipleFilterValue)
          break
        case 'autocomplete-single':
          const urlParamSingleFilterValue = encodeSingleFilterFieldValue(value as FilterOption)
          newSearchParams.set(filterKey, urlParamSingleFilterValue)
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
        case 'numeric':
        case 'datepicker':
        case 'autocomplete-single':
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
