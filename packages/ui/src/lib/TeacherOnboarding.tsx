import React, { useState } from 'react'

export interface TeacherOnboardingProps {
  onComplete?: (igHandle: string) => void
  onSkip?: () => void
  isLoading?: boolean
  error?: string
  className?: string
}

export const TeacherOnboarding: React.FC<TeacherOnboardingProps> = ({
  onComplete,
  onSkip,
  isLoading = false,
  error,
  className
}) => {
  const [igHandle, setIgHandle] = useState('')
  const [inputError, setInputError] = useState('')

  const validateHandle = (handle: string): boolean => {
    // Remove @ if user typed it
    const cleanHandle = handle.replace('@', '')
    
    if (!cleanHandle.trim()) {
      setInputError('Instagram handle is required')
      return false
    }
    
    if (cleanHandle.length < 1) {
      setInputError('Handle too short')
      return false
    }
    
    if (cleanHandle.length > 30) {
      setInputError('Handle too long (max 30 characters)')
      return false
    }
    
    // Basic IG handle validation
    if (!/^[a-zA-Z0-9._]+$/.test(cleanHandle)) {
      setInputError('Only letters, numbers, dots and underscores allowed')
      return false
    }
    
    setInputError('')
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const cleanHandle = igHandle.replace('@', '')
    
    if (validateHandle(cleanHandle)) {
      onComplete?.(`@${cleanHandle}`)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setIgHandle(value)
    
    // Clear errors when user starts typing
    if (inputError) {
      setInputError('')
    }
  }

  const classes = ['teacher-onboarding', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <div className="teacher-onboarding__content">
        <div className="teacher-onboarding__header">
          <h1 className="teacher-onboarding__title">Set your handle</h1>
        </div>

        <form onSubmit={handleSubmit} className="teacher-onboarding__form">
          <div className="teacher-onboarding__input-wrapper">
            <span className="teacher-onboarding__input-prefix">@</span>
            <input
              id="ig-handle"
              type="text"
              value={igHandle.replace('@', '')}
              onChange={handleInputChange}
              placeholder="handle"
              className={`teacher-onboarding__input ${
                (inputError || error) ? 'teacher-onboarding__input--error' : ''
              }`}
              disabled={isLoading}
              autoFocus
            />
          </div>
          {(inputError || error) && (
            <p className="teacher-onboarding__error">{inputError || error}</p>
          )}

          <button
            type="submit"
            className="teacher-onboarding__submit"
            disabled={isLoading || !igHandle.trim()}
          >
            {isLoading ? 'Setting up...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}