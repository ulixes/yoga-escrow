import React from 'react'

export type Location = {
  country: string
  city: string
  specificLocation: string
}

export type LocationPickerProps = {
  country?: string
  city?: string
  options?: string[]
  value?: Location | null
  onChange?: (location: Location) => void
  onDone?: (location: Location) => void
  skin?: string
  className?: string
}

const DEFAULT_COUNTRY = 'Georgia'
const DEFAULT_CITY = 'Tbilisi'
const DEFAULT_OPTIONS = ['Vake Park', 'Lisi Lake', 'Turtle Lake']

export function LocationPicker(props: LocationPickerProps) {
  const {
    country = DEFAULT_COUNTRY,
    city = DEFAULT_CITY,
    options = DEFAULT_OPTIONS,
    value,
    onChange,
    onDone,
    skin = 'ulyxes',
    className,
  } = props

  const [selected, setSelected] = React.useState<string>(value?.specificLocation ?? '')
  React.useEffect(() => {
    if (value?.specificLocation !== undefined) {
      setSelected(value.specificLocation)
    }
  }, [value?.specificLocation])

  const handleSelect = (loc: string) => {
    setSelected(loc)
    const next: Location = { country, city, specificLocation: loc }
    onChange?.(next)
  }

  const handleDone = () => {
    if (!selected) return
    const next: Location = { country, city, specificLocation: selected }
    onDone?.(next)
  }

  const canDone = Boolean(selected)

  return (
    <div data-skin={skin} className={className}>
      <section className="yui-location-picker" aria-label="Location picker">
        <header className="yui-location-picker__header">
          <div className="yui-location-picker__title">Choose class location</div>
          <div className="yui-location-picker__meta">
            <span className="yui-location-picker__country">{country}</span>
            <span aria-hidden>·</span>
            <span className="yui-location-picker__city">{city}</span>
          </div>
        </header>

        <ul className="yui-location-picker__options" role="radiogroup" aria-label={`${country}, ${city} locations`}>
          {options.map((opt) => {
            const id = `loc-${opt.replace(/\s+/g, '-').toLowerCase()}`
            const checked = selected === opt
            return (
              <li key={opt} className="yui-location-picker__option">
                <label className="yui-location-picker__row" htmlFor={id}>
                  <input
                    id={id}
                    className="yui-location-picker__radio"
                    type="radio"
                    name="location"
                    checked={checked}
                    onChange={() => handleSelect(opt)}
                  />
                  <span className="yui-location-picker__label">{opt}</span>
                </label>
              </li>
            )
          })}
        </ul>

        <footer className="yui-location-picker__actions">
          <button
            type="button"
            className="yui-btn yui-location-picker__done"
            onClick={handleDone}
            disabled={!canDone}
          >
            Done
          </button>
        </footer>
      </section>
    </div>
  )
}
