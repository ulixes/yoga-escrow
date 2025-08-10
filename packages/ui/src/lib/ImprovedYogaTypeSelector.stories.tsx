import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { ImprovedYogaTypeSelector, YogaTypeOption } from './ImprovedYogaTypeSelector'

const meta: Meta<typeof ImprovedYogaTypeSelector> = {
  title: 'Ulyx/ImprovedYogaTypeSelector',
  component: ImprovedYogaTypeSelector,
}
export default meta

type Story = StoryObj<typeof ImprovedYogaTypeSelector>

const sampleYogaTypes: YogaTypeOption[] = [
  {
    id: 'vinyasa',
    name: 'Vinyasa',
    tagline: 'Flow with breath',
    description: 'Dynamic sequences that link breath with movement',
    personas: ['runner', 'traveler', 'dancer'],
    benefits: ['Fluidity & balance', 'Expressive flow']
  },
  {
    id: 'hatha',
    name: 'Hatha',
    tagline: 'Foundational & calm',
    description: 'Gentle, slow-paced practice focusing on basic postures',
    personas: ['runner', 'traveler', 'dancer'],
    benefits: ['Alignment & control', 'Mindful movement']
  },
  {
    id: 'yin',
    name: 'Yin',
    tagline: 'Deep stretch',
    description: 'Passive poses held for longer periods to target deep tissues',
    personas: ['runner', 'traveler'],
    benefits: ['Deep relaxation', 'Flexibility']
  },
  {
    id: 'power',
    name: 'Power Yoga',
    tagline: 'Strength & energy',
    description: 'Fast-paced, strength-focused Vinyasa practice',
    personas: ['runner', 'dancer'],
    benefits: ['Build strength', 'Athletic flow']
  },
  {
    id: 'restorative',
    name: 'Restorative',
    tagline: 'Rest & restore',
    description: 'Gentle, supported poses using props for deep relaxation',
    personas: ['traveler'],
    benefits: ['Stress relief', 'Deep rest']
  }
]

export const Default: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [filterPersona, setFilterPersona] = useState<string | null>(null)

    return (
      <div style={{ padding: '20px', maxWidth: '800px' }}>
        <ImprovedYogaTypeSelector
          options={sampleYogaTypes}
          selectedId={selectedId}
          filterPersona={filterPersona}
          onSelect={setSelectedId}
          onFilterChange={setFilterPersona}
        />
        
        <div style={{ marginTop: '20px', padding: '16px', background: '#f0f0f0', borderRadius: '8px' }}>
          <h4>Current Selection:</h4>
          <p><strong>Selected:</strong> {selectedId || 'None'}</p>
          <p><strong>Filter:</strong> {filterPersona || 'All'}</p>
        </div>
      </div>
    )
  },
}

export const RunnerFilter: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>('vinyasa')
    const [filterPersona, setFilterPersona] = useState<string | null>('runner')

    return (
      <div style={{ padding: '20px', maxWidth: '800px' }}>
        <ImprovedYogaTypeSelector
          options={sampleYogaTypes}
          selectedId={selectedId}
          filterPersona={filterPersona}
          onSelect={setSelectedId}
          onFilterChange={setFilterPersona}
        />
      </div>
    )
  },
}