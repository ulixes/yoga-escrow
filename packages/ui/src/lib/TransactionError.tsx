import React from 'react'

export type TransactionErrorProps = {
  error: string
  onRetry?: () => void
  onCancel?: () => void
  skin?: string
  className?: string
}

export function TransactionError({ error, onRetry, onCancel, skin = 'ulyxes', className }: TransactionErrorProps) {
  return (
    <div data-skin={skin} className={['yui-tx-error', className].filter(Boolean).join(' ')} role="alert">
      <div className="yui-tx-error__title">Transaction Failed</div>
      <div className="yui-tx-error__message">{error}</div>
      <div className="yui-tx-error__actions">
        {onRetry && <button type="button" className="yui-btn" onClick={onRetry}>Retry</button>}
        {onCancel && <button type="button" className="yui-btn" onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  )
}
