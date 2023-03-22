import React from 'react'
import itLocale from 'date-fns/locale/it'
import enLocale from 'date-fns/locale/en-US'
import { getLocalizedValue } from '../../../utils/common.utils'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker'
import { FilterFieldCommonProps } from '../filters.types'
import { isValidDate } from '../filters.utils'

export const DatepickerFilterField: React.FC<FilterFieldCommonProps> = ({
  field,
  value,
  onChangeActiveFilter,
  onFieldsValuesChange,
}) => {
  const filterKey = field.name
  const adapterLocale = getLocalizedValue({ it: itLocale, en: enLocale })

  const enableDatepickerFilter = (filterKey: string) => {
    if (!value || !isValidDate(value as Date)) return

    onChangeActiveFilter('datepicker', filterKey, value)
    onFieldsValuesChange(filterKey, null)
  }

  const handleDatepickerKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    const target = event.target as HTMLInputElement
    if (target.type === 'button') return

    target.blur()
    enableDatepickerFilter(field.name)
  }

  const handleDatepickerChange = (data: Date | null) => {
    onFieldsValuesChange(filterKey, data)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={adapterLocale}>
      <DesktopDateTimePicker
        ampm={false}
        onChange={handleDatepickerChange}
        label={field.label}
        slotProps={{
          textField: { size: 'small', onKeyDown: handleDatepickerKeyDown },
        }}
      />
    </LocalizationProvider>
  )
}
