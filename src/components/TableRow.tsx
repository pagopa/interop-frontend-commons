import React from 'react'
import { TableRow as MUITableRow, TableCell, Typography } from '@mui/material'

type Cell = string | JSX.Element

export interface TableRowProps {
  children?: React.ReactNode
  cellData: Array<Cell>
}

export const TableRow: React.FC<TableRowProps> = ({ cellData, children }) => {
  return (
    <MUITableRow sx={{ bgcolor: 'common.white' }}>
      {cellData.map((cell, i) => {
        return (
          <TableCell key={i} sx={{ py: 2 }}>
            {typeof cell === 'string' ? (
              <Typography component="span" sx={{ display: 'inline-block' }} variant="body2">
                {cell}
              </Typography>
            ) : (
              cell
            )}
          </TableCell>
        )
      })}
      {children && (
        <TableCell sx={{ minWidth: '15rem' }} align="right">
          {children}
        </TableCell>
      )}
    </MUITableRow>
  )
}
