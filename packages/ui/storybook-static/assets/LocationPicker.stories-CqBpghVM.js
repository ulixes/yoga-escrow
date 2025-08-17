import{j as t}from"./jsx-runtime-CDt2p4po.js";import{r as l}from"./index-GiUgBvb1.js";import{L as s}from"./LocationPicker-6EM9LXQM.js";const p={title:"Ulyx/LocationPicker",component:s},e={render:()=>{const[c,i]=l.useState(null);return t.jsx("div",{"data-skin":"ulyxes",children:t.jsx(s,{value:c,onChange:i,onDone:o=>alert(`${o.country}, ${o.city} — ${o.specificLocation}`)})})}};var r,n,a;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [loc, setLoc] = useState<any>(null);
    return <div data-skin="ulyxes">
        <LocationPicker value={loc} onChange={setLoc} onDone={l => alert(\`\${l.country}, \${l.city} — \${l.specificLocation}\`)} />
      </div>;
  }
}`,...(a=(n=e.parameters)==null?void 0:n.docs)==null?void 0:a.source}}};const x=["GeorgiaTbilisi"];export{e as GeorgiaTbilisi,x as __namedExportsOrder,p as default};
