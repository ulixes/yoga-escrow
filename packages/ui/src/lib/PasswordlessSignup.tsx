import * as React from 'react'
import { Button } from './Button'

export type PasswordlessSignupStep =
  | 'enterEmail'
  | 'sendingCode'
  | 'enterCode'
  | 'verifyingCode'
  | 'success'
  | 'error'

export type PasswordlessSignupProps = {
  initialEmail?: string
  step?: PasswordlessSignupStep
  onRequestCode: (email: string) => Promise<void> | void
  onVerifyCode: (email: string, code: string) => Promise<void> | void
  onResendCode?: (email: string) => Promise<void> | void
  onSuccess?: (email: string) => void
  onError?: (message: string) => void
  title?: string
  description?: string
  autoFocus?: boolean
  codeLength?: number
  className?: string
  skin?: string
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  emailInputProps?: React.InputHTMLAttributes<HTMLInputElement>
  codeInputProps?: React.InputHTMLAttributes<HTMLInputElement>
  requestButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  verifyButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  resendButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  translations?: Partial<{
    enterEmailTitle: string
    enterEmailDescription: string
    emailPlaceholder: string
    requestCode: string
    sendingCode: string
    enterCodeTitle: string
    enterCodeDescription: string
    codePlaceholder: string
    verify: string
    verifying: string
    resendCode: string
    success: string
    error: string
  }>
}

export const PasswordlessSignup: React.FC<PasswordlessSignupProps> = ({
  initialEmail = '',
  step: controlledStep,
  onRequestCode,
  onVerifyCode,
  onResendCode,
  onSuccess,
  onError,
  title,
  description,
  autoFocus = true,
  codeLength = 6,
  className,
  skin,
  containerProps,
  emailInputProps,
  codeInputProps,
  requestButtonProps,
  verifyButtonProps,
  resendButtonProps,
  translations = {},
}) => {
  const [internalStep, setInternalStep] = React.useState<PasswordlessSignupStep>('enterEmail')
  const isControlled = controlledStep !== undefined
  const step = isControlled ? controlledStep! : internalStep

  const [email, setEmail] = React.useState(initialEmail)
  const [code, setCode] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  const t = {
    enterEmailTitle: 'Sign up or log in',
    enterEmailDescription: 'We will email you a one-time code.',
    emailPlaceholder: 'you@example.com',
    requestCode: 'Send code',
    sendingCode: 'Sending…',
    enterCodeTitle: 'Enter the code',
    enterCodeDescription: `Enter the ${codeLength}-digit code we sent to`,
    codePlaceholder: '123456',
    verify: 'Verify',
    verifying: 'Verifying…',
    resendCode: 'Resend code',
    success: 'You are logged in!',
    error: 'Something went wrong',
    ...translations,
  }

  const isEmailValid = (value: string) => /.+@.+\..+/.test(value)
  const canRequest = isEmailValid(email)
  const canVerify = code.length === codeLength

  React.useEffect(() => {
    if (error && onError) onError(error)
  }, [error, onError])

  const requestCode = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)
    try {
      if (!isControlled) setInternalStep('sendingCode')
      await onRequestCode(email)
      if (!isControlled) setInternalStep('enterCode')
    } catch (err: any) {
      setError(err?.message || t.error)
      if (!isControlled) setInternalStep('error')
    }
  }

  const verifyCode = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)
    try {
      if (!isControlled) setInternalStep('verifyingCode')
      await onVerifyCode(email, code)
      if (!isControlled) setInternalStep('success')
      onSuccess?.(email)
    } catch (err: any) {
      setError(err?.message || t.error)
      if (!isControlled) setInternalStep('error')
    }
  }

  const resend = async () => {
    setError(null)
    try {
      await onResendCode?.(email)
    } catch (err: any) {
      setError(err?.message || t.error)
    }
  }

  const codeBoxes = React.useMemo(() => Array.from({ length: codeLength }), [codeLength])
  const containerClass = ['yui-pwls', className].filter(Boolean).join(' ')
  const skinAttr = skin ? { 'data-skin': skin } : {}

  const renderEnterEmail = () => (
    <form className="yui-pwls__form" onSubmit={requestCode}>
      <div className="yui-pwls__section yui-pwls__section--email">
        <h2 className="yui-pwls__title">{title || t.enterEmailTitle}</h2>
        <p className="yui-pwls__description">{description || t.enterEmailDescription}</p>
        <input
          autoFocus={autoFocus}
          type="email"
          inputMode="email"
          name="email"
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="yui-pwls__input yui-pwls__input--email"
          {...emailInputProps}
        />
        <Button
          type="submit"
          disabled={!canRequest || step === 'sendingCode'}
          className="yui-btn yui-pwls__btn yui-pwls__btn--request"
          {...requestButtonProps}
        >
          {step === 'sendingCode' ? t.sendingCode : t.requestCode}
        </Button>
      </div>
    </form>
  )

  const renderEnterCode = () => (
    <form className="yui-pwls__form" onSubmit={verifyCode}>
      <div className="yui-pwls__section yui-pwls__section--code">
        <h2 className="yui-pwls__title">{t.enterCodeTitle}</h2>
        <p className="yui-pwls__description">
          {t.enterCodeDescription} <strong>{email}</strong>
        </p>

        {/* Single input approach for accessibility and IME friendliness */}
        <input
          autoFocus={autoFocus}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          name="code"
          placeholder={t.codePlaceholder}
          value={code}
          onChange={(e) => {
            const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, codeLength)
            setCode(digitsOnly)
          }}
          className="yui-pwls__input yui-pwls__input--code"
          {...codeInputProps}
        />

        {/* Visual helper boxes */}
        <div className="yui-pwls__code-boxes" style={{ gridTemplateColumns: `repeat(${codeLength}, minmax(0, 1fr))` }} aria-hidden>
          {codeBoxes.map((_, idx) => (
            <div className="yui-pwls__code-box" key={idx} data-filled={Boolean(code[idx])}>
              <span className="yui-pwls__code-digit">{code[idx] || ''}</span>
            </div>
          ))}
        </div>

        <div className="yui-pwls__actions">
          <Button
            type="submit"
            disabled={!canVerify || step === 'verifyingCode'}
            className="yui-btn yui-pwls__btn yui-pwls__btn--verify"
            {...verifyButtonProps}
          >
            {step === 'verifyingCode' ? t.verifying : t.verify}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={resend}
            className="yui-btn yui-pwls__btn yui-pwls__btn--resend"
            {...resendButtonProps}
          >
            {t.resendCode}
          </Button>
        </div>
      </div>
    </form>
  )

  const renderSuccess = () => (
    <div className="yui-pwls__section yui-pwls__section--success">
      <h2 className="yui-pwls__title">{t.success}</h2>
    </div>
  )

  const renderError = () => (
    <div className="yui-pwls__section yui-pwls__section--error">
      <h2 className="yui-pwls__title">{t.error}</h2>
      {error && <p className="yui-pwls__error">{error}</p>}
      <Button variant="secondary" onClick={() => setInternalStep('enterEmail')}>
        {t.requestCode}
      </Button>
    </div>
  )

  return (
    <div className={containerClass} {...skinAttr} {...containerProps}>
      {step === 'enterEmail' || step === 'sendingCode' ? renderEnterEmail() : null}
      {step === 'enterCode' || step === 'verifyingCode' ? renderEnterCode() : null}
      {step === 'success' ? renderSuccess() : null}
      {step === 'error' ? renderError() : null}
    </div>
  )
}
