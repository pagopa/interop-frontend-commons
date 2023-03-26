import React from 'react'
import type { ComponentMeta } from '@storybook/react'
import { PaginationExample } from './PaginationExample'

export default {
  title: 'Features/Pagination',
  component: PaginationExample,
} as ComponentMeta<typeof PaginationExample>

export const Pagination = () => <PaginationExample />
