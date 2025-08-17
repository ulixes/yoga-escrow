import{j as t}from"./jsx-runtime-CDt2p4po.js";import{R as w}from"./index-GiUgBvb1.js";import{H as c,T as S}from"./TeacherDiscovery-DVYHNlbx.js";const y={title:"Discovery/HotTeachers",component:c},i=[{id:"1",handle:"luna.flows",displayName:"Luna Martinez",heroImage:"https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=600&h=800&fit=crop",gridImages:["https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop"],stats:{followers:"24.5K",sessions:847,rating:4.9},tags:["Power Vinyasa","Hot Yoga","Sculpt"],vibe:"Fierce flows that make you glow ✨",verified:!0},{id:"2",handle:"sasha.strength",displayName:"Sasha Chen",heroImage:"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop",gridImages:["https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&h=400&fit=crop"],stats:{followers:"18.2K",sessions:632,rating:4.8},tags:["Ashtanga","Core Power","HIIT Yoga"],vibe:"Build strength, find your edge 🔥",verified:!0},{id:"3",handle:"kai.balance",displayName:"Kai Thompson",heroImage:"https://images.unsplash.com/photo-1549540952-f1a0ff6d3e74?w=600&h=800&fit=crop",gridImages:["https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1598135753163-6167c1a1ad65?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1593811167562-9cef47bfc4a7?w=400&h=400&fit=crop"],stats:{followers:"31.7K",sessions:1204,rating:5},tags:["Inversions","Arm Balances","Flow"],vibe:"Defy gravity, elevate your practice 🚀"},{id:"4",handle:"maya.mindful",displayName:"Maya Rodriguez",heroImage:"https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=600&h=800&fit=crop",gridImages:["https://images.unsplash.com/photo-1602827114937-3e09c9b42d72?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1540324155974-7523202daa3f?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=400&h=400&fit=crop"],stats:{followers:"42.1K",sessions:2156,rating:4.9},tags:["Yin Yoga","Meditation","Breathwork"],vibe:"Deep stretch, deeper connection 🌙",verified:!0},{id:"5",handle:"alex.athletic",displayName:"Alex Rivera",heroImage:"https://images.unsplash.com/photo-1518310532351-d6d4e07b9e93?w=600&h=800&fit=crop",gridImages:["https://images.unsplash.com/photo-1552196527-bffef41ef674?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1573384293695-8390968bc3b0?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1623620736710-05240a7b0c18?w=400&h=400&fit=crop"],stats:{followers:"28.9K",sessions:991,rating:4.7},tags:["Athletic Yoga","Mobility","Recovery"],vibe:"Train hard, flow harder 💪"}],s={render:()=>{const[e,r]=w.useState(!1);return t.jsx("div",{style:{maxWidth:"400px",padding:"20px"},children:t.jsx(c,{teacher:i[0],isSelected:e,onSelect:()=>r(!e)})})}},a={render:()=>{const[e,r]=w.useState(!1);return t.jsx("div",{style:{maxWidth:"300px",padding:"20px"},children:t.jsx(c,{teacher:i[1],isSelected:e,onSelect:()=>r(!e),compact:!0})})}},o={render:()=>t.jsx(S,{teachers:i,maxSelection:3,onSubmitSelection:e=>{console.log("Selected teachers:",e),alert(`Creating escrow for ${e.length} teacher(s)`)}})};var n,h,p;s.parameters={...s.parameters,docs:{...(n=s.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = React.useState(false);
    return <div style={{
      maxWidth: '400px',
      padding: '20px'
    }}>
        <HotTeacherCard teacher={mockTeachers[0]} isSelected={selected} onSelect={() => setSelected(!selected)} />
      </div>;
  }
}`,...(p=(h=s.parameters)==null?void 0:h.docs)==null?void 0:p.source}}};var l,d,m;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = React.useState(false);
    return <div style={{
      maxWidth: '300px',
      padding: '20px'
    }}>
        <HotTeacherCard teacher={mockTeachers[1]} isSelected={selected} onSelect={() => setSelected(!selected)} compact />
      </div>;
  }
}`,...(m=(d=a.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var g,f,u;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    return <TeacherDiscovery teachers={mockTeachers} maxSelection={3} onSubmitSelection={ids => {
      console.log('Selected teachers:', ids);
      alert(\`Creating escrow for \${ids.length} teacher(s)\`);
    }} />;
  }
}`,...(u=(f=o.parameters)==null?void 0:f.docs)==null?void 0:u.source}}};const T=["SingleCard","CompactCard","FullDiscovery"];export{a as CompactCard,o as FullDiscovery,s as SingleCard,T as __namedExportsOrder,y as default};
