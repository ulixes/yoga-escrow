import React, { useState } from 'react'
import { ImprovedPersonaSelector, PersonaType, GoalType } from './ImprovedPersonaSelector'
import { ImprovedYogaTypeSelector, YogaTypeOption } from './ImprovedYogaTypeSelector'

export interface WorkingSelectionDemoProps {
  className?: string
  skin?: string
}

const yogaTypeOptions: YogaTypeOption[] = [
  {
    id: 'vinyasa',
    name: 'Vinyasa',
    tagline: 'Flow with breath',
    description: 'Dynamic sequences that link breath with movement, building heat and fluidity',
    personas: ['runner', 'traveler', 'dancer'],
    benefits: ['Fluidity & balance', 'Expressive flow', 'Build heat']
  },
  {
    id: 'hatha',
    name: 'Hatha',
    tagline: 'Foundational & calm',
    description: 'Gentle, slow-paced practice focusing on basic postures and breathing',
    personas: ['runner', 'traveler', 'dancer'],
    benefits: ['Alignment & control', 'Mindful movement', 'Steady strength']
  },
  {
    id: 'yin',
    name: 'Yin',
    tagline: 'Deep stretch',
    description: 'Passive poses held for longer periods to target deep connective tissues',
    personas: ['runner', 'traveler'],
    benefits: ['Deep relaxation', 'Hip opening', 'Flexibility improvement']
  },
  {
    id: 'power',
    name: 'Power Yoga',
    tagline: 'Strength & energy',
    description: 'Fast-paced, strength-focused practice with athletic movements',
    personas: ['runner', 'dancer'],
    benefits: ['Build strength', 'Athletic flow', 'Core stability']
  },
  {
    id: 'restorative',
    name: 'Restorative',
    tagline: 'Rest & restore',
    description: 'Gentle, supported poses using props for deep relaxation and healing',
    personas: ['traveler'],
    benefits: ['Stress relief', 'Deep rest', 'Nervous system reset']
  }
]

export function WorkingSelectionDemo({ className, skin = 'ulyxes' }: WorkingSelectionDemoProps) {
  const [step, setStep] = useState<'persona' | 'yoga' | 'complete'>('persona')
  
  // Step 1 - Persona Selection
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('None')
  const [selectedGoal, setSelectedGoal] = useState<GoalType>('None')
  
  // Step 2 - Yoga Type Selection
  const [selectedYogaId, setSelectedYogaId] = useState<string | null>(null)
  const [filterPersona, setFilterPersona] = useState<string | null>(null)

  const handlePersonaNext = () => {
    if (selectedPersona !== 'None') {
      // Auto-set filter based on persona selection
      const personaMap: Record<PersonaType, string | null> = {
        'Dancer': 'dancer',
        'Runner': 'runner', 
        'Traveler': 'traveler',
        'None': null
      }
      setFilterPersona(personaMap[selectedPersona])
      setStep('yoga')
    }
  }

  const handleYogaNext = () => {
    if (selectedYogaId) {
      setStep('complete')
    }
  }

  const handleReset = () => {
    setStep('persona')
    setSelectedPersona('None')
    setSelectedGoal('None')
    setSelectedYogaId(null)
    setFilterPersona(null)
  }

  const selectedYogaType = yogaTypeOptions.find(y => y.id === selectedYogaId)

  return (
    <div data-skin={skin} className={`working-selection-demo ${className || ''}`}>
      <div className="working-selection-demo__header">
        <h1>Yoga Class Booking - Step {step === 'persona' ? '1' : step === 'yoga' ? '2' : '3'}/3</h1>
        <div className="working-selection-demo__progress">
          <div 
            className="working-selection-demo__progress-bar" 
            style={{ 
              width: `${step === 'persona' ? 33 : step === 'yoga' ? 66 : 100}%` 
            }} 
          />
        </div>
      </div>

      <div className="working-selection-demo__content">
        {step === 'persona' && (
          <div className="working-selection-demo__step">
            <ImprovedPersonaSelector
              selectedPersona={selectedPersona}
              selectedGoal={selectedGoal}
              onPersonaChange={setSelectedPersona}
              onGoalChange={setSelectedGoal}
              skin={skin}
            />
            
            <div className="working-selection-demo__actions">
              <button 
                type="button"
                className="working-selection-demo__btn working-selection-demo__btn--primary"
                onClick={handlePersonaNext}
                disabled={selectedPersona === 'None'}
              >
                Next: Choose Yoga Style
              </button>
            </div>
          </div>
        )}

        {step === 'yoga' && (
          <div className="working-selection-demo__step">
            <ImprovedYogaTypeSelector
              options={yogaTypeOptions}
              selectedId={selectedYogaId}
              filterPersona={filterPersona}
              onSelect={setSelectedYogaId}
              onFilterChange={setFilterPersona}
              skin={skin}
            />
            
            <div className="working-selection-demo__actions">
              <button 
                type="button"
                className="working-selection-demo__btn working-selection-demo__btn--secondary"
                onClick={() => setStep('persona')}
              >
                Back
              </button>
              <button 
                type="button"
                className="working-selection-demo__btn working-selection-demo__btn--primary"
                onClick={handleYogaNext}
                disabled={!selectedYogaId}
              >
                Complete Selection
              </button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="working-selection-demo__step working-selection-demo__complete">
            <div className="working-selection-demo__success">
              <h2>Perfect! Your selections are ready 🧘‍♀️</h2>
              <p>Here's what you've chosen for your yoga journey:</p>
            </div>
            
            <div className="working-selection-demo__summary">
              <div className="working-selection-demo__summary-item">
                <h3>Your Persona</h3>
                <p><strong>{selectedPersona}</strong></p>
                {selectedGoal !== 'None' && <p>Goal: {selectedGoal}</p>}
              </div>
              
              <div className="working-selection-demo__summary-item">
                <h3>Your Yoga Practice</h3>
                <p><strong>{selectedYogaType?.name}</strong></p>
                <p><em>{selectedYogaType?.tagline}</em></p>
                <p>{selectedYogaType?.description}</p>
                <div className="working-selection-demo__benefits">
                  {selectedYogaType?.benefits.map((benefit, index) => (
                    <span key={index} className="working-selection-demo__benefit-tag">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="working-selection-demo__actions">
              <button 
                type="button"
                className="working-selection-demo__btn working-selection-demo__btn--secondary"
                onClick={handleReset}
              >
                Start Over
              </button>
              <button 
                type="button"
                className="working-selection-demo__btn working-selection-demo__btn--primary"
                onClick={() => alert('Booking would continue to location and time selection!')}
              >
                Continue Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}