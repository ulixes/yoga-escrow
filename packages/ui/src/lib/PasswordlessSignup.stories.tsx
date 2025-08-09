import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { PasswordlessSignup } from './PasswordlessSignup'

const meta: Meta<typeof PasswordlessSignup> = {
  title: 'Auth/PasswordlessSignup',
  component: PasswordlessSignup,
  argTypes: {
    step: {
      control: 'select',
      options: ['enterEmail', 'sendingCode', 'enterCode', 'verifyingCode', 'success', 'error'],
    },
    skin: { control: 'text' },
    codeLength: { control: { type: 'number', min: 4, max: 8 } },
  },
}

export default meta

type Story = StoryObj<typeof PasswordlessSignup>

const mockDelay = (ms: number) => new Promise((res) => setTimeout(res, ms))

const mockRequestCode = async () => {
  await mockDelay(800)
}

const mockVerifyCode = async (_email: string, code: string) => {
  await mockDelay(800)
  if (code !== '123456') throw new Error('Invalid code')
}

const mockVerifyAlwaysOk = async () => {
  await mockDelay(600)
}

const mockVerifyAlwaysFail = async () => {
  await mockDelay(600)
  throw new Error('Invalid code')
}

export const EnterEmail: Story = {
  args: {
    step: 'enterEmail',
    translations: { enterEmailTitle: 'Sign up or log in' },
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyCode,
  },
}

export const SendingCode: Story = {
  args: {
    step: 'sendingCode',
    initialEmail: 'yogi@example.com',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyCode,
  },
}

export const EnterCode: Story = {
  args: {
    step: 'enterCode',
    initialEmail: 'yogi@example.com',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyCode,
  },
}

export const Verifying: Story = {
  args: {
    step: 'verifyingCode',
    initialEmail: 'yogi@example.com',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyCode,
  },
}

export const Success: Story = {
  args: {
    step: 'success',
    initialEmail: 'yogi@example.com',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyCode,
  },
}

export const ErrorState: Story = {
  args: {
    step: 'error',
    initialEmail: 'yogi@example.com',
    translations: { error: 'Something went wrong' },
    onRequestCode: mockRequestCode,
    onVerifyCode: async () => {
      await mockDelay(400)
      throw new Error('Server unreachable')
    },
  },
}

// Themed and SkinDark stories removed to keep white-label baseline

export const FlowDemo: Story = {
  name: 'Uncontrolled Flow (Happy Path)',
  args: {
    initialEmail: '',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyAlwaysOk,
    skin: 'ulyxes',
  },
}

export const FlowUnhappy: Story = {
  name: 'Uncontrolled Flow (Unhappy Path)',
  args: {
    initialEmail: 'yogi@example.com',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyAlwaysFail,
    skin: 'ulyxes',
  },
}
