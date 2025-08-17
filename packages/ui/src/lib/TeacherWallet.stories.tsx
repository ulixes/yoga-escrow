import type { Meta, StoryObj } from '@storybook/react'
import { TeacherWallet, type WalletInfo } from './TeacherWallet'
import { TeacherWalletCompact } from './TeacherWalletCompact'

const meta: Meta<typeof TeacherWallet> = {
  title: 'Teacher/TeacherWallet',
  component: TeacherWallet,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The TeacherWallet component provides basic wallet interactions for teachers using Privy embedded wallets.

**Key Features:**
- ETH balance display with fiat conversion
- Wallet address with copy functionality  
- Connection status indication
- Clean integration with existing nav menu
- Responsive design matching app aesthetic

**Usage in Nav Menu:**
This component is designed to be added to the nav menu dropdown, giving teachers quick access to their wallet information without leaving their current page.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onCopyAddress: { action: 'copyAddress' },
    onViewFullWallet: { action: 'viewFullWallet' },
    fiatCurrency: {
      control: 'select',
      options: ['USD', 'EUR', 'GBP'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Mock wallet data
const connectedWallet: WalletInfo = {
  address: '0x742d35Cc6344C4532BDAA8A4C30fF0AB5c234567',
  ethBalance: '1.2543',
  isConnected: true,
}

const lowBalanceWallet: WalletInfo = {
  address: '0x8b3f21CC9c6F4B7A5D2E3F1A8C9D0E1F2A3B4C5D',
  ethBalance: '0.0023',
  isConnected: true,
}

const highBalanceWallet: WalletInfo = {
  address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
  ethBalance: '15.7829',
  isConnected: true,
}

export const Connected: Story = {
  args: {
    wallet: connectedWallet,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const LowBalance: Story = {
  args: {
    wallet: lowBalanceWallet,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const HighBalance: Story = {
  args: {
    wallet: highBalanceWallet,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const Disconnected: Story = {
  args: {
    wallet: {
      address: '',
      ethBalance: '0',
      isConnected: false,
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const NoWallet: Story = {
  args: {
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const WithoutFiatRate: Story = {
  args: {
    wallet: connectedWallet,
  },
}

export const EuroCurrency: Story = {
  args: {
    wallet: connectedWallet,
    ethToFiatRate: 2200,
    fiatCurrency: 'EUR',
  },
}

export const CustomFiatFormat: Story = {
  args: {
    wallet: connectedWallet,
    ethToFiatRate: 2200,
    fiatCurrency: 'EUR',
    formatFiat: (amount: number, currency: string) => `${amount.toFixed(2)} ${currency}`,
  },
}

export const WithoutFullWalletAction: Story = {
  args: {
    wallet: connectedWallet,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    // No onViewFullWallet prop - hides the button
  },
}

export const NavMenuIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates how the TeacherWallet component would look when integrated into a navigation menu dropdown.

**Integration Pattern:**
\`\`\`tsx
// In your NavBar component, add to the menu:
<div className="yui-nav__menu" role="menu">
  <div className="yui-nav__menu-section">
    <TeacherWallet 
      wallet={teacherWallet}
      ethToFiatRate={ethToFiatRate}
      onCopyAddress={handleCopyAddress}
      onViewFullWallet={handleViewFullWallet}
    />
  </div>
  <button role="menuitem" className="yui-nav__menu-item">
    My Bookings
  </button>
  <button role="menuitem" className="yui-nav__menu-item--danger">
    Log out
  </button>
</div>
\`\`\`

**Privy Integration:**
\`\`\`tsx
import { useWallets } from '@privy-io/react-auth'

const { wallets } = useWallets()
const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy')

const walletInfo = {
  address: embeddedWallet?.address || '',
  ethBalance: ethBalance || '0',
  isConnected: !!embeddedWallet
}
\`\`\`
        `,
      },
    },
  },
  args: {
    wallet: connectedWallet,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    className: 'nav-menu-wallet',
  },
  decorators: [
    (Story) => (
      <div style={{ 
        maxWidth: '280px', 
        padding: '12px',
        border: '2px solid #000',
        borderRadius: '8px',
        background: '#fff'
      }}>
        <Story />
      </div>
    ),
  ],
}

export const TeacherEarningsExample: Story = {
  parameters: {
    docs: {
      description: {
        story: `
Example showing a teacher's wallet after receiving payments from completed yoga classes.
        `,
      },
    },
  },
  args: {
    wallet: {
      address: '0x9f8e7d6c5b4a3928716051423364758c9d0e1f2a',
      ethBalance: '2.1156', // Accumulated from multiple class payments
      isConnected: true,
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const CompactNavMenuVersion: Story = {
  parameters: {
    docs: {
      description: {
        story: `
Compact version specifically designed for nav menu integration. This is the recommended version for adding to the NavBar component's dropdown menu.

**Usage:**
\`\`\`tsx
import { TeacherWalletCompact } from '@your-org/ui'

// In your NavBar menu:
<div className="yui-nav__menu" role="menu">
  <TeacherWalletCompact 
    wallet={teacherWallet}
    ethToFiatRate={ethToFiatRate}
    onCopyAddress={handleCopyAddress}
    onViewFullWallet={openWalletModal}
  />
  <button role="menuitem" className="yui-nav__menu-item">
    My Bookings
  </button>
  <button role="menuitem" className="yui-nav__menu-item--danger">
    Log out
  </button>
</div>
\`\`\`
        `,
      },
    },
  },
  render: (args) => <TeacherWalletCompact {...args} />,
  args: {
    wallet: connectedWallet,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
  decorators: [
    (Story) => (
      <div style={{ 
        maxWidth: '250px', 
        padding: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        background: '#fff'
      }}>
        <Story />
      </div>
    ),
  ],
}