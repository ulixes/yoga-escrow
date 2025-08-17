import React, { useState } from 'react'
import { usePrivateKey } from '../hooks/usePrivateKey'

export function WalletSettings() {
  const {
    isExporting,
    error,
    walletAddress,
    exportPrivateKey,
    hasPrivyWallet
  } = usePrivateKey()

  const [showWarning, setShowWarning] = useState(false)

  const handleExportClick = () => {
    setShowWarning(true)
  }

  const handleConfirmExport = async () => {
    setShowWarning(false)
    await exportPrivateKey()
  }

  if (!hasPrivyWallet) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No wallet connected</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Wallet Settings</h3>
      
      <div className="space-y-4">
        {/* Wallet Address */}
        <div>
          <label className="text-sm text-gray-600">Wallet Address</label>
          <div className="mt-1 p-2 bg-gray-50 rounded font-mono text-sm break-all">
            {walletAddress}
          </div>
        </div>

        {/* Private Key Section */}
        <div>
          <label className="text-sm text-gray-600">Private Key Export</label>
          <p className="text-xs text-gray-500 mt-1 mb-3">
            Export your private key to use this wallet in other applications like MetaMask.
          </p>
          
          {!showWarning && (
            <button
              onClick={handleExportClick}
              disabled={isExporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExporting ? 'Opening Export...' : 'Export Private Key'}
            </button>
          )}

          {/* Warning Modal */}
          {showWarning && (
            <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="text-amber-900 font-semibold mb-2">⚠️ Security Warning</h4>
              <p className="text-amber-800 text-sm mb-3">
                Never share your private key with anyone. Anyone with access to your private key can steal your funds.
                Only proceed if you understand the risks. This will open a secure modal where you can view and copy your private key.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmExport}
                  disabled={isExporting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isExporting ? 'Opening...' : 'I Understand, Export Key'}
                </button>
                <button
                  onClick={() => setShowWarning(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-2 p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}