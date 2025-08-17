import * as React from 'react'
import { 
  Button, 
  TeacherOnboarding,
  NavBar,
  TeacherClassesList,
  PasswordlessSignup,
  TeacherWalletCompact
} from '@yoga/ui'
import '@yoga/ui/styles.css'
import { useHeadlessEmailAuth } from './auth'
import { useTeacherClassRequests } from './hooks/useTeacherClassRequests'
import { useTeacherActions } from './hooks/useTeacherActions'
import { useETHPrice } from './hooks/useETHPrice'
import { useWalletInfo } from './hooks/useWalletInfo'

type AppStep = 'onboarding' | 'dashboard'

export default function App() {
  const [step, setStep] = React.useState<AppStep>('onboarding')
  const [teacherHandle, setTeacherHandle] = React.useState<string>('')

  // Authentication hooks
  const { ready, authenticated, user, requestCode, confirmCode, logout } = useHeadlessEmailAuth()

  // Extract wallet address from user
  const walletAddress = React.useMemo(() => {
    return user?.wallet?.address as `0x${string}` | undefined
  }, [user])

  // Hooks for class requests and actions
  const { opportunities, upcomingClasses, classHistory, isLoading, error, refreshRequests } = useTeacherClassRequests(teacherHandle)
  
  // Debug log
  console.log('App - opportunities:', opportunities, 'type:', typeof opportunities)
  console.log('App - upcomingClasses:', upcomingClasses, 'type:', typeof upcomingClasses)
  console.log('App - classHistory:', classHistory, 'type:', typeof classHistory)
  const { acceptClass, batchAcceptClass, actionState, resetActionState } = useTeacherActions()
  const { ethPrice } = useETHPrice()
  
  // Wallet info hook
  const { walletInfo, ethToFiatRate, isLoading: walletLoading, handleCopyAddress, handleViewFullWallet } = useWalletInfo({
    walletAddress,
    ethPrice: ethPrice || undefined
  })

  // Check if teacher has already set their handle and is authenticated
  React.useEffect(() => {
    if (authenticated) {
      const savedHandle = localStorage.getItem('teacherHandle')
      if (savedHandle) {
        setTeacherHandle(savedHandle)
        setStep('dashboard')
      }
    }
  }, [authenticated])

  const handleOnboardingComplete = (igHandle: string) => {
    setTeacherHandle(igHandle)
    localStorage.setItem('teacherHandle', igHandle)
    setStep('dashboard')
  }

  const handleAcceptOpportunity = async (opportunityId: string, escrowId: number, timeIndex: number) => {
    try {
      await acceptClass({
        escrowId,
        teacherHandle,
        timeIndex
      })
      
      // Refresh the opportunities list after successful acceptance
      setTimeout(refreshRequests, 2000) // Wait a bit for blockchain confirmation
    } catch (error) {
      console.error('Failed to accept opportunity:', error)
    }
  }

  const handleIgnoreClass = (classId: number) => {
    // For now, just log the ignore action
    // In a real implementation, you might want to store ignored requests locally
    console.log('Ignoring class request:', classId)
  }

  const handleAcceptGroup = async (groupKey: string) => {
    try {
      // Find the group and collect all escrow IDs
      const group = opportunities.find(opp => opp.groupKey === groupKey)
      if (!group || group.opportunities.length === 0) {
        throw new Error('Group not found')
      }
      
      // Collect all escrow IDs from the group
      const escrowIds = group.opportunities.map(opp => opp.escrowId)
      const timeIndex = group.opportunities[0].timeIndex // They should all have the same time
      
      // Batch accept all opportunities in the group
      await batchAcceptClass({
        escrowIds,
        teacherHandle,
        timeIndex
      })
      
      // Refresh the opportunities list after successful acceptance
      setTimeout(refreshRequests, 2000)
    } catch (error) {
      console.error('Failed to accept group class:', error)
    }
  }

  const handleViewDetails = (opportunity: any) => {
    console.log('Viewing details for opportunity:', opportunity)
    // TODO: Implement details modal/view
  }


  const handleViewStudentDetails = (escrowId: number) => {
    console.log('Viewing student details for escrow:', escrowId)
    // TODO: Implement student-specific details modal/view
  }

  const handleCancelClass = async (escrowId: number) => {
    console.log('Cancelling class for escrow:', escrowId)
    // TODO: Implement cancel class functionality
    // For group classes, this would cancel the entire group
    // Individual student cancellations would be handled via handleViewStudentDetails
  }

  const handleLogout = () => {
    // Clear teacher handle from localStorage and state
    localStorage.removeItem('teacherHandle')
    setTeacherHandle('')
    setStep('onboarding')
    logout()
  }

  // Loading state while Privy initializes
  if (!ready) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        fontFamily: 'sans-serif'
      }}>
        Loading…
      </div>
    )
  }

  // Authentication gate - if not authenticated, show login
  if (!authenticated) {
    return (
      <div style={{ 
        fontFamily: 'sans-serif',
        minHeight: '100vh',
        background: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <PasswordlessSignup
          onRequestCode={requestCode}
          onVerifyCode={confirmCode}
          skin="ulyxes"
          title="Teacher Login"
          description="Enter your email to access your teacher dashboard"
        />
      </div>
    )
  }

  // Onboarding step  
  if (step === 'onboarding') {
    return (
      <div style={{ 
        fontFamily: 'sans-serif',
        minHeight: '100vh',
        background: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <TeacherOnboarding
          onComplete={handleOnboardingComplete}
          onSkip={() => handleOnboardingComplete('@teacher')} // fallback
        />
      </div>
    )
  }

  // Dashboard step
  return (
    <div style={{ 
      fontFamily: 'sans-serif',
      minHeight: '100vh',
      background: '#fafafa'
    }}>
      <NavBar
        skin="ulyxes"
        title="Teacher Dashboard"
        slogan={`Welcome, ${teacherHandle}`}
        customMenuContent={
          <>
            <TeacherWalletCompact
              wallet={walletInfo}
              ethToFiatRate={ethToFiatRate}
              fiatCurrency="USD"
              onCopyAddress={handleCopyAddress}
              onViewFullWallet={handleViewFullWallet}
            />
            <button
              type="button"
              role="menuitem"
              className="yui-nav__menu-item"
            >
              My Bookings
            </button>
            <button
              type="button"
              role="menuitem"
              className="yui-nav__menu-item yui-nav__menu-item--danger"
              onClick={handleLogout}
            >
              Log out
            </button>
          </>
        }
      />

      <TeacherClassesList
        opportunities={opportunities}
        upcomingClasses={upcomingClasses}
        classHistory={classHistory}
        teacherHandle={teacherHandle}
        onAcceptOpportunity={handleAcceptOpportunity}
        onAcceptGroup={handleAcceptGroup}
        onViewDetails={handleViewDetails}
        onViewStudentDetails={handleViewStudentDetails}
        onCancelClass={handleCancelClass}
        ethToFiatRate={ethPrice || undefined}
        fiatCurrency="USD"
      />
    </div>
  )
}

