import React from 'react'

export type InsufficientFundsProps = {
  neededUSDC: number
  onAddFunds?: () => void
  onCancel?: () => void
  skin?: string
  className?: string
}

export function InsufficientFunds({ neededUSDC, onAddFunds, onCancel, skin = 'ulyxes', className }: InsufficientFundsProps) {
  // Format as currency value only; append unit once in the sentence
  const fmt = (n: number) => `$${n.toFixed(2)}`
  return (
    <div data-skin={skin} className={['yui-insufficient', className].filter(Boolean).join(' ')}>
      <div className="yui-insufficient__message">Need {fmt(neededUSDC)} more</div>
      <div className="yui-insufficient__actions">
        {onAddFunds && <button type="button" className="yui-btn" onClick={onAddFunds}>Add funds</button>}
        {onCancel && <button type="button" className="yui-btn" onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  )
}
