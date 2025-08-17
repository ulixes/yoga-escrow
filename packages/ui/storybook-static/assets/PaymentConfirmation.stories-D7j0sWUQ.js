import{j as e}from"./jsx-runtime-CDt2p4po.js";import"./index-GiUgBvb1.js";function t({summary:_,onConfirm:r,onCancel:i,skin:j="ulyxes",className:h}){const{currentBalanceUSDC:m,estimatedGasFeeETH:l,estimatedGasFeeUSD:u,defaultOfferAmount:C}=_,o=C||0,c=o+(u||0),b=Math.max(0,m-c),a=N=>`$${N.toFixed(2)}`;return e.jsxs("div",{"data-skin":j,className:["yui-payment",h].filter(Boolean).join(" "),children:[e.jsxs("div",{className:"yui-payment__row",children:[e.jsx("div",{className:"yui-payment__label",children:"Your Offer"}),e.jsx("div",{className:"yui-payment__value",children:a(o)})]}),l&&e.jsxs("div",{className:"yui-payment__row",children:[e.jsx("div",{className:"yui-payment__label",children:"Estimated gas fee"}),e.jsxs("div",{className:"yui-payment__value",children:[l.toFixed(6)," ETH (~",a(u||0),")"]})]}),e.jsxs("div",{className:"yui-payment__row yui-payment__row--total",children:[e.jsx("div",{className:"yui-payment__label",children:"Total cost (offer + gas)"}),e.jsx("div",{className:"yui-payment__value",children:a(c)})]}),e.jsxs("div",{className:"yui-payment__row",children:[e.jsx("div",{className:"yui-payment__label",children:"Current balance"}),e.jsx("div",{className:"yui-payment__value",children:a(m)})]}),e.jsxs("div",{className:"yui-payment__row",children:[e.jsx("div",{className:"yui-payment__label",children:"Remaining after payment"}),e.jsx("div",{className:"yui-payment__value",children:a(b)})]}),e.jsxs("div",{className:"yui-payment__actions",children:[i&&e.jsx("button",{type:"button",className:"yui-btn",onClick:i,children:"Cancel"}),r&&e.jsx("button",{type:"button",className:"yui-btn",onClick:r,children:"Confirm payment"})]})]})}t.__docgenInfo={description:"",methods:[],displayName:"PaymentConfirmation",props:{summary:{required:!0,tsType:{name:"signature",type:"object",raw:`{
  currentBalanceUSDC: number
  estimatedGasFeeETH?: number  // Gas fee in ETH
  estimatedGasFeeUSD?: number  // Gas fee in USD equivalent
  defaultSessionType?: SessionType
  defaultOfferAmount?: number
}`,signature:{properties:[{key:"currentBalanceUSDC",value:{name:"number",required:!0}},{key:"estimatedGasFeeETH",value:{name:"number",required:!1}},{key:"estimatedGasFeeUSD",value:{name:"number",required:!1}},{key:"defaultSessionType",value:{name:"union",raw:"'1on1' | 'group'",elements:[{name:"literal",value:"'1on1'"},{name:"literal",value:"'group'"}],required:!1}},{key:"defaultOfferAmount",value:{name:"number",required:!1}}]}},description:""},onConfirm:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onCancel:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},skin:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'ulyxes'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};const U={title:"Ulyx/PaymentConfirmation",component:t},n={render:()=>e.jsx("div",{"data-skin":"ulyxes",children:e.jsx(t,{summary:{costUSDC:10,currentBalanceUSDC:10}})})},s={render:()=>e.jsx("div",{"data-skin":"ulyxes",children:e.jsx(t,{summary:{costUSDC:10,currentBalanceUSDC:25.75}})})};var d,y,p;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <div data-skin="ulyxes">
    <PaymentConfirmation summary={{
      costUSDC: 10,
      currentBalanceUSDC: 10
    }} />
  </div>
}`,...(p=(y=n.parameters)==null?void 0:y.docs)==null?void 0:p.source}}};var f,v,x;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <div data-skin="ulyxes">
    <PaymentConfirmation summary={{
      costUSDC: 10,
      currentBalanceUSDC: 25.75
    }} />
  </div>
}`,...(x=(v=s.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};const D=["ExactBalance","PlentyLeft"];export{n as ExactBalance,s as PlentyLeft,D as __namedExportsOrder,U as default};
