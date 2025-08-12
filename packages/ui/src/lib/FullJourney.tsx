import React from 'react'
import { YogaTypePicker, YogaTypeItem } from './YogaTypePicker'
import { LocationPicker, LocationPickerProps } from './LocationPicker'
import { YogaTimeBlocksPicker, YogaDay, Persona } from './YogaTimeBlocksPicker'

export type JourneyPersona = 'Dancer' | 'Runner' | 'Traveler'
export type JourneyGoal = 'Flexibility' | 'Recovery' | 'Strength' | 'Calm' | 'None'

export type FullJourneyResult = {
  persona: JourneyPersona
  goal: JourneyGoal | 'None'
  yogaTypeId: string
  location: { country: string; city: string; specificLocation: string }
  timeIds: string[] // dayId:HH:mm
  student: { email: string }
}

export type FullJourneyProps = {
  yogaTypes: YogaTypeItem[]
  yogaTypePersonas: string[]
  days: YogaDay[]
  defaultPersona?: JourneyPersona
  defaultStudentEmail?: string
  skin?: string
  className?: string
  onSubmit?: (result: FullJourneyResult) => void
  locationProps?: Pick<LocationPickerProps, 'country' | 'city' | 'options'>
  startSecondaryLabel?: string
  onStartSecondary?: () => void
}

type Step = 1 | 2 | 3 | 4 | 5 | 6

export function FullJourney(props: FullJourneyProps) {
  const {
    yogaTypes,
    yogaTypePersonas,
    days,
    defaultPersona = 'Traveler',
    defaultStudentEmail,
    skin = 'ulyxes',
    className,
    onSubmit,
    locationProps,
    startSecondaryLabel = 'View your bookings',
    onStartSecondary,
  } = props

  const [step, setStep] = React.useState<Step>(1)
  const [started, setStarted] = React.useState<boolean>(false)

  // Step 1
  const [persona, setPersona] = React.useState<JourneyPersona>(defaultPersona)
  const [goal, setGoal] = React.useState<JourneyGoal>('None')

  // Step 2
  const [selectedYogaTypeId, setSelectedYogaTypeId] = React.useState<string>('')

  // Step 3
  const [location, setLocation] = React.useState<{ country: string; city: string; specificLocation: string } | null>(
    null,
  )

  // Step 4
  const [selectedTimes, setSelectedTimes] = React.useState<string[]>([])

  // Step 5 - details
  const [studentEmail, setStudentEmail] = React.useState<string>(defaultStudentEmail || '')
  React.useEffect(() => {
    console.log('[JOURNEY DEBUG] FullJourney received defaultStudentEmail:', defaultStudentEmail)
    console.log('[JOURNEY DEBUG] Current studentEmail state:', studentEmail)
    // Prefill when provided; do not overwrite if user already typed something different
    if (defaultStudentEmail && (studentEmail === '' || studentEmail === undefined)) {
      console.log('[JOURNEY DEBUG] Setting email to:', defaultStudentEmail)
      setStudentEmail(defaultStudentEmail)
    } else {
      console.log('[JOURNEY DEBUG] Not setting email - defaultStudentEmail:', defaultStudentEmail, 'studentEmail:', studentEmail)
    }
  }, [defaultStudentEmail])

  const totalSteps: Step = 6

  const canNext = React.useMemo(() => {
    switch (step) {
      case 1:
        return Boolean(persona)
      case 2:
        return Boolean(selectedYogaTypeId)
      case 3:
        return Boolean(location)
      case 4:
        return selectedTimes.length >= 3
      case 5:
        return /@/.test(studentEmail)
      default:
        return true
    }
  }, [step, persona, selectedYogaTypeId, location, selectedTimes, studentEmail])

  const handleNext = () => {
    if (step === totalSteps) return
    if (step === 5) {
      // Submit before moving to confirmation
      const result: FullJourneyResult = {
        persona,
        goal,
        yogaTypeId: selectedYogaTypeId,
        location: location!,
        timeIds: selectedTimes,
        student: { email: studentEmail.trim() },
      }
      onSubmit?.(result)
    }
    setStep((s) => ((s + 1) as Step))
  }

  const handleBack = () => {
    if (step === 1) return
    setStep((s) => ((s - 1) as Step))
  }

  const personaToInternal: Record<JourneyPersona, Persona> = {
    Dancer: 'dancer',
    Runner: 'runner',
    Traveler: 'traveler',
  }

  // Sync YogaTypePicker's persona filter with journey persona, but allow user to change it in step 2
  const [ytFilterPersona, setYtFilterPersona] = React.useState<string | null>(personaToInternal[persona])
  React.useEffect(() => {
    setYtFilterPersona(personaToInternal[persona])
  }, [persona])

  return (
    <div data-skin={skin} className={['yui-journey', className].filter(Boolean).join(' ')}>
      {!started ? (
        <main className="yui-journey__start" aria-label="Start booking">
          <h1 className="yui-journey__start-title">Book a yoga class</h1>
          <p className="yui-journey__start-subtitle">Find your class — anywhere, anytime.</p>
          <div className="yui-journey__start-actions">
            <button type="button" className="yui-btn yui-journey__cta" onClick={() => setStarted(true)}>
              Start a new booking
            </button>
          </div>
        </main>
      ) : (
        <>
          <header className="yui-journey__header">
            <div className="yui-journey__progress">
              <div className="yui-journey__progress-text">Step {step}/{totalSteps}</div>
              <div className="yui-journey__progress-bar"><span style={{ width: `${(step / totalSteps) * 100}%` }} /></div>
            </div>
          </header>

          <main className="yui-journey__content">
        {step === 1 && (
          <section className="yui-journey__step yui-journey__welcome" aria-label="Welcome">
            <div className="yui-journey__hero">
              <h2 className="yui-journey__title">Start Your Journey</h2>
              <p className="yui-journey__subtitle">Pick a persona and an optional goal</p>
            </div>
            <div className="yui-journey__cards">
              {(['Dancer', 'Runner', 'Traveler'] as JourneyPersona[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  className="yui-btn yui-journey__persona"
                  data-active={persona === p}
                  onClick={() => setPersona(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="yui-journey__goals">
              {(['None', 'Flexibility', 'Recovery', 'Strength', 'Calm'] as JourneyGoal[]).map((g) => (
                <button key={g} type="button" className="yui-journey__goal" data-active={goal === g} onClick={() => setGoal(g)}>
                  {g}
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="yui-journey__step" aria-label="Choose Yoga Type">
            <YogaTypePicker
              items={yogaTypes}
              personas={yogaTypePersonas}
              filterPersona={ytFilterPersona}
              onFilterPersona={(p) => setYtFilterPersona(p)}
              selectedIds={selectedYogaTypeId ? [selectedYogaTypeId] : []}
              selectionMode="single"
              onSelect={(id) => setSelectedYogaTypeId(id)}
              onDeselect={(id) => setSelectedYogaTypeId('')}
              skin={skin}
            />
          </section>
        )}

        {step === 3 && (
          <section className="yui-journey__step" aria-label="Choose Location">
            <LocationPicker
              {...locationProps}
              value={location}
              onChange={(loc) => setLocation(loc)}
              onDone={(loc) => setLocation(loc)}
              skin={skin}
              hideDoneButton={true}
            />
          </section>
        )}

        {step === 4 && (
          <section className="yui-journey__step" aria-label="Choose Times">
            <YogaTimeBlocksPicker
              days={days}
              selectedIds={selectedTimes}
              onChange={setSelectedTimes}
              minSelections={3}
              onDone={setSelectedTimes}
              persona={personaToInternal[persona]}
              skin={skin}
              hideDoneButton={true}
            />
          </section>
        )}

        {step === 5 && (
          <section className="yui-journey__step" aria-label="Review & Details">
            {console.log('[JOURNEY DEBUG] Rendering step 5 with studentEmail:', studentEmail)}
            <div className="yui-journey__review">
              <h3>Review your choices</h3>
              <ul className="yui-journey__summary">
                <li><strong>Persona:</strong> {persona}</li>
                <li><strong>Goal:</strong> {goal}</li>
                <li><strong>Yoga:</strong> {selectedYogaTypeId || '—'}</li>
                <li><strong>Location:</strong> {location ? `${location.country}, ${location.city} — ${location.specificLocation}` : '—'}</li>
                <li><strong>Times:</strong> {selectedTimes.length ? selectedTimes.join(', ') : '—'}</li>
              </ul>
            </div>
            <div className="yui-journey__details">
              <label className="yui-journey__field">
                <span>Email</span>
                <input 
                  className="yui-journey__input" 
                  type="email" 
                  value={studentEmail} 
                  onChange={(e) => {
                    console.log('[JOURNEY DEBUG] Email input changed to:', e.target.value)
                    setStudentEmail(e.target.value)
                  }} 
                />
              </label>
            </div>
          </section>
        )}

        {step === 6 && (
          <section className="yui-journey__step yui-journey__confirm" aria-label="Confirmation">
            <h2 className="yui-journey__title">You're all set</h2>
            <p className="yui-journey__subtitle">We’ll match your preferences and reach out shortly.</p>
          </section>
        )}
          </main>

          <footer className="yui-journey__footer">
            <button type="button" className="yui-btn yui-journey__back" onClick={handleBack} disabled={step === 1}>Back</button>
            <button type="button" className="yui-btn yui-journey__next" onClick={handleNext} disabled={!canNext}>
              {step === 5 ? 'Confirm' : step === 6 ? 'Done' : 'Next'}
            </button>
          </footer>
        </>
      )}
    </div>
  )
}
