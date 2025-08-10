import { useCallback } from 'react'
import { usePrivy, useLoginWithEmail } from '@privy-io/react-auth'

export function useHeadlessEmailAuth() {
  const { ready, authenticated, user, getAccessToken, logout } = usePrivy()
  const { sendCode, loginWithCode } = useLoginWithEmail()

  const requestCode = useCallback(async (email: string) => {
    try {
      await sendCode({ email })
    } catch (error) {
      console.error('Failed to send code:', error)
      throw error
    }
  }, [sendCode])

  const confirmCode = useCallback(async (email: string, code: string) => {
    try {
      await loginWithCode({ code })
    } catch (error) {
      console.error('Failed to verify code:', error)
      throw error
    }
  }, [loginWithCode])

  return {
    ready,
    authenticated,
    user,
    getAccessToken,
    requestCode,
    confirmCode,
    logout,
  }
}
