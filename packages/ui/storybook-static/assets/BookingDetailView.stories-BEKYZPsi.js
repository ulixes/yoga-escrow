import{j as e}from"./jsx-runtime-CDt2p4po.js";import{C as s}from"./BookingRequestCard-CYKcAmBL.js";import"./index-GiUgBvb1.js";function f(a){const t=new Date(a*1e3);return t.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})+" at "+t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0})}function Z(a){const t=[{type:"created",label:"Request created",timestamp:a.createdAt,description:`Booking request submitted with ${a.amount} ETH`}];return a.status===s.Accepted&&a.classTime&&t.push({type:"accepted",label:`Teacher ${a.selectedHandle} accepted`,timestamp:a.classTime-24*60*60,description:`Class scheduled for ${f(a.classTime)}`}),a.status===s.Delivered&&a.classTime&&t.push({type:"completed",label:"Class completed",timestamp:a.classTime,description:`Payment released to ${a.selectedHandle}`}),a.status===s.Cancelled&&t.push({type:"cancelled",label:"Booking cancelled",timestamp:a.createdAt+60*60,description:`Refund processed: ${a.amount} ETH`}),t.sort((n,c)=>n.timestamp-c.timestamp)}function ee({status:a}){const n={[s.Pending]:{label:"Waiting for Teacher",color:"orange"},[s.Accepted]:{label:"Class Confirmed",color:"green"},[s.Delivered]:{label:"Completed",color:"blue"},[s.Cancelled]:{label:"Cancelled",color:"gray"}}[a];return e.jsx("span",{className:`booking-detail-status-badge booking-detail-status-badge--${n.color}`,children:n.label})}const J=({escrow:a,onCancel:t,onReleasePayment:n,onClose:c,fiatCurrency:x="USD",ethToFiatRate:v,formatFiat:k,transactionHash:w,blockExplorerUrl:T,className:K})=>{const Q=["booking-detail-view",K].filter(Boolean).join(" "),l=v?parseFloat(a.amount)*v:null,y=l&&k?k(l,x):l?new Intl.NumberFormat(void 0,{style:"currency",currency:x}).format(l):null,X=Z(a);return e.jsxs("div",{className:Q,children:[e.jsxs("div",{className:"booking-detail-view__header",children:[e.jsxs("div",{className:"booking-detail-view__header-content",children:[e.jsx("h2",{className:"booking-detail-view__title",children:a.description}),e.jsx(ee,{status:a.status})]}),c&&e.jsx("button",{className:"booking-detail-view__close",onClick:c,"aria-label":"Close details",children:"×"})]}),e.jsxs("div",{className:"booking-detail-view__content",children:[e.jsxs("div",{className:"booking-detail-view__main",children:[e.jsxs("section",{className:"booking-detail-view__section",children:[e.jsx("h3",{className:"booking-detail-view__section-title",children:"Payment Details"}),e.jsxs("div",{className:"booking-detail-view__payment",children:[e.jsxs("div",{className:"booking-detail-view__amount",children:[e.jsxs("span",{className:"booking-detail-view__amount-eth",children:[a.amount," ETH"]}),y&&e.jsxs("span",{className:"booking-detail-view__amount-fiat",children:["(",y,")"]})]}),w&&T&&e.jsx("a",{href:`${T}/tx/${w}`,target:"_blank",rel:"noopener noreferrer",className:"booking-detail-view__tx-link",children:"View transaction ↗"})]})]}),e.jsxs("section",{className:"booking-detail-view__section",children:[e.jsx("h3",{className:"booking-detail-view__section-title",children:"Class Details"}),e.jsxs("div",{className:"booking-detail-view__details",children:[e.jsxs("div",{className:"booking-detail-view__detail-row",children:[e.jsx("span",{className:"booking-detail-view__detail-label",children:"Location:"}),e.jsx("span",{className:"booking-detail-view__detail-value",children:a.location})]}),e.jsxs("div",{className:"booking-detail-view__detail-row",children:[e.jsx("span",{className:"booking-detail-view__detail-label",children:"Student email:"}),e.jsx("span",{className:"booking-detail-view__detail-value",children:a.studentEmail})]})]})]}),e.jsxs("section",{className:"booking-detail-view__section",children:[e.jsx("h3",{className:"booking-detail-view__section-title",children:"Teacher Options"}),e.jsx("div",{className:"booking-detail-view__teacher-options",children:a.teacherHandles.map((i,o)=>e.jsxs("div",{className:`booking-detail-view__teacher-option ${a.selectedHandle===i?"booking-detail-view__teacher-option--selected":a.selectedHandle&&a.selectedHandle!==i?"booking-detail-view__teacher-option--not-selected":""}`,children:[e.jsx("span",{className:"booking-detail-view__teacher-handle",children:i}),a.selectedHandle===i&&e.jsx("span",{className:"booking-detail-view__teacher-badge",children:"Selected"})]},o))})]}),e.jsxs("section",{className:"booking-detail-view__section",children:[e.jsx("h3",{className:"booking-detail-view__section-title",children:"Time Options"}),e.jsx("div",{className:"booking-detail-view__time-options",children:a.timeSlots.map((i,o)=>e.jsxs("div",{className:`booking-detail-view__time-option ${a.selectedTimeIndex===o?"booking-detail-view__time-option--selected":a.selectedTimeIndex!==void 0&&a.selectedTimeIndex!==o?"booking-detail-view__time-option--not-selected":""}`,children:[e.jsx("span",{className:"booking-detail-view__time-text",children:f(i)}),a.selectedTimeIndex===o&&e.jsx("span",{className:"booking-detail-view__time-badge",children:"Selected"})]},o))})]}),e.jsxs("section",{className:"booking-detail-view__section",children:[e.jsx("h3",{className:"booking-detail-view__section-title",children:"Timeline"}),e.jsx("div",{className:"booking-detail-view__timeline",children:X.map((i,o)=>e.jsxs("div",{className:"booking-detail-view__timeline-item",children:[e.jsx("div",{className:"booking-detail-view__timeline-marker"}),e.jsxs("div",{className:"booking-detail-view__timeline-content",children:[e.jsx("div",{className:"booking-detail-view__timeline-title",children:i.label}),e.jsx("div",{className:"booking-detail-view__timeline-time",children:f(i.timestamp)}),e.jsx("div",{className:"booking-detail-view__timeline-description",children:i.description})]})]},o))})]})]}),e.jsxs("div",{className:"booking-detail-view__actions",children:[a.status===s.Pending&&e.jsx("button",{className:"booking-detail-view__action booking-detail-view__action--cancel",onClick:()=>t==null?void 0:t(a.id),children:"Cancel Request"}),a.status===s.Accepted&&e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"booking-detail-view__action booking-detail-view__action--release",onClick:()=>n==null?void 0:n(a.id),children:"Release Payment"}),e.jsx("button",{className:"booking-detail-view__action booking-detail-view__action--cancel",onClick:()=>t==null?void 0:t(a.id),children:"Cancel Booking"})]})]})]})]})};J.__docgenInfo={description:"",methods:[],displayName:"BookingDetailView",props:{escrow:{required:!0,tsType:{name:"Escrow"},description:""},onCancel:{required:!1,tsType:{name:"signature",type:"function",raw:"(escrowId: number) => void",signature:{arguments:[{type:{name:"number"},name:"escrowId"}],return:{name:"void"}}},description:""},onReleasePayment:{required:!1,tsType:{name:"signature",type:"function",raw:"(escrowId: number) => void",signature:{arguments:[{type:{name:"number"},name:"escrowId"}],return:{name:"void"}}},description:""},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},fiatCurrency:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'USD'",computed:!1}},ethToFiatRate:{required:!1,tsType:{name:"number"},description:""},formatFiat:{required:!1,tsType:{name:"signature",type:"function",raw:"(fiatAmount: number, currency: string) => string",signature:{arguments:[{type:{name:"number"},name:"fiatAmount"},{type:{name:"string"},name:"currency"}],return:{name:"string"}}},description:""},transactionHash:{required:!1,tsType:{name:"string"},description:""},blockExplorerUrl:{required:!1,tsType:{name:"string"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const ie={title:"Components/BookingDetailView",component:J,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{onCancel:{action:"cancel"},onReleasePayment:{action:"release-payment"},onClose:{action:"close"}}},r={id:1,student:"0x1234567890123456789012345678901234567890",amount:"0.002",status:s.Pending,createdAt:Math.floor(Date.now()/1e3)-7200,description:"Private Vinyasa Flow Session",location:"Vake Park, Tbilisi (near the fountain)",studentEmail:"student@example.com",teacherHandles:["@yoga_master_tbilisi","@zen_teacher_flow","@ashtanga_guru"],timeSlots:[Math.floor(Date.now()/1e3)+86400,Math.floor(Date.now()/1e3)+172800,Math.floor(Date.now()/1e3)+259200]},d={args:{escrow:r,ethToFiatRate:2500,fiatCurrency:"USD",transactionHash:"0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",blockExplorerUrl:"https://sepolia.basescan.org"}},m={args:{escrow:{...r,id:2,status:s.Accepted,teacher:"0x0987654321098765432109876543210987654321",classTime:Math.floor(Date.now()/1e3)+86400,selectedTimeIndex:0,selectedHandle:"@yoga_master_tbilisi"},ethToFiatRate:2500,fiatCurrency:"USD",transactionHash:"0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",blockExplorerUrl:"https://sepolia.basescan.org"}},u={args:{escrow:{...r,id:3,status:s.Delivered,teacher:"0x0987654321098765432109876543210987654321",classTime:Math.floor(Date.now()/1e3)-3600,selectedTimeIndex:1,selectedHandle:"@zen_teacher_flow",description:"Power Yoga Session with Meditation",amount:"0.0035"},ethToFiatRate:2500,fiatCurrency:"USD",transactionHash:"0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",blockExplorerUrl:"https://sepolia.basescan.org"}},p={args:{escrow:{...r,id:4,status:s.Cancelled,description:"Yin Yoga and Breathwork Session",location:"Botanical Garden Pavilion, Tbilisi"},ethToFiatRate:2500,fiatCurrency:"USD",transactionHash:"0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",blockExplorerUrl:"https://sepolia.basescan.org"}},g={args:{escrow:{...r,status:s.Accepted,teacher:"0x0987654321098765432109876543210987654321",classTime:Math.floor(Date.now()/1e3)+86400,selectedTimeIndex:2,selectedHandle:"@ashtanga_guru"},ethToFiatRate:2500,fiatCurrency:"USD"}},b={args:{escrow:{...r,status:s.Accepted,teacher:"0x0987654321098765432109876543210987654321",classTime:Math.floor(Date.now()/1e3)+86400,selectedTimeIndex:0,selectedHandle:"@yoga_master_tbilisi"}}},h={args:{escrow:{...r,status:s.Delivered,teacher:"0x0987654321098765432109876543210987654321",classTime:Math.floor(Date.now()/1e3)-3600,selectedTimeIndex:0,selectedHandle:"@yoga_master_tbilisi",amount:"0.004"},ethToFiatRate:2200,fiatCurrency:"EUR",formatFiat:(a,t)=>`${a.toFixed(2)} ${t}`,transactionHash:"0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",blockExplorerUrl:"https://sepolia.basescan.org"}},_={args:{escrow:{...r,description:"Advanced Ashtanga Yoga Session with Pranayama Breathing Techniques and Meditation Practice for Intermediate to Advanced Students",location:"Mtatsminda Park Yoga Pavilion, Tbilisi (near the Ferris wheel, take the cable car up)",status:s.Accepted,teacher:"0x0987654321098765432109876543210987654321",classTime:Math.floor(Date.now()/1e3)+86400,selectedTimeIndex:0,selectedHandle:"@ashtanga_guru"},ethToFiatRate:2500,fiatCurrency:"USD"}};var j,N,S;d.parameters={...d.parameters,docs:{...(j=d.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    escrow: baseEscrow,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    blockExplorerUrl: 'https://sepolia.basescan.org'
  }
}`,...(S=(N=d.parameters)==null?void 0:N.docs)==null?void 0:S.source}}};var D,C,H;m.parameters={...m.parameters,docs:{...(D=m.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    escrow: {
      ...baseEscrow,
      id: 2,
      status: ClassStatus.Accepted,
      teacher: '0x0987654321098765432109876543210987654321',
      classTime: Math.floor(Date.now() / 1000) + 86400,
      // Tomorrow
      selectedTimeIndex: 0,
      selectedHandle: '@yoga_master_tbilisi'
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    blockExplorerUrl: 'https://sepolia.basescan.org'
  }
}`,...(H=(C=m.parameters)==null?void 0:C.docs)==null?void 0:H.source}}};var F,E,U;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    escrow: {
      ...baseEscrow,
      id: 3,
      status: ClassStatus.Delivered,
      teacher: '0x0987654321098765432109876543210987654321',
      classTime: Math.floor(Date.now() / 1000) - 3600,
      // 1 hour ago (class completed)
      selectedTimeIndex: 1,
      selectedHandle: '@zen_teacher_flow',
      description: 'Power Yoga Session with Meditation',
      amount: '0.0035'
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    blockExplorerUrl: 'https://sepolia.basescan.org'
  }
}`,...(U=(E=u.parameters)==null?void 0:E.docs)==null?void 0:U.source}}};var I,A,M;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    escrow: {
      ...baseEscrow,
      id: 4,
      status: ClassStatus.Cancelled,
      description: 'Yin Yoga and Breathwork Session',
      location: 'Botanical Garden Pavilion, Tbilisi'
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    transactionHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    blockExplorerUrl: 'https://sepolia.basescan.org'
  }
}`,...(M=(A=p.parameters)==null?void 0:A.docs)==null?void 0:M.source}}};var B,R,P;g.parameters={...g.parameters,docs:{...(B=g.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    escrow: {
      ...baseEscrow,
      status: ClassStatus.Accepted,
      teacher: '0x0987654321098765432109876543210987654321',
      classTime: Math.floor(Date.now() / 1000) + 86400,
      selectedTimeIndex: 2,
      selectedHandle: '@ashtanga_guru'
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(P=(R=g.parameters)==null?void 0:R.docs)==null?void 0:P.source}}};var q,$,Y;b.parameters={...b.parameters,docs:{...(q=b.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    escrow: {
      ...baseEscrow,
      status: ClassStatus.Accepted,
      teacher: '0x0987654321098765432109876543210987654321',
      classTime: Math.floor(Date.now() / 1000) + 86400,
      selectedTimeIndex: 0,
      selectedHandle: '@yoga_master_tbilisi'
    }
  }
}`,...(Y=($=b.parameters)==null?void 0:$.docs)==null?void 0:Y.source}}};var V,L,W;h.parameters={...h.parameters,docs:{...(V=h.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    escrow: {
      ...baseEscrow,
      status: ClassStatus.Delivered,
      teacher: '0x0987654321098765432109876543210987654321',
      classTime: Math.floor(Date.now() / 1000) - 3600,
      selectedTimeIndex: 0,
      selectedHandle: '@yoga_master_tbilisi',
      amount: '0.004'
    },
    ethToFiatRate: 2200,
    fiatCurrency: 'EUR',
    formatFiat: (amount: number, currency: string) => \`\${amount.toFixed(2)} \${currency}\`,
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    blockExplorerUrl: 'https://sepolia.basescan.org'
  }
}`,...(W=(L=h.parameters)==null?void 0:L.docs)==null?void 0:W.source}}};var z,O,G;_.parameters={..._.parameters,docs:{...(z=_.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    escrow: {
      ...baseEscrow,
      description: 'Advanced Ashtanga Yoga Session with Pranayama Breathing Techniques and Meditation Practice for Intermediate to Advanced Students',
      location: 'Mtatsminda Park Yoga Pavilion, Tbilisi (near the Ferris wheel, take the cable car up)',
      status: ClassStatus.Accepted,
      teacher: '0x0987654321098765432109876543210987654321',
      classTime: Math.floor(Date.now() / 1000) + 86400,
      selectedTimeIndex: 0,
      selectedHandle: '@ashtanga_guru'
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(G=(O=_.parameters)==null?void 0:O.docs)==null?void 0:G.source}}};const ne=["PendingBooking","AcceptedBooking","DeliveredBooking","CancelledBooking","WithoutTransactionInfo","WithoutFiatRate","CustomFiatFormat","LongDescription"];export{m as AcceptedBooking,p as CancelledBooking,h as CustomFiatFormat,u as DeliveredBooking,_ as LongDescription,d as PendingBooking,b as WithoutFiatRate,g as WithoutTransactionInfo,ne as __namedExportsOrder,ie as default};
