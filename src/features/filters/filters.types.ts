export type ActiveFilters = Array<FilterOption & { type: FilterFieldType; filterKey: string }>
export type FilterFieldValue = Array<FilterOption> | FilterOption | string | (Date | null)

export type FilterFieldsValues = Record<string, FilterFieldValue>
export type FilterFieldType =
  | 'autocomplete-multiple'
  | 'autocomplete-single'
  | 'numeric'
  | 'freetext'
  | 'datepicker'
export type FiltersParams = Record<string, string | string[] | boolean>
export type FiltersHandlers = {
  fields: FilterFields
  activeFilters: ActiveFilters
  onChangeActiveFilter: FiltersHandler
  onRemoveActiveFilter: FiltersHandler
  onResetActiveFilters: VoidFunction
}

type FilterFieldCommon<TName extends string = string> = {
  name: TName
  label: string
}

export type FreetextFilterFieldOptions<TName extends string = string> = FilterFieldCommon<TName> & {
  type: 'freetext'
}
export type DatepickerFilterFieldOptions<TName extends string = string> =
  FilterFieldCommon<TName> & { type: 'datepicker' }
export type NumericFilterFieldOptions<TName extends string = string> = FilterFieldCommon<TName> & {
  type: 'numeric'
  min?: number
  max?: number
}

export type AutocompleteFilterFieldOptions<TName extends string = string> =
  FilterFieldCommon<TName> & {
    type: 'autocomplete-multiple' | 'autocomplete-single'
    options: Array<FilterOption>
    onTextInputChange?: (value: string) => void
  }

export type FilterField<TName extends string = string> =
  | FreetextFilterFieldOptions<TName>
  | DatepickerFilterFieldOptions<TName>
  | NumericFilterFieldOptions<TName>
  | AutocompleteFilterFieldOptions<TName>

export type FilterFieldCommonProps = {
  field: FilterField
  value: FilterFieldValue
  onChangeActiveFilter: FiltersHandler
  onFieldsValuesChange: (name: string, value: FilterFieldValue) => void
}

export type FilterFields<TName extends string = string> = FilterField<TName>[]

export type FilterOption = { label: string; value: string }

export type FiltersHandler = (
  type: FilterFieldType,
  filterKey: string,
  value: FilterFieldValue
) => void
