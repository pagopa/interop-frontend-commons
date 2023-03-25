import React from 'react'
import {
  TableContainer,
  Table as MUITable,
  TableBody,
  TableHead,
  TableRow as MUITableRow,
  TableCell,
  Alert,
} from '@mui/material'
import { getLocalizedValue } from '@/utils/common.utils'

export interface TableProps {
  children: React.ReactNode
  headLabels: Array<string>
  isEmpty?: boolean
  noDataLabel?: string
}

export const Table: React.FC<TableProps> = ({ children, noDataLabel, headLabels, isEmpty }) => {
  const defaultNoDataLabel = getLocalizedValue({
    it: 'La ricerca corrente non ha prodotto risultati',
    en: 'Your current search returned no results',
  })

  return (
    <TableContainer sx={{ borderRadius: 1 }}>
      <MUITable>
        <TableHead sx={{ bgcolor: 'background.default' }}>
          <MUITableRow>
            {headLabels.map((item, i) => (
              <TableCell key={i}>{item}</TableCell>
            ))}
          </MUITableRow>
        </TableHead>
        <TableBody sx={{ bgcolor: 'background.paper' }}>
          {children}
          {isEmpty && (
            <MUITableRow>
              <TableCell colSpan={headLabels.length} sx={{ p: 0 }}>
                <Alert severity="info">{noDataLabel ?? defaultNoDataLabel}</Alert>
              </TableCell>
            </MUITableRow>
          )}
        </TableBody>
      </MUITable>
    </TableContainer>
  )
}
