import React from 'react'

export type PersonaType = 'Dancer' | 'Runner' | 'Traveler' | 'None'
export type GoalType = 'Flexibility' | 'Recovery' | 'Strength' | 'Calm' | 'Back' | 'None'

export interface ImprovedPersonaSelectorProps {
  selectedPersona: PersonaType
  selectedGoal: GoalType
  onPersonaChange: (persona: PersonaType) => void
  onGoalChange: (goal: GoalType) => void
  className?: string
  skin?: string
}

export function ImprovedPersonaSelector({
  selectedPersona,
  selectedGoal,
  onPersonaChange,
  onGoalChange,
  className,
  skin = 'ulyxes'
}: ImprovedPersonaSelectorProps) {
  const personas: PersonaType[] = ['Dancer', 'Runner', 'Traveler', 'None']
  const goals: GoalType[] = ['None', 'Flexibility', 'Recovery', 'Strength', 'Calm', 'Back']

  return (
    <div 
      data-skin={skin} 
      className={`yui-persona-selector ${className || ''}`}
    >
      <div className="yui-persona-selector__hero">
        <h2 className="yui-persona-selector__title">Start Your Journey</h2>
        <p className="yui-persona-selector__subtitle">Pick a persona and an optional goal</p>
      </div>

      <div className="yui-persona-selector__section">
        <h3 className="yui-persona-selector__section-title">Persona</h3>
        <div className="yui-persona-selector__grid">
          {personas.map((persona) => (
            <button
              key={persona}
              type="button"
              className={`yui-persona-selector__option ${
                selectedPersona === persona ? 'yui-persona-selector__option--selected' : ''
              }`}
              onClick={() => onPersonaChange(persona)}
              aria-pressed={selectedPersona === persona}
            >
              {persona}
            </button>
          ))}
        </div>
      </div>

      <div className="yui-persona-selector__section">
        <h3 className="yui-persona-selector__section-title">Goal (Optional)</h3>
        <div className="yui-persona-selector__grid yui-persona-selector__grid--goals">
          {goals.map((goal) => (
            <button
              key={goal}
              type="button"
              className={`yui-persona-selector__option yui-persona-selector__option--goal ${
                selectedGoal === goal ? 'yui-persona-selector__option--selected' : ''
              }`}
              onClick={() => onGoalChange(goal)}
              aria-pressed={selectedGoal === goal}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}