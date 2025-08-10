import React from 'react'

export type PaymentSummary = {
  costUSDC: number
  currentBalanceUSDC: number
  estimatedGasFeeETH?: number  // Gas fee in ETH
  estimatedGasFeeUSD?: number  // Gas fee in USD equivalent
  totalCostWithGas?: number    // Total cost including gas
}

export type PaymentConfirmationProps = {
  summary: PaymentSummary
  onConfirm?: () => void
  onCancel?: () => void
  skin?: string
  className?: string
}

export function PaymentConfirmation({ summary, onConfirm, onCancel, skin = 'ulyxes', className }: PaymentConfirmationProps) {
  const { costUSDC, currentBalanceUSDC, estimatedGasFeeETH, estimatedGasFeeUSD, totalCostWithGas } = summary
  const remaining = Math.max(0, currentBalanceUSDC - (totalCostWithGas || costUSDC))
  const fmt = (n: number) => `$${n.toFixed(2)} USDC`
  return (
    <div data-skin={skin} className={['yui-payment', className].filter(Boolean).join(' ')}>
      <div className="yui-payment__row">
        <div className="yui-payment__label">Class cost</div>
        <div className="yui-payment__value">{fmt(costUSDC)}</div>
      </div>
      {estimatedGasFeeETH && (
        <div className="yui-payment__row">
          <div className="yui-payment__label">Estimated gas fee</div>
          <div className="yui-payment__value">{estimatedGasFeeETH.toFixed(6)} ETH (~${estimatedGasFeeUSD?.toFixed(2)})</div>
        </div>
      )}
      {totalCostWithGas && (
        <div className="yui-payment__row yui-payment__row--total">
          <div className="yui-payment__label">Total cost (class + gas)</div>
          <div className="yui-payment__value">{fmt(totalCostWithGas)}</div>
        </div>
      )}
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
