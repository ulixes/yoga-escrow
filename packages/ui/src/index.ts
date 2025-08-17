export { Button } from './lib/Button'
export type { ButtonProps } from './lib/Button'

export { PasswordlessSignup } from './lib/PasswordlessSignup'
export type {
  PasswordlessSignupProps,
  PasswordlessSignupStep,
} from './lib/PasswordlessSignup'

export { Brand } from './lib/Brand'
export type { BrandProps } from './lib/Brand'

export { YogaTypePicker } from './lib/YogaTypePicker'
export type { YogaTypePickerProps, YogaTypeItem } from './lib/YogaTypePicker'

export { TeacherPicker } from './lib/TeacherPicker'
export type { TeacherPickerProps, TeacherItem } from './lib/TeacherPicker'

// Import this in your app to get the UI component styles
export const UIStyles = './styles.css'

export { YogaTimePicker } from './lib/YogaTimePicker'
export type { YogaTimePickerProps, YogaDay, YogaTimeItem } from './lib/YogaTimePicker'

export { LocationPicker } from './lib/LocationPicker'
export type { LocationPickerProps } from './lib/LocationPicker'

export { YogaTimeBlocksPicker } from './lib/YogaTimeBlocksPicker'
export type { YogaTimeBlocksPickerProps, Persona } from './lib/YogaTimeBlocksPicker'

export { FullJourney } from './lib/FullJourney'
export type { FullJourneyProps, FullJourneyResult, JourneyPersona, JourneyGoal } from './lib/FullJourney'

export { BalanceDisplay } from './lib/BalanceDisplay'
export type { BalanceDisplayProps } from './lib/BalanceDisplay'

export { InsufficientFunds } from './lib/InsufficientFunds'
export type { InsufficientFundsProps } from './lib/InsufficientFunds'

export { PaymentConfirmation } from './lib/PaymentConfirmation'
export type { PaymentConfirmationProps, PaymentSummary } from './lib/PaymentConfirmation'

export { LoadingState } from './lib/LoadingState'
export type { LoadingStateProps } from './lib/LoadingState'

export { TransactionConfirmation } from './lib/TransactionConfirmation'
export type { TransactionConfirmationProps } from './lib/TransactionConfirmation'

export { TransactionError } from './lib/TransactionError'
export type { TransactionErrorProps } from './lib/TransactionError'

export { BookingInfo } from './lib/BookingInfo'
export type { BookingInfoProps, BookingInfoItem } from './lib/BookingInfo'
export { ImprovedPersonaSelector } from './lib/ImprovedPersonaSelector'
export type { ImprovedPersonaSelectorProps, PersonaType, GoalType } from './lib/ImprovedPersonaSelector'

export { ImprovedYogaTypeSelector } from './lib/ImprovedYogaTypeSelector'
export type { ImprovedYogaTypeSelectorProps, YogaTypeOption } from './lib/ImprovedYogaTypeSelector'

export { WorkingSelectionDemo } from './lib/WorkingSelectionDemo'
export type { WorkingSelectionDemoProps } from './lib/WorkingSelectionDemo'

// Booking history components
export { ClassItem } from './lib/ClassItem'
export type { ClassItemProps, StudentEscrow, EscrowStatus, TimeSlot, Location } from './lib/ClassItem'
export { ClassList } from './lib/ClassList'
export type { ClassListProps } from './lib/ClassList'

// Navigation
export { NavBar } from './lib/NavBar'
export type { NavBarProps } from './lib/NavBar'

// MyBookings wrapper
export { MyBookings } from './lib/MyBookings'
export type { MyBookingsProps, MyBookingsFilter } from './lib/MyBookings'

// Hot Teacher Cards and Discovery
export { HotTeacherCard } from './lib/HotTeacherCard'
export type { HotTeacherCardProps, HotTeacherProfile } from './lib/HotTeacherCard'
export { TeacherDiscovery } from './lib/TeacherDiscovery'
export type { TeacherDiscoveryProps } from './lib/TeacherDiscovery'

// Student Booking Tracking Components
export { BookingRequestCard } from './lib/BookingRequestCard'
export type { BookingRequestCardProps } from './lib/BookingRequestCard'
export { ClassStatus } from './lib/BookingRequestCard'
export { BookingsList } from './lib/BookingsList'
export type { BookingsListProps, BookingFilter, BookingSortOption } from './lib/BookingsList'
export { BookingDetailView } from './lib/BookingDetailView'
export type { BookingDetailViewProps } from './lib/BookingDetailView'

// Teacher Components
export { TeacherClassCard } from './lib/TeacherClassCard'
export type { TeacherClassCardProps, TeacherClassRequest } from './lib/TeacherClassCard'
export { TeacherClassesList } from './lib/TeacherClassesList'
export type { TeacherClassesListProps, TeacherFilter, TeacherSortOption } from './lib/TeacherClassesList'
export { OpportunityDetailsModal } from './lib/OpportunityDetailsModal'
export type { OpportunityDetailsModalProps } from './lib/OpportunityDetailsModal'
export { UpcomingClassCard } from './lib/UpcomingClassCard'
export type { UpcomingClassCardProps } from './lib/UpcomingClassCard'
export { TeacherOnboarding } from './lib/TeacherOnboarding'
export type { TeacherOnboardingProps } from './lib/TeacherOnboarding'

// Teacher Wallet Components
export { TeacherWallet } from './lib/TeacherWallet'
export type { TeacherWalletProps, WalletInfo } from './lib/TeacherWallet'
export { TeacherWalletCompact } from './lib/TeacherWalletCompact'
export type { TeacherWalletCompactProps } from './lib/TeacherWalletCompact'

// Core Types
export type { Escrow, ClassOpportunity, GroupedOpportunity, AcceptedClass, TeacherDashboardData, ClassStudent } from './lib/types'
