import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { ImprovedPersonaSelector, PersonaType, GoalType } from './ImprovedPersonaSelector'

const meta: Meta<typeof ImprovedPersonaSelector> = {
  title: 'Ulyx/ImprovedPersonaSelector',
  component: ImprovedPersonaSelector,
}
export default meta

type Story = StoryObj<typeof ImprovedPersonaSelector>

export const Default: Story = {
  render: () => {
    const [selectedPersona, setSelectedPersona] = useState<PersonaType>('None')
    const [selectedGoal, setSelectedGoal] = useState<GoalType>('None')

    return (
      <div style={{ padding: '20px', maxWidth: '600px' }}>
        <ImprovedPersonaSelector
          selectedPersona={selectedPersona}
          selectedGoal={selectedGoal}
          onPersonaChange={setSelectedPersona}
          onGoalChange={setSelectedGoal}
        />
        
        <div style={{ marginTop: '20px', padding: '16px', background: '#f0f0f0', borderRadius: '8px' }}>
          <h4>Current Selection:</h4>
          <p><strong>Persona:</strong> {selectedPersona}</p>
          <p><strong>Goal:</strong> {selectedGoal}</p>
        </div>
      </div>
    )
  },
}

export const PreSelected: Story = {
  render: () => {
    const [selectedPersona, setSelectedPersona] = useState<PersonaType>('Traveler')
    const [selectedGoal, setSelectedGoal] = useState<GoalType>('Flexibility')

    return (
      <div style={{ padding: '20px', maxWidth: '600px' }}>
        <ImprovedPersonaSelector
          selectedPersona={selectedPersona}
          selectedGoal={selectedGoal}
          onPersonaChange={setSelectedPersona}
          onGoalChange={setSelectedGoal}
        />
      </div>
    )
  },
}