import * as React from 'react'
import { 
  Button, 
  PasswordlessSignup, 
  Brand, 
  FullJourney,
  BalanceDisplay,
  InsufficientFunds,
  PaymentConfirmation,
  TransactionConfirmation,
  TransactionError,
  NavBar
} from '@yoga/ui'
import type { FullJourneyResult, YogaTypeItem, YogaDay, PaymentSummary, HotTeacherProfile } from '@yoga/ui'
import '@yoga/ui/styles.css'
import { useHeadlessEmailAuth } from './auth'
import { useBookingFlow } from './hooks/useBookingFlow'
import { useETHBalance } from './hooks/useETHBalance'
import { useFundWallet } from './hooks/useFundWallet'
import { useETHPrice } from './hooks/useETHPrice'
// CLASS_PRICE_USD removed - now dynamic pricing
import { History } from './components/History'
import { ContractDebugger } from './components/ContractDebugger'
import { WalletSettings } from './components/WalletSettings'
import { API_BASE_URL } from './config'

export default function App() {
  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  const { ready, authenticated, user, requestCode, confirmCode, logout } = useHeadlessEmailAuth()
  const [showHistory, setShowHistory] = React.useState(false)
  const [showWalletSettings, setShowWalletSettings] = React.useState(false)
  
  const { 
    ethBalance,
    ethBalanceFormatted,
    isLoading: isBalanceLoading,
    error: balanceError,
    refreshBalance 
  } = useETHBalance()

  const { 
    fundWallet,
    showFundingInstructions,
    copyWalletAddress,
    walletAddress,
    canFund
  } = useFundWallet()

  const { 
    usdPrice: ethPrice,
    isLoading: isPriceLoading,
    error: priceError,
    ethToUSD
  } = useETHPrice()
  
  // Resilient email extraction for prefill
  const studentEmail = React.useMemo(() => {
    const u: any = user
    console.log('[EMAIL DEBUG] Full user object:', JSON.stringify(u, null, 2))
    
    const emailFromAddress = u?.email?.address
    const emailFromString = typeof u?.email === 'string' ? u.email : null
    const emailFromLinked = u?.linkedAccounts?.find((acc: any) => acc.type === 'email')?.address
    
    return emailFromAddress || emailFromString || emailFromLinked || ''
  }, [user])

  // Teachers will be fetched from API
  const [teachers, setTeachers] = React.useState<HotTeacherProfile[]>([])
  const [teachersLoading, setTeachersLoading] = React.useState(true)

  const {
    step,
    bookingPayload,
    journeyResult,
    paymentState,
    loading,
    error,
    handleJourneyComplete,
    updatePaymentState,
    estimateGasForBooking,
    validatePaymentAndProceed,
    confirmPayment,
    contractState,
    transactionHash,
    escrowId,
    goToStep
  } = useBookingFlow(studentEmail, walletAddress, ethPrice, teachers)

  // Fetch teachers from API on mount
  React.useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setTeachersLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/teachers/instagram`)
        const result = await response.json()
        
        if (result.success && result.data) {
          setTeachers(result.data)
        } else {
          console.error('Failed to fetch teachers:', result.error)
        }
      } catch (error) {
        console.error('Error fetching teachers:', error)
      } finally {
        setTeachersLoading(false)
      }
    }
    
    fetchTeachers()
  }, [])

  // Calculate days with 24-hour skip logic - MUST be at top to avoid hooks order issues
  const days: YogaDay[] = React.useMemo(() => {
    const generateDays = () => {
      const dayMap: Record<string, number> = {
        'tue': 2, 'thu': 4, 'sat': 6
      }
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(now.getDate() + 1)
      
      return ['tue', 'thu', 'sat'].map(dayId => {
        const targetDay = dayMap[dayId]
        const currentDay = tomorrow.getDay()
        
        // Calculate days until target from tomorrow
        let daysUntil = targetDay - currentDay
        if (daysUntil <= 0) {
          daysUntil += 7 // Next week
        }
        
        const targetDate = new Date(tomorrow)
        targetDate.setDate(tomorrow.getDate() + daysUntil)
        
        const month = monthNames[targetDate.getMonth()]
        const day = targetDate.getDate()
        const dayName = dayNames[targetDate.getDay()]
        
        return {
          id: dayId,
          label: `${month} ${day} - ${dayName}`,
          times: [
            { id: '09:00', label: '9:00 AM' },
            { id: '11:00', label: '11:00 AM' },
            { id: '18:00', label: '6:00 PM' }
          ]
        }
      })
    }
    
    return generateDays()
  }, []) // Empty dependency array so it calculates once on mount

  // Update payment state when balance changes
  React.useEffect(() => {
    if (step === 'payment' && paymentState && paymentState.isCheckingBalance) {
      console.log('Debug - Triggering payment state update with ETH balance:', ethBalanceFormatted)
      if (balanceError) {
        updatePaymentState('0', balanceError)
      } else {
        updatePaymentState(ethBalanceFormatted, undefined, paymentState.gasEstimate)
      }
    }
  }, [step, paymentState?.isCheckingBalance, ethBalanceFormatted, balanceError])

  // Estimate gas when payment step starts
  React.useEffect(() => {
    if (step === 'payment' && bookingPayload && walletAddress && !paymentState?.gasEstimate && ethBalanceFormatted) {
      console.log('Estimating gas for payment step...')
      estimateGasForBooking(ethBalanceFormatted)
    }
  }, [step, bookingPayload, walletAddress, paymentState?.gasEstimate, ethBalanceFormatted, estimateGasForBooking])

  // NOW ALL HOOKS ARE DONE - WE CAN DO EARLY RETURNS
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

  // Simple login gate - if not authenticated, show login
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
          title="Sign up or log in"
          description="Enter your email to get started with Yoga Escrow"
        />
      </div>
    )
  }

  // Yoga configuration data
  const yogaTypes: YogaTypeItem[] = [
    {
      id: 'vinyasa',
      name: 'Vinyasa',
      tagline: 'Flow with breath',
      personas: ['runner', 'traveler', 'dancer'],
      benefits: {
        runner: ['Build heat', 'Mobility for stride', 'Core stability'],
        traveler: ['Shake off jet lag', 'Improve circulation', 'Clear mind'],
        dancer: ['Fluidity & balance', 'Expressive flow']
      }
    },
    {
      id: 'yin',
      name: 'Yin',
      tagline: 'Deep stretch',
      personas: ['runner', 'traveler'],
      benefits: {
        runner: ['Post-run recovery', 'Hip opening'],
        traveler: ['Reset nervous system', 'Gentle decompression'],
        dancer: ['Release fascia']
      }
    },
    {
      id: 'hatha',
      name: 'Hatha',
      tagline: 'Foundational & calm',
      personas: ['runner', 'traveler', 'dancer'],
      benefits: {
        runner: ['Steady strength'],
        traveler: ['Grounding breath'],
        dancer: ['Alignment & control']
      }
    }
  ]

  const handleSubmit = (result: FullJourneyResult) => {
    // handleJourneyComplete(result)
  }

  const handlePayment = async (result: FullJourneyResult) => {
    // Complete Payment button clicked - process journey and trigger payment
    
    // Ensure teachers data has loaded before proceeding
    if (teachersLoading || teachers.length === 0) {
      console.error('Teachers data not loaded yet, please wait...')
      return
    }
    
    const payload = handleJourneyComplete(result)
    
    // Use the returned payload to call confirmPayment immediately
    if (payload) {
      await confirmPayment(payload)
    }
  }

  const handlePaymentProceed = async () => {
    if (bookingPayload) {
      try {
        await validatePaymentAndProceed(bookingPayload)
      } catch (error) {
        console.error('Payment confirmation failed:', error)
      }
    }
  }

  return (
    <div style={{ 
      fontFamily: 'sans-serif',
      minHeight: '100vh',
      background: '#fafafa'
    }}>
      <NavBar
        skin="ulyxes"
        customMenuContent={
          <>
            <button
              type="button"
              role="menuitem"
              className="yui-nav__menu-item"
              onClick={() => {
                setShowHistory(!showHistory)
                setShowWalletSettings(false)
              }}
            >
              {showHistory ? "Back to Booking" : "My bookings"}
            </button>
            <button
              type="button"
              role="menuitem"
              className="yui-nav__menu-item"
              onClick={() => {
                setShowWalletSettings(!showWalletSettings)
                setShowHistory(false)
              }}
            >
              {showWalletSettings ? 'Hide Settings' : '⚙️ Wallet Settings'}
            </button>
            <button
              type="button"
              role="menuitem"
              className="yui-nav__menu-item yui-nav__menu-item--danger"
              onClick={logout}
            >
              Log out
            </button>
          </>
        }
      />

      {/* Wallet Settings View */}
      {showWalletSettings && (
        <div style={{ maxWidth: 600, margin: '24px auto', padding: '0 24px' }}>
          <h2 style={{ marginBottom: '20px' }}>Wallet Settings</h2>
          <WalletSettings />
        </div>
      )}

      {/* History View */}
      {showHistory && !showWalletSettings && (
        <div style={{ maxWidth: 800, margin: '24px auto', padding: '0 24px' }}>
          <h2>My Bookings</h2>
          <History studentAddress={walletAddress as `0x${string}` | undefined} />
        </div>
      )}

      {/* Journey Step */}
      {step === 'journey' && !showHistory && !showWalletSettings && (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {teachersLoading ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '50vh',
              fontFamily: 'sans-serif'
            }}>
              Loading teachers...
            </div>
          ) : (
            <FullJourney
              yogaTypes={yogaTypes}
              yogaTypePersonas={['runner', 'traveler', 'dancer']}
              days={days}
              teachers={teachers}
              defaultPersona="Traveler"
              defaultStudentEmail={studentEmail}
              locationProps={{
                country: 'Georgia',
                city: 'Tbilisi',
                options: ['Vake Park', 'Lisi Lake', 'Turtle Lake']
              }}
              onSubmit={handleSubmit}
              onPayment={handlePayment}
              skin="ulyxes"
              // Authentication already done before journey starts
              isAuthenticated={true}
              userEmail={studentEmail}
              userWallet={walletAddress}
            />
          )}
        </div>
      )}


      {/* Confirmation Step */}
      {step === 'confirmation' && !showHistory && !showWalletSettings && transactionHash && (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
          <TransactionConfirmation
            transactionHash={transactionHash}
            escrowId={escrowId?.toString()}
            onViewTransaction={() => {
              window.open(`https://sepolia.basescan.org/tx/${transactionHash}`, '_blank')
            }}
            onBackToHome={() => goToStep('journey')}
            skin="ulyxes"
          />
        </div>
      )}
      
      {/* Error State */}
      {error && step === 'payment' && !showHistory && !showWalletSettings && (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
          <TransactionError
            error={error}
            onRetry={() => {
              if (bookingPayload) {
                confirmPayment()
              }
            }}
            onCancel={() => goToStep('journey')}
            skin="ulyxes"
          />
        </div>
      )}
    </div>
  )
}
