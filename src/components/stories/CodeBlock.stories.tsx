import React from 'react'
import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { CodeBlock as _CodeBlock } from '../CodeBlock'

export default {
  title: 'Components/CodeBlock',
  component: _CodeBlock,
  argTypes: {
    code: {
      control: {
        type: 'text',
      },
      defaultValue: {
        value: 'test',
      },
    },
  },
} as ComponentMeta<typeof _CodeBlock>

export const CodeBlock: ComponentStory<typeof _CodeBlock> = (args) => <_CodeBlock {...args} />
