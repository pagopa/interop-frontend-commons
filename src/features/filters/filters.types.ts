export type ActiveFilters = Array<FilterOption & { type: FilterFieldType; filterKey: string }>
export type FilterFieldValue = Array<FilterOption> | string | (Date | null)
export type FilterFieldsValues = Record<string, FilterFieldValue>
export type FilterFieldType = 'autocomplete-multiple' | 'freetext' | 'datepicker'
export type FiltersParams = Record<string, string | string[] | boolean>
export type FiltersHandlers = {
  fields: FilterFields
  activeFilters: ActiveFilters
  onChangeActiveFilter: FiltersHandler
  onRemoveActiveFilter: FiltersHandler
  onResetActiveFilters: VoidFunction
}

export type FilterField<TName extends string = string> = {
  name: TName
  label: string
} & (
  | {
      type: 'autocomplete-multiple'
      options: Array<FilterOption>
      onTextInputChange?: (value: string) => void
    }
  | { type: Exclude<FilterFieldType, 'autocomplete-multiple'> }
)

export type FilterFields<T extends string = string> = Array<FilterField<T>>

export type FilterOption = { label: string; value: string }

export type FiltersHandler = (
  type: FilterFieldType,
  filterKey: string,
  value: FilterFieldValue
) => void
