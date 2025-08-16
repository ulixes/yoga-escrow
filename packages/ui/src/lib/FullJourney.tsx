import React from 'react'
import { YogaTypePicker, YogaTypeItem } from './YogaTypePicker'
import { LocationPicker, LocationPickerProps } from './LocationPicker'
import { YogaTimeBlocksPicker, YogaDay, Persona } from './YogaTimeBlocksPicker'
import { TeacherDiscovery, TeacherDiscoveryProps } from './TeacherDiscovery'
import { PaymentConfirmation, PaymentSummary } from './PaymentConfirmation'

export type JourneyPersona = 'Dancer' | 'Runner' | 'Traveler'
export type JourneyGoal = 'Flexibility' | 'Recovery' | 'Strength' | 'Calm' | 'None'

export type FullJourneyResult = {
  selectedTeacherIds: string[]
  persona: JourneyPersona
  goal: JourneyGoal | 'None'
  yogaTypeId: string
  location: { country: string; city: string; specificLocation: string }
  timeIds: string[] // dayId:HH:mm
  student: { email: string; wallet?: string }
}

export type FullJourneyProps = {
  yogaTypes: YogaTypeItem[]
  yogaTypePersonas: string[]
  days: YogaDay[]
  teachers: TeacherDiscoveryProps['teachers']
  defaultPersona?: JourneyPersona
  defaultStudentEmail?: string
  skin?: string
  className?: string
  onSubmit?: (result: FullJourneyResult) => void
  onPayment?: (paymentData: any) => void
  locationProps?: Pick<LocationPickerProps, 'country' | 'city' | 'options'>
  startSecondaryLabel?: string
  onStartSecondary?: () => void
  paymentSummary?: PaymentSummary
  // Authentication props
  isAuthenticated?: boolean
  userEmail?: string
  userWallet?: string
  LoginComponent?: React.ComponentType<any>
  onAuthRequired?: () => void
}

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export function FullJourney(props: FullJourneyProps) {
  const {
    yogaTypes,
    yogaTypePersonas,
    days,
    teachers = [],
    defaultPersona = 'Traveler',
    defaultStudentEmail,
    skin = 'ulyxes',
    className,
    onSubmit,
    onPayment,
    locationProps,
    startSecondaryLabel = 'View your bookings',
    onStartSecondary,
    paymentSummary,
    isAuthenticated = false,
    userEmail = '',
    userWallet = '',
    LoginComponent,
    onAuthRequired,
  } = props

  const [step, setStep] = React.useState<Step>(1)
  const [started, setStarted] = React.useState<boolean>(true)

  // Step 1 - Teacher Discovery
  const [selectedTeacherIds, setSelectedTeacherIds] = React.useState<string[]>([])

  // Step 2 - Teacher Selection (confirmation)
  // Already handled in selectedTeacherIds

  // Step 3 - Persona + Goal
  const [persona, setPersona] = React.useState<JourneyPersona>(defaultPersona)
  const [goal, setGoal] = React.useState<JourneyGoal>('None')

  // Step 4 - Yoga Type
  const [selectedYogaTypeId, setSelectedYogaTypeId] = React.useState<string>('')

  // Step 5 - Location
  const [location, setLocation] = React.useState<{ country: string; city: string; specificLocation: string } | null>(
    null,
  )

  // Step 6 - Time Slots
  const [selectedTimes, setSelectedTimes] = React.useState<string[]>([])

  // Login/Auth data (handled via props)
  const [studentEmail, setStudentEmail] = React.useState<string>(defaultStudentEmail || userEmail || '')
  const [wallet, setWallet] = React.useState<string>(userWallet || '')
  
  // Auto-populate from authenticated user
  React.useEffect(() => {
    if (isAuthenticated) {
      setStudentEmail(userEmail || defaultStudentEmail || '')
      setWallet(userWallet || '')
    }
  }, [isAuthenticated, userEmail, userWallet, defaultStudentEmail])

  // Step 7 - Pricing
  const [sessionType, setSessionType] = React.useState<'1on1' | 'group'>('1on1')
  const [customAmount, setCustomAmount] = React.useState<number>(50)
  
  // Step 8 - Success
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

  const totalSteps: Step = 8

  const canNext = React.useMemo(() => {
    switch (step) {
      case 1:
        return selectedTeacherIds.length > 0
      case 2:
        return selectedTeacherIds.length > 0
      case 3:
        return Boolean(persona)
      case 4:
        return Boolean(selectedYogaTypeId)
      case 5:
        return Boolean(location)
      case 6:
        return selectedTimes.length >= 3
      case 7:
        return customAmount > 0 // Pricing step - must have valid amount
      default:
        return true
    }
  }, [step, selectedTeacherIds, persona, selectedYogaTypeId, location, selectedTimes, studentEmail, wallet, isAuthenticated, customAmount, sessionType])

  const handleNext = () => {
    if (step === totalSteps) return
    
    // Skip step 2 (teacher confirmation) - go directly from 1 to 3
    if (step === 1) {
      setStep(3)
      return
    }
    
    // Handle authentication requirement before pricing if not authenticated
    if (step === 6 && !isAuthenticated && onAuthRequired) {
      onAuthRequired()
      return
    }
    
    // Step 7 is now just pricing selection - no payment logic here
    setStep((s) => ((s + 1) as Step))
  }

  const handleBack = () => {
    if (step === 1) return
    // Skip step 2 when going backwards - if on step 3, go to step 1
    if (step === 3) {
      setStep(1)
      return
    }
    setStep((s) => ((s - 1) as Step))
  }

  const handleTeacherSelection = (selectedIds: string[]) => {
    setSelectedTeacherIds(selectedIds)
    setStep(3) // Skip step 2, go directly to step 3
  }

  const handleWalletConnect = (walletAddress: string) => {
    setWallet(walletAddress)
  }

  const personaToInternal: Record<JourneyPersona, Persona> = {
    Dancer: 'dancer',
    Runner: 'runner',
    Traveler: 'traveler',
  }

  // Helper function to calculate future date from day/time selection
  const calculateFutureDate = (dayTime: string): string => {
    const [dayStr, timeStr] = dayTime.split(':')
    const dayMap: Record<string, number> = {
      'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6, 'sun': 0
    }
    
    const targetDay = dayMap[dayStr.toLowerCase()]
    const today = new Date()
    const currentDay = today.getDay()
    const [hours, minutes = '00'] = timeStr.split(':')
    const hour = parseInt(hours)
    const minute = parseInt(minutes)
    
    // Calculate days until target
    let daysUntil = targetDay - currentDay
    
    // If the target day is today, check if the time has passed
    if (daysUntil === 0) {
      const targetTime = new Date(today)
      targetTime.setHours(hour, minute, 0, 0)
      if (targetTime <= today) {
        daysUntil = 7 // Next week
      }
    } else if (daysUntil < 0) {
      daysUntil += 7 // Next week
    }
    
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + daysUntil)
    
    // Format time with AM/PM
    const formatTime = () => {
      const period = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      const displayMinute = minute.toString().padStart(2, '0')
      return `${displayHour}:${displayMinute} ${period}`
    }
    
    // Format as readable date
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }
    return `${targetDate.toLocaleDateString('en-US', options)} at ${formatTime()}`
  }

  // Get selected yoga type name
  const getYogaTypeName = () => {
    const yogaType = yogaTypes.find(yt => yt.id === selectedYogaTypeId)
    return yogaType?.name || 'Not selected'
  }

  // Get selected teacher names
  const getTeacherNames = () => {
    return teachers
      .filter(t => selectedTeacherIds.includes(t.id))
      .map(t => t.name)
      .join(', ') || 'No teachers selected'
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
          <section className="yui-journey__step yui-journey__discovery" aria-label="Discover Teachers">
            <TeacherDiscovery
              teachers={teachers}
              maxSelection={3}
              onSubmitSelection={handleTeacherSelection}
            />
          </section>
        )}

        {/* Step 2 removed - we skip directly from teacher selection to persona */}

        {step === 3 && (
          <section className="yui-journey__step yui-journey__welcome" aria-label="Persona & Goal">
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

        {step === 4 && (
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

        {step === 5 && (
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

        {step === 6 && (
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

        {step === 7 && (
          <section className="yui-journey__step" aria-label="Pricing">
            <div className="yui-journey__pricing">
              <div className="yui-journey__hero">
                <h2 className="yui-journey__title">Choose Your Session</h2>
                <p className="yui-journey__subtitle">Select session type and set your offer amount</p>
              </div>
              
              <div className="yui-journey__pricing-options">
                <div 
                  className={`yui-journey__pricing-card ${sessionType === 'group' ? 'selected' : ''}`}
                  onClick={() => {
                    setSessionType('group')
                    setCustomAmount(10)
                  }}
                >
                  <div className="yui-journey__pricing-header">
                    <h3>Group Session</h3>
                    <div className="yui-journey__price">$10</div>
                  </div>
                  <p className="yui-journey__pricing-desc">Join a shared yoga class with other students</p>
                  <div className="yui-journey__pricing-features">
                    <span>• Shared experience</span>
                    <span>• Lower cost</span>
                    <span>• Community vibe</span>
                  </div>
                </div>
                
                <div 
                  className={`yui-journey__pricing-card ${sessionType === '1on1' ? 'selected' : ''}`}
                  onClick={() => {
                    setSessionType('1on1')
                    setCustomAmount(50)
                  }}
                >
                  <div className="yui-journey__pricing-header">
                    <h3>Private 1:1</h3>
                    <div className="yui-journey__price">$50</div>
                  </div>
                  <p className="yui-journey__pricing-desc">Personalized session focused entirely on you</p>
                  <div className="yui-journey__pricing-features">
                    <span>• Full attention</span>
                    <span>• Customized practice</span>
                    <span>• Personal guidance</span>
                  </div>
                </div>
              </div>
              
              <div className="yui-journey__amount-section">
                <label className="yui-journey__amount-label">
                  Your offer amount (USD)
                </label>
                <div className="yui-journey__amount-input">
                  <span className="yui-journey__currency">$</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(parseFloat(e.target.value) || 0)}
                    className="yui-journey__amount-field"
                    min="1"
                    step="0.01"
                  />
                </div>
                <p className="yui-journey__amount-note">
                  Teachers may decline offers significantly below recommended amounts
                </p>
              </div>
            </div>
          </section>
        )}

        {step === 8 && (
          <section className="yui-journey__step" aria-label="Payment Review">
            <div className="yui-journey__final-review">
              <div className="yui-journey__hero">
                <h2 className="yui-journey__title">Review & Confirm</h2>
                <p className="yui-journey__subtitle">Please review your booking details before payment</p>
              </div>
              
              {/* Matching Section - Teachers × Times */}
              <div className="yui-journey__matching-section">
                <div className="yui-journey__matching-header">
                  <h3 className="yui-journey__matching-title">Your Booking Request</h3>
                  <p className="yui-journey__matching-subtitle">First match wins!</p>
                </div>
                
                <div className="yui-journey__matching-grid">
                  <div className="yui-journey__matching-teachers">
                    <div className="yui-journey__matching-count">{selectedTeacherIds.length}</div>
                    <div className="yui-journey__matching-label">Teacher{selectedTeacherIds.length > 1 ? 's' : ''}</div>
                    <div className="yui-journey__matching-names">
                      {teachers
                        .filter(t => selectedTeacherIds.includes(t.id))
                        .map(t => (
                          <div key={t.id} className="yui-journey__teacher-chip">{t.name}</div>
                        ))}
                    </div>
                  </div>
                  
                  <div className="yui-journey__matching-connector">
                    <span className="yui-journey__matching-times-icon">×</span>
                  </div>
                  
                  <div className="yui-journey__matching-times">
                    <div className="yui-journey__matching-count">{selectedTimes.length}</div>
                    <div className="yui-journey__matching-label">Time Slot{selectedTimes.length > 1 ? 's' : ''}</div>
                    <div className="yui-journey__matching-slots">
                      {selectedTimes.map((time, idx) => {
                        const [dayStr, timeStr] = time.split(':')
                        const [hours] = timeStr.split(':')
                        const hour = parseInt(hours)
                        const period = hour >= 12 ? 'PM' : 'AM'
                        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
                        return (
                          <div key={idx} className="yui-journey__time-chip">
                            {dayStr.toUpperCase()} {displayHour}{period}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Session Details */}
              <div className="yui-journey__details-section">
                <div className="yui-journey__detail-grid">
                  <div className="yui-journey__detail-item">
                    <span className="yui-journey__detail-label">Style</span>
                    <span className="yui-journey__detail-value">{getYogaTypeName()}</span>
                  </div>
                  <div className="yui-journey__detail-item">
                    <span className="yui-journey__detail-label">Location</span>
                    <span className="yui-journey__detail-value">
                      {location ? `${location.specificLocation}, ${location.city}` : 'Not selected'}
                    </span>
                  </div>
                  <div className="yui-journey__detail-item">
                    <span className="yui-journey__detail-label">Session</span>
                    <span className="yui-journey__detail-value">
                      {sessionType === '1on1' ? 'Private 1:1' : 'Group Class'}
                    </span>
                  </div>
                  {goal !== 'None' && (
                    <div className="yui-journey__detail-item">
                      <span className="yui-journey__detail-label">Goal</span>
                      <span className="yui-journey__detail-value">{goal}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {paymentSummary && (
                <div className="yui-journey__payment-section">
                  <h3 className="yui-journey__review-title">Payment Summary</h3>
                  <PaymentConfirmation
                    summary={{
                      ...paymentSummary,
                      defaultSessionType: sessionType,
                      defaultOfferAmount: customAmount
                    }}
                    onConfirm={() => {
                      const result = {
                        selectedTeacherIds,
                        persona,
                        goal,
                        yogaTypeId: selectedYogaTypeId,
                        location: location!,
                        timeIds: selectedTimes,
                        student: { email: studentEmail.trim(), wallet },
                      }
                      onPayment?.(result)
                      onSubmit?.(result)
                    }}
                    onCancel={() => setStep(7)}
                    skin={skin}
                  />
                </div>
              )}
            </div>
          </section>
        )}
          </main>

          <footer className="yui-journey__footer">
            <button type="button" className="yui-btn yui-journey__back" onClick={handleBack} disabled={step === 1}>Back</button>
            <button type="button" className="yui-btn yui-journey__next" onClick={handleNext} disabled={!canNext}>
              {step === 7 ? 'Review Payment' : step === 8 ? 'Complete Payment' : 'Next'}
            </button>
          </footer>
        </>
      )}
    </div>
  )
}