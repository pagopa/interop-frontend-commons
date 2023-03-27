import React from 'react'
import { Table as _Table } from '../Table'
import { TableRow } from '../TableRow'
import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { Button, Chip, Container } from '@mui/material'

export default {
  title: 'Components/Table',
  component: _Table,
} as ComponentMeta<typeof _Table>

const tableData = [
  { name: 'e-service 1', state: 'ACTIVE' },
  { name: 'e-service 2', state: 'SUSPENDED' },
  { name: 'e-service 3', state: 'ARCHIVED' },
]

export const WithContent: ComponentStory<typeof _Table> = () => {
  const headLabels = ['Nome', 'Stato', '']
  const isEmpty = tableData.length === 0

  return (
    <Container sx={{ p: 4, bgcolor: 'white' }}>
      <_Table isEmpty={isEmpty} headLabels={headLabels}>
        {tableData.map((data) => (
          <TableRow
            key={data.name}
            cellData={[data.name, <Chip key={data.name} label={data.state} />]}
          >
            <Button size="small" variant="outlined">
              Ispeziona
            </Button>
          </TableRow>
        ))}
      </_Table>
    </Container>
  )
}

export const Empty: ComponentStory<typeof _Table> = () => {
  const headLabels = ['Nome', 'Stato', '']
  return (
    <Container sx={{ p: 4, bgcolor: 'white' }}>
      <_Table isEmpty={true} headLabels={headLabels}>
        {}
      </_Table>
    </Container>
  )
}
