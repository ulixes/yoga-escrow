import React from 'react'

export type YogaTypeOption = {
  id: string
  name: string
  tagline: string
  description: string
  personas: string[]
  benefits: string[]
}

export interface ImprovedYogaTypeSelectorProps {
  options: YogaTypeOption[]
  selectedId: string | null
  filterPersona: string | null
  onSelect: (id: string) => void
  onFilterChange: (persona: string | null) => void
  className?: string
  skin?: string
}

export function ImprovedYogaTypeSelector({
  options,
  selectedId,
  filterPersona,
  onSelect,
  onFilterChange,
  className,
  skin = 'ulyxes'
}: ImprovedYogaTypeSelectorProps) {
  const availablePersonas = React.useMemo(() => {
    const all = new Set<string>()
    options.forEach(opt => opt.personas.forEach(p => all.add(p)))
    return Array.from(all).sort()
  }, [options])

  const filteredOptions = React.useMemo(() => {
    if (!filterPersona) return options
    return options.filter(opt => opt.personas.includes(filterPersona))
  }, [options, filterPersona])

  return (
    <div 
      data-skin={skin} 
      className={`yui-yoga-type-selector ${className || ''}`}
    >
      <div className="yui-yoga-type-selector__hero">
        <h2 className="yui-yoga-type-selector__title">Choose Your Practice</h2>
        <p className="yui-yoga-type-selector__subtitle">Select the yoga style that resonates with you</p>
      </div>

      <div className="yui-yoga-type-selector__filters">
        <h3 className="yui-yoga-type-selector__filter-title">Filter by persona:</h3>
        <div className="yui-yoga-type-selector__filter-buttons">
          <button
            type="button"
            className={`yui-yoga-type-selector__filter ${
              filterPersona === null ? 'yui-yoga-type-selector__filter--active' : ''
            }`}
            onClick={() => onFilterChange(null)}
          >
            All
          </button>
          {availablePersonas.map((persona) => (
            <button
              key={persona}
              type="button"
              className={`yui-yoga-type-selector__filter ${
                filterPersona === persona ? 'yui-yoga-type-selector__filter--active' : ''
              }`}
              onClick={() => onFilterChange(persona)}
            >
              {persona}
            </button>
          ))}
        </div>
      </div>

      <div className="yui-yoga-type-selector__grid">
        {filteredOptions.map((option) => (
          <div
            key={option.id}
            className={`yui-yoga-type-selector__card ${
              selectedId === option.id ? 'yui-yoga-type-selector__card--selected' : ''
            }`}
            onClick={() => onSelect(option.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(option.id)
              }
            }}
          >
            <h3 className="yui-yoga-type-selector__card-title">{option.name}</h3>
            <p className="yui-yoga-type-selector__card-tagline">{option.tagline}</p>
            <p className="yui-yoga-type-selector__card-description">{option.description}</p>
            
            <div className="yui-yoga-type-selector__benefits">
              {option.benefits.slice(0, 2).map((benefit, index) => (
                <div key={index} className="yui-yoga-type-selector__benefit">
                  {benefit}
                </div>
              ))}
            </div>

            <div className="yui-yoga-type-selector__personas">
              {option.personas.map((persona) => (
                <span key={persona} className="yui-yoga-type-selector__persona-tag">
                  {persona}
                </span>
              ))}
            </div>

            <button
              type="button"
              className="yui-yoga-type-selector__select-btn"
              onClick={(e) => {
                e.stopPropagation()
                onSelect(option.id)
              }}
            >
              {selectedId === option.id ? 'Selected' : 'Select'}
            </button>
          </div>
        ))}

        {filteredOptions.length === 0 && (
          <div className="yui-yoga-type-selector__empty">
            No yoga types match your current filter. Try selecting "All" or a different persona.
          </div>
        )}
      </div>
    </div>
  )
}