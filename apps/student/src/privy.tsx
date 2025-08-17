import { PrivyProvider } from '@privy-io/react-auth'
import React from 'react'
import { base, baseSepolia } from 'viem/chains'
import { NETWORK } from './config'

const appId = (import.meta as any).env.VITE_PRIVY_APP_ID as string
const clientId = (import.meta as any).env.VITE_PRIVY_CLIENT_ID as string

export function WithPrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={appId}
      clientId={clientId}
      config={{
        appearance: {
          theme: 'light',
        },
        loginMethods: ['email'],
        embeddedWallets: {
          createOnLogin: 'all-users',
          requireUserPasswordOnCreate: false,
          priceDisplay: {
            primary: 'fiat-currency',
            secondary: 'native-token',
          },
        },
        defaultChain: NETWORK === 'base' ? base : baseSepolia,
        supportedChains: NETWORK === 'base' ? [base] : [baseSepolia],
        // Ensure proper wallet initialization
        walletConnectCloudProjectId: undefined,
        // We won't render their modal; we'll trigger flows and show our own UI.
      }}
    >
      {children}
    </PrivyProvider>
  )
}
