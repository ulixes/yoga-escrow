import{j as e}from"./jsx-runtime-CDt2p4po.js";import{r as pe}from"./index-GiUgBvb1.js";function fe(a){return a?`${a.slice(0,6)}...${a.slice(-4)}`:""}function ve(a){if(navigator.clipboard)navigator.clipboard.writeText(a);else{const t=document.createElement("textarea");t.value=a,document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)}}const he=({wallet:a,fiatCurrency:t="USD",ethToFiatRate:s,formatFiat:o,onCopyAddress:n,onViewFullWallet:c,className:F,skin:l})=>{const[i,d]=pe.useState(!1),u=["teacher-wallet",F].filter(Boolean).join(" "),p=l?{"data-skin":l}:{},j=ge=>{if(!s)return null;const R=ge*s;return o?o(R,t):new Intl.NumberFormat(void 0,{style:"currency",currency:t}).format(R)},h=()=>{a!=null&&a.address&&(ve(a.address),n==null||n(a.address),d(!0),setTimeout(()=>d(!1),2e3))};if(!a||!a.isConnected)return e.jsx("div",{className:u,...p,children:e.jsx("div",{className:"teacher-wallet__disconnected",children:e.jsx("div",{className:"teacher-wallet__status",children:"Wallet not connected"})})});const B=parseFloat(a.ethBalance),m=j(B);return e.jsxs("div",{className:u,...p,children:[e.jsx("div",{className:"teacher-wallet__header",children:e.jsx("div",{className:"teacher-wallet__title",children:"Teacher Wallet"})}),e.jsx("div",{className:"teacher-wallet__balance-section",children:e.jsxs("div",{className:"teacher-wallet__balance-row",children:[e.jsx("span",{className:"teacher-wallet__balance-label",children:"Balance:"}),e.jsxs("div",{className:"teacher-wallet__balance-value",children:[e.jsxs("span",{className:"teacher-wallet__eth-amount",children:[a.ethBalance," ETH"]}),m&&e.jsxs("span",{className:"teacher-wallet__fiat-amount",children:["(",m,")"]})]})]})}),e.jsx("div",{className:"teacher-wallet__address-section",children:e.jsxs("div",{className:"teacher-wallet__address-row",children:[e.jsx("span",{className:"teacher-wallet__address-label",children:"Address:"}),e.jsxs("div",{className:"teacher-wallet__address-actions",children:[e.jsx("span",{className:"teacher-wallet__address-short",children:fe(a.address)}),e.jsx("button",{type:"button",className:"teacher-wallet__copy-btn",onClick:h,title:"Copy full address",disabled:i,children:i?e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M20 6L9 17l-5-5"})}):e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),e.jsx("path",{d:"M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"})]})})]})]})}),c&&e.jsx("div",{className:"teacher-wallet__actions",children:e.jsx("button",{type:"button",className:"teacher-wallet__action teacher-wallet__action--primary",onClick:c,children:"View Full Wallet"})})]})};he.__docgenInfo={description:"",methods:[],displayName:"TeacherWallet",props:{wallet:{required:!1,tsType:{name:"WalletInfo"},description:""},fiatCurrency:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'USD'",computed:!1}},ethToFiatRate:{required:!1,tsType:{name:"number"},description:""},formatFiat:{required:!1,tsType:{name:"signature",type:"function",raw:"(fiatAmount: number, currency: string) => string",signature:{arguments:[{type:{name:"number"},name:"fiatAmount"},{type:{name:"string"},name:"currency"}],return:{name:"string"}}},description:""},onCopyAddress:{required:!1,tsType:{name:"signature",type:"function",raw:"(address: string) => void",signature:{arguments:[{type:{name:"string"},name:"address"}],return:{name:"void"}}},description:""},onViewFullWallet:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},className:{required:!1,tsType:{name:"string"},description:""},skin:{required:!1,tsType:{name:"string"},description:""}}};function we(a){return a?`${a.slice(0,6)}...${a.slice(-4)}`:""}function xe(a){if(navigator.clipboard)navigator.clipboard.writeText(a);else{const t=document.createElement("textarea");t.value=a,document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)}}const ye=({wallet:a,fiatCurrency:t="USD",ethToFiatRate:s,formatFiat:o,onCopyAddress:n,onViewFullWallet:c,className:F})=>{const[l,i]=pe.useState(!1),d=["teacher-wallet-compact",F].filter(Boolean).join(" "),u=B=>{if(!s)return null;const m=B*s;return o?o(m,t):new Intl.NumberFormat(void 0,{style:"currency",currency:t}).format(m)},p=()=>{a!=null&&a.address&&(xe(a.address),n==null||n(a.address),i(!0),setTimeout(()=>i(!1),2e3))};if(!a||!a.isConnected)return e.jsx("div",{className:d,children:e.jsx("div",{className:"teacher-wallet-compact__disconnected",children:e.jsx("span",{className:"teacher-wallet-compact__status",children:"Wallet not connected"})})});const j=parseFloat(a.ethBalance),h=u(j);return e.jsxs("div",{className:d,children:[e.jsxs("div",{className:"teacher-wallet-compact__row",children:[e.jsx("span",{className:"teacher-wallet-compact__label",children:"Balance:"}),e.jsxs("div",{className:"teacher-wallet-compact__balance",children:[e.jsxs("span",{className:"teacher-wallet-compact__eth",children:[a.ethBalance," ETH"]}),h&&e.jsxs("span",{className:"teacher-wallet-compact__fiat",children:["(",h,")"]})]})]}),e.jsxs("div",{className:"teacher-wallet-compact__row",children:[e.jsx("span",{className:"teacher-wallet-compact__label",children:"Address:"}),e.jsxs("div",{className:"teacher-wallet-compact__address",children:[e.jsx("span",{className:"teacher-wallet-compact__address-text",children:we(a.address)}),e.jsx("button",{type:"button",className:"teacher-wallet-compact__copy",onClick:p,title:"Copy full address",disabled:l,children:l?"✓":"📋"})]})]}),c&&e.jsx("div",{className:"teacher-wallet-compact__actions",children:e.jsx("button",{type:"button",className:"teacher-wallet-compact__action",onClick:c,children:"View Full Wallet"})})]})};ye.__docgenInfo={description:"",methods:[],displayName:"TeacherWalletCompact",props:{wallet:{required:!1,tsType:{name:"WalletInfo"},description:""},fiatCurrency:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'USD'",computed:!1}},ethToFiatRate:{required:!1,tsType:{name:"number"},description:""},formatFiat:{required:!1,tsType:{name:"signature",type:"function",raw:"(fiatAmount: number, currency: string) => string",signature:{arguments:[{type:{name:"number"},name:"fiatAmount"},{type:{name:"string"},name:"currency"}],return:{name:"string"}}},description:""},onCopyAddress:{required:!1,tsType:{name:"signature",type:"function",raw:"(address: string) => void",signature:{arguments:[{type:{name:"string"},name:"address"}],return:{name:"void"}}},description:""},onViewFullWallet:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const We={title:"Teacher/TeacherWallet",component:he,parameters:{layout:"padded",docs:{description:{component:`
The TeacherWallet component provides basic wallet interactions for teachers using Privy embedded wallets.

**Key Features:**
- ETH balance display with fiat conversion
- Wallet address with copy functionality  
- Connection status indication
- Clean integration with existing nav menu
- Responsive design matching app aesthetic

**Usage in Nav Menu:**
This component is designed to be added to the nav menu dropdown, giving teachers quick access to their wallet information without leaving their current page.
        `}}},tags:["autodocs"],argTypes:{onCopyAddress:{action:"copyAddress"},onViewFullWallet:{action:"viewFullWallet"},fiatCurrency:{control:"select",options:["USD","EUR","GBP"]}}},r={address:"0x742d35Cc6344C4532BDAA8A4C30fF0AB5c234567",ethBalance:"1.2543",isConnected:!0},_e={address:"0x8b3f21CC9c6F4B7A5D2E3F1A8C9D0E1F2A3B4C5D",ethBalance:"0.0023",isConnected:!0},be={address:"0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",ethBalance:"15.7829",isConnected:!0},y={args:{wallet:r,ethToFiatRate:2500,fiatCurrency:"USD"}},g={args:{wallet:_e,ethToFiatRate:2500,fiatCurrency:"USD"}},f={args:{wallet:be,ethToFiatRate:2500,fiatCurrency:"USD"}},v={args:{wallet:{address:"",ethBalance:"0",isConnected:!1},ethToFiatRate:2500,fiatCurrency:"USD"}},w={args:{ethToFiatRate:2500,fiatCurrency:"USD"}},x={args:{wallet:r}},_={args:{wallet:r,ethToFiatRate:2200,fiatCurrency:"EUR"}},b={args:{wallet:r,ethToFiatRate:2200,fiatCurrency:"EUR",formatFiat:(a,t)=>`${a.toFixed(2)} ${t}`}},C={args:{wallet:r,ethToFiatRate:2500,fiatCurrency:"USD"}},T={parameters:{docs:{description:{story:`
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
        `}}},args:{wallet:r,ethToFiatRate:2500,fiatCurrency:"USD",className:"nav-menu-wallet"},decorators:[a=>e.jsx("div",{style:{maxWidth:"280px",padding:"12px",border:"2px solid #000",borderRadius:"8px",background:"#fff"},children:e.jsx(a,{})})]},W={parameters:{docs:{description:{story:`
Example showing a teacher's wallet after receiving payments from completed yoga classes.
        `}}},args:{wallet:{address:"0x9f8e7d6c5b4a3928716051423364758c9d0e1f2a",ethBalance:"2.1156",isConnected:!0},ethToFiatRate:2500,fiatCurrency:"USD"}},N={parameters:{docs:{description:{story:`
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
        `}}},render:a=>e.jsx(ye,{...a}),args:{wallet:r,ethToFiatRate:2500,fiatCurrency:"USD"},decorators:[a=>e.jsx("div",{style:{maxWidth:"250px",padding:"16px",border:"1px solid #ccc",borderRadius:"4px",background:"#fff"},children:e.jsx(a,{})})]};var S,A,U;y.parameters={...y.parameters,docs:{...(S=y.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    wallet: connectedWallet,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(U=(A=y.parameters)==null?void 0:A.docs)==null?void 0:U.source}}};var D,k,E;g.parameters={...g.parameters,docs:{...(D=g.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    wallet: lowBalanceWallet,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(E=(k=g.parameters)==null?void 0:k.docs)==null?void 0:E.source}}};var I,V,q;f.parameters={...f.parameters,docs:{...(I=f.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    wallet: highBalanceWallet,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(q=(V=f.parameters)==null?void 0:V.docs)==null?void 0:q.source}}};var M,$,L;v.parameters={...v.parameters,docs:{...(M=v.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    wallet: {
      address: '',
      ethBalance: '0',
      isConnected: false
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(L=($=v.parameters)==null?void 0:$.docs)==null?void 0:L.source}}};var H,P,G;w.parameters={...w.parameters,docs:{...(H=w.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(G=(P=w.parameters)==null?void 0:P.docs)==null?void 0:G.source}}};var K,O,z;x.parameters={...x.parameters,docs:{...(K=x.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    wallet: connectedWallet
  }
}`,...(z=(O=x.parameters)==null?void 0:O.docs)==null?void 0:z.source}}};var J,Q,X;_.parameters={..._.parameters,docs:{...(J=_.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    wallet: connectedWallet,
    ethToFiatRate: 2200,
    fiatCurrency: 'EUR'
  }
}`,...(X=(Q=_.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,ee;b.parameters={...b.parameters,docs:{...(Y=b.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    wallet: connectedWallet,
    ethToFiatRate: 2200,
    fiatCurrency: 'EUR',
    formatFiat: (amount: number, currency: string) => \`\${amount.toFixed(2)} \${currency}\`
  }
}`,...(ee=(Z=b.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var ae,te,ne;C.parameters={...C.parameters,docs:{...(ae=C.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    wallet: connectedWallet,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
    // No onViewFullWallet prop - hides the button
  }
}`,...(ne=(te=C.parameters)==null?void 0:te.docs)==null?void 0:ne.source}}};var re,se,oe;T.parameters={...T.parameters,docs:{...(re=T.parameters)==null?void 0:re.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
This story demonstrates how the TeacherWallet component would look when integrated into a navigation menu dropdown.

**Integration Pattern:**
\\\`\\\`\\\`tsx
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
\\\`\\\`\\\`

**Privy Integration:**
\\\`\\\`\\\`tsx
import { useWallets } from '@privy-io/react-auth'

const { wallets } = useWallets()
const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy')

const walletInfo = {
  address: embeddedWallet?.address || '',
  ethBalance: ethBalance || '0',
  isConnected: !!embeddedWallet
}
\\\`\\\`\\\`
        \`
      }
    }
  },
  args: {
    wallet: connectedWallet,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    className: 'nav-menu-wallet'
  },
  decorators: [Story => <div style={{
    maxWidth: '280px',
    padding: '12px',
    border: '2px solid #000',
    borderRadius: '8px',
    background: '#fff'
  }}>
        <Story />
      </div>]
}`,...(oe=(se=T.parameters)==null?void 0:se.docs)==null?void 0:oe.source}}};var ce,le,ie;W.parameters={...W.parameters,docs:{...(ce=W.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
Example showing a teacher's wallet after receiving payments from completed yoga classes.
        \`
      }
    }
  },
  args: {
    wallet: {
      address: '0x9f8e7d6c5b4a3928716051423364758c9d0e1f2a',
      ethBalance: '2.1156',
      // Accumulated from multiple class payments
      isConnected: true
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(ie=(le=W.parameters)==null?void 0:le.docs)==null?void 0:ie.source}}};var de,me,ue;N.parameters={...N.parameters,docs:{...(de=N.parameters)==null?void 0:de.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
Compact version specifically designed for nav menu integration. This is the recommended version for adding to the NavBar component's dropdown menu.

**Usage:**
\\\`\\\`\\\`tsx
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
\\\`\\\`\\\`
        \`
      }
    }
  },
  render: args => <TeacherWalletCompact {...args} />,
  args: {
    wallet: connectedWallet,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  },
  decorators: [Story => <div style={{
    maxWidth: '250px',
    padding: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    background: '#fff'
  }}>
        <Story />
      </div>]
}`,...(ue=(me=N.parameters)==null?void 0:me.docs)==null?void 0:ue.source}}};const Ne=["Connected","LowBalance","HighBalance","Disconnected","NoWallet","WithoutFiatRate","EuroCurrency","CustomFiatFormat","WithoutFullWalletAction","NavMenuIntegration","TeacherEarningsExample","CompactNavMenuVersion"];export{N as CompactNavMenuVersion,y as Connected,b as CustomFiatFormat,v as Disconnected,_ as EuroCurrency,f as HighBalance,g as LowBalance,T as NavMenuIntegration,w as NoWallet,W as TeacherEarningsExample,x as WithoutFiatRate,C as WithoutFullWalletAction,Ne as __namedExportsOrder,We as default};
