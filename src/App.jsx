import { useState, useRef, useEffect } from "react";

// ── DATA ─────────────────────────────────────────────────────────────────────

const ALLIANCES = {
  NATO:       { name:"NATO",        color:"#3b82f6", members:["usa","uk","germany","poland","france","turkey"],               description:"Collective defence — Article 5 mutual defence" },
  SCO:        { name:"SCO",         color:"#ef4444", members:["china","russia","india","pakistan","iran","kazakhstan"],       description:"Shanghai Cooperation Organisation — security & trade" },
  BRICS:      { name:"BRICS",       color:"#f59e0b", members:["brazil","russia","india","china","south_africa","iran"],       description:"Emerging economies — challenging Western financial order" },
  ARAB_LEAGUE:{ name:"Arab League", color:"#22c55e", members:["saudi_arabia","egypt","jordan","syria","libya","iraq"],        description:"Pan-Arab political coordination bloc" },
  QUAD:       { name:"QUAD",        color:"#8b5cf6", members:["usa","india","japan","australia"],                             description:"Indo-Pacific security dialogue" },
  CSTO:       { name:"CSTO",        color:"#ec4899", members:["russia","kazakhstan","belarus","armenia"],                     description:"Russia-led collective security treaty" },
};

const NON_STATE_ACTORS = {
  isis:      { name:"ISIS/DAESH",        icon:"☠️", regions:["syria","iraq","libya","afghanistan"],     threat:"Critical", ideology:"Salafi-jihadist caliphate" },
  hamas:     { name:"Hamas",             icon:"🎯", regions:["israel_pal","egypt","jordan"],            threat:"High",     ideology:"Palestinian Islamist resistance" },
  hezbollah: { name:"Hezbollah",         icon:"🚀", regions:["lebanon","syria","iran"],                 threat:"High",     ideology:"Shia Islamist, Iran proxy" },
  let:       { name:"Lashkar-e-Tayyaba", icon:"💣", regions:["pakistan","india","afghanistan"],         threat:"High",     ideology:"Kashmir-focused jihadist group" },
  ttp:       { name:"TTP",               icon:"🔫", regions:["pakistan","afghanistan"],                 threat:"High",     ideology:"Anti-Pakistan state jihadist" },
  alnusra:   { name:"Al-Qaeda/Nusra",    icon:"⚡", regions:["syria","libya","afghanistan","mali"],     threat:"Critical", ideology:"Global jihad, anti-Western" },
  houthis:   { name:"Houthis",           icon:"🛥️", regions:["yemen","saudi_arabia"],                  threat:"High",     ideology:"Shia insurgency, Iran-aligned" },
};

const NEWS_OUTLETS = [
  { id:"herald",   name:"The World Herald",  bias:"western_liberal",  accentColor:"#1a3a6e" },
  { id:"global_t", name:"Global Times",      bias:"eastern_statist",  accentColor:"#cc0000" },
  { id:"al_watan", name:"Al-Watan Tribune",  bias:"gulf_conservative",accentColor:"#1d6b2f" },
];

const COUNTRIES = [
  { id:"usa",         name:"United States",  flag:"🇺🇸", region:"North America", power:"Superpower",    gdp:25000, military:100, diplomacy:90, stability:72, internalStrife:28, alliances:["NATO","QUAD"],        threats:[],                      traits:"Global hegemon, NATO anchor, dollar dominance, internal polarisation rising" },
  { id:"china",       name:"China",          flag:"🇨🇳", region:"Asia",          power:"Superpower",    gdp:18000, military:95,  diplomacy:80, stability:78, internalStrife:18, alliances:["SCO","BRICS"],        threats:[],                      traits:"Rising superpower, Belt & Road, Taiwan ambitions, Xinjiang tensions" },
  { id:"russia",      name:"Russia",         flag:"🇷🇺", region:"Eurasia",       power:"Major Power",   gdp:2200,  military:88,  diplomacy:60, stability:60, internalStrife:30, alliances:["SCO","CSTO","BRICS"], threats:[],                      traits:"Nuclear power, energy weaponisation, revisionist, sanctions-hit" },
  { id:"india",       name:"India",          flag:"🇮🇳", region:"South Asia",    power:"Major Power",   gdp:3700,  military:80,  diplomacy:75, stability:68, internalStrife:32, alliances:["SCO","QUAD","BRICS"], threats:["let"],                  traits:"Strategic autonomy, border disputes with China & Pakistan, fastest-growing economy" },
  { id:"uk",          name:"United Kingdom", flag:"🇬🇧", region:"Europe",        power:"Regional Power",gdp:3100,  military:72,  diplomacy:82, stability:70, internalStrife:22, alliances:["NATO"],               threats:[],                      traits:"P5 member, post-Brexit pivot, global finance, devolution pressures" },
  { id:"germany",     name:"Germany",        flag:"🇩🇪", region:"Europe",        power:"Regional Power",gdp:4400,  military:58,  diplomacy:85, stability:78, internalStrife:20, alliances:["NATO"],               threats:[],                      traits:"EU economic engine, energy transition, rearming post-Ukraine" },
  { id:"japan",       name:"Japan",          flag:"🇯🇵", region:"East Asia",     power:"Regional Power",gdp:4200,  military:62,  diplomacy:78, stability:82, internalStrife:10, alliances:["QUAD"],               threats:[],                      traits:"Pacifist constitution revision, China threat, US alliance" },
  { id:"france",      name:"France",         flag:"🇫🇷", region:"Europe",        power:"Regional Power",gdp:3000,  military:70,  diplomacy:80, stability:65, internalStrife:35, alliances:["NATO"],               threats:[],                      traits:"Nuclear state, EU co-leader, Sahel interventions, domestic unrest" },
  { id:"iran",        name:"Iran",           flag:"🇮🇷", region:"Middle East",   power:"Regional Power",gdp:400,   military:68,  diplomacy:42, stability:55, internalStrife:45, alliances:["SCO","BRICS"],        threats:["houthis","hezbollah"],  traits:"Axis of Resistance, proxy network, sanctions, nuclear programme" },
  { id:"pakistan",    name:"Pakistan",       flag:"🇵🇰", region:"South Asia",    power:"Regional Power",gdp:380,   military:65,  diplomacy:50, stability:42, internalStrife:60, alliances:["SCO"],               threats:["ttp","let"],            traits:"Nuclear state, civil-military tension, IMF crisis, Afghan border chaos" },
  { id:"turkey",      name:"Turkey",         flag:"🇹🇷", region:"Eurasia",       power:"Regional Power",gdp:1100,  military:70,  diplomacy:68, stability:60, internalStrife:38, alliances:["NATO"],               threats:[],                      traits:"NATO's awkward member, Erdoğan neo-Ottoman pivot" },
  { id:"saudi_arabia",name:"Saudi Arabia",   flag:"🇸🇦", region:"Middle East",   power:"Regional Power",gdp:1100,  military:65,  diplomacy:72, stability:68, internalStrife:22, alliances:["ARAB_LEAGUE"],        threats:["houthis","isis"],       traits:"OPEC kingpin, Vision 2030, Yemen war, US security partner" },
  { id:"israel",      name:"Israel",         flag:"🇮🇱", region:"Middle East",   power:"Regional Power",gdp:530,   military:80,  diplomacy:55, stability:62, internalStrife:40, alliances:[],                    threats:["hamas","hezbollah"],    traits:"Nuclear-ambiguous, Abraham Accords, Gaza conflict, Iran threat" },
  { id:"brazil",      name:"Brazil",         flag:"🇧🇷", region:"South America", power:"Regional Power",gdp:2100,  military:55,  diplomacy:70, stability:62, internalStrife:28, alliances:["BRICS"],              threats:[],                      traits:"Amazon geopolitics, BRICS leader, Lula's multipolar diplomacy" },
  { id:"poland",      name:"Poland",         flag:"🇵🇱", region:"Europe",        power:"Middle Power",  gdp:750,   military:60,  diplomacy:65, stability:72, internalStrife:25, alliances:["NATO"],               threats:[],                      traits:"NATO's eastern flank anchor, Russia border anxiety, rearmament surge" },
  { id:"taiwan",      name:"Taiwan",         flag:"🇹🇼", region:"East Asia",     power:"Middle Power",  gdp:790,   military:55,  diplomacy:40, stability:75, internalStrife:15, alliances:[],                    threats:[],                      traits:"Semiconductor giant, existential China threat, US informal ally" },
  { id:"afghanistan", name:"Afghanistan",    flag:"🇦🇫", region:"South Asia",    power:"Weak State",    gdp:15,    military:30,  diplomacy:15, stability:20, internalStrife:80, alliances:[],                    threats:["isis","ttp","alnusra"],  traits:"Taliban rule, humanitarian collapse, ISIS-K insurgency" },
  { id:"syria",       name:"Syria",          flag:"🇸🇾", region:"Middle East",   power:"Weak State",    gdp:22,    military:38,  diplomacy:20, stability:18, internalStrife:82, alliances:["ARAB_LEAGUE"],        threats:["isis","alnusra"],       traits:"Post-civil war, Assad regime, ISIS remnants, foreign forces on soil" },
  { id:"libya",       name:"Libya",          flag:"🇱🇾", region:"North Africa",  power:"Weak State",    gdp:50,    military:28,  diplomacy:22, stability:20, internalStrife:78, alliances:["ARAB_LEAGUE"],        threats:["isis","alnusra"],       traits:"Dual government, militia fragmentation, Wagner group, oil curse" },
  { id:"nepal",       name:"Nepal",          flag:"🇳🇵", region:"South Asia",    power:"Small State",   gdp:40,    military:22,  diplomacy:45, stability:58, internalStrife:30, alliances:[],                    threats:[],                      traits:"India-China squeeze, political instability, Himalayan buffer state" },
  { id:"bangladesh",  name:"Bangladesh",     flag:"🇧🇩", region:"South Asia",    power:"Small State",   gdp:460,   military:35,  diplomacy:52, stability:55, internalStrife:35, alliances:[],                    threats:["let"],                  traits:"Garment economy, climate vulnerability, Rohingya burden" },
  { id:"ukraine",     name:"Ukraine",        flag:"🇺🇦", region:"Europe",        power:"Middle Power",  gdp:200,   military:65,  diplomacy:70, stability:25, internalStrife:20, alliances:[],                    threats:[],                      traits:"Active war with Russia, Western arms dependency, EU candidate" },
  { id:"north_korea", name:"North Korea",    flag:"🇰🇵", region:"East Asia",     power:"Rogue State",   gdp:18,    military:60,  diplomacy:8,  stability:70, internalStrife:10, alliances:[],                    threats:[],                      traits:"Nuclear hermit state, missile provocations, Russia alignment" },
  { id:"ethiopia",    name:"Ethiopia",       flag:"🇪🇹", region:"Africa",        power:"Regional Power",gdp:130,   military:45,  diplomacy:48, stability:38, internalStrife:65, alliances:[],                    threats:["isis"],                 traits:"Tigray aftermath, Nile dam dispute, BRICS aspirant" },
];

const SCENARIOS = [
  { id:"trade_war",   title:"Trade War Erupts",        icon:"📦", description:"A major trading partner slaps 40% tariffs. Your exporters are panicking.",              stakes:"High",     category:"Economic" },
  { id:"territorial", title:"Territorial Flashpoint",  icon:"🗺️", description:"A neighbour seizes disputed territory. Troops are mobilising on both sides.",          stakes:"Critical", category:"Military" },
  { id:"cyber",       title:"Critical Cyberattack",    icon:"💻", description:"Your power grid and banking system were hit by a sophisticated state actor.",            stakes:"High",     category:"Security" },
  { id:"pandemic",    title:"Pandemic Outbreak",       icon:"🦠", description:"A lethal pathogen emerges in your territory. The WHO is alarmed.",                      stakes:"Critical", category:"Health" },
  { id:"climate",     title:"Climate Accord Collapse", icon:"🌍", description:"The global climate framework is fracturing. Your stance will define alliances.",        stakes:"Medium",   category:"Diplomacy" },
  { id:"refugee",     title:"Refugee Crisis",          icon:"🏕️", description:"Millions flee conflict next door. Neighbours seal borders and point at you.",          stakes:"High",     category:"Humanitarian" },
  { id:"sanctions",   title:"Sanctions & Isolation",   icon:"🔒", description:"A coalition of powers imposes sweeping economic sanctions on your country.",            stakes:"Critical", category:"Economic" },
  { id:"nuclear",     title:"Nuclear Neighbour",       icon:"☢️", description:"A bordering state announces nuclear capability. Your doctrine is obsolete.",           stakes:"Critical", category:"Military" },
  { id:"coup",        title:"Military Coup",           icon:"🎖️", description:"Your military has seized power — or attempted to. The streets are burning.",          stakes:"Critical", category:"Internal" },
  { id:"terror",      title:"Major Terror Attack",     icon:"💥", description:"A devastating attack on your capital. A known militant group claims responsibility.",   stakes:"Critical", category:"Security" },
  { id:"debt_crisis", title:"Sovereign Debt Crisis",   icon:"📉", description:"Your foreign debt payments come due. The IMF is calling.",                             stakes:"High",     category:"Economic" },
  { id:"civil_war",   title:"Civil War Ignites",       icon:"🔥", description:"Ethnic and political tensions explode into open armed conflict in your territory.",    stakes:"Critical", category:"Internal" },
  { id:"proxy_war",   title:"Proxy War Entanglement",  icon:"🎯", description:"A great power is funding militias on your border to destabilise you.",                 stakes:"High",     category:"Military" },
  { id:"election",    title:"Election Crisis",         icon:"🗳️", description:"A disputed election result is tearing your country apart. The world is watching.",    stakes:"High",     category:"Internal" },
];

const STAT_KEYS = ["Economy","Military","Diplomacy","Stability","GlobalPrestige"];
const POWER_COLORS = { Superpower:"#8b5cf6","Major Power":"#3b82f6","Regional Power":"#22c55e","Middle Power":"#f59e0b","Small State":"#94a3b8","Weak State":"#ef4444","Rogue State":"#ec4899" };
const STAKE_COLORS = { Critical:"#ef4444", High:"#f59e0b", Medium:"#22c55e" };

// ── HELPERS ───────────────────────────────────────────────────────────────────

function clamp(v) { return Math.max(5, Math.min(95, Math.round(v))); }
function getCountryAlliances(c) { return Object.entries(ALLIANCES).filter(([k])=>c.alliances.includes(k)).map(([k,v])=>({key:k,...v})); }
function getCountryThreats(c)   { return c.threats.map(t=>NON_STATE_ACTORS[t]).filter(Boolean); }
function getRelatedActors(country) {
  const seen=new Set(), actors=[];
  for(const [k,a] of Object.entries(NON_STATE_ACTORS)) {
    if((a.regions.some(r=>country.region.toLowerCase().includes(r)||r===country.id)||country.threats.includes(k))&&!seen.has(k)){seen.add(k);actors.push(a);}
  }
  return actors;
}

// ── ROBUST JSON PARSER — strips +signs, trailing commas etc ──────────────────

function safeParseJSON(raw) {
  const cleaned = raw
    .replace(/```json|```/g, "")
    .replace(/:\s*\+(\d)/g, ": $1")   // +5 → 5  (the main culprit)
    .replace(/,\s*}/g, "}")            // trailing commas in objects
    .replace(/,\s*]/g, "]")            // trailing commas in arrays
    .trim();
  return JSON.parse(cleaned);
}

// ── GLOBAL STYLES ─────────────────────────────────────────────────────────────

const G = `
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
  .action-btn:hover{border-color:var(--color-border-primary)!important;background:var(--color-background-secondary)!important;}
  .country-btn:hover{border-color:var(--color-border-primary)!important;}
  .paper-tab:hover{opacity:0.85;}
  .cont-btn:hover{background:var(--color-background-secondary)!important;}
  .press-btn:hover{border-color:#a09880!important;background:#f0ece0!important;}
`;

// ── SMALL COMPONENTS ──────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return <div style={{fontSize:10,letterSpacing:"0.12em",fontFamily:"var(--font-mono)",color:"var(--color-text-tertiary)",textTransform:"uppercase",marginBottom:8}}>{children}</div>;
}

function Divider({ label }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,margin:"18px 0 14px"}}>
      <div style={{flex:1,height:"0.5px",background:"var(--color-border-tertiary)"}}/>
      {label&&<span style={{fontSize:10,letterSpacing:"0.1em",color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)",whiteSpace:"nowrap"}}>{label}</span>}
      <div style={{flex:1,height:"0.5px",background:"var(--color-border-tertiary)"}}/>
    </div>
  );
}

function StatPill({ label, value }) {
  const color = value>65?"#22c55e":value>35?"#f59e0b":"#ef4444";
  return (
    <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",padding:"10px 8px",textAlign:"center"}}>
      <div style={{fontSize:9,color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)",marginBottom:4,letterSpacing:"0.08em"}}>{label.slice(0,5).toUpperCase()}</div>
      <div style={{fontSize:17,fontWeight:500,color,lineHeight:1}}>{value}</div>
    </div>
  );
}

function StatBar({ label, value, prev }) {
  const delta = prev!==undefined ? value-prev : 0;
  const color = value>65?"#22c55e":value>35?"#f59e0b":"#ef4444";
  return (
    <div style={{marginBottom:11}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <span style={{fontSize:11,color:"var(--color-text-secondary)",fontFamily:"var(--font-mono)"}}>{label}</span>
        <span style={{fontSize:11,fontWeight:500,display:"flex",alignItems:"center",gap:4}}>
          {value}
          {delta!==0&&<span style={{fontSize:10,color:delta>0?"#22c55e":"#ef4444"}}>{delta>0?`+${delta}`:delta}</span>}
        </span>
      </div>
      <div style={{height:5,background:"var(--color-background-tertiary)",borderRadius:3,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${value}%`,background:color,borderRadius:3,transition:"width 0.7s ease"}}/>
      </div>
    </div>
  );
}

function TypewriterText({ text, speed=13, onDone }) {
  const [disp,setDisp]=useState(""); const [done,setDone]=useState(false); const i=useRef(0);
  useEffect(()=>{
    setDisp(""); setDone(false); i.current=0;
    const iv=setInterval(()=>{
      if(i.current<text.length){setDisp(text.slice(0,i.current+1));i.current++;}
      else{clearInterval(iv);setDone(true);onDone&&onDone();}
    },speed);
    return()=>clearInterval(iv);
  },[text]);
  return <span>{disp}{!done&&<span style={{opacity:0.4,animation:"blink 0.8s infinite"}}>▌</span>}</span>;
}

// ── STAT DELTA PANEL ──────────────────────────────────────────────────────────

function StatDeltaPanel({ stats, prevStats }) {
  if(!prevStats) return null;
  const changes=STAT_KEYS.map(k=>({key:k,val:stats[k],delta:stats[k]-prevStats[k]})).filter(x=>x.delta!==0);
  if(!changes.length) return null;
  return (
    <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",padding:"10px 14px",animation:"fadeUp 0.4s ease 0.1s both"}}>
      <SectionLabel>Score changes this turn</SectionLabel>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {changes.map(({key,val,delta})=>(
          <div key={key} style={{display:"flex",alignItems:"center",gap:5,background:delta>0?"#f0fdf4":"#fef2f2",border:`0.5px solid ${delta>0?"#86efac":"#fca5a5"}`,borderRadius:"var(--border-radius-md)",padding:"4px 10px"}}>
            <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>{key}</span>
            <span style={{fontSize:12,fontWeight:500,color:delta>0?"#16a34a":"#dc2626"}}>{delta>0?"+":""}{delta}</span>
            <span style={{fontSize:10,color:"var(--color-text-tertiary)"}}>→ {val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── NEWSPAPER PANEL ───────────────────────────────────────────────────────────

function NewspaperPanel({ edition, country }) {
  const [tab,setTab]=useState(0);
  useEffect(()=>{setTab(0);},[edition]);
  if(!edition?.papers?.length) return null;
  const paper=edition.papers[tab];
  const outlet=NEWS_OUTLETS.find(o=>o.id===paper.outletId)||NEWS_OUTLETS[tab%NEWS_OUTLETS.length];

  return (
    <div style={{background:"#faf8f2",border:"0.5px solid #d0c8b0",borderRadius:"var(--border-radius-lg)",overflow:"hidden",animation:"fadeUp 0.4s ease"}}>
      {/* Outlet tabs */}
      <div style={{display:"flex",background:"#1c1c1c",borderBottom:`3px solid ${outlet.accentColor}`}}>
        {edition.papers.map((p,i)=>{
          const o=NEWS_OUTLETS.find(x=>x.id===p.outletId)||NEWS_OUTLETS[i%NEWS_OUTLETS.length];
          return (
            <button key={i} onClick={()=>setTab(i)} className="paper-tab"
              style={{flex:1,padding:"8px 6px",background:tab===i?o.accentColor:"transparent",color:tab===i?"#fff":"#888",border:"none",cursor:"pointer",fontSize:9,fontFamily:"Georgia,serif",letterSpacing:"0.08em",transition:"background 0.15s",textAlign:"center",lineHeight:1.3}}>
              {o.name}
            </button>
          );
        })}
      </div>
      <div style={{padding:"12px 16px 14px"}}>
        {/* Masthead */}
        <div style={{textAlign:"center",borderBottom:`1px solid ${outlet.accentColor}40`,paddingBottom:8,marginBottom:10}}>
          <div style={{fontSize:9,color:"#999",fontFamily:"Georgia,serif",letterSpacing:"0.12em",marginBottom:4}}>
            TURN {edition.turn} EDITION &nbsp;·&nbsp; {country.name.toUpperCase()} &nbsp;·&nbsp; SPECIAL REPORT
          </div>
          <div style={{fontSize:18,fontWeight:700,fontFamily:"Georgia,serif",color:"#1a1a1a",letterSpacing:"-0.01em"}}>{outlet.name.toUpperCase()}</div>
        </div>
        {/* Breaking tag */}
        {paper.breakingTag&&(
          <div style={{display:"inline-block",background:outlet.accentColor,color:"#fff",fontSize:8,padding:"2px 7px",fontFamily:"Georgia,serif",letterSpacing:"0.15em",marginBottom:8}}>
            ▶ {paper.breakingTag}
          </div>
        )}
        {/* Headline */}
        <h2 style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,lineHeight:1.25,color:"#1a1a1a",margin:"0 0 6px"}}>{paper.headline}</h2>
        {paper.subHeadline&&(
          <p style={{fontFamily:"Georgia,serif",fontSize:11,fontStyle:"italic",color:"#444",lineHeight:1.55,margin:"0 0 10px",borderBottom:"1px solid #e0d8c8",paddingBottom:10}}>
            {paper.subHeadline}
          </p>
        )}
        {/* Body + pull quote */}
        <div style={{display:"grid",gridTemplateColumns:paper.pullQuote?"1fr 130px":"1fr",gap:12,marginBottom:10}}>
          <p style={{fontFamily:"Georgia,serif",fontSize:12,lineHeight:1.7,color:"#222",margin:0}}>{paper.body}</p>
          {paper.pullQuote&&(
            <div style={{borderLeft:`3px solid ${outlet.accentColor}`,paddingLeft:10}}>
              <p style={{fontFamily:"Georgia,serif",fontSize:12,fontStyle:"italic",lineHeight:1.5,color:"#1a1a1a",margin:"0 0 5px"}}>"{paper.pullQuote.text}"</p>
              <p style={{fontFamily:"Georgia,serif",fontSize:9,color:"#777",margin:0}}>— {paper.pullQuote.attribution}</p>
            </div>
          )}
        </div>
        {/* Secondary stories */}
        {paper.secondaryStories?.length>0&&(
          <>
            <div style={{height:"0.5px",background:"#d0c8b0",margin:"10px 0"}}/>
            <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(paper.secondaryStories.length,3)},1fr)`,gap:0}}>
              {paper.secondaryStories.map((s,i)=>(
                <div key={i} style={{padding:"6px 10px",borderRight:i<paper.secondaryStories.length-1?"0.5px solid #d0c8b0":"none"}}>
                  <div style={{fontSize:8,color:outlet.accentColor,fontFamily:"Georgia,serif",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>{s.section}</div>
                  <div style={{fontSize:11,fontWeight:700,fontFamily:"Georgia,serif",color:"#1a1a1a",lineHeight:1.3,marginBottom:3}}>{s.headline}</div>
                  <div style={{fontSize:10,fontFamily:"Georgia,serif",color:"#555",lineHeight:1.5}}>{s.snippet}</div>
                </div>
              ))}
            </div>
          </>
        )}
        {/* Op-ed */}
        {paper.opEd&&(
          <>
            <div style={{height:"0.5px",background:"#d0c8b0",margin:"10px 0"}}/>
            <div style={{background:"#f0ece0",borderRadius:4,padding:"8px 12px",display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:outlet.accentColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{paper.opEd.authorIcon||"✍"}</div>
              <div>
                <div style={{fontSize:8,color:outlet.accentColor,fontFamily:"Georgia,serif",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>Opinion · {paper.opEd.author}</div>
                <div style={{fontSize:11,fontWeight:700,fontFamily:"Georgia,serif",color:"#1a1a1a",marginBottom:3}}>{paper.opEd.title}</div>
                <div style={{fontSize:10,fontFamily:"Georgia,serif",fontStyle:"italic",color:"#444",lineHeight:1.55}}>{paper.opEd.excerpt}</div>
              </div>
            </div>
          </>
        )}
        {/* Ticker */}
        {paper.ticker?.length>0&&(
          <div style={{background:"#1c1c1c",margin:"12px -16px -14px",padding:"5px 12px",display:"flex",gap:0,overflow:"hidden"}}>
            <span style={{fontSize:8,color:outlet.accentColor,fontWeight:700,fontFamily:"Georgia,serif",letterSpacing:"0.1em",marginRight:10,flexShrink:0}}>TICKER</span>
            <span style={{fontSize:9,color:"#bbb",fontFamily:"Georgia,serif",letterSpacing:"0.04em",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{paper.ticker.join("  ·  ")}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function NewspaperSkeleton() {
  return (
    <div style={{background:"#faf8f2",border:"0.5px solid #d0c8b0",borderRadius:"var(--border-radius-lg)",padding:"16px",animation:"fadeUp 0.3s ease"}}>
      <div style={{textAlign:"center",marginBottom:12}}>
        <div style={{fontSize:9,color:"#999",fontFamily:"Georgia,serif",letterSpacing:"0.1em",marginBottom:6}}>PRESS IS PRINTING...</div>
        <div style={{fontSize:16,fontWeight:700,fontFamily:"Georgia,serif",color:"#ccc"}}>THE WORLD HERALD</div>
      </div>
      {[80,55,100,40,70].map((w,i)=>(
        <div key={i} style={{height:i===0?18:10,width:`${w}%`,background:"#e0d8c8",borderRadius:2,marginBottom:8,animation:"pulse 1.5s ease infinite",animationDelay:`${i*0.15}s`}}/>
      ))}
    </div>
  );
}

// ── COUNTRY SELECT SCREEN ─────────────────────────────────────────────────────

function CountrySelectScreen({ onSelect, apiKey, setApiKey, showApiInput, setShowApiInput }) {
  const [filter,setFilter]=useState("All");
  const regions=["All",...new Set(COUNTRIES.map(c=>c.region))];
  const filtered=filter==="All"?COUNTRIES:COUNTRIES.filter(c=>c.region===filter);
  return (
    <div style={{fontFamily:"var(--font-sans)",maxWidth:900,margin:"0 auto",padding:"1.5rem 1rem"}}>
      <style>{G}</style>
      <div style={{marginBottom:"1.5rem"}}>
        <div style={{fontSize:10,letterSpacing:"0.14em",color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)",marginBottom:6}}>GEOPOLITICS SIMULATOR</div>
        <h1 style={{fontSize:24,fontWeight:500,margin:"0 0 6px",letterSpacing:"-0.02em"}}>Choose your nation</h1>
        <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>Lead a country through crisis. Every decision makes tomorrow's headlines.</p>
      </div>
      {showApiInput?(
        <div style={{background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-lg)",padding:"1rem",marginBottom:"1.25rem"}}>
          <p style={{fontSize:12,color:"var(--color-text-secondary)",margin:"0 0 8px"}}>Enter your OpenRouter API key:</p>
          <div style={{display:"flex",gap:8}}>
            <input type="password" placeholder="sk-or-..." value={apiKey} onChange={e=>setApiKey(e.target.value)}
              style={{flex:1,fontSize:13,padding:"7px 10px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)"}}/>
            <button onClick={()=>{window.__GEO_KEY__=apiKey;setShowApiInput(false);}}
              style={{fontSize:13,padding:"7px 16px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",cursor:"pointer",background:"var(--color-background-primary)",color:"var(--color-text-primary)"}}>Save</button>
          </div>
        </div>
      ):(
        <button onClick={()=>setShowApiInput(true)} style={{fontSize:11,color:"var(--color-text-tertiary)",background:"none",border:"none",cursor:"pointer",padding:"0 0 1.25rem",textDecoration:"underline"}}>
          {apiKey?"✓ API key set — change":"Set OpenRouter API key (required to play)"}
        </button>
      )}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:"1.25rem"}}>
        {regions.map(r=>(
          <button key={r} onClick={()=>setFilter(r)}
            style={{fontSize:11,padding:"4px 13px",borderRadius:99,border:`0.5px solid ${filter===r?"var(--color-border-primary)":"var(--color-border-tertiary)"}`,background:filter===r?"var(--color-background-secondary)":"transparent",cursor:"pointer",color:"var(--color-text-primary)",fontFamily:"var(--font-mono)",transition:"border-color 0.15s"}}>
            {r}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
        {filtered.map(c=>(
          <button key={c.id} onClick={()=>onSelect(c)} className="country-btn"
            style={{textAlign:"left",padding:"14px",borderRadius:"var(--border-radius-lg)",border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",cursor:"pointer",fontFamily:"var(--font-sans)",transition:"border-color 0.15s",width:"100%"}}>
            <div style={{fontSize:28,marginBottom:8,lineHeight:1}}>{c.flag}</div>
            <div style={{fontSize:13,fontWeight:500,marginBottom:3,color:"var(--color-text-primary)"}}>{c.name}</div>
            <div style={{fontSize:10,color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)",marginBottom:8,letterSpacing:"0.06em"}}>{c.region}</div>
            <div style={{display:"inline-block",fontSize:9,padding:"2px 7px",borderRadius:99,background:`${POWER_COLORS[c.power]||"#94a3b8"}18`,color:POWER_COLORS[c.power]||"#94a3b8",border:`0.5px solid ${POWER_COLORS[c.power]||"#94a3b8"}40`,fontFamily:"var(--font-mono)"}}>
              {c.power}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── SCENARIO SELECT SCREEN ────────────────────────────────────────────────────

function ScenarioSelectScreen({ country, onSelect, onBack, loading }) {
  return (
    <div style={{fontFamily:"var(--font-sans)",maxWidth:860,margin:"0 auto",padding:"1.5rem 1rem"}}>
      <style>{G}</style>
      <button onClick={onBack} style={{fontSize:12,color:"var(--color-text-secondary)",background:"none",border:"none",cursor:"pointer",padding:"0 0 1rem"}}>← Back</button>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem",padding:"14px 16px",background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-lg)",border:"0.5px solid var(--color-border-tertiary)"}}>
        <span style={{fontSize:32}}>{country.flag}</span>
        <div>
          <div style={{fontSize:10,color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)",letterSpacing:"0.1em",marginBottom:3}}>PLAYING AS</div>
          <div style={{fontSize:18,fontWeight:500,color:"var(--color-text-primary)"}}>{country.name}</div>
          <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:2}}>{country.traits}</div>
        </div>
      </div>
      <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:"1rem"}}>Select a crisis to navigate</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:10}}>
        {SCENARIOS.map(s=>(
          <button key={s.id} onClick={()=>onSelect(s)} disabled={loading} className="action-btn"
            style={{textAlign:"left",padding:14,borderRadius:"var(--border-radius-lg)",border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",cursor:"pointer",fontFamily:"var(--font-sans)",opacity:loading?0.6:1,transition:"border-color 0.15s,background 0.15s"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:22}}>{s.icon}</span>
              <span style={{fontSize:9,padding:"2px 7px",borderRadius:99,fontFamily:"var(--font-mono)",background:s.stakes==="Critical"?"#fef2f2":s.stakes==="High"?"#fffbeb":"#f0fdf4",color:STAKE_COLORS[s.stakes]}}>
                {s.stakes.toUpperCase()}
              </span>
            </div>
            <div style={{fontSize:13,fontWeight:500,marginBottom:3,color:"var(--color-text-primary)"}}>{s.title}</div>
            <div style={{fontSize:10,color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)",marginBottom:6,letterSpacing:"0.06em"}}>{s.category}</div>
            <div style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.55}}>{s.description}</div>
          </button>
        ))}
      </div>
      {loading&&<div style={{textAlign:"center",marginTop:"2rem",fontSize:13,color:"var(--color-text-secondary)"}}>⚙️ Generating your scenario...</div>}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────

export default function GeopoliticsSimulator() {
  const [phase,setPhase]                     = useState("select_country");
  const [country,setCountry]                 = useState(null);
  const [scenario,setScenario]               = useState(null);
  const [stats,setStats]                     = useState({Economy:60,Military:60,Diplomacy:60,Stability:65,GlobalPrestige:60});
  const [prevStats,setPrevStats]             = useState(null);
  const [strife,setStrife]                   = useState(30);
  const [relationships,setRelationships]     = useState({});
  const [turn,setTurn]                       = useState(1);
  const [situation,setSituation]             = useState("");
  const [actions,setActions]                 = useState([]);
  const [gameState,setGameState]             = useState("choosing");
  const [reactionText,setReactionText]       = useState("");
  const [statDeltas,setStatDeltas]           = useState(null);
  const [randomEvent,setRandomEvent]         = useState(null);
  const [pendingNext,setPendingNext]         = useState(null);
  const [loading,setLoading]                 = useState(false);
  const [newspaper,setNewspaper]             = useState(null);
  const [allEditions,setAllEditions]         = useState([]);
  const [newspaperLoading,setNewspaperLoading] = useState(false);
  const [log,setLog]                         = useState([]);
  const [apiKey,setApiKey]                   = useState("");
  const [showApiInput,setShowApiInput]       = useState(false);
  const [sideTab,setSideTab]                 = useState("alliances");
  // Track current action label for on-demand newspaper
  const lastActionRef = useRef("");
  const lastReactionRef = useRef("");

  // ── API ──

  async function callClaude(prompt, maxTokens=700) {
    const key = apiKey || window.__GEO_KEY__;
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`,"HTTP-Referer":window.location.href,"X-Title":"Geopolitics Simulator"},
      body: JSON.stringify({model:"anthropic/claude-3-haiku",max_tokens:maxTokens,messages:[{role:"user",content:prompt}]}),
    });
    const data = await res.json();
    if(data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
  }

  function buildCtx() {
    const allies=getCountryAlliances(country).map(a=>a.name).join(", ");
    const threats=getCountryThreats(country).map(a=>a.name).join(", ");
    return `Country: ${country.name} (${country.power}, ${country.region})\nTraits: ${country.traits}\nAlliances: ${allies||"none"} | Threats: ${threats||"none"} | Strife: ${strife}/100`;
  }

  // ── START GAME ──

  async function startGame(c, s) {
    setLoading(true);
    const init={
      Economy:        clamp(c.gdp>3000?70:c.gdp>500?55:35),
      Military:       clamp(c.military),
      Diplomacy:      clamp(c.diplomacy),
      Stability:      clamp(c.stability),
      GlobalPrestige: clamp(c.power==="Superpower"?85:c.power==="Major Power"?70:c.power==="Regional Power"?55:35),
    };
    setStats(init); setPrevStats(null); setStrife(c.internalStrife);
    setTurn(1); setLog([]); setReactionText(""); setRandomEvent(null);
    setNewspaper(null); setAllEditions([]); setStatDeltas(null); setGameState("choosing"); setPendingNext(null);
    const initRel={};
    ["usa","china","russia","india","germany","uk","iran","saudi_arabia"].forEach(id=>{
      const x=COUNTRIES.find(y=>y.id===id);
      if(x&&x.id!==c.id) initRel[id]=Math.floor(Math.random()*40)+30;
    });
    setRelationships(initRel);
    try {
      const allies=getCountryAlliances(c).map(a=>a.name).join(", ");
      const threats=getCountryThreats(c).map(a=>a.name).join(", ");
      const prompt=`Geopolitical simulation. Country: ${c.name} (${c.power}, ${c.region}). Traits: ${c.traits}. Alliances: ${allies||"none"}. Threats: ${threats||"none"}. Scenario: ${s.title} — ${s.description}.
Return ONLY valid JSON (no extra text, no markdown fences):
{"situation":"2-3 vivid sentences on the crisis from ${c.name} perspective.","internalEvent":"One sentence about immediate internal pressure.","actions":[{"id":"a1","label":"Short label","description":"One tradeoff sentence","statHints":{"Economy":0,"Military":5,"Diplomacy":-5,"Stability":-3,"GlobalPrestige":2}},{"id":"a2","label":"Short label","description":"One tradeoff sentence","statHints":{"Economy":-3,"Military":0,"Diplomacy":8,"Stability":2,"GlobalPrestige":5}},{"id":"a3","label":"Short label","description":"One tradeoff sentence","statHints":{"Economy":5,"Military":-2,"Diplomacy":-3,"Stability":5,"GlobalPrestige":-2}},{"id":"a4","label":"Short label","description":"One tradeoff sentence","statHints":{"Economy":-5,"Military":8,"Diplomacy":-8,"Stability":-5,"GlobalPrestige":-3}}]}`;
      const raw=await callClaude(prompt,600);
      const p=safeParseJSON(raw);
      setSituation(p.situation+(p.internalEvent?" "+p.internalEvent:""));
      setActions(p.actions);
      setPhase("playing");
    } catch(e){alert("Error starting game: "+e.message);}
    setLoading(false);
  }

  // ── HANDLE ACTION ──

  async function handleAction(action) {
    setLoading(true);
    setGameState("reacting");
    setReactionText("");
    setNewspaper(null);
    setNewspaperLoading(false);
    setStatDeltas(null);
    setRandomEvent(null);
    lastActionRef.current = action.label;

    const actorCtx=getRelatedActors(country).map(a=>a.name).join(", ");
    const allyCtx=getCountryAlliances(country).map(a=>a.name).join(", ");

    try {
      const prompt=`Geopolitical simulation — turn ${turn}.
${buildCtx()}
Scenario: ${scenario.title}. Situation: ${situation}
Player action: "${action.label}" — ${action.description}
Stats: Eco ${stats.Economy} Mil ${stats.Military} Dip ${stats.Diplomacy} Sta ${stats.Stability} Pre ${stats.GlobalPrestige} | Strife: ${strife}
Alliances: ${allyCtx||"none"} | Non-state actors nearby: ${actorCtx||"none"}
Recent decisions: ${log.slice(-2).map(l=>l.action).join(", ")||"none"}

Return ONLY valid JSON (no markdown, no + signs before numbers):
{"worldReaction":"2-3 sentences naming specific countries. Dramatic and realistic.","internalConsequence":"1 sentence of internal political consequence.","nonStateActorEvent":null,"randomEvent":null,"newSituation":"2-3 sentences for next turn.","newActions":[{"id":"a1","label":"Label","description":"One sentence"},{"id":"a2","label":"Label","description":"One sentence"},{"id":"a3","label":"Label","description":"One sentence"},{"id":"a4","label":"Label","description":"One sentence"}],"statChanges":{"Economy":0,"Military":0,"Diplomacy":0,"Stability":0,"GlobalPrestige":0},"strifeChange":0,"relationshipChanges":{"usa":0,"china":0,"russia":0},"gameOver":false,"gameOverReason":null}
All numeric values must be plain integers with NO + sign. statChanges range: -15 to 15. strifeChange: -10 to 15. If any stat hits 5 or 95, or strife reaches 90, set gameOver true.`;

      const raw=await callClaude(prompt,700);
      const p=safeParseJSON(raw);

      const snapshot={...stats};
      const newStats={};
      for(const k of STAT_KEYS) newStats[k]=clamp(stats[k]+(p.statChanges[k]||0));
      const newStrife=Math.max(0,Math.min(100,strife+(p.strifeChange||0)));
      const newRel={...relationships};
      for(const [k,v] of Object.entries(p.relationshipChanges||{})){if(newRel[k]!==undefined) newRel[k]=Math.max(0,Math.min(100,newRel[k]+v));}

      let fullText=p.worldReaction;
      if(p.internalConsequence) fullText+="\n\n🏛️ Internally: "+p.internalConsequence;
      if(p.nonStateActorEvent)  fullText+="\n\n⚠️ "+p.nonStateActorEvent;

      lastReactionRef.current = p.worldReaction;
      setPrevStats(snapshot);
      setStats(newStats);
      setStrife(newStrife);
      setRelationships(newRel);
      setReactionText(fullText);
      setStatDeltas(snapshot);
      if(p.randomEvent) setRandomEvent(p.randomEvent);
      setLog(prev=>[...prev,{turn,action:action.label,reaction:p.worldReaction,strife:newStrife}]);

      if(p.gameOver){
        setPendingNext({gameOver:true,reason:p.gameOverReason});
      } else {
        setPendingNext({situation:p.newSituation,actions:p.newActions});
      }

    } catch(e){alert("Error: "+e.message);setGameState("choosing");}
    setLoading(false);
  }

  // ── GENERATE NEWSPAPER (on demand) ──

  async function handleGenerateNewspaper() {
    setNewspaperLoading(true);
    try {
      const allies=getCountryAlliances(country).map(a=>a.name).join(", ");
      const prompt=`Fictional newspaper for a geopolitical game. Country: ${country.name} (${country.power}). Scenario: ${scenario.title}. Player action: "${lastActionRef.current}". World reaction: ${lastReactionRef.current}. Turn: ${turn}. Stats: Eco ${stats.Economy} Mil ${stats.Military} Dip ${stats.Diplomacy} Sta ${stats.Stability}. Alliances: ${allies||"none"}.
Generate 1 newspaper front page from a Western liberal perspective.
Return ONLY valid JSON (no markdown):
{"papers":[{"outletId":"herald","breakingTag":"BREAKING","headline":"Max 12 words headline","subHeadline":"One sentence deck","body":"2-3 sentence article referencing specific countries or actors","pullQuote":{"text":"Short quote under 12 words","attribution":"Name, Title"},"secondaryStories":[{"section":"WORLD","headline":"Headline","snippet":"One sentence."},{"section":"ECONOMY","headline":"Headline","snippet":"One sentence."}],"opEd":{"author":"Analyst name","authorIcon":"🎓","title":"Op-ed title","excerpt":"2 sentences commentary."},"ticker":["Item 1","Item 2","Item 3"]}]}`;
      const raw=await callClaude(prompt,600);
      const parsed=safeParseJSON(raw);
      const edition={...parsed,turn};
      setNewspaper(edition);
      setAllEditions(prev=>[...prev,edition]);
    } catch(e){ console.error("Newspaper error:",e); }
    setNewspaperLoading(false);
  }

  // ── CONTINUE ──

  function handleContinue() {
    if(!pendingNext) return;
    if(pendingNext.gameOver){
      setSituation(pendingNext.reason);
      setActions([]);
      setPhase("result");
    } else {
      setSituation(pendingNext.situation);
      setActions(pendingNext.actions);
      setTurn(t=>t+1);
      setGameState("choosing");
      setReactionText("");
      setStatDeltas(null);
      setRandomEvent(null);
      setNewspaper(null);
      setNewspaperLoading(false);
      setPendingNext(null);
    }
  }

  // ── SCREENS ──

  if(phase==="select_country") return (
    <CountrySelectScreen onSelect={c=>{setCountry(c);setPhase("select_scenario");}} apiKey={apiKey} setApiKey={setApiKey} showApiInput={showApiInput} setShowApiInput={setShowApiInput}/>
  );

  if(phase==="select_scenario") return (
    <ScenarioSelectScreen country={country} onSelect={s=>{setScenario(s);startGame(country,s);}} onBack={()=>setPhase("select_country")} loading={loading}/>
  );

  // ── PLAYING ──

  if(phase==="playing") return (
    <div style={{fontFamily:"var(--font-sans)",maxWidth:980,margin:"0 auto",padding:"1.25rem 1rem"}}>
      <style>{G}</style>

      {/* TOPBAR */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem",paddingBottom:"0.75rem",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:24}}>{country.flag}</span>
          <div>
            <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)"}}>{country.name}</div>
            <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{scenario.icon} {scenario.title}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <div style={{fontSize:10,fontFamily:"var(--font-mono)",color:"var(--color-text-tertiary)",background:"var(--color-background-secondary)",padding:"4px 10px",borderRadius:99,border:"0.5px solid var(--color-border-tertiary)"}}>TURN {turn}</div>
          <div style={{fontSize:10,fontFamily:"var(--font-mono)",color:strife>60?"#ef4444":strife>35?"#f59e0b":"#22c55e",background:"var(--color-background-secondary)",padding:"4px 10px",borderRadius:99,border:"0.5px solid var(--color-border-tertiary)"}}>STRIFE {strife}</div>
          <button onClick={()=>setPhase("select_scenario")} style={{fontSize:10,padding:"4px 10px",borderRadius:99,border:"0.5px solid var(--color-border-tertiary)",background:"none",cursor:"pointer",color:"var(--color-text-tertiary)"}}>↩ New Scenario</button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 240px",gap:14,alignItems:"start"}}>

        {/* LEFT COLUMN */}
        <div>

          {/* SITUATION */}
          <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem",marginBottom:12}}>
            <SectionLabel>Situation Report — Turn {turn}</SectionLabel>
            <p style={{fontSize:14,lineHeight:1.75,margin:0,color:"var(--color-text-primary)"}}>{situation}</p>
          </div>

          {/* SHOCK EVENT */}
          {randomEvent&&(
            <div style={{background:"#fef2f2",border:"0.5px solid #fca5a5",borderLeft:"3px solid #ef4444",borderRadius:"var(--border-radius-md)",padding:"10px 14px",marginBottom:12,animation:"fadeUp 0.3s ease"}}>
              <div style={{fontSize:10,fontFamily:"var(--font-mono)",color:"#ef4444",letterSpacing:"0.1em",marginBottom:4}}>⚡ SHOCK EVENT — {randomEvent.title.toUpperCase()}</div>
              <p style={{fontSize:13,color:"#7f1d1d",lineHeight:1.6,margin:0}}>{randomEvent.description}</p>
            </div>
          )}

          {/* WORLD REACTION */}
          {reactionText&&(
            <div style={{background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",borderLeft:"3px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem",marginBottom:12,animation:"fadeUp 0.3s ease"}}>
              <SectionLabel>🌐 World Reaction</SectionLabel>
              <p style={{fontSize:14,lineHeight:1.75,margin:0,whiteSpace:"pre-wrap",color:"var(--color-text-primary)"}}>
                <TypewriterText text={reactionText} speed={11}/>
              </p>
            </div>
          )}

          {/* STAT DELTAS */}
          {reactionText&&statDeltas&&(
            <div style={{marginBottom:12}}>
              <StatDeltaPanel stats={stats} prevStats={statDeltas}/>
            </div>
          )}

          {/* NEWSPAPER — on demand */}
          {reactionText&&(
            <div style={{marginBottom:12}}>
              <Divider label="WORLD PRESS"/>
              {!newspaper&&!newspaperLoading&&(
                <button onClick={handleGenerateNewspaper} className="press-btn"
                  style={{width:"100%",padding:"11px 14px",borderRadius:"var(--border-radius-lg)",border:"0.5px solid #d0c8b0",background:"#faf8f2",cursor:"pointer",fontSize:12,color:"#666",fontFamily:"Georgia,serif",letterSpacing:"0.04em",transition:"border-color 0.15s,background 0.15s",textAlign:"center"}}>
                  📰 Generate press coverage for this turn
                </button>
              )}
              {newspaperLoading&&!newspaper&&<NewspaperSkeleton/>}
              {newspaper&&<NewspaperPanel edition={newspaper} country={country}/>}
            </div>
          )}

          {/* CONTINUE BUTTON */}
          {reactionText&&pendingNext&&!loading&&(
            <div style={{marginBottom:12,animation:"fadeUp 0.4s ease 0.2s both"}}>
              <button onClick={handleContinue} className="cont-btn"
                style={{width:"100%",padding:"13px",borderRadius:"var(--border-radius-lg)",border:"0.5px solid var(--color-border-primary)",background:"var(--color-background-primary)",cursor:"pointer",fontSize:13,fontWeight:500,color:"var(--color-text-primary)",fontFamily:"var(--font-sans)",transition:"background 0.15s"}}>
                {pendingNext.gameOver?"See Final Outcome →":"Continue to Turn "+(turn+1)+" →"}
              </button>
            </div>
          )}

          {/* ACTION CHOICES */}
          {gameState==="choosing"&&actions.length>0&&!loading&&(
            <div style={{animation:"fadeUp 0.3s ease"}}>
              <Divider label="YOUR MOVE"/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {actions.map((a,i)=>(
                  <button key={a.id} onClick={()=>handleAction(a)} className="action-btn"
                    style={{textAlign:"left",padding:"13px 14px",borderRadius:"var(--border-radius-lg)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",cursor:"pointer",fontFamily:"var(--font-sans)",animation:`fadeUp 0.3s ease ${i*0.06}s both`,transition:"border-color 0.15s,background 0.15s"}}>
                    <div style={{fontSize:13,fontWeight:500,marginBottom:5,color:"var(--color-text-primary)"}}>{a.label}</div>
                    <div style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.55,marginBottom:a.statHints?8:0}}>{a.description}</div>
                    {a.statHints&&(
                      <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                        {Object.entries(a.statHints).filter(([,v])=>v!==0).map(([k,v])=>(
                          <span key={k} style={{fontSize:10,color:v>0?"#16a34a":"#dc2626",fontFamily:"var(--font-mono)",background:v>0?"#f0fdf4":"#fef2f2",padding:"1px 5px",borderRadius:3}}>{k.slice(0,3)} {v>0?"+":""}{v}</span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading&&(
            <div style={{textAlign:"center",padding:"2rem 0",color:"var(--color-text-secondary)",fontSize:13}}>⚙️ Simulating consequences...</div>
          )}

          {/* DECISION LOG */}
          {log.length>0&&gameState==="choosing"&&(
            <div style={{marginTop:4}}>
              <Divider label="DECISION LOG"/>
              {log.slice().reverse().map((e,i)=>(
                <div key={i} style={{paddingLeft:12,borderLeft:"2px solid var(--color-border-tertiary)",marginBottom:12}}>
                  <div style={{fontSize:10,fontFamily:"var(--font-mono)",color:"var(--color-text-tertiary)",marginBottom:3}}>TURN {e.turn}</div>
                  <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:3}}>{e.action}</div>
                  <div style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.6}}>{e.reaction.slice(0,160)}…</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{position:"sticky",top:"1rem"}}>

          {/* Stats */}
          <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1rem",marginBottom:10}}>
            <SectionLabel>National Stats</SectionLabel>
            {STAT_KEYS.map(k=><StatBar key={k} label={k} value={stats[k]} prev={prevStats?.[k]}/>)}
            <div style={{borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:10,marginTop:6}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                <span style={{color:"var(--color-text-secondary)"}}>Internal Strife</span>
                <span style={{color:strife>60?"#ef4444":strife>35?"#f59e0b":"#22c55e",fontWeight:500}}>{strife}</span>
              </div>
              <div style={{height:5,background:"var(--color-background-tertiary)",borderRadius:3}}>
                <div style={{height:"100%",width:`${strife}%`,background:strife>60?"#ef4444":strife>35?"#f59e0b":"#22c55e",borderRadius:3,transition:"width 0.7s"}}/>
              </div>
            </div>
          </div>

          {/* Side info tabs */}
          <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",overflow:"hidden",marginBottom:10}}>
            <div style={{display:"flex",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
              {["alliances","threats","diplo"].map(t=>(
                <button key={t} onClick={()=>setSideTab(t)}
                  style={{flex:1,fontSize:10,padding:"7px 4px",background:"none",border:"none",borderBottom:`2px solid ${sideTab===t?"var(--color-text-primary)":"transparent"}`,cursor:"pointer",color:sideTab===t?"var(--color-text-primary)":"var(--color-text-tertiary)",fontFamily:"var(--font-sans)",transition:"border-color 0.15s"}}>
                  {t==="alliances"?"Allies":t==="threats"?"Threats":"Diplo"}
                </button>
              ))}
            </div>
            <div style={{padding:"10px 12px",maxHeight:240,overflowY:"auto"}}>
              {sideTab==="alliances"&&(
                getCountryAlliances(country).length===0
                  ?<div style={{fontSize:11,color:"var(--color-text-secondary)"}}>No formal alliances.</div>
                  :getCountryAlliances(country).map(a=>(
                    <div key={a.key} style={{marginBottom:10,paddingLeft:8,borderLeft:`2px solid ${a.color}`}}>
                      <div style={{fontSize:12,fontWeight:500,color:a.color,marginBottom:2}}>{a.name}</div>
                      <div style={{fontSize:10,color:"var(--color-text-secondary)",lineHeight:1.5}}>{a.description}</div>
                    </div>
                  ))
              )}
              {sideTab==="threats"&&(
                Object.entries(NON_STATE_ACTORS).map(([k,a])=>{
                  const rel=a.regions.some(r=>r===country.id||country.region.toLowerCase().includes(r))||country.threats.includes(k);
                  return rel?(
                    <div key={k} style={{marginBottom:8,display:"flex",gap:6,alignItems:"flex-start"}}>
                      <span style={{fontSize:14}}>{a.icon}</span>
                      <div>
                        <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-primary)"}}>{a.name}</div>
                        <div style={{fontSize:10,color:"var(--color-text-secondary)"}}>{a.ideology}</div>
                      </div>
                    </div>
                  ):null;
                })
              )}
              {sideTab==="diplo"&&(
                Object.entries(relationships).map(([id,score])=>{
                  const c2=COUNTRIES.find(x=>x.id===id); if(!c2) return null;
                  return (
                    <div key={id} style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
                      <span style={{fontSize:14}}>{c2.flag}</span>
                      <div style={{flex:1,height:4,background:"var(--color-background-tertiary)",borderRadius:2}}>
                        <div style={{height:"100%",width:`${score}%`,background:score>60?"#22c55e":score>35?"#f59e0b":"#ef4444",borderRadius:2,transition:"width 0.5s"}}/>
                      </div>
                      <span style={{fontSize:10,fontFamily:"var(--font-mono)",color:"var(--color-text-secondary)",minWidth:20,textAlign:"right"}}>{score}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Press archive */}
          {allEditions.length>0&&(
            <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"10px 12px"}}>
              <SectionLabel>Press Archive</SectionLabel>
              {allEditions.map((ed,i)=>{
                const p=ed.papers?.[0]; if(!p) return null;
                const o=NEWS_OUTLETS.find(x=>x.id===p.outletId)||NEWS_OUTLETS[0];
                return (
                  <div key={i} style={{marginBottom:7,paddingLeft:8,borderLeft:`2px solid ${o.accentColor}`}}>
                    <div style={{fontSize:9,color:o.accentColor,fontFamily:"Georgia,serif",fontWeight:700,marginBottom:2}}>T{ed.turn} · {o.name}</div>
                    <div style={{fontSize:10,fontFamily:"Georgia,serif",color:"var(--color-text-primary)",lineHeight:1.35}}>{p.headline}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── RESULT ──

  if(phase==="result"){
    const avg=Math.round(STAT_KEYS.reduce((s,k)=>s+stats[k],0)/STAT_KEYS.length);
    const outcome=avg>65?{label:"Diplomatic Triumph",color:"#22c55e",icon:"🏆"}:avg>45?{label:"Uneasy Stalemate",color:"#f59e0b",icon:"⚖️"}:{label:"State Collapse",color:"#ef4444",icon:"💥"};
    return (
      <div style={{fontFamily:"var(--font-sans)",maxWidth:700,margin:"0 auto",padding:"2rem 1rem"}}>
        <style>{G}</style>
        <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
          <div style={{fontSize:52,marginBottom:12}}>{outcome.icon}</div>
          <div style={{fontSize:10,letterSpacing:"0.12em",color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)",marginBottom:6}}>GAME OVER — {turn} TURNS</div>
          <h2 style={{fontSize:24,fontWeight:500,color:outcome.color,margin:"0 0 1rem",letterSpacing:"-0.02em"}}>{outcome.label}</h2>
        </div>
        <div style={{background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem",marginBottom:"1.25rem"}}>
          <p style={{fontSize:14,lineHeight:1.75,margin:0}}>{situation}</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:"1.25rem"}}>
          {STAT_KEYS.map(k=><StatPill key={k} label={k} value={stats[k]}/>)}
        </div>
        {allEditions.length>0&&(
          <>
            <Divider label="YOUR TENURE IN THE WORLD PRESS"/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8,marginBottom:"1.5rem"}}>
              {allEditions.flatMap((ed,i)=>(ed.papers||[]).slice(0,1).map((p,j)=>{
                const o=NEWS_OUTLETS.find(x=>x.id===p.outletId)||NEWS_OUTLETS[0];
                return (
                  <div key={`${i}-${j}`} style={{padding:"10px 12px",borderRadius:"var(--border-radius-md)",border:`0.5px solid ${o.accentColor}40`,borderLeft:`3px solid ${o.accentColor}`,background:"#faf8f2"}}>
                    <div style={{fontSize:9,color:o.accentColor,fontFamily:"Georgia,serif",fontWeight:700,marginBottom:4}}>T{ed.turn} · {o.name}</div>
                    <div style={{fontSize:11,fontFamily:"Georgia,serif",lineHeight:1.4,color:"#1a1a1a"}}>{p.headline}</div>
                  </div>
                );
              }))}
            </div>
          </>
        )}
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button onClick={()=>{setPhase("select_country");setCountry(null);setScenario(null);}}
            style={{fontSize:13,padding:"10px 24px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",cursor:"pointer",fontFamily:"var(--font-sans)"}}>
            New Game
          </button>
          <button onClick={()=>startGame(country,scenario)}
            style={{fontSize:13,padding:"10px 24px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",cursor:"pointer",fontFamily:"var(--font-sans)"}}>
            Replay Scenario
          </button>
        </div>
      </div>
    );
  }
}
