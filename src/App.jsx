import { useState, useRef, useEffect } from "react";

// ── DATA ─────────────────────────────────────────────────────────────────────

const ALLIANCES = {
  NATO:       { name:"NATO",        color:"#3b82f6", members:["usa","uk","germany","poland","france","turkey"],                  description:"Collective defence — Article 5 mutual defence" },
  SCO:        { name:"SCO",         color:"#ef4444", members:["china","russia","india","pakistan","iran","kazakhstan"],          description:"Shanghai Cooperation Organisation — security & trade" },
  BRICS:      { name:"BRICS",       color:"#f59e0b", members:["brazil","russia","india","china","south_africa","iran"],          description:"Emerging economies — challenging Western financial order" },
  ARAB_LEAGUE:{ name:"Arab League", color:"#22c55e", members:["saudi_arabia","egypt","jordan","syria","libya","iraq"],           description:"Pan-Arab political coordination bloc" },
  QUAD:       { name:"QUAD",        color:"#8b5cf6", members:["usa","india","japan","australia"],                                description:"Indo-Pacific security dialogue targeting China's expansion" },
  CSTO:       { name:"CSTO",        color:"#ec4899", members:["russia","kazakhstan","belarus","armenia"],                        description:"Russia-led collective security — CIS equivalent of NATO" },
};

const NON_STATE_ACTORS = {
  isis:      { name:"ISIS/DAESH",          icon:"☠️", regions:["syria","iraq","libya","afghanistan"],       threat:"Critical", ideology:"Salafi-jihadist caliphate" },
  hamas:     { name:"Hamas",               icon:"🎯", regions:["israel_pal","egypt","jordan"],              threat:"High",     ideology:"Palestinian Islamist resistance" },
  hezbollah: { name:"Hezbollah",           icon:"🚀", regions:["lebanon","syria","iran"],                   threat:"High",     ideology:"Shia Islamist, Iran proxy" },
  let:       { name:"Lashkar-e-Tayyaba",   icon:"💣", regions:["pakistan","india","afghanistan"],           threat:"High",     ideology:"Kashmir-focused jihadist group" },
  ttp:       { name:"TTP",                 icon:"🔫", regions:["pakistan","afghanistan"],                   threat:"High",     ideology:"Anti-Pakistan state jihadist" },
  alnusra:   { name:"Al-Qaeda/Nusra",      icon:"⚡", regions:["syria","libya","afghanistan","mali"],       threat:"Critical", ideology:"Global jihad, anti-Western" },
  houthis:   { name:"Houthis",             icon:"🛥️", regions:["yemen","saudi_arabia"],                    threat:"High",     ideology:"Shia insurgency, Iran-aligned" },
};

// Fictional news outlets with distinct editorial slants
const NEWS_OUTLETS = [
  { id:"herald",    name:"The World Herald",        origin:"usa",          bias:"western_liberal",  style:"broadsheet", accentColor:"#1a3a6e", logo:"⬛" },
  { id:"xinhua_t",  name:"Global Times",            origin:"china",        bias:"eastern_statist",  style:"tabloid",    accentColor:"#cc0000", logo:"🔴" },
  { id:"al_watan",  name:"Al-Watan Tribune",        origin:"saudi_arabia", bias:"gulf_conservative",style:"broadsheet", accentColor:"#1d6b2f", logo:"🌙" },
  { id:"sentinel",  name:"The Independent Sentinel", origin:"uk",           bias:"centrist",         style:"broadsheet", accentColor:"#2c2c2c", logo:"◆" },
  { id:"pravda_t",  name:"Pravda International",    origin:"russia",       bias:"pro_kremlin",      style:"tabloid",    accentColor:"#8B0000", logo:"★" },
  { id:"tribune",   name:"South Asia Tribune",      origin:"india",        bias:"regional_power",   style:"broadsheet", accentColor:"#FF6600", logo:"◉" },
];

const COUNTRIES = [
  { id:"usa",         name:"United States",    flag:"🇺🇸", region:"North America", power:"Superpower",    gdp:25000, military:100, diplomacy:90, stability:72, internalStrife:28, alliances:["NATO","QUAD"],         threats:[],                      traits:"Global hegemon, NATO anchor, dollar dominance, internal polarisation rising" },
  { id:"china",       name:"China",            flag:"🇨🇳", region:"Asia",          power:"Superpower",    gdp:18000, military:95,  diplomacy:80, stability:78, internalStrife:18, alliances:["SCO","BRICS"],         threats:[],                      traits:"Rising superpower, Belt & Road, Taiwan ambitions, Xinjiang tensions" },
  { id:"russia",      name:"Russia",           flag:"🇷🇺", region:"Eurasia",       power:"Major Power",   gdp:2200,  military:88,  diplomacy:60, stability:60, internalStrife:30, alliances:["SCO","CSTO","BRICS"],  threats:[],                      traits:"Nuclear power, energy weaponisation, revisionist, sanctions-hit" },
  { id:"india",       name:"India",            flag:"🇮🇳", region:"South Asia",    power:"Major Power",   gdp:3700,  military:80,  diplomacy:75, stability:68, internalStrife:32, alliances:["SCO","QUAD","BRICS"],  threats:["let"],                 traits:"Strategic autonomy, border disputes with China & Pakistan, fastest-growing economy" },
  { id:"uk",          name:"United Kingdom",   flag:"🇬🇧", region:"Europe",        power:"Regional Power",gdp:3100,  military:72,  diplomacy:82, stability:70, internalStrife:22, alliances:["NATO"],                threats:[],                      traits:"P5 member, post-Brexit pivot, global finance, devolution pressures" },
  { id:"germany",     name:"Germany",          flag:"🇩🇪", region:"Europe",        power:"Regional Power",gdp:4400,  military:58,  diplomacy:85, stability:78, internalStrife:20, alliances:["NATO"],                threats:[],                      traits:"EU economic engine, energy transition, rearming post-Ukraine, far-right rise" },
  { id:"japan",       name:"Japan",            flag:"🇯🇵", region:"East Asia",     power:"Regional Power",gdp:4200,  military:62,  diplomacy:78, stability:82, internalStrife:10, alliances:["QUAD"],                threats:[],                      traits:"Pacifist constitution revision, China threat, US alliance, demographic crisis" },
  { id:"france",      name:"France",           flag:"🇫🇷", region:"Europe",        power:"Regional Power",gdp:3000,  military:70,  diplomacy:80, stability:65, internalStrife:35, alliances:["NATO"],                threats:[],                      traits:"Nuclear state, EU co-leader, Sahel interventions, domestic unrest" },
  { id:"iran",        name:"Iran",             flag:"🇮🇷", region:"Middle East",   power:"Regional Power",gdp:400,   military:68,  diplomacy:42, stability:55, internalStrife:45, alliances:["SCO","BRICS"],         threats:["houthis","hezbollah"],  traits:"Axis of Resistance, proxy network, sanctions, nuclear programme" },
  { id:"pakistan",    name:"Pakistan",         flag:"🇵🇰", region:"South Asia",    power:"Regional Power",gdp:380,   military:65,  diplomacy:50, stability:42, internalStrife:60, alliances:["SCO"],                 threats:["ttp","let"],           traits:"Nuclear state, civil-military tension, IMF crisis, Afghan border chaos" },
  { id:"turkey",      name:"Turkey",           flag:"🇹🇷", region:"Eurasia",       power:"Regional Power",gdp:1100,  military:70,  diplomacy:68, stability:60, internalStrife:38, alliances:["NATO"],                threats:[],                      traits:"NATO's awkward member, Erdoğan neo-Ottoman pivot, balances Russia & West" },
  { id:"saudi_arabia",name:"Saudi Arabia",     flag:"🇸🇦", region:"Middle East",   power:"Regional Power",gdp:1100,  military:65,  diplomacy:72, stability:68, internalStrife:22, alliances:["ARAB_LEAGUE"],         threats:["houthis","isis"],      traits:"OPEC kingpin, Vision 2030, Yemen war, US security partner" },
  { id:"israel",      name:"Israel",           flag:"🇮🇱", region:"Middle East",   power:"Regional Power",gdp:530,   military:80,  diplomacy:55, stability:62, internalStrife:40, alliances:[],                     threats:["hamas","hezbollah"],   traits:"Nuclear-ambiguous, Abraham Accords, Gaza conflict, Iran threat" },
  { id:"brazil",      name:"Brazil",           flag:"🇧🇷", region:"South America", power:"Regional Power",gdp:2100,  military:55,  diplomacy:70, stability:62, internalStrife:28, alliances:["BRICS"],               threats:[],                      traits:"Amazon geopolitics, BRICS leader, Lula's multipolar diplomacy" },
  { id:"poland",      name:"Poland",           flag:"🇵🇱", region:"Europe",        power:"Middle Power",  gdp:750,   military:60,  diplomacy:65, stability:72, internalStrife:25, alliances:["NATO"],                threats:[],                      traits:"NATO's eastern flank anchor, Russia border anxiety, rearmament surge" },
  { id:"taiwan",      name:"Taiwan",           flag:"🇹🇼", region:"East Asia",     power:"Middle Power",  gdp:790,   military:55,  diplomacy:40, stability:75, internalStrife:15, alliances:[],                     threats:[],                      traits:"Semiconductor giant, existential China threat, US informal ally" },
  { id:"afghanistan", name:"Afghanistan",      flag:"🇦🇫", region:"South Asia",    power:"Weak State",    gdp:15,    military:30,  diplomacy:15, stability:20, internalStrife:80, alliances:[],                     threats:["isis","ttp","alnusra"], traits:"Taliban rule, humanitarian collapse, ISIS-K insurgency" },
  { id:"syria",       name:"Syria",            flag:"🇸🇾", region:"Middle East",   power:"Weak State",    gdp:22,    military:38,  diplomacy:20, stability:18, internalStrife:82, alliances:["ARAB_LEAGUE"],         threats:["isis","alnusra"],      traits:"Post-civil war, Assad regime, ISIS remnants, foreign forces on soil" },
  { id:"libya",       name:"Libya",            flag:"🇱🇾", region:"North Africa",  power:"Weak State",    gdp:50,    military:28,  diplomacy:22, stability:20, internalStrife:78, alliances:["ARAB_LEAGUE"],         threats:["isis","alnusra"],      traits:"Dual government, militia fragmentation, Wagner group, oil curse" },
  { id:"nepal",       name:"Nepal",            flag:"🇳🇵", region:"South Asia",    power:"Small State",   gdp:40,    military:22,  diplomacy:45, stability:58, internalStrife:30, alliances:[],                     threats:[],                      traits:"India-China squeeze, political instability, Himalayan buffer state" },
  { id:"bangladesh",  name:"Bangladesh",       flag:"🇧🇩", region:"South Asia",    power:"Small State",   gdp:460,   military:35,  diplomacy:52, stability:55, internalStrife:35, alliances:[],                     threats:["let"],                 traits:"Garment economy, climate vulnerability, Rohingya burden" },
  { id:"ukraine",     name:"Ukraine",          flag:"🇺🇦", region:"Europe",        power:"Middle Power",  gdp:200,   military:65,  diplomacy:70, stability:25, internalStrife:20, alliances:[],                     threats:[],                      traits:"Active war with Russia, Western arms dependency, EU candidate" },
  { id:"north_korea", name:"North Korea",      flag:"🇰🇵", region:"East Asia",     power:"Rogue State",   gdp:18,    military:60,  diplomacy:8,  stability:70, internalStrife:10, alliances:[],                     threats:[],                      traits:"Nuclear hermit state, missile provocations, Russia alignment" },
  { id:"ethiopia",    name:"Ethiopia",         flag:"🇪🇹", region:"Africa",        power:"Regional Power",gdp:130,   military:45,  diplomacy:48, stability:38, internalStrife:65, alliances:[],                     threats:["isis"],                traits:"Tigray aftermath, Nile dam dispute, BRICS aspirant" },
];

const SCENARIOS = [
  { id:"trade_war",   title:"Trade War Erupts",         icon:"📦", description:"A major trading partner slaps 40% tariffs. Your exporters are panicking.",                   stakes:"High",     category:"Economic" },
  { id:"territorial", title:"Territorial Flashpoint",   icon:"🗺️", description:"A neighbour seizes disputed territory. Troops are mobilising on both sides.",               stakes:"Critical", category:"Military" },
  { id:"cyber",       title:"Critical Cyberattack",     icon:"💻", description:"Your power grid and banking system were hit by a sophisticated state actor.",                 stakes:"High",     category:"Security" },
  { id:"pandemic",    title:"Pandemic Outbreak",        icon:"🦠", description:"A lethal pathogen emerges in your territory. The WHO is alarmed.",                           stakes:"Critical", category:"Health" },
  { id:"climate",     title:"Climate Accord Collapse",  icon:"🌍", description:"The global climate framework is fracturing. Your stance will define alliances.",             stakes:"Medium",   category:"Diplomacy" },
  { id:"refugee",     title:"Refugee Flood",            icon:"🏕️", description:"Millions flee conflict next door. Neighbours seal borders and point at you.",               stakes:"High",     category:"Humanitarian" },
  { id:"sanctions",   title:"Sanctions & Isolation",    icon:"🔒", description:"A coalition of powers imposes sweeping economic sanctions.",                                 stakes:"Critical", category:"Economic" },
  { id:"nuclear",     title:"Nuclear Neighbour",        icon:"☢️", description:"A bordering state announces nuclear capability. Your doctrine is obsolete.",                stakes:"Critical", category:"Military" },
  { id:"coup",        title:"Military Coup",            icon:"🎖️", description:"Your military has seized power — or attempted to. The streets are burning.",               stakes:"Critical", category:"Internal" },
  { id:"terror",      title:"Major Terror Attack",      icon:"💥", description:"A devastating attack on your capital. A known militant group claims responsibility.",        stakes:"Critical", category:"Security" },
  { id:"debt_crisis", title:"Sovereign Debt Crisis",    icon:"📉", description:"Your foreign debt payments come due. The IMF is calling.",                                  stakes:"High",     category:"Economic" },
  { id:"civil_war",   title:"Civil War Ignites",        icon:"🔥", description:"Ethnic and political tensions explode into open armed conflict.",                           stakes:"Critical", category:"Internal" },
  { id:"proxy_war",   title:"Proxy War Entanglement",   icon:"🎯", description:"A great power is funding militias on your border to destabilise you.",                      stakes:"High",     category:"Military" },
  { id:"election",    title:"Election Crisis",          icon:"🗳️", description:"A disputed election result is tearing your country apart. The world is watching.",         stakes:"High",     category:"Internal" },
];

const STAT_KEYS = ["Economy","Military","Diplomacy","Stability","GlobalPrestige"];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function clamp(v) { return Math.max(5, Math.min(95, Math.round(v))); }

function getCountryAlliances(country) {
  return Object.entries(ALLIANCES).filter(([k]) => country.alliances.includes(k)).map(([k,v]) => ({ key:k, ...v }));
}
function getCountryThreats(country) {
  return country.threats.map(t => NON_STATE_ACTORS[t]).filter(Boolean);
}
function getRelatedActors(scenario, country) {
  const seen = new Set(); const actors = [];
  for (const [k,a] of Object.entries(NON_STATE_ACTORS)) {
    if ((a.regions.some(r => country.region.toLowerCase().includes(r) || r === country.id) || country.threats.includes(k)) && !seen.has(k)) { seen.add(k); actors.push(a); }
  }
  return actors;
}

// ── NEWSPAPER COMPONENT ────────────────────────────────────────────────────

function NewspaperFront({ edition, country, onClose }) {
  const [visible, setVisible] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState(0);

  useEffect(() => { setTimeout(() => setVisible(true), 50); }, []);

  if (!edition || !edition.papers || edition.papers.length === 0) return null;

  const paper = edition.papers[selectedOutlet] || edition.papers[0];
  const outlet = NEWS_OUTLETS.find(o => o.id === paper.outletId) || NEWS_OUTLETS[0];

  const biasLabels = {
    western_liberal: "Western / Liberal",
    eastern_statist: "State-aligned / Eastern",
    gulf_conservative: "Gulf / Conservative",
    centrist: "Independent / Centrist",
    pro_kremlin: "State Media",
    regional_power: "Regional / Nationalist",
  };

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:1000,
      display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem",
      opacity: visible ? 1 : 0, transition:"opacity 0.25s ease",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width:"100%", maxWidth:680, maxHeight:"90vh", overflowY:"auto",
        background:"#faf8f2", borderRadius:4, boxShadow:"0 20px 60px rgba(0,0,0,0.5)",
        transform: visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(16px)",
        transition:"transform 0.3s ease",
      }}>

        {/* Outlet tabs */}
        <div style={{ display:"flex", borderBottom:"2px solid #1a1a1a", overflowX:"auto", background:"#1a1a1a" }}>
          {edition.papers.map((p, i) => {
            const o = NEWS_OUTLETS.find(x => x.id === p.outletId) || NEWS_OUTLETS[i % NEWS_OUTLETS.length];
            return (
              <button key={i} onClick={() => setSelectedOutlet(i)}
                style={{ fontSize:10, padding:"8px 14px", whiteSpace:"nowrap", background: selectedOutlet===i ? o.accentColor : "transparent", color: selectedOutlet===i ? "#fff" : "#aaa", border:"none", cursor:"pointer", fontFamily:"Georgia, serif", transition:"background 0.15s", letterSpacing:"0.05em" }}>
                {o.logo} {o.name}
              </button>
            );
          })}
          <button onClick={onClose} style={{ marginLeft:"auto", padding:"8px 14px", background:"transparent", border:"none", color:"#aaa", cursor:"pointer", fontSize:16 }}>✕</button>
        </div>

        {/* Masthead */}
        <div style={{ borderBottom:`4px solid ${outlet.accentColor}`, padding:"12px 20px 10px", background:"#faf8f2" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:4 }}>
            <span style={{ fontSize:9, fontFamily:"Georgia, serif", color:"#666", letterSpacing:"0.15em", textTransform:"uppercase" }}>
              {biasLabels[outlet.bias] || "Independent"} • Est. 1887
            </span>
            <span style={{ fontSize:9, fontFamily:"Georgia, serif", color:"#666", letterSpacing:"0.1em" }}>
              TURN {edition.turn} · {country.name.toUpperCase()}
            </span>
          </div>
          <div style={{ textAlign:"center", borderTop:"1px solid #ccc", borderBottom:"1px solid #ccc", padding:"8px 0", margin:"6px 0" }}>
            <h1 style={{ fontFamily:"'Georgia', serif", fontSize:28, fontWeight:700, margin:0, color:"#1a1a1a", letterSpacing:"-0.02em", lineHeight:1.1 }}>
              {outlet.logo} {outlet.name.toUpperCase()}
            </h1>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:8, color:"#666", fontFamily:"Georgia, serif", letterSpacing:"0.05em" }}>
            <span>VOL. {(edition.turn * 7 + 23)} · NO. {(edition.turn * 13 + 147)}</span>
            <span style={{ fontWeight:700, color: outlet.accentColor }}>SPECIAL EDITION — BREAKING</span>
            <span>PRICE: FREE</span>
          </div>
        </div>

        {/* Main headline */}
        <div style={{ padding:"14px 20px 10px", borderBottom:"1px solid #d0c8b0" }}>
          <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
            <div style={{ flex:1 }}>
              {paper.breakingTag && (
                <div style={{ display:"inline-block", background:outlet.accentColor, color:"#fff", fontSize:9, padding:"2px 8px", fontFamily:"Georgia, serif", letterSpacing:"0.15em", marginBottom:8, textTransform:"uppercase" }}>
                  ▶ {paper.breakingTag}
                </div>
              )}
              <h2 style={{ fontFamily:"Georgia, serif", fontSize:22, fontWeight:700, lineHeight:1.2, margin:"0 0 8px", color:"#1a1a1a" }}>
                {paper.headline}
              </h2>
              <p style={{ fontFamily:"Georgia, serif", fontSize:12, lineHeight:1.6, color:"#333", margin:"0 0 8px", fontStyle:"italic" }}>
                {paper.subHeadline}
              </p>
              <p style={{ fontFamily:"Georgia, serif", fontSize:12, lineHeight:1.65, color:"#222", margin:0 }}>
                {paper.body}
              </p>
            </div>
            {paper.pullQuote && (
              <div style={{ width:160, flexShrink:0, borderLeft:`3px solid ${outlet.accentColor}`, paddingLeft:12 }}>
                <p style={{ fontFamily:"Georgia, serif", fontSize:13, fontStyle:"italic", lineHeight:1.5, color:"#1a1a1a", margin:"0 0 6px" }}>
                  "{paper.pullQuote.text}"
                </p>
                <p style={{ fontFamily:"Georgia, serif", fontSize:10, color:"#666", margin:0 }}>— {paper.pullQuote.attribution}</p>
              </div>
            )}
          </div>
        </div>

        {/* Secondary stories */}
        {paper.secondaryStories && paper.secondaryStories.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(paper.secondaryStories.length, 3)}, 1fr)`, borderBottom:"1px solid #d0c8b0" }}>
            {paper.secondaryStories.map((s, i) => (
              <div key={i} style={{ padding:"10px 14px", borderRight: i < paper.secondaryStories.length-1 ? "1px solid #d0c8b0" : "none" }}>
                <div style={{ fontSize:8, fontFamily:"Georgia, serif", color: outlet.accentColor, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>{s.section}</div>
                <h3 style={{ fontFamily:"Georgia, serif", fontSize:12, fontWeight:700, lineHeight:1.3, margin:"0 0 5px", color:"#1a1a1a" }}>{s.headline}</h3>
                <p style={{ fontFamily:"Georgia, serif", fontSize:11, lineHeight:1.55, color:"#444", margin:0 }}>{s.snippet}</p>
              </div>
            ))}
          </div>
        )}

        {/* Op-ed / editorial box */}
        {paper.opEd && (
          <div style={{ padding:"10px 20px", borderBottom:"1px solid #d0c8b0", background:"#f0ece0" }}>
            <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background: outlet.accentColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                {paper.opEd.authorIcon || "✍"}
              </div>
              <div>
                <div style={{ fontSize:8, fontFamily:"Georgia, serif", color:outlet.accentColor, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:3 }}>Opinion · {paper.opEd.author}</div>
                <h4 style={{ fontFamily:"Georgia, serif", fontSize:13, fontWeight:700, margin:"0 0 4px", color:"#1a1a1a" }}>{paper.opEd.title}</h4>
                <p style={{ fontFamily:"Georgia, serif", fontSize:11, lineHeight:1.6, color:"#444", margin:0, fontStyle:"italic" }}>{paper.opEd.excerpt}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer ticker */}
        <div style={{ background:"#1a1a1a", padding:"6px 14px", overflow:"hidden" }}>
          <div style={{ fontSize:9, color:"#ccc", fontFamily:"Georgia, serif", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>
            <span style={{ color: outlet.accentColor, fontWeight:700, marginRight:10 }}>TICKER</span>
            {(paper.ticker || []).join("  •  ")}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CORE UI COMPONENTS ────────────────────────────────────────────────────────

function StatBar({ label, value, prev }) {
  const delta = prev !== undefined ? value - prev : 0;
  const color = value > 65 ? "#22c55e" : value > 35 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
        <span style={{ fontSize:11, color:"var(--color-text-secondary)", fontFamily:"var(--font-mono)" }}>{label.toUpperCase()}</span>
        <span style={{ fontSize:12, fontWeight:500, display:"flex", alignItems:"center", gap:4 }}>
          {value}
          {delta !== 0 && <span style={{ fontSize:10, color: delta>0?"#22c55e":"#ef4444" }}>{delta>0?`+${delta}`:delta}</span>}
        </span>
      </div>
      <div style={{ height:5, background:"var(--color-background-tertiary)", borderRadius:3, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${value}%`, background:color, borderRadius:3, transition:"width 0.6s ease" }} />
      </div>
    </div>
  );
}

function TypewriterText({ text, speed=14, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);
  useEffect(() => {
    setDisplayed(""); setDone(false); idx.current = 0;
    const iv = setInterval(() => {
      if (idx.current < text.length) { setDisplayed(text.slice(0, idx.current+1)); idx.current++; }
      else { clearInterval(iv); setDone(true); onDone && onDone(); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return <span>{displayed}{!done && <span style={{ opacity:0.5, animation:"blink 0.8s infinite" }}>▌</span>}</span>;
}

function Badge({ label, color="#3b82f6" }) {
  return (
    <span style={{ fontSize:10, padding:"2px 7px", borderRadius:99, background:`${color}18`, color, border:`0.5px solid ${color}40`, fontFamily:"var(--font-mono)", whiteSpace:"nowrap" }}>
      {label}
    </span>
  );
}

function AllianceTag({ allianceKey }) {
  const a = ALLIANCES[allianceKey]; if (!a) return null;
  return <Badge label={a.name} color={a.color} />;
}
function ThreatTag({ actorKey }) {
  const a = NON_STATE_ACTORS[actorKey]; if (!a) return null;
  return <Badge label={a.name} color="#ef4444" />;
}
function StripeBar({ value, label, color }) {
  return (
    <div style={{ marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:3 }}>
        <span style={{ color:"var(--color-text-secondary)" }}>{label}</span>
        <span style={{ color, fontWeight:500 }}>{value}</span>
      </div>
      <div style={{ height:4, background:"var(--color-background-tertiary)", borderRadius:2 }}>
        <div style={{ height:"100%", width:`${value}%`, background:color, borderRadius:2, transition:"width 0.5s" }} />
      </div>
    </div>
  );
}

function CountryCard({ c, onClick }) {
  const [hov, setHov] = useState(false);
  const pc = { Superpower:"#8b5cf6","Major Power":"#3b82f6","Regional Power":"#22c55e","Middle Power":"#f59e0b","Small State":"#94a3b8","Weak State":"#ef4444","Rogue State":"#ec4899" };
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ textAlign:"left", padding:14, borderRadius:"var(--border-radius-lg)", border:`0.5px solid ${hov?"var(--color-border-primary)":"var(--color-border-tertiary)"}`, background:"var(--color-background-primary)", cursor:"pointer", fontFamily:"var(--font-sans)", transition:"border-color 0.15s", width:"100%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
        <span style={{ fontSize:26 }}>{c.flag}</span>
        <Badge label={c.power} color={pc[c.power]||"#94a3b8"} />
      </div>
      <div style={{ fontSize:13, fontWeight:500, marginBottom:2 }}>{c.name}</div>
      <div style={{ fontSize:10, color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)", marginBottom:8 }}>{c.region.toUpperCase()}</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:8 }}>
        {c.alliances.map(a => <AllianceTag key={a} allianceKey={a} />)}
        {c.threats.slice(0,2).map(t => <ThreatTag key={t} actorKey={t} />)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 10px" }}>
        <div style={{ fontSize:11, color:"var(--color-text-secondary)" }}>Stability <span style={{ fontWeight:500 }}>{c.stability}</span></div>
        <div style={{ fontSize:11, color:"var(--color-text-secondary)" }}>Strife <span style={{ fontWeight:500, color:c.internalStrife>50?"#ef4444":"#f59e0b" }}>{c.internalStrife}</span></div>
      </div>
    </button>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────

export default function GeopoliticsSimulator() {
  const [phase, setPhase] = useState("select_country");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [stats, setStats] = useState({ Economy:60, Military:60, Diplomacy:60, Stability:65, GlobalPrestige:60 });
  const [prevStats, setPrevStats] = useState(null);
  const [internalStrife, setInternalStrife] = useState(30);
  const [relationships, setRelationships] = useState({});
  const [turn, setTurn] = useState(1);
  const [situation, setSituation] = useState("");
  const [actions, setActions] = useState([]);
  const [worldReaction, setWorldReaction] = useState("");
  const [randomEvent, setRandomEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(false);
  const [filterRegion, setFilterRegion] = useState("All");
  const [activeTab, setActiveTab] = useState("situation");
  // Newspaper state
  const [currentEdition, setCurrentEdition] = useState(null);
  const [showNewspaper, setShowNewspaper] = useState(false);
  const [newEditionReady, setNewEditionReady] = useState(false);
  const [allEditions, setAllEditions] = useState([]);

  const regions = ["All", ...new Set(COUNTRIES.map(c => c.region))];
  const stakeColor = { Critical:"#ef4444", High:"#f59e0b", Medium:"#22c55e" };

 async function callClaude(prompt, maxTokens = 1400) {
  const key = apiKey || window.__GEO_KEY__;
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
      "HTTP-Referer": window.location.href,
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-4-5",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content;
}

  function buildContext(country) {
    const allies = getCountryAlliances(country).map(a=>`${a.name}`).join(", ");
    const threats = getCountryThreats(country).map(a=>a.name).join(", ");
    return `Country: ${country.name} (${country.power}, ${country.region})
Traits: ${country.traits}
Alliances: ${allies||"none"} | Threats: ${threats||"none"} | Strife: ${internalStrife}/100`;
  }

  // Generate newspaper edition from game events
  async function generateNewspaper(country, scenario, action, worldReactionText, turnNum, currentStats) {
    const allyNames = getCountryAlliances(country).map(a=>a.name).join(", ");
    const prompt = `You are generating fictional newspaper front pages for a geopolitical strategy game.

Context:
- Player country: ${country.name} (${country.power})
- Crisis scenario: ${scenario.title}
- Player's action this turn: "${action}"
- World reaction: ${worldReactionText}
- Turn: ${turnNum}
- Player's current stats: Economy ${currentStats.Economy}, Military ${currentStats.Military}, Diplomacy ${currentStats.Diplomacy}, Stability ${currentStats.Stability}
- Alliances: ${allyNames || "none"}

Generate 3 newspaper front pages from 3 different fictional outlets with clearly different editorial biases — one broadly Western/liberal, one Eastern/statist or state-media, one from a regional outlet (Middle East, South Asia, or Global South perspective relevant to the action taken). Each outlet should spin the SAME events very differently based on its bias.

Return ONLY valid JSON (no markdown):
{
  "papers": [
    {
      "outletId": "herald",
      "breakingTag": "BREAKING NEWS",
      "headline": "Bold, punchy main headline (max 12 words) from Western liberal perspective",
      "subHeadline": "One-sentence deck explaining the headline",
      "body": "2-3 sentences of news article body. Reference specific countries, actors, or alliances. Write as a real journalist would.",
      "pullQuote": { "text": "Short punchy quote (max 15 words)", "attribution": "Name, Title, Country" },
      "secondaryStories": [
        { "section": "WORLD", "headline": "Secondary story headline", "snippet": "One sentence." },
        { "section": "ECONOMY", "headline": "Economic angle headline", "snippet": "One sentence." },
        { "section": "OPINION", "headline": "Op-ed teaser headline", "snippet": "One sentence opinion." }
      ],
      "opEd": { "author": "Fictional analyst name", "authorIcon": "🎓", "title": "Op-ed title", "excerpt": "2 sentences of opinionated commentary on ${country.name}'s decision." },
      "ticker": ["Short ticker item 1", "Short ticker item 2", "Short ticker item 3", "Short ticker item 4"]
    },
    {
      "outletId": "xinhua_t",
      "breakingTag": "EXCLUSIVE",
      "headline": "Same events but framed from Eastern/statist perspective (max 12 words)",
      "subHeadline": "One-sentence deck",
      "body": "2-3 sentences. Pro-state framing, emphasise sovereignty, Western hypocrisy, or multipolarity.",
      "pullQuote": { "text": "Quote from Eastern perspective", "attribution": "Name, Title" },
      "secondaryStories": [
        { "section": "GEOPOLITICS", "headline": "Headline", "snippet": "One sentence." },
        { "section": "TRADE", "headline": "Headline", "snippet": "One sentence." }
      ],
      "opEd": { "author": "Fictional analyst name", "authorIcon": "🌏", "title": "Op-ed title", "excerpt": "2 sentences critical of Western interference or praising multipolarity." },
      "ticker": ["Ticker item 1", "Ticker item 2", "Ticker item 3"]
    },
    {
      "outletId": "al_watan",
      "breakingTag": "URGENT",
      "headline": "Regional/Global South perspective on same events (max 12 words)",
      "subHeadline": "One-sentence deck",
      "body": "2-3 sentences. Emphasise regional impact, sovereignty, or humanitarian angle.",
      "pullQuote": { "text": "Quote", "attribution": "Name, Title" },
      "secondaryStories": [
        { "section": "REGIONAL", "headline": "Headline", "snippet": "One sentence." },
        { "section": "ANALYSIS", "headline": "Headline", "snippet": "One sentence." }
      ],
      "opEd": { "author": "Fictional analyst name", "authorIcon": "🌍", "title": "Op-ed title", "excerpt": "2 sentences on regional consequences of this decision." },
      "ticker": ["Ticker item 1", "Ticker item 2", "Ticker item 3"]
    }
  ]
}`;

    const raw = await callClaude(prompt, 1800);
    const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
    return { ...parsed, turn: turnNum };
  }

  async function startGame(country, scenario) {
    setLoading(true);
    const initStats = {
      Economy:        clamp(country.gdp > 3000 ? 70 : country.gdp > 500 ? 55 : 35),
      Military:       clamp(country.military),
      Diplomacy:      clamp(country.diplomacy),
      Stability:      clamp(country.stability),
      GlobalPrestige: clamp(country.power==="Superpower"?85:country.power==="Major Power"?70:country.power==="Regional Power"?55:35),
    };
    setStats(initStats); setPrevStats(null);
    setInternalStrife(country.internalStrife);
    setTurn(1); setLog([]); setWorldReaction(""); setRandomEvent(null);
    setCurrentEdition(null); setAllEditions([]); setNewEditionReady(false);
    const initRel = {};
    ["usa","china","russia","india","germany","uk","france","turkey","iran","saudi_arabia"].forEach(id => {
      const c = COUNTRIES.find(x=>x.id===id);
      if (c && c.id !== country.id) initRel[id] = Math.floor(Math.random()*40)+30;
    });
    setRelationships(initRel);
    try {
      const prompt = `You are running a realistic geopolitical strategy simulation.
${buildContext(country)}
Scenario: ${scenario.title} — ${scenario.description}
Consider: alliance obligations, non-state actors, internal stability, great power competition.

Return ONLY valid JSON (no markdown):
{
  "situation": "2-3 vivid sentences describing the unfolding crisis from ${country.name}'s perspective, referencing specific neighbours or actors.",
  "internalEvent": "One sentence about immediate internal political pressure.",
  "actions": [
    {"id":"a1","label":"Short label","description":"One sentence tradeoff","statHints":{"Economy":0,"Military":5,"Diplomacy":-5,"Stability":-3,"GlobalPrestige":2}},
    {"id":"a2","label":"Short label","description":"One sentence tradeoff","statHints":{"Economy":-3,"Military":0,"Diplomacy":8,"Stability":2,"GlobalPrestige":5}},
    {"id":"a3","label":"Short label","description":"One sentence tradeoff","statHints":{"Economy":5,"Military":-2,"Diplomacy":-3,"Stability":5,"GlobalPrestige":-2}},
    {"id":"a4","label":"Short label","description":"One sentence tradeoff","statHints":{"Economy":-5,"Military":8,"Diplomacy":-8,"Stability":-5,"GlobalPrestige":-3}}
  ]
}`;
      const raw = await callClaude(prompt);
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      setSituation(parsed.situation + (parsed.internalEvent ? " " + parsed.internalEvent : ""));
      setActions(parsed.actions);
      setPhase("playing");
    } catch(e) { alert("Error: " + e.message); }
    setLoading(false);
  }

  async function handleAction(action) {
    setLoading(true); setWorldReaction(""); setNewEditionReady(false);
    const country = selectedCountry;
    const relatedActors = getRelatedActors(selectedScenario, country);
    const actorCtx = relatedActors.length ? `Relevant non-state actors: ${relatedActors.map(a=>a.name).join(", ")}` : "";
    const allyCtx = getCountryAlliances(country).map(a=>`${a.name}: ${a.description}`).join("; ");

    try {
      // Run game logic and newspaper generation in parallel
      const gamePromise = callClaude(`Geopolitical simulation — turn ${turn}.
${buildContext(country)}
Scenario: ${selectedScenario.title}
Current situation: ${situation}
Player action: "${action.label}" — ${action.description}
Stats: ${JSON.stringify(stats)} | Strife: ${internalStrife}/100
Alliance context: ${allyCtx||"none"}
${actorCtx}
Recent: ${log.slice(-2).map(l=>l.action).join(", ")||"none"}

Return ONLY valid JSON:
{
  "worldReaction": "3-5 sentences naming specific countries and actors. Dramatic, realistic.",
  "internalConsequence": "1-2 sentences of internal political consequence.",
  "nonStateActorEvent": null,
  "randomEvent": null,
  "newSituation": "2-3 sentences for next turn.",
  "newActions": [
    {"id":"a1","label":"Label","description":"One sentence"},
    {"id":"a2","label":"Label","description":"One sentence"},
    {"id":"a3","label":"Label","description":"One sentence"},
    {"id":"a4","label":"Label","description":"One sentence"}
  ],
  "statChanges": {"Economy":0,"Military":0,"Diplomacy":0,"Stability":0,"GlobalPrestige":0},
  "strIfeChange": 0,
  "relationshipChanges": {"usa":0,"china":0,"russia":0},
  "gameOver": false,
  "gameOverReason": null
}
statChanges: -20 to +20. strIfeChange: -10 to +20. If stat hits 5/95 or strife 90+, gameOver:true.`);

      const [gameRaw] = await Promise.all([gamePromise]);
      const parsed = JSON.parse(gameRaw.replace(/```json|```/g,"").trim());

      const newStats = {};
      for (const k of STAT_KEYS) newStats[k] = clamp(stats[k] + (parsed.statChanges[k]||0));
      const newStrife = Math.max(0, Math.min(100, internalStrife + (parsed.strIfeChange||0)));
      const newRel = { ...relationships };
      for (const [k,v] of Object.entries(parsed.relationshipChanges||{})) {
        if (newRel[k] !== undefined) newRel[k] = Math.max(0, Math.min(100, newRel[k]+v));
      }

      let fullReaction = parsed.worldReaction;
      if (parsed.internalConsequence) fullReaction += "\n\n🏛️ Internally: " + parsed.internalConsequence;
      if (parsed.nonStateActorEvent) fullReaction += "\n\n⚠️ " + parsed.nonStateActorEvent;

      setPrevStats({ ...stats });
      setStats(newStats);
      setInternalStrife(newStrife);
      setRelationships(newRel);
      setWorldReaction(fullReaction);
      if (parsed.randomEvent) setRandomEvent(parsed.randomEvent);

      const newLogEntry = { turn, action: action.label, reaction: parsed.worldReaction, strife: newStrife };
      setLog(prev => [...prev, newLogEntry]);

      // Generate newspaper in background
      generateNewspaper(country, selectedScenario, action.label, parsed.worldReaction, turn, newStats)
        .then(edition => {
          setCurrentEdition(edition);
          setAllEditions(prev => [...prev, edition]);
          setNewEditionReady(true);
        }).catch(() => {});

      const delay = fullReaction.length * 12 + 800;
      if (parsed.gameOver) {
        setTimeout(() => { setSituation(parsed.gameOverReason); setActions([]); setPhase("result"); }, delay);
      } else {
        setTimeout(() => {
          setSituation(parsed.newSituation);
          setActions(parsed.newActions);
          setTurn(t => t+1);
          setWorldReaction(""); setRandomEvent(null);
        }, delay);
      }
    } catch(e) { alert("Error: " + e.message); }
    setLoading(false);
  }

  // ── RENDER: SELECT COUNTRY ──
  if (phase === "select_country") {
    const filtered = filterRegion==="All" ? COUNTRIES : COUNTRIES.filter(c => c.region===filterRegion);
    return (
      <div style={{ fontFamily:"var(--font-sans)", maxWidth:920, margin:"0 auto", padding:"1.5rem 1rem" }}>
        <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}} @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
        <div style={{ marginBottom:"1.25rem" }}>
          <div style={{ fontSize:10, letterSpacing:"0.12em", color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)", marginBottom:6 }}>GEOPOLITICS SIMULATOR v3</div>
          <h1 style={{ fontSize:22, fontWeight:500, margin:"0 0 6px" }}>Choose your nation</h1>
          <p style={{ fontSize:13, color:"var(--color-text-secondary)", margin:0 }}>Lead a country through crises. Every decision makes tomorrow's headlines.</p>
        </div>
        {showApiInput ? (
          <div style={{ background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-secondary)", borderRadius:"var(--border-radius-lg)", padding:"1rem", marginBottom:"1rem" }}>
            <p style={{ fontSize:12, color:"var(--color-text-secondary)", margin:"0 0 8px" }}>Anthropic API key:</p>
            <div style={{ display:"flex", gap:8 }}>
              <input type="password" placeholder="sk-ant-..." value={apiKey} onChange={e=>setApiKey(e.target.value)}
                style={{ flex:1, fontSize:13, padding:"6px 10px", borderRadius:"var(--border-radius-md)", border:"0.5px solid var(--color-border-secondary)", background:"var(--color-background-primary)", color:"var(--color-text-primary)" }} />
              <button onClick={() => { window.__GEO_KEY__=apiKey; setShowApiInput(false); }}
                style={{ fontSize:13, padding:"6px 14px", borderRadius:"var(--border-radius-md)", border:"0.5px solid var(--color-border-secondary)", cursor:"pointer", background:"var(--color-background-primary)", color:"var(--color-text-primary)" }}>Save</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowApiInput(true)} style={{ fontSize:11, color:"var(--color-text-tertiary)", background:"none", border:"none", cursor:"pointer", padding:"0 0 1rem", textDecoration:"underline" }}>
            {apiKey ? "✓ API key set" : "Set Anthropic API key"}
          </button>
        )}
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:"1rem" }}>
          {Object.entries(ALLIANCES).map(([k,a]) => <Badge key={k} label={a.name} color={a.color} />)}
          <Badge label="Non-state threat" color="#ef4444" />
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:"1rem" }}>
          {regions.map(r => (
            <button key={r} onClick={() => setFilterRegion(r)}
              style={{ fontSize:11, padding:"4px 12px", borderRadius:99, border:`0.5px solid ${filterRegion===r?"var(--color-border-primary)":"var(--color-border-tertiary)"}`, background: filterRegion===r?"var(--color-background-secondary)":"transparent", cursor:"pointer", color:"var(--color-text-primary)", fontFamily:"var(--font-mono)" }}>
              {r}
            </button>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:10 }}>
          {filtered.map(c => <CountryCard key={c.id} c={c} onClick={() => { setSelectedCountry(c); setPhase("select_scenario"); }} />)}
        </div>
      </div>
    );
  }

  // ── RENDER: SELECT SCENARIO ──
  if (phase === "select_scenario") return (
    <div style={{ fontFamily:"var(--font-sans)", maxWidth:860, margin:"0 auto", padding:"1.5rem 1rem" }}>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      <button onClick={() => setPhase("select_country")} style={{ fontSize:12, color:"var(--color-text-secondary)", background:"none", border:"none", cursor:"pointer", padding:"0 0 1rem" }}>← Back</button>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"0.75rem" }}>
        <span style={{ fontSize:28 }}>{selectedCountry.flag}</span>
        <div>
          <div style={{ fontSize:10, color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)" }}>PLAYING AS</div>
          <h1 style={{ fontSize:20, fontWeight:500, margin:0 }}>{selectedCountry.name}</h1>
        </div>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:"1rem" }}>
        {selectedCountry.alliances.map(a => <AllianceTag key={a} allianceKey={a} />)}
        {selectedCountry.threats.map(t => <ThreatTag key={t} actorKey={t} />)}
      </div>
      <p style={{ fontSize:13, color:"var(--color-text-secondary)", margin:"0 0 1rem" }}>Select a crisis scenario:</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(230px, 1fr))", gap:10 }}>
        {SCENARIOS.map(s => (
          <button key={s.id} onClick={() => { setSelectedScenario(s); startGame(selectedCountry, s); }}
            disabled={loading}
            style={{ textAlign:"left", padding:14, borderRadius:"var(--border-radius-lg)", border:"0.5px solid var(--color-border-tertiary)", background:"var(--color-background-primary)", cursor:"pointer", fontFamily:"var(--font-sans)", opacity:loading?0.6:1 }}
            onMouseEnter={e => !loading&&(e.currentTarget.style.borderColor="var(--color-border-primary)")}
            onMouseLeave={e => e.currentTarget.style.borderColor="var(--color-border-tertiary)"}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:22 }}>{s.icon}</span>
              <span style={{ fontSize:10, padding:"2px 7px", borderRadius:99, fontFamily:"var(--font-mono)", background: s.stakes==="Critical"?"#fef2f2":s.stakes==="High"?"#fffbeb":"#f0fdf4", color:stakeColor[s.stakes] }}>{s.stakes.toUpperCase()}</span>
            </div>
            <div style={{ fontSize:13, fontWeight:500, marginBottom:3 }}>{s.title}</div>
            <div style={{ fontSize:10, color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)", marginBottom:6 }}>{s.category.toUpperCase()}</div>
            <div style={{ fontSize:12, color:"var(--color-text-secondary)", lineHeight:1.5 }}>{s.description}</div>
          </button>
        ))}
      </div>
      {loading && <div style={{ textAlign:"center", marginTop:"2rem", fontSize:14, color:"var(--color-text-secondary)" }}>Generating scenario... ⚙️</div>}
    </div>
  );

  // ── RENDER: PLAYING ──
  if (phase === "playing") return (
    <div style={{ fontFamily:"var(--font-sans)", maxWidth:940, margin:"0 auto", padding:"1.25rem 1rem" }}>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}} @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}`}</style>

      {/* Newspaper overlay */}
      {showNewspaper && currentEdition && (
        <NewspaperFront edition={currentEdition} country={selectedCountry} onClose={() => setShowNewspaper(false)} />
      )}

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem", flexWrap:"wrap", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:22 }}>{selectedCountry.flag}</span>
          <div>
            <div style={{ fontSize:12, fontWeight:500 }}>{selectedCountry.name}</div>
            <div style={{ fontSize:10, color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)" }}>{selectedScenario.icon} {selectedScenario.title.toUpperCase()}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {/* Newspaper button */}
          {currentEdition && (
            <button onClick={() => setShowNewspaper(true)}
              style={{ fontSize:11, padding:"5px 12px", borderRadius:99, border:`0.5px solid ${newEditionReady?"#f59e0b":"var(--color-border-tertiary)"}`, background: newEditionReady?"#fffbeb":"var(--color-background-secondary)", cursor:"pointer", color: newEditionReady?"#92400e":"var(--color-text-secondary)", fontFamily:"var(--font-sans)", display:"flex", alignItems:"center", gap:5, animation: newEditionReady?"pulse 1.5s ease 3":undefined }}>
              📰 {newEditionReady ? "New Edition!" : "Read Press"}
              {newEditionReady && <span style={{ width:6, height:6, borderRadius:"50%", background:"#f59e0b", display:"inline-block" }} />}
            </button>
          )}
          <div style={{ fontSize:10, color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)", background:"var(--color-background-secondary)", padding:"4px 10px", borderRadius:99, border:"0.5px solid var(--color-border-tertiary)" }}>TURN {turn}</div>
          <div style={{ fontSize:10, color: internalStrife>60?"#ef4444":internalStrife>35?"#f59e0b":"#22c55e", fontFamily:"var(--font-mono)", background:"var(--color-background-secondary)", padding:"4px 10px", borderRadius:99, border:"0.5px solid var(--color-border-tertiary)" }}>
            STRIFE {internalStrife}
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 210px", gap:12, alignItems:"start" }}>
        <div>
          {/* Tabs */}
          <div style={{ display:"flex", gap:0, marginBottom:12, borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
            {["situation","press","alliances","actors","history"].map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); if(tab==="press"&&newEditionReady) setNewEditionReady(false); }}
                style={{ fontSize:12, padding:"6px 14px", background:"none", border:"none", borderBottom:`2px solid ${activeTab===tab?"var(--color-text-primary)":"transparent"}`, cursor:"pointer", color: activeTab===tab?"var(--color-text-primary)":"var(--color-text-secondary)", fontFamily:"var(--font-sans)", fontWeight: activeTab===tab?500:400, position:"relative" }}>
                {tab==="press" ? "📰 Press" : tab.charAt(0).toUpperCase()+tab.slice(1)}
                {tab==="press" && newEditionReady && (
                  <span style={{ position:"absolute", top:4, right:4, width:6, height:6, borderRadius:"50%", background:"#f59e0b" }} />
                )}
              </button>
            ))}
          </div>

          {/* SITUATION TAB */}
          {activeTab === "situation" && (
            <div>
              {randomEvent && (
                <div style={{ background:"#fef2f2", border:"0.5px solid #fca5a5", borderRadius:"var(--border-radius-md)", padding:"10px 14px", marginBottom:10, animation:"fadeIn 0.3s ease" }}>
                  <div style={{ fontSize:11, fontFamily:"var(--font-mono)", color:"#ef4444", marginBottom:4 }}>⚡ RANDOM EVENT: {randomEvent.title.toUpperCase()}</div>
                  <div style={{ fontSize:13, color:"#7f1d1d", lineHeight:1.6 }}>{randomEvent.description}</div>
                </div>
              )}
              <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", padding:"1rem 1.25rem", marginBottom:10 }}>
                <div style={{ fontSize:10, letterSpacing:"0.1em", color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)", marginBottom:8 }}>SITUATION REPORT</div>
                <p style={{ fontSize:14, lineHeight:1.7, margin:0 }}>{situation}</p>
              </div>
              {worldReaction && (
                <div style={{ background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", padding:"1rem 1.25rem", marginBottom:10, animation:"fadeIn 0.3s ease" }}>
                  <div style={{ fontSize:10, letterSpacing:"0.1em", color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)", marginBottom:8 }}>🌐 WORLD REACTION</div>
                  <p style={{ fontSize:14, lineHeight:1.7, margin:0, whiteSpace:"pre-wrap" }}>
                    <TypewriterText text={worldReaction} speed={11} />
                  </p>
                </div>
              )}
              {!loading && !worldReaction && actions.length > 0 && (
                <div>
                  <div style={{ fontSize:10, letterSpacing:"0.1em", color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)", marginBottom:8 }}>YOUR MOVE</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {actions.map((a, i) => (
                      <button key={a.id} onClick={() => handleAction(a)} disabled={loading}
                        style={{ textAlign:"left", padding:"12px 14px", borderRadius:"var(--border-radius-lg)", border:"0.5px solid var(--color-border-secondary)", background:"var(--color-background-primary)", cursor:"pointer", fontFamily:"var(--font-sans)", animation:`fadeIn 0.3s ease ${i*0.07}s both` }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor="var(--color-border-primary)"; e.currentTarget.style.background="var(--color-background-secondary)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor="var(--color-border-secondary)"; e.currentTarget.style.background="var(--color-background-primary)"; }}>
                        <div style={{ fontSize:13, fontWeight:500, marginBottom:4 }}>{a.label}</div>
                        <div style={{ fontSize:12, color:"var(--color-text-secondary)", lineHeight:1.5 }}>{a.description}</div>
                        {a.statHints && (
                          <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:8 }}>
                            {Object.entries(a.statHints).filter(([,v])=>v!==0).map(([k,v]) => (
                              <span key={k} style={{ fontSize:10, color:v>0?"#22c55e":"#ef4444", fontFamily:"var(--font-mono)" }}>{k.slice(0,3)} {v>0?"+":""}{v}</span>
                            ))}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {loading && <div style={{ textAlign:"center", padding:"2rem", color:"var(--color-text-secondary)", fontSize:14 }}>⚙️ Simulating world response...</div>}
            </div>
          )}

          {/* PRESS TAB */}
          {activeTab === "press" && (
            <div>
              {allEditions.length === 0 ? (
                <div style={{ padding:"2rem", textAlign:"center", color:"var(--color-text-secondary)" }}>
                  <div style={{ fontSize:32, marginBottom:12 }}>📰</div>
                  <div style={{ fontSize:14, marginBottom:6 }}>No press coverage yet</div>
                  <div style={{ fontSize:12 }}>Make your first decision — the world media will react.</div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize:12, color:"var(--color-text-secondary)", margin:"0 0 12px" }}>
                    {allEditions.length} edition{allEditions.length!==1?"s":""} published. Click any edition to read.
                  </p>
                  {allEditions.slice().reverse().map((edition, i) => (
                    <div key={i} style={{ marginBottom:10 }}>
                      <div style={{ fontSize:10, fontFamily:"var(--font-mono)", color:"var(--color-text-tertiary)", marginBottom:6 }}>TURN {edition.turn} EDITION</div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                        {(edition.papers||[]).map((paper, j) => {
                          const outlet = NEWS_OUTLETS.find(o=>o.id===paper.outletId) || NEWS_OUTLETS[j%NEWS_OUTLETS.length];
                          return (
                            <button key={j} onClick={() => { setCurrentEdition(edition); setShowNewspaper(true); }}
                              style={{ textAlign:"left", padding:"10px 12px", borderRadius:"var(--border-radius-md)", border:`0.5px solid ${outlet.accentColor}40`, background:"var(--color-background-primary)", cursor:"pointer", fontFamily:"var(--font-sans)", borderLeft:`3px solid ${outlet.accentColor}` }}
                              onMouseEnter={e => e.currentTarget.style.background="var(--color-background-secondary)"}
                              onMouseLeave={e => e.currentTarget.style.background="var(--color-background-primary)"}>
                              <div style={{ fontSize:10, fontFamily:"Georgia, serif", color:outlet.accentColor, marginBottom:5, fontWeight:700 }}>{outlet.logo} {outlet.name}</div>
                              <div style={{ fontSize:11, lineHeight:1.4, color:"var(--color-text-primary)", fontFamily:"Georgia, serif", fontWeight:600 }}>{paper.headline}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ALLIANCES TAB */}
          {activeTab === "alliances" && (
            <div>
              {getCountryAlliances(selectedCountry).length === 0 && (
                <p style={{ fontSize:13, color:"var(--color-text-secondary)" }}>{selectedCountry.name} holds no formal alliance memberships.</p>
              )}
              {getCountryAlliances(selectedCountry).map(a => (
                <div key={a.key} style={{ background:"var(--color-background-primary)", border:`0.5px solid ${a.color}40`, borderLeft:`3px solid ${a.color}`, borderRadius:"var(--border-radius-lg)", padding:"12px 14px", marginBottom:10 }}>
                  <div style={{ fontSize:13, fontWeight:500, marginBottom:4, color:a.color }}>{a.name}</div>
                  <div style={{ fontSize:12, color:"var(--color-text-secondary)", marginBottom:8 }}>{a.description}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {a.members.map(m => { const c=COUNTRIES.find(x=>x.id===m); return c?<span key={m} style={{ fontSize:11, padding:"2px 8px", borderRadius:99, background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)" }}>{c.flag} {c.name}</span>:null; })}
                  </div>
                </div>
              ))}
              <div style={{ marginTop:16 }}>
                <div style={{ fontSize:10, letterSpacing:"0.1em", color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)", marginBottom:10 }}>DIPLOMATIC RELATIONS</div>
                {Object.entries(relationships).map(([id,score]) => {
                  const c=COUNTRIES.find(x=>x.id===id); if(!c) return null;
                  return (
                    <div key={id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                      <span style={{ fontSize:16 }}>{c.flag}</span>
                      <span style={{ fontSize:12, minWidth:100 }}>{c.name}</span>
                      <div style={{ flex:1, height:4, background:"var(--color-background-tertiary)", borderRadius:2 }}>
                        <div style={{ height:"100%", width:`${score}%`, background:score>60?"#22c55e":score>35?"#f59e0b":"#ef4444", borderRadius:2, transition:"width 0.5s" }} />
                      </div>
                      <span style={{ fontSize:11, fontFamily:"var(--font-mono)", minWidth:24, textAlign:"right", color:score>60?"#22c55e":score>35?"#f59e0b":"#ef4444" }}>{score}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACTORS TAB */}
          {activeTab === "actors" && (
            <div>
              {Object.entries(NON_STATE_ACTORS).map(([k,a]) => {
                const relevant = a.regions.some(r=>r===selectedCountry.id||selectedCountry.region.toLowerCase().includes(r)) || selectedCountry.threats.includes(k);
                return (
                  <div key={k} style={{ background:"var(--color-background-primary)", border:`0.5px solid ${relevant?"#ef444440":"var(--color-border-tertiary)"}`, borderLeft:`3px solid ${relevant?"#ef4444":"transparent"}`, borderRadius:"var(--border-radius-lg)", padding:"10px 14px", marginBottom:8, opacity:relevant?1:0.5 }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", gap:8 }}>
                        <span style={{ fontSize:18 }}>{a.icon}</span>
                        <div>
                          <div style={{ fontSize:13, fontWeight:500 }}>{a.name}</div>
                          <div style={{ fontSize:11, color:"var(--color-text-secondary)" }}>{a.ideology}</div>
                        </div>
                      </div>
                      <Badge label={a.threat} color={a.threat==="Critical"?"#ef4444":"#f59e0b"} />
                    </div>
                    {relevant && <div style={{ fontSize:11, color:"#ef4444", marginTop:6, fontFamily:"var(--font-mono)" }}>⚠ ACTIVE THREAT IN YOUR REGION</div>}
                  </div>
                );
              })}
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === "history" && (
            <div>
              {log.length===0 && <p style={{ fontSize:13, color:"var(--color-text-secondary)" }}>No decisions yet.</p>}
              {log.slice().reverse().map((entry,i) => (
                <div key={i} style={{ borderLeft:"2px solid var(--color-border-tertiary)", paddingLeft:12, marginBottom:14 }}>
                  <div style={{ fontSize:10, fontFamily:"var(--font-mono)", color:"var(--color-text-tertiary)", marginBottom:3 }}>TURN {entry.turn} · STRIFE {entry.strife}</div>
                  <div style={{ fontSize:13, fontWeight:500, marginBottom:4 }}>{entry.action}</div>
                  <div style={{ fontSize:12, color:"var(--color-text-secondary)", lineHeight:1.6 }}>{entry.reaction.slice(0,180)}...</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats sidebar */}
        <div>
          <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", padding:"1rem", marginBottom:10 }}>
            <div style={{ fontSize:10, letterSpacing:"0.1em", color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)", marginBottom:12 }}>NATIONAL STATS</div>
            {STAT_KEYS.map(k => <StatBar key={k} label={k} value={stats[k]} prev={prevStats?.[k]} />)}
            <div style={{ borderTop:"0.5px solid var(--color-border-tertiary)", marginTop:12, paddingTop:12 }}>
              <StripeBar value={internalStrife} label="Internal Strife" color={internalStrife>60?"#ef4444":internalStrife>35?"#f59e0b":"#22c55e"} />
            </div>
          </div>

          {/* Mini press preview */}
          {currentEdition && currentEdition.papers && currentEdition.papers[0] && (
            <div onClick={() => setShowNewspaper(true)}
              style={{ background:"#faf8f2", border:"0.5px solid #d0c8b0", borderRadius:"var(--border-radius-md)", padding:"10px 12px", marginBottom:10, cursor:"pointer" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#a09880"}
              onMouseLeave={e => e.currentTarget.style.borderColor="#d0c8b0"}>
              <div style={{ fontSize:9, fontFamily:"Georgia, serif", color:"#666", marginBottom:5, letterSpacing:"0.08em" }}>LATEST EDITION</div>
              <div style={{ fontSize:11, fontFamily:"Georgia, serif", fontWeight:700, color:"#1a1a1a", lineHeight:1.35, marginBottom:4 }}>
                {currentEdition.papers[0].headline}
              </div>
              <div style={{ fontSize:9, color:"#888", fontFamily:"Georgia, serif" }}>Tap to read full press coverage →</div>
            </div>
          )}

          <div style={{ background:"var(--color-background-secondary)", borderRadius:"var(--border-radius-md)", padding:"10px 12px", marginBottom:10 }}>
            <div style={{ fontSize:10, fontFamily:"var(--font-mono)", color:"var(--color-text-tertiary)", marginBottom:6 }}>ACTIVE THREATS</div>
            {selectedCountry.threats.length===0
              ? <div style={{ fontSize:11, color:"var(--color-text-secondary)" }}>None identified</div>
              : selectedCountry.threats.map(t => { const a=NON_STATE_ACTORS[t]; return a?<div key={t} style={{ fontSize:11, marginBottom:3 }}>{a.icon} {a.name}</div>:null; })}
          </div>
          <button onClick={() => setPhase("select_scenario")}
            style={{ width:"100%", fontSize:11, padding:"7px", borderRadius:"var(--border-radius-md)", border:"0.5px solid var(--color-border-tertiary)", background:"none", cursor:"pointer", color:"var(--color-text-secondary)" }}>
            ↩ Change scenario
          </button>
        </div>
      </div>
    </div>
  );

  // ── RENDER: RESULT ──
  if (phase === "result") {
    const avg = Math.round(STAT_KEYS.reduce((sum,k)=>sum+stats[k],0)/STAT_KEYS.length);
    const outcome = avg>65?{label:"Diplomatic Triumph",color:"#22c55e",icon:"🏆"}
      :avg>45?{label:"Uneasy Stalemate",color:"#f59e0b",icon:"⚖️"}
      :{label:"State Collapse",color:"#ef4444",icon:"💥"};
    return (
      <div style={{ fontFamily:"var(--font-sans)", maxWidth:660, margin:"0 auto", padding:"2rem 1rem" }}>
        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
        {showNewspaper && currentEdition && <NewspaperFront edition={currentEdition} country={selectedCountry} onClose={() => setShowNewspaper(false)} />}
        <div style={{ textAlign:"center", marginBottom:"1.5rem" }}>
          <div style={{ fontSize:52, marginBottom:14 }}>{outcome.icon}</div>
          <div style={{ fontSize:10, letterSpacing:"0.12em", color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)", marginBottom:8 }}>GAME OVER — {turn} TURNS</div>
          <h2 style={{ fontSize:22, fontWeight:500, color:outcome.color, margin:"0 0 1rem" }}>{outcome.label}</h2>
        </div>
        <div style={{ background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", padding:"1rem 1.25rem", marginBottom:"1rem" }}>
          <p style={{ fontSize:14, lineHeight:1.7, margin:0 }}>{situation}</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:"1rem" }}>
          {STAT_KEYS.map(k => (
            <div key={k} style={{ background:"var(--color-background-secondary)", borderRadius:"var(--border-radius-md)", padding:"10px 6px", textAlign:"center" }}>
              <div style={{ fontSize:16, fontWeight:500, marginBottom:2 }}>{stats[k]}</div>
              <div style={{ fontSize:9, color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)" }}>{k.slice(0,4).toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Final press */}
        {allEditions.length > 0 && (
          <div style={{ background:"#faf8f2", border:"0.5px solid #d0c8b0", borderRadius:"var(--border-radius-lg)", padding:"12px 16px", marginBottom:"1rem" }}>
            <div style={{ fontSize:10, fontFamily:"Georgia, serif", color:"#666", letterSpacing:"0.1em", marginBottom:10 }}>THE WORLD PRESS COVERED YOUR TENURE</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:8 }}>
              {allEditions.flatMap(ed => (ed.papers||[]).slice(0,1).map((p,i) => {
                const outlet = NEWS_OUTLETS.find(o=>o.id===p.outletId)||NEWS_OUTLETS[0];
                return (
                  <button key={`${ed.turn}-${i}`} onClick={() => { setCurrentEdition(ed); setShowNewspaper(true); }}
                    style={{ textAlign:"left", padding:"8px 10px", borderRadius:"var(--border-radius-md)", border:`0.5px solid ${outlet.accentColor}40`, borderLeft:`3px solid ${outlet.accentColor}`, background:"transparent", cursor:"pointer", fontFamily:"var(--font-sans)" }}>
                    <div style={{ fontSize:9, color:outlet.accentColor, fontFamily:"Georgia, serif", fontWeight:700, marginBottom:4 }}>T{ed.turn} · {outlet.name}</div>
                    <div style={{ fontSize:10, fontFamily:"Georgia, serif", lineHeight:1.4, color:"#1a1a1a" }}>{p.headline}</div>
                  </button>
                );
              }))}
            </div>
          </div>
        )}

        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <button onClick={() => { setPhase("select_country"); setSelectedCountry(null); setSelectedScenario(null); }}
            style={{ fontSize:13, padding:"10px 20px", borderRadius:"var(--border-radius-md)", border:"0.5px solid var(--color-border-secondary)", background:"var(--color-background-primary)", cursor:"pointer", fontFamily:"var(--font-sans)" }}>
            New Game
          </button>
          <button onClick={() => startGame(selectedCountry, selectedScenario)}
            style={{ fontSize:13, padding:"10px 20px", borderRadius:"var(--border-radius-md)", border:"0.5px solid var(--color-border-secondary)", background:"var(--color-background-primary)", cursor:"pointer", fontFamily:"var(--font-sans)" }}>
            Replay Scenario
          </button>
        </div>
      </div>
    );
  }
}
