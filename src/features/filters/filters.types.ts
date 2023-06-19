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
  /**
   * The name of the filter field.
   * It will be used as the key in the URL search params and as the key in the `filtersParams` returned object.
   */
  name: TName
  /**
   * The label of the filter field.
   */
  label: string
}

export type FreetextFilterFieldOptions<TName extends string = string> = FilterFieldCommon<TName> & {
  type: 'freetext'
}

export type DatepickerFilterFieldOptions<TName extends string = string> =
  FilterFieldCommon<TName> & {
    type: 'datepicker'
    /**
     * The minimum selectable date.
     */
    minDate?: Date
    /**
     * The maximum selectable date.
     */
    maxDate?: Date
  }

export type NumericFilterFieldOptions<TName extends string = string> = FilterFieldCommon<TName> & {
  type: 'numeric'
  /**
   * The minimum value of the numeric filter.
   */
  min?: number
  /**
   * The maximum value of the numeric filter.
   */
  max?: number
}

export type AutocompleteFilterFieldOptions<TName extends string = string> =
  FilterFieldCommon<TName> & {
    type: 'autocomplete-multiple' | 'autocomplete-single'
    /**
     * The options of the autocomplete filter.
     * The values must be unique.
     */
    options: Array<FilterOption>
    /**
     * Callback called when the user types in the autocomplete input.
     * @param value The value of the input.
     */
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
