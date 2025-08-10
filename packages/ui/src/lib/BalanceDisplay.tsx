import React from 'react'

export type BalanceDisplayProps = {
  balanceUSDC: number
  minimumUSDC?: number
  skin?: string
  className?: string
}

export function BalanceDisplay({ balanceUSDC, minimumUSDC = 10, skin = 'ulyxes', className }: BalanceDisplayProps) {
  const sufficient = balanceUSDC >= minimumUSDC
  const fmt = (n: number) => `$${n.toFixed(2)}`
  return (
    <div data-skin={skin} className={['yui-balance', className].filter(Boolean).join(' ')}>
      <div className="yui-balance__row" data-ok={sufficient || undefined} data-error={!sufficient || undefined}>
        <div className="yui-balance__label">Current balance</div>
        <div className="yui-balance__value">{fmt(balanceUSDC)}</div>
      </div>
      <div className="yui-balance__row">
        <div className="yui-balance__label">Required</div>
        <div className="yui-balance__value">{fmt(minimumUSDC)}</div>
      </div>
      <div className="yui-balance__status" aria-live="polite">
        {sufficient ? 'Balance sufficient' : 'Insufficient balance'}
      </div>
    </div>
  )
}
