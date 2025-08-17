import{j as t}from"./jsx-runtime-CDt2p4po.js";import{U as e}from"./UpcomingClassCard-D_TB6QS8.js";import"./index-GiUgBvb1.js";const i=[{escrowId:0,studentAddress:"0x3bF4d7E8A9B2C1D3E4F5A6B7C8D9E0F1A2B3C4D5",payout:"0.002232",status:"accepted"},{escrowId:1,studentAddress:"0x9595e8f7d6c5b4a3928716051423364758c9d0e1",payout:"0.002227",status:"accepted"}],c={escrowId:0,studentAddress:"0x3bF4d7E8A9B2C1D3E4F5A6B7C8D9E0F1A2B3C4D5",classTime:Math.floor(Date.now()/1e3)+86400,location:"Vake Park, Tbilisi",description:"Group yoga class booking",payout:"0.002232",acceptedAt:Math.floor(Date.now()/1e3)-3600,status:"accepted",isGroup:!0,students:i,totalStudents:2,totalPayout:"0.004459"},u={escrowId:0,studentAddress:"2 students",classTime:Math.floor(Date.now()/1e3)+86400,location:"Vake Park, Tbilisi",description:"Group yoga class booking",payout:"0.004459",acceptedAt:Math.floor(Date.now()/1e3)-3600,status:"accepted"},d=()=>t.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px",padding:"20px"},children:[t.jsxs("div",{children:[t.jsx("h3",{children:"✅ CORRECT: Group Class with Full Data Structure"}),t.jsx("p",{children:"This will show:"}),t.jsxs("ul",{children:[t.jsx("li",{children:"Students: 2 Students"}),t.jsx("li",{children:"Total Payout: 0.004459 ETH (sum of both students)"}),t.jsx("li",{children:'"View Roster ▼" button'}),t.jsx("li",{children:"Expandable roster with individual student details"})]}),t.jsx(e,{acceptedClass:c,ethToFiatRate:2500,fiatCurrency:"USD",onViewStudentDetails:n=>console.log("View student details:",n)})]}),t.jsxs("div",{children:[t.jsx("h3",{children:"❌ WRONG: Missing Group Data (displays as single student)"}),t.jsx("p",{children:"This will incorrectly show:"}),t.jsxs("ul",{children:[t.jsx("li",{children:"Student: 2 stud...ents (truncated as address)"}),t.jsx("li",{children:"Payout: 0.004459 ETH (individual, not marked as total)"}),t.jsx("li",{children:"Escrow ID: #0"}),t.jsx("li",{children:'No "View Roster" button'})]}),t.jsx(e,{acceptedClass:u,ethToFiatRate:2500,fiatCurrency:"USD"})]}),t.jsxs("div",{style:{padding:"20px",background:"#f0f0f0",borderRadius:"8px"},children:[t.jsx("h4",{children:"🔧 How to Fix Your Data Transformation:"}),t.jsx("pre",{style:{background:"#fff",padding:"10px",borderRadius:"4px",overflow:"auto"},children:`// ✅ CORRECT transformation from multiple escrows to group class:
const transformToGroupClass = (escrows: AcceptedClass[]): AcceptedClass => {
  const totalPayout = escrows.reduce((sum, escrow) => 
    sum + parseFloat(escrow.payout), 0
  ).toString()
  
  const students: ClassStudent[] = escrows.map(escrow => ({
    escrowId: escrow.escrowId,
    studentAddress: escrow.studentAddress,
    payout: escrow.payout,
    status: escrow.status
  }))
  
  return {
    ...escrows[0], // Use first escrow as base
    isGroup: true, // 🎯 REQUIRED
    students: students, // 🎯 REQUIRED
    totalStudents: escrows.length, // 🎯 REQUIRED
    totalPayout: totalPayout, // 🎯 REQUIRED
    description: \`Group yoga class booking (\${escrows.length} students)\`
  }
}`})]})]});d.__docgenInfo={description:"",methods:[],displayName:"GroupClassDataExample"};const w={title:"Teacher/GroupClassDataExample",component:d,parameters:{layout:"fullscreen",docs:{description:{component:`
# 🚨 GROUP CLASS DATA STRUCTURE GUIDE

This component demonstrates the **EXACT** data structure needed to fix group class display issues.

## ❌ Current Issue

The frontend developer is seeing:
- \`Student: 2 stud...ents\` (wrong)
- \`Payout: 0.002232 ETH\` (individual amount, not total)
- No "View Roster" button
- No expandable roster functionality

## ✅ Solution

Use this **exact** data structure for group classes:

\`\`\`typescript
const groupClass: AcceptedClass = {
  // Standard fields
  escrowId: 0,
  studentAddress: '0x...',
  classTime: 1234567890,
  location: 'Vake Park, Tbilisi',
  description: 'Group yoga class booking',
  payout: '0.002232',
  acceptedAt: 1234567890,
  status: 'accepted',
  
  // 🎯 REQUIRED GROUP FIELDS
  isGroup: true,                    // Must be true
  students: [                       // Must contain ClassStudent[]
    { escrowId: 0, studentAddress: '0x...', payout: '0.002232', status: 'accepted' },
    { escrowId: 1, studentAddress: '0x...', payout: '0.002227', status: 'accepted' }
  ],
  totalStudents: 2,                 // Total count
  totalPayout: '0.004459',          // Sum of all payouts
}
\`\`\`

## 🎯 Expected Results

With correct data structure, you'll see:
- **Students: 2 Students** (not truncated address)
- **Total Payout: 0.004459 ETH** (combined amount)
- **View Roster ▼** (expandable button)
- **Individual student management** in roster

The UI package already supports everything - it's just a data structure issue!
        `}}},tags:["autodocs"]},s={parameters:{docs:{description:{story:`
This story shows the difference between correct and incorrect data structures for group classes.

**Top card (✅ Correct):** Shows proper group display with total payout and roster functionality.

**Bottom card (❌ Wrong):** Shows how it looks when group data is missing - falls back to single student display.

Copy the data structure from the top example to fix the group class display issues.
        `}}}};var o,a,r;s.parameters={...s.parameters,docs:{...(o=s.parameters)==null?void 0:o.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
This story shows the difference between correct and incorrect data structures for group classes.

**Top card (✅ Correct):** Shows proper group display with total payout and roster functionality.

**Bottom card (❌ Wrong):** Shows how it looks when group data is missing - falls back to single student display.

Copy the data structure from the top example to fix the group class display issues.
        \`
      }
    }
  }
}`,...(r=(a=s.parameters)==null?void 0:a.docs)==null?void 0:r.source}}};const y=["SideBySideComparison"];export{s as SideBySideComparison,y as __namedExportsOrder,w as default};
