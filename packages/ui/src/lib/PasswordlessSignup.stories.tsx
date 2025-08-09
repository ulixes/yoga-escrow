import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { PasswordlessSignup } from './PasswordlessSignup'
import { Brand } from './Brand'

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

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div style={{ display: 'grid', gap: 16 }}>
    <Brand
      title="Ulyxes"
      slogan="Yoga everywhere.. anytime.."
      subtitle="Move with breath. Find your space."
      orientation="vertical"
      size="lg"
      logoVariant="wave"
      skin="ulyxes"
    />
    {children}
  </div>
)

export const EnterEmail: Story = {
  render: (args) => (
    <Layout>
      <PasswordlessSignup {...args} />
    </Layout>
  ),
  args: {
    step: 'enterEmail',
    translations: { enterEmailTitle: 'Sign up or log in' },
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyCode,
    skin: 'ulyxes',
  },
}

export const SendingCode: Story = {
  render: (args) => (
    <Layout>
      <PasswordlessSignup {...args} />
    </Layout>
  ),
  args: {
    step: 'sendingCode',
    initialEmail: 'yogi@example.com',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyCode,
    skin: 'ulyxes',
  },
}

export const EnterCode: Story = {
  render: (args) => (
    <Layout>
      <PasswordlessSignup {...args} />
    </Layout>
  ),
  args: {
    step: 'enterCode',
    initialEmail: 'yogi@example.com',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyCode,
    skin: 'ulyxes',
  },
}

export const Verifying: Story = {
  render: (args) => (
    <Layout>
      <PasswordlessSignup {...args} />
    </Layout>
  ),
  args: {
    step: 'verifyingCode',
    initialEmail: 'yogi@example.com',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyCode,
    skin: 'ulyxes',
  },
}

export const Success: Story = {
  render: (args) => (
    <Layout>
      <PasswordlessSignup {...args} />
    </Layout>
  ),
  args: {
    step: 'success',
    initialEmail: 'yogi@example.com',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyCode,
    skin: 'ulyxes',
  },
}

export const ErrorState: Story = {
  render: (args) => (
    <Layout>
      <PasswordlessSignup {...args} />
    </Layout>
  ),
  args: {
    step: 'error',
    initialEmail: 'yogi@example.com',
    translations: { error: 'Something went wrong' },
    onRequestCode: mockRequestCode,
    onVerifyCode: async () => {
      await mockDelay(400)
      throw new Error('Server unreachable')
    },
    skin: 'ulyxes',
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

export const WithBrandAbove: Story = {
  name: 'Login with Brand',
  render: (args) => (
    <Layout>
      <PasswordlessSignup {...args} />
    </Layout>
  ),
  args: {
    initialEmail: '',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyAlwaysOk,
    skin: 'ulyxes',
  },
}
