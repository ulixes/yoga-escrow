import{U as $}from"./UpcomingClassCard-BAvGDZ7L.js";import"./jsx-runtime-CDt2p4po.js";import"./index-GiUgBvb1.js";const L={title:"Teacher/UpcomingClassCard",component:$,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{onViewDetails:{action:"viewDetails"},onCancel:{action:"cancel"},onViewStudentDetails:{action:"viewStudentDetails"}}},u={escrowId:0,studentAddress:"0x742d35Cc6344C4532BDAA8A4C30fF0AB5c234567",classTime:Math.floor(Date.now()/1e3)+86400,location:"Vake Park, Tbilisi",description:"Private Vinyasa Flow Session",payout:"0.002232",acceptedAt:Math.floor(Date.now()/1e3)-3600,status:"accepted"},Y=[{escrowId:0,studentAddress:"0x742d35Cc6344C4532BDAA8A4C30fF0AB5c234567",payout:"0.002232",status:"accepted"},{escrowId:1,studentAddress:"0x8b3f21CC9c6F4B7A5D2E3F1A8C9D0E1F2A3B4C5D",payout:"0.002227",status:"accepted"}],O=[{escrowId:5,studentAddress:"0x742d35Cc6344C4532BDAA8A4C30fF0AB5c234567",payout:"0.003",status:"completed"},{escrowId:6,studentAddress:"0x8b3f21CC9c6F4B7A5D2E3F1A8C9D0E1F2A3B4C5D",payout:"0.003",status:"cancelled"},{escrowId:7,studentAddress:"0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",payout:"0.003",status:"awaiting_release"}],e={escrowId:0,studentAddress:"0x742d35Cc6344C4532BDAA8A4C30fF0AB5c234567",classTime:Math.floor(Date.now()/1e3)+86400,location:"Saburtalo Fitness Center",description:"Group Vinyasa Flow",payout:"0.002232",acceptedAt:Math.floor(Date.now()/1e3)-3600,status:"accepted",isGroup:!0,students:Y,totalStudents:2,totalPayout:"0.004459"},t={args:{acceptedClass:u,ethToFiatRate:2500,fiatCurrency:"USD"}},a={args:{acceptedClass:e,ethToFiatRate:2500,fiatCurrency:"USD"}},s={args:{acceptedClass:{...e,escrowId:5,description:"Group Power Yoga",location:"Central Park",students:O,totalStudents:3,totalPayout:"0.009"},ethToFiatRate:2500,fiatCurrency:"USD"}},o={args:{acceptedClass:{...e,escrowId:10,description:"Group Hatha Yoga",location:"Rustaveli Avenue Studio",students:[...Y,{escrowId:2,studentAddress:"0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",payout:"0.002",status:"accepted"},{escrowId:3,studentAddress:"0x9f8e7d6c5b4a3928716051423364758c9d0e1f2a",payout:"0.002",status:"accepted"},{escrowId:4,studentAddress:"0x5c4b3a2918273645192837465102948576839201",payout:"0.002",status:"accepted"}],totalStudents:5,totalPayout:"0.012459"},ethToFiatRate:2500,fiatCurrency:"USD"}},n={args:{acceptedClass:{...u,escrowId:10,classTime:Math.floor(Date.now()/1e3)-3600,description:"Overdue Hatha Yoga Session",status:"accepted"},ethToFiatRate:2500,fiatCurrency:"USD"}},r={args:{acceptedClass:{...u,escrowId:15,classTime:Math.floor(Date.now()/1e3)-86400,description:"Completed Power Yoga Session",status:"completed"},ethToFiatRate:2500,fiatCurrency:"USD"}},c={args:{acceptedClass:e}},d={args:{acceptedClass:{...e,totalPayout:"0.008"},ethToFiatRate:2200,fiatCurrency:"EUR",formatFiat:(H,W)=>`${H.toFixed(2)} ${W}`}},i={parameters:{docs:{description:{story:`
This story demonstrates the group class UI pattern:

**Collapsed View (Default):**
- Shows aggregated information: "3 Students", "Total Payout: 1.5 ETH"
- Clean, single-card view for group sessions
- "View Roster ▼" button to expand details

**Expanded View (Click "View Roster"):**
- Shows individual student roster
- Each student's escrow ID, payout, and status
- Handles mixed statuses: Accepted, Paid, Cancelled, Awaiting Release
- Click individual escrow IDs for student-specific actions

**Key Features:**
- Single card represents entire group session
- Expandable roster for detailed management
- Individual escrow status tracking
- Clean aggregation of financial data
- Maintains individual escrow independence

**Data Structure:**
\`\`\`javascript
const groupClass = {
  isGroup: true,
  students: [
    { escrowId: 0, studentAddress: "0x742d35...", payout: "0.002232", status: "accepted" },
    { escrowId: 1, studentAddress: "0x8b3f21...", payout: "0.002227", status: "accepted" }
  ],
  totalStudents: 2,
  totalPayout: "0.004459"
}
\`\`\`
        `}}},args:{acceptedClass:e,ethToFiatRate:2500,fiatCurrency:"USD"}};var p,l,C;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    acceptedClass: baseSingleClass,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(C=(l=t.parameters)==null?void 0:l.docs)==null?void 0:C.source}}};var g,m,w;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    acceptedClass: groupClass,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(w=(m=a.parameters)==null?void 0:m.docs)==null?void 0:w.source}}};var S,f,y;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    acceptedClass: {
      ...groupClass,
      escrowId: 5,
      description: 'Group Power Yoga',
      location: 'Central Park',
      students: mixedStatusStudents,
      totalStudents: 3,
      totalPayout: '0.009'
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(y=(f=s.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var D,A,h;o.parameters={...o.parameters,docs:{...(D=o.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    acceptedClass: {
      ...groupClass,
      escrowId: 10,
      description: 'Group Hatha Yoga',
      location: 'Rustaveli Avenue Studio',
      students: [...groupStudents, {
        escrowId: 2,
        studentAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
        payout: '0.002',
        status: 'accepted' as const
      }, {
        escrowId: 3,
        studentAddress: '0x9f8e7d6c5b4a3928716051423364758c9d0e1f2a',
        payout: '0.002',
        status: 'accepted' as const
      }, {
        escrowId: 4,
        studentAddress: '0x5c4b3a2918273645192837465102948576839201',
        payout: '0.002',
        status: 'accepted' as const
      }],
      totalStudents: 5,
      totalPayout: '0.012459'
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(h=(A=o.parameters)==null?void 0:A.docs)==null?void 0:h.source}}};var F,I,x;n.parameters={...n.parameters,docs:{...(F=n.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    acceptedClass: {
      ...baseSingleClass,
      escrowId: 10,
      classTime: Math.floor(Date.now() / 1000) - 3600,
      // 1 hour ago
      description: 'Overdue Hatha Yoga Session',
      status: 'accepted'
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(x=(I=n.parameters)==null?void 0:I.docs)==null?void 0:x.source}}};var b,T,R;r.parameters={...r.parameters,docs:{...(b=r.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    acceptedClass: {
      ...baseSingleClass,
      escrowId: 15,
      classTime: Math.floor(Date.now() / 1000) - 86400,
      // Yesterday
      description: 'Completed Power Yoga Session',
      status: 'completed'
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(R=(T=r.parameters)==null?void 0:T.docs)==null?void 0:R.source}}};var P,U,v;c.parameters={...c.parameters,docs:{...(P=c.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    acceptedClass: groupClass
  }
}`,...(v=(U=c.parameters)==null?void 0:U.docs)==null?void 0:v.source}}};var G,E,V;d.parameters={...d.parameters,docs:{...(G=d.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    acceptedClass: {
      ...groupClass,
      totalPayout: '0.008'
    },
    ethToFiatRate: 2200,
    fiatCurrency: 'EUR',
    formatFiat: (amount: number, currency: string) => \`\${amount.toFixed(2)} \${currency}\`
  }
}`,...(V=(E=d.parameters)==null?void 0:E.docs)==null?void 0:V.source}}};var B,M,k;i.parameters={...i.parameters,docs:{...(B=i.parameters)==null?void 0:B.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
This story demonstrates the group class UI pattern:

**Collapsed View (Default):**
- Shows aggregated information: "3 Students", "Total Payout: 1.5 ETH"
- Clean, single-card view for group sessions
- "View Roster ▼" button to expand details

**Expanded View (Click "View Roster"):**
- Shows individual student roster
- Each student's escrow ID, payout, and status
- Handles mixed statuses: Accepted, Paid, Cancelled, Awaiting Release
- Click individual escrow IDs for student-specific actions

**Key Features:**
- Single card represents entire group session
- Expandable roster for detailed management
- Individual escrow status tracking
- Clean aggregation of financial data
- Maintains individual escrow independence

**Data Structure:**
\\\`\\\`\\\`javascript
const groupClass = {
  isGroup: true,
  students: [
    { escrowId: 0, studentAddress: "0x742d35...", payout: "0.002232", status: "accepted" },
    { escrowId: 1, studentAddress: "0x8b3f21...", payout: "0.002227", status: "accepted" }
  ],
  totalStudents: 2,
  totalPayout: "0.004459"
}
\\\`\\\`\\\`
        \`
      }
    }
  },
  args: {
    acceptedClass: groupClass,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(k=(M=i.parameters)==null?void 0:M.docs)==null?void 0:k.source}}};const q=["SingleStudent","GroupClassCollapsed","GroupClassWithMixedStatus","LargeGroupClass","PastDueClass","CompletedClass","WithoutFiatRate","CustomFiatFormat","GroupClassUIDemo"];export{r as CompletedClass,d as CustomFiatFormat,a as GroupClassCollapsed,i as GroupClassUIDemo,s as GroupClassWithMixedStatus,o as LargeGroupClass,n as PastDueClass,t as SingleStudent,c as WithoutFiatRate,q as __namedExportsOrder,L as default};
