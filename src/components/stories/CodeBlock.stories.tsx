import React from 'react'
import type { StoryFn, Meta } from '@storybook/react'
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
} as Meta<typeof _CodeBlock>

export const CodeBlock: StoryFn<typeof _CodeBlock> = (args) => <_CodeBlock {...args} />
