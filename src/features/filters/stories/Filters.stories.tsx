import React from 'react'
import type { Meta, StoryFn } from '@storybook/react'
import { FiltersExample } from './FiltersExample'

export default {
  title: 'Features/Filters',
  component: FiltersExample,
} as Meta<typeof FiltersExample>

export const Filters: StoryFn = () => <FiltersExample />
