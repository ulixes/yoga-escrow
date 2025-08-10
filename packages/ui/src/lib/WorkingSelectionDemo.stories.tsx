import type { Meta, StoryObj } from '@storybook/react'
import { WorkingSelectionDemo } from './WorkingSelectionDemo'

const meta: Meta<typeof WorkingSelectionDemo> = {
  title: 'Ulyx/WorkingSelectionDemo',
  component: WorkingSelectionDemo,
}
export default meta

type Story = StoryObj<typeof WorkingSelectionDemo>

export const Default: Story = {
  render: () => (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#fafafa' }}>
      <WorkingSelectionDemo />
    </div>
  ),
}

export const Embedded: Story = {
  render: () => (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
        Working Selection Components Demo
      </h1>
      <WorkingSelectionDemo />
    </div>
  ),
}