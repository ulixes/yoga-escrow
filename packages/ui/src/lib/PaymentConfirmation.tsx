import React from 'react'

export type SessionType = '1on1' | 'group'

export type PaymentSummary = {
  currentBalanceUSDC: number
  estimatedGasFeeETH?: number  // Gas fee in ETH
  estimatedGasFeeUSD?: number  // Gas fee in USD equivalent
  defaultSessionType?: SessionType
  defaultOfferAmount?: number
}

export type PaymentConfirmationProps = {
  summary: PaymentSummary
  onConfirm?: () => void
  onCancel?: () => void
  skin?: string
  className?: string
}

export function PaymentConfirmation({ summary, onConfirm, onCancel, skin = 'ulyxes', className }: PaymentConfirmationProps) {
  const { currentBalanceUSDC, estimatedGasFeeETH, estimatedGasFeeUSD, defaultOfferAmount } = summary
  
  const offerAmount = defaultOfferAmount || 0
  const totalCostWithGas = offerAmount + (estimatedGasFeeUSD || 0)
  const remaining = Math.max(0, currentBalanceUSDC - totalCostWithGas)
  const fmt = (n: number) => `$${n.toFixed(2)}`
  
  return (
    <div data-skin={skin} className={['yui-payment', className].filter(Boolean).join(' ')}>
      <div className="yui-payment__row">
        <div className="yui-payment__label">Your Offer</div>
        <div className="yui-payment__value">{fmt(offerAmount)}</div>
      </div>
      {estimatedGasFeeETH && (
        <div className="yui-payment__row">
          <div className="yui-payment__label">Estimated gas fee</div>
          <div className="yui-payment__value">{estimatedGasFeeETH.toFixed(6)} ETH (~{fmt(estimatedGasFeeUSD || 0)})</div>
        </div>
      )}
      <div className="yui-payment__row yui-payment__row--total">
        <div className="yui-payment__label">Total cost (offer + gas)</div>
        <div className="yui-payment__value">{fmt(totalCostWithGas)}</div>
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
