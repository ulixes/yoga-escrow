import React, { useState } from 'react'
import { WalletInfo } from './TeacherWallet'

export interface TeacherWalletCompactProps {
  wallet?: WalletInfo
  fiatCurrency?: string
  ethToFiatRate?: number
  formatFiat?: (fiatAmount: number, currency: string) => string
  onCopyAddress?: (address: string) => void
  onViewFullWallet?: () => void
  className?: string
}

function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function copyToClipboard(text: string): void {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

export const TeacherWalletCompact: React.FC<TeacherWalletCompactProps> = ({
  wallet,
  fiatCurrency = 'USD',
  ethToFiatRate,
  formatFiat,
  onCopyAddress,
  onViewFullWallet,
  className
}) => {
  const [copyFeedback, setCopyFeedback] = useState(false)
  
  const classes = ['teacher-wallet-compact', className].filter(Boolean).join(' ')

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
      <div className={classes}>
        <div className="teacher-wallet-compact__disconnected">
          <span className="teacher-wallet-compact__status">Wallet not connected</span>
        </div>
      </div>
    )
  }

  const ethBalance = parseFloat(wallet.ethBalance)
  const fiatValue = formatFiatAmount(ethBalance)

  return (
    <div className={classes}>
      <div className="teacher-wallet-compact__row">
        <span className="teacher-wallet-compact__label">Balance:</span>
        <div className="teacher-wallet-compact__balance">
          <span className="teacher-wallet-compact__eth">{wallet.ethBalance} ETH</span>
          {fiatValue && (
            <span className="teacher-wallet-compact__fiat">({fiatValue})</span>
          )}
        </div>
      </div>
      
      <div className="teacher-wallet-compact__row">
        <span className="teacher-wallet-compact__label">Address:</span>
        <div className="teacher-wallet-compact__address">
          <span className="teacher-wallet-compact__address-text">
            {formatAddress(wallet.address)}
          </span>
          <button
            type="button"
            className="teacher-wallet-compact__copy"
            onClick={handleCopyAddress}
            title="Copy full address"
            disabled={copyFeedback}
          >
            {copyFeedback ? '✓' : '📋'}
          </button>
        </div>
      </div>

      {onViewFullWallet && (
        <div className="teacher-wallet-compact__actions">
          <button
            type="button"
            className="teacher-wallet-compact__action"
            onClick={onViewFullWallet}
          >
            View Full Wallet
          </button>
        </div>
      )}
    </div>
  )
}