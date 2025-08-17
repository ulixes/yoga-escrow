import{j as e}from"./jsx-runtime-CDt2p4po.js";import{r}from"./index-GiUgBvb1.js";import{I as l}from"./ImprovedPersonaSelector-_FMDfy06.js";const h={title:"Ulyx/ImprovedPersonaSelector",component:l},t={render:()=>{const[n,a]=r.useState("None"),[s,d]=r.useState("None");return e.jsxs("div",{style:{padding:"20px",maxWidth:"600px"},children:[e.jsx(l,{selectedPersona:n,selectedGoal:s,onPersonaChange:a,onGoalChange:d}),e.jsxs("div",{style:{marginTop:"20px",padding:"16px",background:"#f0f0f0",borderRadius:"8px"},children:[e.jsx("h4",{children:"Current Selection:"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Persona:"})," ",n]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Goal:"})," ",s]})]})]})}},o={render:()=>{const[n,a]=r.useState("Traveler"),[s,d]=r.useState("Flexibility");return e.jsx("div",{style:{padding:"20px",maxWidth:"600px"},children:e.jsx(l,{selectedPersona:n,selectedGoal:s,onPersonaChange:a,onGoalChange:d})})}};var c,p,i;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => {
    const [selectedPersona, setSelectedPersona] = useState<PersonaType>('None');
    const [selectedGoal, setSelectedGoal] = useState<GoalType>('None');
    return <div style={{
      padding: '20px',
      maxWidth: '600px'
    }}>
        <ImprovedPersonaSelector selectedPersona={selectedPersona} selectedGoal={selectedGoal} onPersonaChange={setSelectedPersona} onGoalChange={setSelectedGoal} />
        
        <div style={{
        marginTop: '20px',
        padding: '16px',
        background: '#f0f0f0',
        borderRadius: '8px'
      }}>
          <h4>Current Selection:</h4>
          <p><strong>Persona:</strong> {selectedPersona}</p>
          <p><strong>Goal:</strong> {selectedGoal}</p>
        </div>
      </div>;
  }
}`,...(i=(p=t.parameters)==null?void 0:p.docs)==null?void 0:i.source}}};var x,S,P;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => {
    const [selectedPersona, setSelectedPersona] = useState<PersonaType>('Traveler');
    const [selectedGoal, setSelectedGoal] = useState<GoalType>('Flexibility');
    return <div style={{
      padding: '20px',
      maxWidth: '600px'
    }}>
        <ImprovedPersonaSelector selectedPersona={selectedPersona} selectedGoal={selectedGoal} onPersonaChange={setSelectedPersona} onGoalChange={setSelectedGoal} />
      </div>;
  }
}`,...(P=(S=o.parameters)==null?void 0:S.docs)==null?void 0:P.source}}};const G=["Default","PreSelected"];export{t as Default,o as PreSelected,G as __namedExportsOrder,h as default};
