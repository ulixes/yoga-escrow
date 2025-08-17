import{j as o}from"./jsx-runtime-CDt2p4po.js";import{P as r}from"./PasswordlessSignup-DpWecX9U.js";import{B as Y}from"./Brand-XKP7rgjz.js";import"./index-GiUgBvb1.js";const X={title:"Auth/PasswordlessSignup",component:r,argTypes:{step:{control:"select",options:["enterEmail","sendingCode","enterCode","verifyingCode","success","error"]},skin:{control:"text"},codeLength:{control:{type:"number",min:4,max:8}}}},a=e=>new Promise(C=>setTimeout(C,e)),n=async()=>{await a(800)},i=async(e,C)=>{if(await a(800),C!=="123456")throw new Error("Invalid code")},M=async()=>{await a(600)},G=async()=>{throw await a(600),new Error("Invalid code")},s=({children:e})=>o.jsxs("div",{style:{display:"grid",gap:16},children:[o.jsx(Y,{title:"Ulyxes",slogan:"Yoga everywhere.. anytime..",subtitle:"Move with breath. Find your space.",orientation:"vertical",size:"lg",logoVariant:"wave",skin:"ulyxes"}),e]}),t={render:e=>o.jsx(s,{children:o.jsx(r,{...e})}),args:{step:"enterEmail",translations:{enterEmailTitle:"Sign up or log in"},onRequestCode:n,onVerifyCode:i,skin:"ulyxes"}},d={render:e=>o.jsx(s,{children:o.jsx(r,{...e})}),args:{step:"sendingCode",initialEmail:"yogi@example.com",onRequestCode:n,onVerifyCode:i,skin:"ulyxes"}},l={render:e=>o.jsx(s,{children:o.jsx(r,{...e})}),args:{step:"enterCode",initialEmail:"yogi@example.com",onRequestCode:n,onVerifyCode:i,skin:"ulyxes"}},c={render:e=>o.jsx(s,{children:o.jsx(r,{...e})}),args:{step:"verifyingCode",initialEmail:"yogi@example.com",onRequestCode:n,onVerifyCode:i,skin:"ulyxes"}},m={render:e=>o.jsx(s,{children:o.jsx(r,{...e})}),args:{step:"success",initialEmail:"yogi@example.com",onRequestCode:n,onVerifyCode:i,skin:"ulyxes"}},u={render:e=>o.jsx(s,{children:o.jsx(r,{...e})}),args:{step:"error",initialEmail:"yogi@example.com",translations:{error:"Something went wrong"},onRequestCode:n,onVerifyCode:async()=>{throw await a(400),new Error("Server unreachable")},skin:"ulyxes"}},y={name:"Uncontrolled Flow (Happy Path)",args:{initialEmail:"",onRequestCode:n,onVerifyCode:M,skin:"ulyxes"}},p={name:"Uncontrolled Flow (Unhappy Path)",args:{initialEmail:"yogi@example.com",onRequestCode:n,onVerifyCode:G,skin:"ulyxes"}},g={name:"Login with Brand",render:e=>o.jsx(s,{children:o.jsx(r,{...e})}),args:{initialEmail:"",onRequestCode:n,onVerifyCode:M,skin:"ulyxes"}};var x,k,w;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: args => <Layout>
      <PasswordlessSignup {...args} />
    </Layout>,
  args: {
    step: 'enterEmail',
    translations: {
      enterEmailTitle: 'Sign up or log in'
    },
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyCode,
    skin: 'ulyxes'
  }
}`,...(w=(k=t.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var f,E,h;d.parameters={...d.parameters,docs:{...(f=d.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: args => <Layout>
      <PasswordlessSignup {...args} />
    </Layout>,
  args: {
    step: 'sendingCode',
    initialEmail: 'yogi@example.com',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyCode,
    skin: 'ulyxes'
  }
}`,...(h=(E=d.parameters)==null?void 0:E.docs)==null?void 0:h.source}}};var V,S,R;l.parameters={...l.parameters,docs:{...(V=l.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: args => <Layout>
      <PasswordlessSignup {...args} />
    </Layout>,
  args: {
    step: 'enterCode',
    initialEmail: 'yogi@example.com',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyCode,
    skin: 'ulyxes'
  }
}`,...(R=(S=l.parameters)==null?void 0:S.docs)==null?void 0:R.source}}};var q,j,L;c.parameters={...c.parameters,docs:{...(q=c.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: args => <Layout>
      <PasswordlessSignup {...args} />
    </Layout>,
  args: {
    step: 'verifyingCode',
    initialEmail: 'yogi@example.com',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyCode,
    skin: 'ulyxes'
  }
}`,...(L=(j=c.parameters)==null?void 0:j.docs)==null?void 0:L.source}}};var P,v,F;m.parameters={...m.parameters,docs:{...(P=m.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: args => <Layout>
      <PasswordlessSignup {...args} />
    </Layout>,
  args: {
    step: 'success',
    initialEmail: 'yogi@example.com',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyCode,
    skin: 'ulyxes'
  }
}`,...(F=(v=m.parameters)==null?void 0:v.docs)==null?void 0:F.source}}};var U,A,b;u.parameters={...u.parameters,docs:{...(U=u.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: args => <Layout>
      <PasswordlessSignup {...args} />
    </Layout>,
  args: {
    step: 'error',
    initialEmail: 'yogi@example.com',
    translations: {
      error: 'Something went wrong'
    },
    onRequestCode: mockRequestCode,
    onVerifyCode: async () => {
      await mockDelay(400);
      throw new Error('Server unreachable');
    },
    skin: 'ulyxes'
  }
}`,...(b=(A=u.parameters)==null?void 0:A.docs)==null?void 0:b.source}}};var B,D,O;y.parameters={...y.parameters,docs:{...(B=y.parameters)==null?void 0:B.docs,source:{originalSource:`{
  name: 'Uncontrolled Flow (Happy Path)',
  args: {
    initialEmail: '',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyAlwaysOk,
    skin: 'ulyxes'
  }
}`,...(O=(D=y.parameters)==null?void 0:D.docs)==null?void 0:O.source}}};var T,_,H;p.parameters={...p.parameters,docs:{...(T=p.parameters)==null?void 0:T.docs,source:{originalSource:`{
  name: 'Uncontrolled Flow (Unhappy Path)',
  args: {
    initialEmail: 'yogi@example.com',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyAlwaysFail,
    skin: 'ulyxes'
  }
}`,...(H=(_=p.parameters)==null?void 0:_.docs)==null?void 0:H.source}}};var I,W,z;g.parameters={...g.parameters,docs:{...(I=g.parameters)==null?void 0:I.docs,source:{originalSource:`{
  name: 'Login with Brand',
  render: args => <Layout>
      <PasswordlessSignup {...args} />
    </Layout>,
  args: {
    initialEmail: '',
    onRequestCode: mockRequestCode,
    onVerifyCode: mockVerifyAlwaysOk,
    skin: 'ulyxes'
  }
}`,...(z=(W=g.parameters)==null?void 0:W.docs)==null?void 0:z.source}}};const Z=["EnterEmail","SendingCode","EnterCode","Verifying","Success","ErrorState","FlowDemo","FlowUnhappy","WithBrandAbove"];export{l as EnterCode,t as EnterEmail,u as ErrorState,y as FlowDemo,p as FlowUnhappy,d as SendingCode,m as Success,c as Verifying,g as WithBrandAbove,Z as __namedExportsOrder,X as default};
