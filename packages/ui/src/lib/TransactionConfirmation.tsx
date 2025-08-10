import React from 'react'

export type TransactionConfirmationProps = {
  transactionHash: string
  escrowId?: string
  onViewTransaction?: () => void
  onBackToHome?: () => void
  skin?: string
  className?: string
}

export function TransactionConfirmation(props: TransactionConfirmationProps) {
  const { transactionHash, escrowId, onViewTransaction, onBackToHome, skin = 'ulyxes', className } = props

  const short = (hash: string) => (hash.length > 12 ? `${hash.slice(0, 10)}…${hash.slice(-6)}` : hash)
  const baseScanUrl = `https://basescan.org/tx/${transactionHash}`

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(transactionHash)
    } catch {}
  }

  return (
    <div data-skin={skin} className={['yui-tx-confirm', className].filter(Boolean).join(' ')}>
      <h2 className="yui-tx-confirm__title">Booking Confirmed!</h2>
      <p className="yui-tx-confirm__subtitle">Your yoga class has been booked successfully.</p>

      <div className="yui-tx-confirm__row">
        <div className="yui-tx-confirm__label">Transaction</div>
        <div className="yui-tx-confirm__hash">
          <code>{short(transactionHash)}</code>
          <button type="button" className="yui-btn yui-copy" onClick={copy} aria-label="Copy transaction hash">Copy</button>
        </div>
      </div>

      {escrowId && (
        <div className="yui-tx-confirm__row">
          <div className="yui-tx-confirm__label">Escrow ID</div>
          <div className="yui-tx-confirm__value">{escrowId}</div>
        </div>
      )}

      <div className="yui-tx-confirm__actions">
        <a className="yui-btn" href={baseScanUrl} target="_blank" rel="noreferrer" onClick={onViewTransaction}>View on BaseScan</a>
        <button type="button" className="yui-btn" onClick={onBackToHome}>Book Another Class</button>
      </div>
    </div>
  )
}
