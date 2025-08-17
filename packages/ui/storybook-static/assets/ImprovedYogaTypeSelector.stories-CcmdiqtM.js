import{j as e}from"./jsx-runtime-CDt2p4po.js";import{r as o}from"./index-GiUgBvb1.js";import{I as l}from"./ImprovedYogaTypeSelector-CtwMV9AK.js";const v={title:"Ulyx/ImprovedYogaTypeSelector",component:l},x=[{id:"vinyasa",name:"Vinyasa",tagline:"Flow with breath",description:"Dynamic sequences that link breath with movement",personas:["runner","traveler","dancer"],benefits:["Fluidity & balance","Expressive flow"]},{id:"hatha",name:"Hatha",tagline:"Foundational & calm",description:"Gentle, slow-paced practice focusing on basic postures",personas:["runner","traveler","dancer"],benefits:["Alignment & control","Mindful movement"]},{id:"yin",name:"Yin",tagline:"Deep stretch",description:"Passive poses held for longer periods to target deep tissues",personas:["runner","traveler"],benefits:["Deep relaxation","Flexibility"]},{id:"power",name:"Power Yoga",tagline:"Strength & energy",description:"Fast-paced, strength-focused Vinyasa practice",personas:["runner","dancer"],benefits:["Build strength","Athletic flow"]},{id:"restorative",name:"Restorative",tagline:"Rest & restore",description:"Gentle, supported poses using props for deep relaxation",personas:["traveler"],benefits:["Stress relief","Deep rest"]}],r={render:()=>{const[t,a]=o.useState(null),[n,i]=o.useState(null);return e.jsxs("div",{style:{padding:"20px",maxWidth:"800px"},children:[e.jsx(l,{options:x,selectedId:t,filterPersona:n,onSelect:a,onFilterChange:i}),e.jsxs("div",{style:{marginTop:"20px",padding:"16px",background:"#f0f0f0",borderRadius:"8px"},children:[e.jsx("h4",{children:"Current Selection:"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Selected:"})," ",t||"None"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Filter:"})," ",n||"All"]})]})]})}},s={render:()=>{const[t,a]=o.useState("vinyasa"),[n,i]=o.useState("runner");return e.jsx("div",{style:{padding:"20px",maxWidth:"800px"},children:e.jsx(l,{options:x,selectedId:t,filterPersona:n,onSelect:a,onFilterChange:i})})}};var d,p,c;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filterPersona, setFilterPersona] = useState<string | null>(null);
    return <div style={{
      padding: '20px',
      maxWidth: '800px'
    }}>
        <ImprovedYogaTypeSelector options={sampleYogaTypes} selectedId={selectedId} filterPersona={filterPersona} onSelect={setSelectedId} onFilterChange={setFilterPersona} />
        
        <div style={{
        marginTop: '20px',
        padding: '16px',
        background: '#f0f0f0',
        borderRadius: '8px'
      }}>
          <h4>Current Selection:</h4>
          <p><strong>Selected:</strong> {selectedId || 'None'}</p>
          <p><strong>Filter:</strong> {filterPersona || 'All'}</p>
        </div>
      </div>;
  }
}`,...(c=(p=r.parameters)==null?void 0:p.docs)==null?void 0:c.source}}};var u,g,m;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>('vinyasa');
    const [filterPersona, setFilterPersona] = useState<string | null>('runner');
    return <div style={{
      padding: '20px',
      maxWidth: '800px'
    }}>
        <ImprovedYogaTypeSelector options={sampleYogaTypes} selectedId={selectedId} filterPersona={filterPersona} onSelect={setSelectedId} onFilterChange={setFilterPersona} />
      </div>;
  }
}`,...(m=(g=s.parameters)==null?void 0:g.docs)==null?void 0:m.source}}};const y=["Default","RunnerFilter"];export{r as Default,s as RunnerFilter,y as __namedExportsOrder,v as default};
