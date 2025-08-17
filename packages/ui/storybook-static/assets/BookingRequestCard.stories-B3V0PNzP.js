import{B as I,C as d}from"./BookingRequestCard-CYKcAmBL.js";import"./jsx-runtime-CDt2p4po.js";import"./index-GiUgBvb1.js";const L={title:"Components/BookingRequestCard",component:I,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{onCancel:{action:"cancel"},onReleasePayment:{action:"release-payment"},onViewDetails:{action:"view-details"}}},e={id:1,student:"0x1234567890123456789012345678901234567890",amount:"0.002",status:d.Pending,createdAt:Math.floor(Date.now()/1e3)-3600,description:"Private yoga class booking",location:"Vake Park, Tbilisi",studentEmail:"student@example.com",teacherHandles:["@yoga_master","@zen_teacher","@flow_guru"],timeSlots:[Math.floor(Date.now()/1e3)+86400,Math.floor(Date.now()/1e3)+172800,Math.floor(Date.now()/1e3)+259200]},a={args:{escrow:e,ethToFiatRate:2500,fiatCurrency:"USD"}},t={args:{escrow:{...e,id:2,status:d.Accepted,teacher:"0x0987654321098765432109876543210987654321",classTime:Math.floor(Date.now()/1e3)+86400,selectedTimeIndex:0,selectedHandle:"@yoga_master"},ethToFiatRate:2500,fiatCurrency:"USD"}},r={args:{escrow:{...e,id:3,status:d.Delivered,teacher:"0x0987654321098765432109876543210987654321",classTime:Math.floor(Date.now()/1e3)-3600,selectedTimeIndex:0,selectedHandle:"@yoga_master"},ethToFiatRate:2500,fiatCurrency:"USD"}},s={args:{escrow:{...e,id:4,status:d.Cancelled},ethToFiatRate:2500,fiatCurrency:"USD"}},o={args:{escrow:e}},n={args:{escrow:e,ethToFiatRate:2500,fiatCurrency:"EUR",formatFiat:(P,k)=>`${P.toFixed(2)} ${k}`}},c={args:{escrow:{...e,teacherHandles:["@very_long_teacher_handle_name","@another_extremely_long_handle","@short"]},ethToFiatRate:2500,fiatCurrency:"USD"}},i={args:{escrow:{...e,amount:"0.25"},ethToFiatRate:2500,fiatCurrency:"USD"}};var l,m,u;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    escrow: baseEscrow,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(u=(m=a.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var g,p,h;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    escrow: {
      ...baseEscrow,
      id: 2,
      status: ClassStatus.Accepted,
      teacher: '0x0987654321098765432109876543210987654321',
      classTime: Math.floor(Date.now() / 1000) + 86400,
      // Tomorrow
      selectedTimeIndex: 0,
      selectedHandle: '@yoga_master'
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(h=(p=t.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};var w,y,C;r.parameters={...r.parameters,docs:{...(w=r.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    escrow: {
      ...baseEscrow,
      id: 3,
      status: ClassStatus.Delivered,
      teacher: '0x0987654321098765432109876543210987654321',
      classTime: Math.floor(Date.now() / 1000) - 3600,
      // 1 hour ago
      selectedTimeIndex: 0,
      selectedHandle: '@yoga_master'
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(C=(y=r.parameters)==null?void 0:y.docs)==null?void 0:C.source}}};var f,T,D;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    escrow: {
      ...baseEscrow,
      id: 4,
      status: ClassStatus.Cancelled
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(D=(T=s.parameters)==null?void 0:T.docs)==null?void 0:D.source}}};var S,F,_;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    escrow: baseEscrow
  }
}`,...(_=(F=o.parameters)==null?void 0:F.docs)==null?void 0:_.source}}};var R,x,U;n.parameters={...n.parameters,docs:{...(R=n.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    escrow: baseEscrow,
    ethToFiatRate: 2500,
    fiatCurrency: 'EUR',
    formatFiat: (amount: number, currency: string) => \`\${amount.toFixed(2)} \${currency}\`
  }
}`,...(U=(x=n.parameters)==null?void 0:x.docs)==null?void 0:U.source}}};var E,b,H;c.parameters={...c.parameters,docs:{...(E=c.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    escrow: {
      ...baseEscrow,
      teacherHandles: ['@very_long_teacher_handle_name', '@another_extremely_long_handle', '@short']
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(H=(b=c.parameters)==null?void 0:b.docs)==null?void 0:H.source}}};var v,M,A;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    escrow: {
      ...baseEscrow,
      amount: '0.25'
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(A=(M=i.parameters)==null?void 0:M.docs)==null?void 0:A.source}}};const V=["Pending","Accepted","Delivered","Cancelled","WithoutFiatRate","CustomFiatFormat","LongTeacherHandles","HighAmount"];export{t as Accepted,s as Cancelled,n as CustomFiatFormat,r as Delivered,i as HighAmount,c as LongTeacherHandles,a as Pending,o as WithoutFiatRate,V as __namedExportsOrder,L as default};
