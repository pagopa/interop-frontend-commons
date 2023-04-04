import React from 'react'
import type { Meta, StoryFn } from '@storybook/react'
import { InformationContainer as _InformationContainer } from '../InformationContainer'

export default {
  title: 'Components/InformationContainer',
  component: _InformationContainer,
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'test',
    },
    labelDescription: {
      control: {
        type: 'text',
      },
      defaultValue: 'Description test',
    },
    content: {
      control: {
        type: 'text',
      },
      defaultValue: 'value',
    },
  },
} as Meta<typeof _InformationContainer>

const Template: StoryFn<typeof _InformationContainer> = (args) => {
  return <_InformationContainer {...args} />
}

export const DirectionRow = Template.bind({})

export const DirectionColumn = Template.bind({})
DirectionColumn.args = {
  direction: 'column',
}

export const WithCopyToClipboardButton = Template.bind({})
WithCopyToClipboardButton.args = {
  copyToClipboard: {
    value: 'test',
  },
}
