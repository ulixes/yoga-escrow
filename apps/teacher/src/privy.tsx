import { PrivyProvider } from '@privy-io/react-auth'
import React from 'react'

const appId = (import.meta as any).env.VITE_PRIVY_APP_ID as string
const clientId = (import.meta as any).env.VITE_PRIVY_CLIENT_ID as string

export const WithPrivyProvider = ({ children }: { children: React.ReactNode }) => {
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
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}