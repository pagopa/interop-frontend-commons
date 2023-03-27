import React from 'react'
import type { ComponentMeta } from '@storybook/react'
import { FiltersExample } from './FiltersExample'

export default {
  title: 'Features/Filters',
  component: FiltersExample,
} as ComponentMeta<typeof FiltersExample>

export const Filters = () => <FiltersExample />
