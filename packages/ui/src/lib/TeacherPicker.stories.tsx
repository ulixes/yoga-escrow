import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { TeacherPicker, TeacherItem } from './TeacherPicker'
import { Brand } from './Brand'

const meta: Meta<typeof TeacherPicker> = {
  title: 'Discovery/TeacherPicker',
  component: TeacherPicker,
}
export default meta

type Story = StoryObj<typeof TeacherPicker>

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

const mockTeachers: TeacherItem[] = [
  {
    id: 't1',
    name: 'Asha Verma',
    bio: 'Vinyasa specialist helping runners build endurance',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&h=256&fit=crop&auto=format&q=60',
    personas: ['Runner', 'Traveler'],
    yogaTypes: ['Vinyasa', 'Power'],
    followerCount: 12400,
    rating: 4.8,
    postImages: [
      'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=200&h=200&fit=crop&auto=format&q=60',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop&auto=format&q=60',
      'https://images.unsplash.com/photo-1520975922284-5f61eacef9d5?w=200&h=200&fit=crop&auto=format&q=60',
      'https://images.unsplash.com/photo-1540202404-2226fb5a6d03?w=200&h=200&fit=crop&auto=format&q=60',
    ],
  },
  {
    id: 't2',
    name: 'Lina Ortiz',
    bio: 'Yin for flexibility and calm—ideal for travelers',
    avatarUrl: 'https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?w=256&h=256&fit=crop&auto=format&q=60',
    personas: ['Traveler', 'Dancer'],
    yogaTypes: ['Yin', 'Hatha'],
    followerCount: 8600,
    rating: 4.6,
    postImages: [
      'https://images.unsplash.com/photo-1557429262-84f0b8db7413?w=200&h=200&fit=crop&auto=format&q=60',
      'https://images.unsplash.com/photo-1520975922284-5f61eacef9d5?w=200&h=200&fit=crop&auto=format&q=60',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop&auto=format&q=60',
      'https://images.unsplash.com/photo-1540202404-2226fb5a6d03?w=200&h=200&fit=crop&auto=format&q=60',
    ],
  },
  {
    id: 't3',
    name: 'Noah Kim',
    bio: 'Ashtanga strength & focus for disciplined growth',
    avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256&h=256&fit=crop&auto=format&q=60',
    personas: ['Runner', 'Dancer'],
    yogaTypes: ['Ashtanga', 'Iyengar'],
    followerCount: 17400,
    rating: 4.9,
    postImages: [
      'https://images.unsplash.com/photo-1540202404-2226fb5a6d03?w=200&h=200&fit=crop&auto=format&q=60',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop&auto=format&q=60',
      'https://images.unsplash.com/photo-1520975922284-5f61eacef9d5?w=200&h=200&fit=crop&auto=format&q=60',
      'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=200&h=200&fit=crop&auto=format&q=60',
    ],
  },
]

export const Default: Story = {
  render: (args) => {
    const [selectedIds, setSelectedIds] = React.useState<string[]>(args.selectedIds || [])
    return (
      <Layout>
        <TeacherPicker
          {...args}
          selectedIds={selectedIds}
          selectionMode="multiple"
          onSelect={(id) => setSelectedIds([id])}
          onDeselect={(id) => setSelectedIds((s) => s.filter((x) => x !== id))}
        />
      </Layout>
    )
  },
  args: {
    items: mockTeachers,
    skin: 'ulyxes',
    selectedIds: ['t2'],
    pickingId: 't1',
  },
}
