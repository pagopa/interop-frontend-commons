import React from 'react'
import { IconButton, TextField } from '@mui/material'
import type { TextFieldProps } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { getLocalizedValue } from '@/utils/common.utils'

type FilterTextField = TextFieldProps & {
  onIconClick: VoidFunction
}

export const FilterTextField: React.FC<FilterTextField> = ({
  InputProps,
  onIconClick,
  ...props
}) => {
  const searchIconAriaLabel = getLocalizedValue({ it: 'Filtra', en: 'Filter' })
  return (
    <TextField
      size="small"
      {...props}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <IconButton disabled={!props.value} sx={{ mx: -1.5 }} onClick={onIconClick}>
            <SearchIcon aria-label={searchIconAriaLabel} />
          </IconButton>
        ),
      }}
    />
  )
}
