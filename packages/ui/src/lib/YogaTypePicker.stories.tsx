import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { YogaTypePicker, YogaTypeItem } from './YogaTypePicker'
import { Brand } from './Brand'

const personas = ['Dancer', 'Runner', 'Traveler']

const items: YogaTypeItem[] = [
  {
    id: 'vinyasa',
    name: 'Vinyasa Yoga',
    tagline: 'Flow-based sequences linking breath with movement',
    personas,
    benefits: {
      Dancer: [
        'Builds fluid movement, balance, and core strength',
        'Supports performance and expression',
      ],
      Runner: [
        'Improves endurance and hip flexibility',
        'Aids recovery from repetitive strain',
      ],
      Traveler: [
        'Energizing and adaptable without props',
        'Short flows to combat jet lag',
      ],
    },
  },
  {
    id: 'yin',
    name: 'Yin Yoga',
    tagline: 'Slow, deep stretches held for minutes',
    personas,
    benefits: {
      Dancer: ['Enhances deep flexibility and joint mobility'],
      Runner: ['Releases tight muscles and reduces injury risk'],
      Traveler: ['Restorative and calming after long travel'],
    },
  },
  {
    id: 'hatha',
    name: 'Hatha Yoga',
    tagline: 'Balanced, foundational poses with breathwork',
    personas,
    benefits: {
      Dancer: ['Improves alignment and body awareness'],
      Runner: ['Strengthens core and legs; better posture'],
      Traveler: ['Simple and portable; minimal space needed'],
    },
  },
  {
    id: 'ashtanga',
    name: 'Ashtanga Yoga',
    tagline: 'Structured, vigorous, athletic series',
    personas,
    benefits: {
      Dancer: ['Strength, stamina, and precision for routines'],
      Runner: ['Cardio and leg power for distance'],
      Traveler: ['Challenging yet modifiable; builds resilience'],
    },
  },
  {
    id: 'restorative',
    name: 'Restorative Yoga',
    tagline: 'Passive poses with props for deep relaxation',
    personas,
    benefits: {
      Dancer: ['Recovery support; reduces muscle fatigue'],
      Runner: ['Eases soreness and promotes healing'],
      Traveler: ['Stress relief and sleep improvement'],
    },
  },
  {
    id: 'iyengar',
    name: 'Iyengar Yoga',
    tagline: 'Precise alignment with props',
    personas,
    benefits: {
      Dancer: ['Refines posture and balance for accuracy'],
      Runner: ['Corrects asymmetries; injury prevention'],
      Traveler: ['Adaptable with everyday items; mindful'],
    },
  },
  {
    id: 'kundalini',
    name: 'Kundalini Yoga',
    tagline: 'Poses, breathwork, chanting, meditation',
    personas,
    benefits: {
      Dancer: ['Enhances creativity, focus, expression'],
      Runner: ['Builds mental toughness and energy'],
      Traveler: ['Grounding and reduces anxiety in new places'],
    },
  },
  {
    id: 'power',
    name: 'Power Yoga',
    tagline: 'Fast-paced, strength-focused Vinyasa',
    personas,
    benefits: {
      Dancer: ['Muscular endurance for high-energy performance'],
      Runner: ['Cross-trains for better speed and power'],
      Traveler: ['Quick, invigorating sessions while on the go'],
    },
  },
]

const meta: Meta<typeof YogaTypePicker> = {
  title: 'Discovery/YogaTypePicker',
  component: YogaTypePicker,
}
export default meta

type Story = StoryObj<typeof YogaTypePicker>

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

export const Default: Story = {
  render: (args) => {
    const [selectedIds, setSelectedIds] = React.useState<string[]>(args.selectedIds || [])
    return (
      <Layout>
        <YogaTypePicker
          {...args}
          selectedIds={selectedIds}
          onSelect={(id) => setSelectedIds((s) => Array.from(new Set([...s, id])))}
          onDeselect={(id) => setSelectedIds((s) => s.filter((x) => x !== id))}
        />
      </Layout>
    )
  },
  args: {
    items,
    personas,
    skin: 'ulyxes',
    selectedIds: ['vinyasa'],
    pickingId: 'vinyasa',
  },
}

export const FilterRunners: Story = {
  render: (args) => (
    <Layout>
      <YogaTypePicker {...args} />
    </Layout>
  ),
  args: {
    items,
    personas,
    filterPersona: 'Runner',
    skin: 'ulyxes',
    selectedIds: ['ashtanga'],
  },
}

// Lean version: removed search story for simplicity
