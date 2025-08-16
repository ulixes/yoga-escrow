import type { Meta, StoryObj } from '@storybook/react'
import { TeacherOnboarding } from './TeacherOnboarding'

const meta: Meta<typeof TeacherOnboarding> = {
  title: 'Teacher/TeacherOnboarding',
  component: TeacherOnboarding,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onComplete: { action: 'complete' },
    onSkip: { action: 'skip' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}

export const WithError: Story = {
  args: {
    error: 'This Instagram handle is already taken. Please choose another one.',
  },
}

export const WithoutSkip: Story = {
  args: {
    onSkip: undefined,
  },
}