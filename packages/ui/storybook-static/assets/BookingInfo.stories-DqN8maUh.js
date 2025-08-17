import{j as e}from"./jsx-runtime-CDt2p4po.js";import{R as I}from"./index-GiUgBvb1.js";import{P as j}from"./PasswordlessSignup-DpWecX9U.js";const R=[{icon:"🕐",title:"Multiple Time Options",description:"Choose 3 preferred slots to guarantee availability."},{icon:"🔒",title:"Secure Payments",description:"Blockchain escrow keeps your ETH safe until confirmation."},{icon:"↩️",title:"Risk‑Free Booking",description:"Full refunds available anytime before teacher accepts."}];function a(i){const{heading:l="Safe & Simple Yoga Booking",items:_=R,variant:r="full",skin:b="ulyxes",className:S}=i,[t,N]=I.useState(r!=="accordion"),c={"data-skin":b,"data-variant":r,className:["yui-booking-info",S].filter(Boolean).join(" ")},m=e.jsx("div",{className:"yui-booking-info__items",role:"list",children:_.map((d,B)=>e.jsxs("div",{role:"listitem",className:"yui-booking-info__item",children:[e.jsx("div",{className:"yui-booking-info__icon","aria-hidden":!0,children:d.icon??"•"}),e.jsxs("div",{className:"yui-booking-info__text",children:[e.jsx("div",{className:"yui-booking-info__title",children:d.title}),e.jsx("div",{className:"yui-booking-info__desc",children:d.description})]})]},B))});return r==="accordion"?e.jsxs("section",{...c,children:[e.jsx("button",{type:"button",className:"yui-booking-info__toggle","aria-expanded":t,onClick:()=>N(!t),children:e.jsx("span",{className:"yui-booking-info__heading",children:l})}),t?m:null]}):e.jsxs("section",{...c,children:[e.jsx("div",{className:"yui-booking-info__heading",children:l}),m]})}a.__docgenInfo={description:"",methods:[],displayName:"BookingInfo",props:{heading:{required:!1,tsType:{name:"string"},description:""},items:{required:!1,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  icon?: React.ReactNode
  title: string
  description: string
}`,signature:{properties:[{key:"icon",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!1}},{key:"title",value:{name:"string",required:!0}},{key:"description",value:{name:"string",required:!0}}]}}],raw:"BookingInfoItem[]"},description:""},variant:{required:!1,tsType:{name:"union",raw:"'full' | 'side' | 'accordion'",elements:[{name:"literal",value:"'full'"},{name:"literal",value:"'side'"},{name:"literal",value:"'accordion'"}]},description:""},skin:{required:!1,tsType:{name:"string"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const A={title:"Ulyx/BookingInfo",component:a},s={render:()=>e.jsxs("div",{"data-skin":"ulyxes",style:{display:"grid",gap:16,maxWidth:640},children:[e.jsx(a,{variant:"full"}),e.jsx(j,{onSubmit:i=>alert(i.email)})]})},n={render:()=>e.jsx("div",{"data-skin":"ulyxes",style:{display:"grid",gap:16},children:e.jsx(a,{variant:"side"})})},o={render:()=>e.jsxs("div",{"data-skin":"ulyxes",style:{display:"grid",gap:16,maxWidth:640},children:[e.jsx(a,{variant:"accordion"}),e.jsx(j,{onSubmit:i=>alert(i.email)})]})};var u,p,g;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <div data-skin="ulyxes" style={{
    display: 'grid',
    gap: 16,
    maxWidth: 640
  }}>
      <BookingInfo variant="full" />
      <PasswordlessSignup onSubmit={e => alert(e.email)} />
    </div>
}`,...(g=(p=s.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var y,f,x;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div data-skin="ulyxes" style={{
    display: 'grid',
    gap: 16
  }}>
      <BookingInfo variant="side" />
    </div>
}`,...(x=(f=n.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};var k,v,h;o.parameters={...o.parameters,docs:{...(k=o.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <div data-skin="ulyxes" style={{
    display: 'grid',
    gap: 16,
    maxWidth: 640
  }}>
      <BookingInfo variant="accordion" />
      <PasswordlessSignup onSubmit={e => alert(e.email)} />
    </div>
}`,...(h=(v=o.parameters)==null?void 0:v.docs)==null?void 0:h.source}}};const P=["AboveLogin","SideBySide","Accordion"];export{s as AboveLogin,o as Accordion,n as SideBySide,P as __namedExportsOrder,A as default};
