import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { TimeSlotCarousel, CuratedSlot } from './TimeSlotCarousel'
import { Brand } from './Brand'

const meta: Meta<typeof TimeSlotCarousel> = {
  title: 'Scheduling/TimeSlotCarousel',
  component: TimeSlotCarousel,
}
export default meta

type Story = StoryObj<typeof TimeSlotCarousel>

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

const demoSlots: CuratedSlot[] = [
  { id: 's1', date: '2025-08-12', time: '09:00', title: 'Energizing Start', benefitTag: 'Great for Runners', persona: 'Runner', teacher: 'Asha' },
  { id: 's2', date: '2025-08-13', time: '18:00', title: 'Evening Yin', benefitTag: 'Post-Run Stretch', persona: 'Runner', teacher: 'Lina' },
  { id: 's3', date: '2025-08-14', time: '07:30', title: 'Sunrise Flow', benefitTag: 'Travel Recovery', persona: 'Traveler', teacher: 'Noah' },
  { id: 's4', date: '2025-08-15', time: '20:00', title: 'Restorative Calm', benefitTag: 'Deep Relax', persona: 'Traveler', teacher: 'Lina' },
  { id: 's5', date: '2025-08-16', time: '10:00', title: 'Power Tempo', benefitTag: 'Strength & Cardio', persona: 'Runner', teacher: 'Asha' },
  { id: 's6', date: '2025-08-17', time: '19:00', title: 'Unwind Stretch', benefitTag: 'Sleep Better', persona: 'Traveler', teacher: 'Noah' },
]

export const Default: Story = {
  render: (args) => {
    const [ids, setIds] = React.useState<string[]>([])
    return (
      <Layout>
        <TimeSlotCarousel
          {...args}
          skin="ulyxes"
          slots={demoSlots}
          selectedIds={ids}
          onChange={setIds}
          onDone={() => alert('Done! ' + ids.join(', '))}
          onCustomize={() => alert('Open mini-grid...')}
        />
      </Layout>
    )
  },
}
