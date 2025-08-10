import React from 'react'

export type PaymentSummary = {
  costUSDC: number
  currentBalanceUSDC: number
}

export type PaymentConfirmationProps = {
  summary: PaymentSummary
  onConfirm?: () => void
  onCancel?: () => void
  skin?: string
  className?: string
}

export function PaymentConfirmation({ summary, onConfirm, onCancel, skin = 'ulyxes', className }: PaymentConfirmationProps) {
  const { costUSDC, currentBalanceUSDC } = summary
  const remaining = Math.max(0, currentBalanceUSDC - costUSDC)
  const fmt = (n: number) => `$${n.toFixed(2)} USDC`
  return (
    <div data-skin={skin} className={['yui-payment', className].filter(Boolean).join(' ')}>
      <div className="yui-payment__row">
        <div className="yui-payment__label">Class cost</div>
        <div className="yui-payment__value">{fmt(costUSDC)}</div>
      </div>
      <div className="yui-payment__row">
        <div className="yui-payment__label">Current balance</div>
        <div className="yui-payment__value">{fmt(currentBalanceUSDC)}</div>
      </div>
      <div className="yui-payment__row">
        <div className="yui-payment__label">Remaining after payment</div>
        <div className="yui-payment__value">{fmt(remaining)}</div>
      </div>
      <div className="yui-payment__actions">
        {onCancel && <button type="button" className="yui-btn" onClick={onCancel}>Cancel</button>}
        {onConfirm && <button type="button" className="yui-btn" onClick={onConfirm}>Confirm payment</button>}
      </div>
    </div>
  )
}
