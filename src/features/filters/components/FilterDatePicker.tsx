import React from 'react'
import itLocale from 'date-fns/locale/it'
import enLocale from 'date-fns/locale/en-US'
import { getLocalizedValue } from '@/utils/common.utils'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'
import {
  DesktopDateTimePicker,
  type DesktopDateTimePickerProps,
} from '@mui/x-date-pickers/DesktopDateTimePicker'

interface FilterDatePickerProps extends DesktopDateTimePickerProps<Date> {
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

export const FilterDatePicker: React.FC<FilterDatePickerProps> = ({ onKeyDown, ...props }) => {
  const adapterLocale = getLocalizedValue({ it: itLocale, en: enLocale })

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={adapterLocale}>
      <DesktopDateTimePicker
        {...props}
        ampm={false}
        slotProps={{ textField: { size: 'small', onKeyDown } }}
      />
    </LocalizationProvider>
  )
}
