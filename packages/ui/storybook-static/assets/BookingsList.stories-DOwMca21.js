import{j as t}from"./jsx-runtime-CDt2p4po.js";import{r as d}from"./index-GiUgBvb1.js";import{B as ue,C as s}from"./BookingRequestCard-CYKcAmBL.js";function de(e,a){if(a==="all")return e;const r={pending:s.Pending,confirmed:s.Accepted,completed:s.Delivered,cancelled:s.Cancelled};return e.filter(o=>o.status===r[a])}function me(e,a){const r=[...e];switch(a){case"newest":return r.sort((o,i)=>i.createdAt-o.createdAt);case"class-date":return r.sort((o,i)=>!o.classTime&&!i.classTime?i.createdAt-o.createdAt:o.classTime?i.classTime?o.classTime-i.classTime:-1:1);case"amount":return r.sort((o,i)=>parseFloat(i.amount)-parseFloat(o.amount));default:return r}}function ge(e){const a={all:e.length,pending:0,confirmed:0,completed:0,cancelled:0};return e.forEach(r=>{switch(r.status){case s.Pending:a.pending++;break;case s.Accepted:a.confirmed++;break;case s.Delivered:a.completed++;break;case s.Cancelled:a.cancelled++;break}}),a}const Q=({bookings:e,onCancel:a,onReleasePayment:r,onCreateBooking:o,fiatCurrency:i="USD",ethToFiatRate:X,formatFiat:Z,className:ee,initialFilter:te="all",initialSort:ae="newest"})=>{const[T,se]=d.useState(te),[v,ne]=d.useState(ae),[m,re]=d.useState(""),w=d.useMemo(()=>{let n=de(e,T);if(m.trim()){const g=m.toLowerCase();n=n.filter(p=>{var x;return p.teacherHandles.some(ce=>ce.toLowerCase().includes(g))||p.location.toLowerCase().includes(g)||p.description.toLowerCase().includes(g)||((x=p.selectedHandle)==null?void 0:x.toLowerCase().includes(g))})}return me(n,v)},[e,T,v,m]),u=d.useMemo(()=>ge(e),[e]),oe=["bookings-list",ee].filter(Boolean).join(" "),ie=[{key:"all",label:"All",count:u.all},{key:"pending",label:"Pending",count:u.pending},{key:"confirmed",label:"Confirmed",count:u.confirmed},{key:"completed",label:"Completed",count:u.completed},{key:"cancelled",label:"Cancelled",count:u.cancelled}],le=[{key:"newest",label:"Newest first"},{key:"class-date",label:"Class date"},{key:"amount",label:"Amount"}];return t.jsxs("div",{className:oe,children:[t.jsxs("div",{className:"bookings-list__header",children:[t.jsx("h2",{className:"bookings-list__title",children:"Your Class Requests"}),t.jsxs("div",{className:"bookings-list__controls",children:[t.jsx("div",{className:"bookings-list__search",children:t.jsx("input",{type:"text",placeholder:"Search by teacher or location...",value:m,onChange:n=>re(n.target.value),className:"bookings-list__search-input"})}),t.jsxs("div",{className:"bookings-list__sort",children:[t.jsx("label",{htmlFor:"sort-select",className:"bookings-list__sort-label",children:"Sort by:"}),t.jsx("select",{id:"sort-select",value:v,onChange:n=>ne(n.target.value),className:"bookings-list__sort-select",children:le.map(n=>t.jsx("option",{value:n.key,children:n.label},n.key))})]})]})]}),t.jsx("div",{className:"bookings-list__filters",children:ie.map(n=>t.jsxs("button",{className:`bookings-list__filter ${T===n.key?"bookings-list__filter--active":""}`,onClick:()=>se(n.key),children:[n.label," (",n.count,")"]},n.key))}),t.jsx("div",{className:"bookings-list__content",children:w.length===0?t.jsx("div",{className:"bookings-list__empty",children:e.length===0?t.jsxs("div",{className:"bookings-list__empty-state",children:[t.jsx("h3",{className:"bookings-list__empty-title",children:"No bookings yet"}),t.jsx("p",{className:"bookings-list__empty-text",children:"Ready to book your first yoga class? Start by creating a booking request."}),o&&t.jsx("button",{className:"bookings-list__create-button",onClick:o,children:"Create Booking"})]}):t.jsxs("div",{className:"bookings-list__no-results",children:[t.jsx("h3",{className:"bookings-list__no-results-title",children:"No bookings found"}),t.jsx("p",{className:"bookings-list__no-results-text",children:"Try adjusting your filters or search terms."})]})}):t.jsx("div",{className:"bookings-list__grid",children:w.map(n=>t.jsx(ue,{escrow:n,onCancel:a,onReleasePayment:r,fiatCurrency:i,ethToFiatRate:X,formatFiat:Z},n.id))})})]})};Q.__docgenInfo={description:"",methods:[],displayName:"BookingsList",props:{bookings:{required:!0,tsType:{name:"Array",elements:[{name:"Escrow"}],raw:"Escrow[]"},description:""},onCancel:{required:!1,tsType:{name:"signature",type:"function",raw:"(escrowId: number) => void",signature:{arguments:[{type:{name:"number"},name:"escrowId"}],return:{name:"void"}}},description:""},onReleasePayment:{required:!1,tsType:{name:"signature",type:"function",raw:"(escrowId: number) => void",signature:{arguments:[{type:{name:"number"},name:"escrowId"}],return:{name:"void"}}},description:""},onCreateBooking:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},fiatCurrency:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'USD'",computed:!1}},ethToFiatRate:{required:!1,tsType:{name:"number"},description:""},formatFiat:{required:!1,tsType:{name:"signature",type:"function",raw:"(fiatAmount: number, currency: string) => string",signature:{arguments:[{type:{name:"number"},name:"fiatAmount"},{type:{name:"string"},name:"currency"}],return:{name:"string"}}},description:""},className:{required:!1,tsType:{name:"string"},description:""},initialFilter:{required:!1,tsType:{name:"union",raw:"'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'",elements:[{name:"literal",value:"'all'"},{name:"literal",value:"'pending'"},{name:"literal",value:"'confirmed'"},{name:"literal",value:"'completed'"},{name:"literal",value:"'cancelled'"}]},description:"",defaultValue:{value:"'all'",computed:!1}},initialSort:{required:!1,tsType:{name:"union",raw:"'newest' | 'class-date' | 'amount'",elements:[{name:"literal",value:"'newest'"},{name:"literal",value:"'class-date'"},{name:"literal",value:"'amount'"}]},description:"",defaultValue:{value:"'newest'",computed:!1}}}};const ke={title:"Components/BookingsList",component:Q,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{onCancel:{action:"cancel"},onReleasePayment:{action:"release-payment"},onViewDetails:{action:"view-details"},onCreateBooking:{action:"create-booking"}}};function l(e,a={}){const r=Math.floor(Date.now()/1e3);return{id:e,student:"0x1234567890123456789012345678901234567890",amount:"0.002",status:s.Pending,createdAt:r-e*3600,description:"Private yoga class booking",location:"Vake Park, Tbilisi",studentEmail:"student@example.com",teacherHandles:["@yoga_master","@zen_teacher","@flow_guru"],timeSlots:[r+86400+e*3600,r+172800+e*3600,r+259200+e*3600],...a}}const c=[l(1,{status:s.Pending,description:"Vinyasa Flow Session",location:"Vake Park, Tbilisi"}),l(2,{status:s.Accepted,description:"Hatha Yoga Class",location:"Rustaveli Avenue Studio",teacher:"0x0987654321098765432109876543210987654321",classTime:Math.floor(Date.now()/1e3)+86400,selectedTimeIndex:0,selectedHandle:"@yoga_master"}),l(3,{status:s.Delivered,description:"Power Yoga Session",location:"Saburtalo Fitness Center",teacher:"0x0987654321098765432109876543210987654321",classTime:Math.floor(Date.now()/1e3)-3600,selectedTimeIndex:1,selectedHandle:"@zen_teacher",amount:"0.0035"}),l(4,{status:s.Cancelled,description:"Yin Yoga Class",location:"Old Tbilisi Courtyard"}),l(5,{status:s.Pending,description:"Ashtanga Practice",location:"Mtatsminda Park",amount:"0.003"}),l(6,{status:s.Accepted,description:"Restorative Yoga",location:"Vere Valley",teacher:"0x1111111111111111111111111111111111111111",classTime:Math.floor(Date.now()/1e3)+172800,selectedTimeIndex:2,selectedHandle:"@flow_guru",amount:"0.0025"})],y={args:{bookings:c,ethToFiatRate:2500,fiatCurrency:"USD"}},f={args:{bookings:[],ethToFiatRate:2500,fiatCurrency:"USD"}},k={args:{bookings:c.filter(e=>e.status===s.Pending),ethToFiatRate:2500,fiatCurrency:"USD",initialFilter:"pending"}},h={args:{bookings:c.filter(e=>e.status===s.Accepted),ethToFiatRate:2500,fiatCurrency:"USD",initialFilter:"confirmed"}},b={args:{bookings:c,ethToFiatRate:2500,fiatCurrency:"USD",initialSort:"amount"}},C={args:{bookings:c.slice(0,3)}},S={args:{bookings:[...c,...Array.from({length:10},(e,a)=>l(a+10,{status:[s.Pending,s.Accepted,s.Delivered,s.Cancelled][a%4],description:`Yoga Class ${a+10}`,location:["Vake Park","Rustaveli Studio","Saburtalo Center","Old Town"][a%4],amount:(Math.random()*.01+.001).toFixed(4)}))],ethToFiatRate:2500,fiatCurrency:"USD"}},_={args:{bookings:c.slice(0,4),ethToFiatRate:2200,fiatCurrency:"EUR",formatFiat:(e,a)=>`${e.toFixed(2)} ${a}`}};var F,R,j;y.parameters={...y.parameters,docs:{...(F=y.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    bookings: mockBookings,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(j=(R=y.parameters)==null?void 0:R.docs)==null?void 0:j.source}}};var D,N,A;f.parameters={...f.parameters,docs:{...(D=f.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    bookings: [],
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(A=(N=f.parameters)==null?void 0:N.docs)==null?void 0:A.source}}};var P,B,U;k.parameters={...k.parameters,docs:{...(P=k.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    bookings: mockBookings.filter(b => b.status === ClassStatus.Pending),
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    initialFilter: 'pending'
  }
}`,...(U=(B=k.parameters)==null?void 0:B.docs)==null?void 0:U.source}}};var M,q,E;h.parameters={...h.parameters,docs:{...(M=h.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    bookings: mockBookings.filter(b => b.status === ClassStatus.Accepted),
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    initialFilter: 'confirmed'
  }
}`,...(E=(q=h.parameters)==null?void 0:q.docs)==null?void 0:E.source}}};var V,L,I;b.parameters={...b.parameters,docs:{...(V=b.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    bookings: mockBookings,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    initialSort: 'amount'
  }
}`,...(I=(L=b.parameters)==null?void 0:L.docs)==null?void 0:I.source}}};var Y,H,$;C.parameters={...C.parameters,docs:{...(Y=C.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    bookings: mockBookings.slice(0, 3)
  }
}`,...($=(H=C.parameters)==null?void 0:H.docs)==null?void 0:$.source}}};var O,z,W;S.parameters={...S.parameters,docs:{...(O=S.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    bookings: [...mockBookings, ...Array.from({
      length: 10
    }, (_, i) => createMockEscrow(i + 10, {
      status: [ClassStatus.Pending, ClassStatus.Accepted, ClassStatus.Delivered, ClassStatus.Cancelled][i % 4],
      description: \`Yoga Class \${i + 10}\`,
      location: ['Vake Park', 'Rustaveli Studio', 'Saburtalo Center', 'Old Town'][i % 4],
      amount: (Math.random() * 0.01 + 0.001).toFixed(4)
    }))],
    ethToFiatRate: 2500,
    fiatCurrency: 'USD'
  }
}`,...(W=(z=S.parameters)==null?void 0:z.docs)==null?void 0:W.source}}};var G,J,K;_.parameters={..._.parameters,docs:{...(G=_.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    bookings: mockBookings.slice(0, 4),
    ethToFiatRate: 2200,
    fiatCurrency: 'EUR',
    formatFiat: (amount: number, currency: string) => \`\${amount.toFixed(2)} \${currency}\`
  }
}`,...(K=(J=_.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};const he=["Default","EmptyState","OnlyPending","OnlyConfirmed","SortByAmount","WithoutFiatRate","ManyBookings","CustomFiatFormat"];export{_ as CustomFiatFormat,y as Default,f as EmptyState,S as ManyBookings,h as OnlyConfirmed,k as OnlyPending,b as SortByAmount,C as WithoutFiatRate,he as __namedExportsOrder,ke as default};
