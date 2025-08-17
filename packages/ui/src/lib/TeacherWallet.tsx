import React, { useState } from 'react'

export interface WalletInfo {
  address: string
  ethBalance: string
  isConnected: boolean
}

export interface TeacherWalletProps {
  wallet?: WalletInfo
  fiatCurrency?: string
  ethToFiatRate?: number
  formatFiat?: (fiatAmount: number, currency: string) => string
  onCopyAddress?: (address: string) => void
  onViewFullWallet?: () => void
  className?: string
  skin?: string
}

function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function copyToClipboard(text: string): void {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

export const TeacherWallet: React.FC<TeacherWalletProps> = ({
  wallet,
  fiatCurrency = 'USD',
  ethToFiatRate,
  formatFiat,
  onCopyAddress,
  onViewFullWallet,
  className,
  skin
}) => {
  const [copyFeedback, setCopyFeedback] = useState(false)
  
  const classes = ['teacher-wallet', className].filter(Boolean).join(' ')
  const skinAttr = skin ? { 'data-skin': skin } : {}

  const formatFiatAmount = (ethAmount: number) => {
    if (!ethToFiatRate) return null
    const fiatAmount = ethAmount * ethToFiatRate
    return formatFiat 
      ? formatFiat(fiatAmount, fiatCurrency)
      : new Intl.NumberFormat(undefined, { style: 'currency', currency: fiatCurrency }).format(fiatAmount)
  }

  const handleCopyAddress = () => {
    if (!wallet?.address) return
    
    copyToClipboard(wallet.address)
    onCopyAddress?.(wallet.address)
    
    setCopyFeedback(true)
    setTimeout(() => setCopyFeedback(false), 2000)
  }

  if (!wallet || !wallet.isConnected) {
    return (
      <div className={classes} {...skinAttr}>
        <div className="teacher-wallet__disconnected">
          <div className="teacher-wallet__status">Wallet not connected</div>
        </div>
      </div>
    )
  }

  const ethBalance = parseFloat(wallet.ethBalance)
  const fiatValue = formatFiatAmount(ethBalance)

  return (
    <div className={classes} {...skinAttr}>
      <div className="teacher-wallet__header">
        <div className="teacher-wallet__title">Teacher Wallet</div>
      </div>

      <div className="teacher-wallet__balance-section">
        <div className="teacher-wallet__balance-row">
          <span className="teacher-wallet__balance-label">Balance:</span>
          <div className="teacher-wallet__balance-value">
            <span className="teacher-wallet__eth-amount">{wallet.ethBalance} ETH</span>
            {fiatValue && (
              <span className="teacher-wallet__fiat-amount">({fiatValue})</span>
            )}
          </div>
        </div>
      </div>

      <div className="teacher-wallet__address-section">
        <div className="teacher-wallet__address-row">
          <span className="teacher-wallet__address-label">Address:</span>
          <div className="teacher-wallet__address-actions">
            <span className="teacher-wallet__address-short">
              {formatAddress(wallet.address)}
            </span>
            <button
              type="button"
              className="teacher-wallet__copy-btn"
              onClick={handleCopyAddress}
              title="Copy full address"
              disabled={copyFeedback}
            >
              {copyFeedback ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {onViewFullWallet && (
        <div className="teacher-wallet__actions">
          <button
            type="button"
            className="teacher-wallet__action teacher-wallet__action--primary"
            onClick={onViewFullWallet}
          >
            View Full Wallet
          </button>
        </div>
      )}
    </div>
  )
}