import{j as e}from"./jsx-runtime-CDt2p4po.js";import"./index-GiUgBvb1.js";function V(a){const t=new Date(a*1e3);return t.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})+" at "+t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0})}function f(a){const t=Date.now(),c=a*1e3,o=t-c,r=Math.floor(o/(1e3*60*60)),n=Math.floor(r/24);return n>0?`${n} day${n>1?"s":""} ago`:`${r} hour${r>1?"s":""} ago`}const E=({classRequest:a,onAccept:t,onIgnore:c,fiatCurrency:o="USD",ethToFiatRate:r,formatFiat:n,className:k})=>{const I=["teacher-class-card",k].filter(Boolean).join(" "),i=r?parseFloat(a.totalAmount)*r:null,_=i&&n?n(i,o):i?new Intl.NumberFormat(void 0,{style:"currency",currency:o}).format(i):null;return e.jsxs("div",{className:I,children:[e.jsxs("div",{className:"teacher-class-card__header",children:[e.jsx("h3",{className:"teacher-class-card__title",children:a.description}),e.jsxs("div",{className:"teacher-class-card__header-right",children:[a.status==="accepted"&&e.jsx("span",{className:"teacher-class-card__status",children:"Accepted"}),e.jsx("span",{className:"teacher-class-card__elapsed",children:a.status==="accepted"&&a.acceptedAt?`Accepted ${f(a.acceptedAt)}`:f(a.createdAt)})]})]}),e.jsxs("div",{className:"teacher-class-card__details",children:[e.jsxs("div",{className:"teacher-class-card__detail-row",children:[e.jsxs("div",{className:"teacher-class-card__detail-item",children:[e.jsx("span",{className:"teacher-class-card__detail-label",children:"People:"}),e.jsx("span",{className:"teacher-class-card__detail-value",children:a.studentCount})]}),e.jsxs("div",{className:"teacher-class-card__detail-item",children:[e.jsx("span",{className:"teacher-class-card__detail-label",children:"Amount:"}),e.jsxs("div",{className:"teacher-class-card__amount",children:[e.jsxs("span",{className:"teacher-class-card__amount-eth",children:[a.totalAmount," ETH"]}),_&&e.jsxs("span",{className:"teacher-class-card__amount-fiat",children:["(",_,")"]})]})]})]}),e.jsxs("div",{className:"teacher-class-card__location",children:[e.jsx("span",{className:"teacher-class-card__detail-label",children:"Location:"}),e.jsx("span",{className:"teacher-class-card__detail-value",children:a.location})]}),e.jsxs("div",{className:"teacher-class-card__time",children:[e.jsx("span",{className:"teacher-class-card__detail-label",children:"Time:"}),e.jsx("span",{className:"teacher-class-card__detail-value",children:V(a.time)})]})]}),a.status==="pending"&&e.jsxs("div",{className:"teacher-class-card__actions",children:[e.jsx("button",{className:"teacher-class-card__action teacher-class-card__action--accept",onClick:()=>t==null?void 0:t(a.id),children:"Accept"}),e.jsx("button",{className:"teacher-class-card__action teacher-class-card__action--ignore",onClick:()=>c==null?void 0:c(a.id),children:"Ignore"})]})]})};E.__docgenInfo={description:"",methods:[],displayName:"TeacherClassCard",props:{classRequest:{required:!0,tsType:{name:"TeacherClassRequest"},description:""},onAccept:{required:!1,tsType:{name:"signature",type:"function",raw:"(classId: number) => void",signature:{arguments:[{type:{name:"number"},name:"classId"}],return:{name:"void"}}},description:""},onIgnore:{required:!1,tsType:{name:"signature",type:"function",raw:"(classId: number) => void",signature:{arguments:[{type:{name:"number"},name:"classId"}],return:{name:"void"}}},description:""},fiatCurrency:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'USD'",computed:!1}},ethToFiatRate:{required:!1,tsType:{name:"number"},description:""},formatFiat:{required:!1,tsType:{name:"signature",type:"function",raw:"(fiatAmount: number, currency: string) => string",signature:{arguments:[{type:{name:"number"},name:"fiatAmount"},{type:{name:"string"},name:"currency"}],return:{name:"string"}}},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const L={title:"Teacher/TeacherClassCard",component:E,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{onAccept:{action:"accept"},onIgnore:{action:"ignore"}}},s={id:1,teacherHandle:"@yoga_master",studentCount:1,totalAmount:"0.002",location:"Vake Park, Tbilisi",time:Math.floor(Date.now()/1e3)+86400,description:"Private Vinyasa Flow Session",createdAt:Math.floor(Date.now()/1e3)-3600,status:"pending"},d={args:{classRequest:s,ethToFiatRate:2500,fiatCurrency:"USD"}},l={args:{classRequest:{...s,id:2,studentCount:3,totalAmount:"0.006",description:"Group Hatha Yoga Class",location:"Rustaveli Avenue Studio"},ethToFiatRate:2500,fiatCurrency:"USD"}},u={args:{classRequest:{...s,id:3,studentCount:5,totalAmount:"0.015",description:"Private Group Power Yoga",location:"Saburtalo Fitness Center"},ethToFiatRate:2500,fiatCurrency:"USD"}},m={args:{classRequest:{...s,id:4,createdAt:Math.floor(Date.now()/1e3)-600,description:"Beginner Yoga Session",location:"Old Tbilisi Courtyard"},ethToFiatRate:2500,fiatCurrency:"USD"}},p={args:{classRequest:s}},h={args:{classRequest:{...s,id:5,status:"accepted",acceptedAt:Math.floor(Date.now()/1e3)-1800,description:"Hatha Yoga Session",studentCount:2,totalAmount:"0.004"},ethToFiatRate:2500,fiatCurrency:"USD"}},g={args:{classRequest:{...s,totalAmount:"0.004"},ethToFiatRate:2200,fiatCurrency:"EUR",formatFiat:(a,t)=>`${a.toFixed(2)} ${t}`}};var y,C,S;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    classRequest: baseRequest,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(S=(C=d.parameters)==null?void 0:C.docs)==null?void 0:S.source}}};var R,T,x;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    classRequest: {
      ...baseRequest,
      id: 2,
      studentCount: 3,
      totalAmount: '0.006',
      description: 'Group Hatha Yoga Class',
      location: 'Rustaveli Avenue Studio'
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(x=(T=l.parameters)==null?void 0:T.docs)==null?void 0:x.source}}};var F,b,j;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    classRequest: {
      ...baseRequest,
      id: 3,
      studentCount: 5,
      totalAmount: '0.015',
      description: 'Private Group Power Yoga',
      location: 'Saburtalo Fitness Center'
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(j=(b=u.parameters)==null?void 0:b.docs)==null?void 0:j.source}}};var A,N,v;m.parameters={...m.parameters,docs:{...(A=m.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    classRequest: {
      ...baseRequest,
      id: 4,
      createdAt: Math.floor(Date.now() / 1000) - 600,
      // 10 minutes ago
      description: 'Beginner Yoga Session',
      location: 'Old Tbilisi Courtyard'
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(v=(N=m.parameters)==null?void 0:N.docs)==null?void 0:v.source}}};var D,q,w;p.parameters={...p.parameters,docs:{...(D=p.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    classRequest: baseRequest
  }
}`,...(w=(q=p.parameters)==null?void 0:q.docs)==null?void 0:w.source}}};var U,M,H;h.parameters={...h.parameters,docs:{...(U=h.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    classRequest: {
      ...baseRequest,
      id: 5,
      status: 'accepted' as const,
      acceptedAt: Math.floor(Date.now() / 1000) - 1800,
      // 30 minutes ago
      description: 'Hatha Yoga Session',
      studentCount: 2,
      totalAmount: '0.004'
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(H=(M=h.parameters)==null?void 0:M.docs)==null?void 0:H.source}}};var $,Y,P;g.parameters={...g.parameters,docs:{...($=g.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    classRequest: {
      ...baseRequest,
      totalAmount: '0.004'
    },
    ethToFiatRate: 2200,
    fiatCurrency: 'EUR',
    formatFiat: (amount: number, currency: string) => \`\${amount.toFixed(2)} \${currency}\`
  }
}`,...(P=(Y=g.parameters)==null?void 0:Y.docs)==null?void 0:P.source}}};const O=["SingleStudent","MultipleStudents","HighValue","RecentRequest","WithoutFiatRate","AcceptedClass","CustomFiatFormat"];export{h as AcceptedClass,g as CustomFiatFormat,u as HighValue,l as MultipleStudents,m as RecentRequest,d as SingleStudent,p as WithoutFiatRate,O as __namedExportsOrder,L as default};
