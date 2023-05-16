import React from 'react'
import type { StoryFn, Meta } from '@storybook/react'
import { Spinner as _Spinner } from '../Spinner'

export default {
  title: 'Components/Spinner',
  component: _Spinner,
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
      defaultValue: {
        value: 'test',
      },
    },
    direction: {
      control: {
        type: 'radio',
      },
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
    },
  },
} as Meta<typeof _Spinner>

export const Spinner: StoryFn<typeof _Spinner> = (args) => <_Spinner {...args} />
