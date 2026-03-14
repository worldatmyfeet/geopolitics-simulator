import { useState, useRef, useEffect } from "react";

// ── COUNTRY INTELLIGENCE ──────────────────────────────────────────────────────

const COUNTRY_INTEL = {
  usa:         { leader:"President (post-2024 election)", capital:"Washington D.C.", currency:"US Dollar", keyRivals:"China, Russia, Iran", keyAllies:"UK, Germany, Japan, Israel, Saudi Arabia", hotIssues:"China tech war, Ukraine aid fatigue, NATO burden-sharing, border crisis, debt ceiling", recentEvents:"AUKUS submarine deal, chip export controls on China, fentanyl sanctions on Mexico" },
  china:       { leader:"Xi Jinping (General Secretary)", capital:"Beijing", currency:"Renminbi/Yuan", keyRivals:"USA, India, Japan, Taiwan", keyAllies:"Russia, Pakistan, North Korea, Cambodia", hotIssues:"Taiwan Strait tensions, South China Sea disputes, Huawei ban, Belt & Road debt traps, Xinjiang", recentEvents:"PLA military exercises near Taiwan, BRICS expansion, semiconductor self-sufficiency drive" },
  russia:      { leader:"Vladimir Putin (President)", capital:"Moscow", currency:"Ruble", keyRivals:"USA, NATO, Ukraine, EU", keyAllies:"Belarus, Iran, North Korea, China", hotIssues:"Ukraine war, Wagner mutiny fallout, sanctions evasion, nuclear threats, energy weaponisation", recentEvents:"Wagner group dissolution, North Korean arms deals, grain deal collapse, ICC arrest warrant" },
  india:       { leader:"Narendra Modi (Prime Minister)", capital:"New Delhi", currency:"Indian Rupee", keyRivals:"Pakistan, China", keyAllies:"USA (QUAD), Russia (historic), France, Israel", hotIssues:"Line of Actual Control with China, Kashmir, Hindu nationalism, IMF reform push, BRICS vs QUAD balancing", recentEvents:"G20 presidency, Chandrayaan-3 moon landing, border standoff in Arunachal Pradesh, UPI payment expansion" },
  uk:          { leader:"Prime Minister (post-2024 election)", capital:"London", currency:"Pound Sterling", keyRivals:"Russia, China (investment concerns)", keyAllies:"USA, France, Germany, NATO allies", hotIssues:"Post-Brexit trade friction, Scottish independence, Northern Ireland Protocol, AUKUS, Rwanda asylum policy", recentEvents:"AUKUS nuclear submarine deal, Ukraine military aid, rejoining Horizon science programme" },
  germany:     { leader:"Chancellor (coalition government)", capital:"Berlin", currency:"Euro", keyRivals:"Russia", keyAllies:"France, USA, Poland, NATO", hotIssues:"Energy transition post-Nordstream, rearmament Zeitenwende, far-right AfD surge, Ukraine aid debate, trade dependency on China", recentEvents:"Bundeswehr 100bn rearmament fund, LNG terminal construction, arresting Russian spy networks" },
  japan:       { leader:"Prime Minister (LDP)", capital:"Tokyo", currency:"Japanese Yen", keyRivals:"China, North Korea, Russia (Kurils)", keyAllies:"USA, Australia, South Korea, QUAD", hotIssues:"Article 9 pacifist constitution revision, North Korean missiles, Chinese naval expansion, defence budget doubling", recentEvents:"Defence budget increase to 2% GDP, Tomahawk missile purchase from USA, AUKUS pillar 2 cooperation" },
  france:      { leader:"Emmanuel Macron (President)", capital:"Paris", currency:"Euro", keyRivals:"Russia, jihadist groups in Sahel", keyAllies:"Germany, USA, EU members, NATO", hotIssues:"Sahel military withdrawal, pension reform protests, EU strategic autonomy, far-right Le Pen threat, nuclear doctrine", recentEvents:"Expelled from Mali/Niger/Burkina Faso, Macron's ambiguous Ukraine troop deployment comments" },
  iran:        { leader:"Supreme Leader Khamenei, President Pezeshkian", capital:"Tehran", currency:"Iranian Rial", keyRivals:"USA, Israel, Saudi Arabia, Sunni states", keyAllies:"Russia, China, Hezbollah, Houthis, Hamas, Syria", hotIssues:"Nuclear programme 60% enrichment, proxy war network, women's rights protests, JCPOA collapse, drone exports to Russia", recentEvents:"Operation True Promise attack on Israel, Haniyeh assassination in Tehran, Nasrallah killing, Houthi Red Sea attacks" },
  pakistan:    { leader:"PM Shehbaz Sharif, Army Chief Asim Munir", capital:"Islamabad", currency:"Pakistani Rupee", keyRivals:"India, Afghanistan (TTP), USA (tensions)", keyAllies:"China (CPEC), Saudi Arabia, Turkey", hotIssues:"Imran Khan imprisonment, IMF bailout, TTP insurgency, Afghan refugee crisis, CPEC debt, Kashmir", recentEvents:"Imran Khan jailed on corruption charges, military crackdown on PTI, IMF 3bn bailout, border clashes with Afghanistan" },
  turkey:      { leader:"Recep Tayyip Erdoğan (President)", capital:"Ankara", currency:"Turkish Lira", keyRivals:"Greece, UAE (historic), Kurdish groups (PKK)", keyAllies:"NATO (uneasy), Qatar, Pakistan, Azerbaijan", hotIssues:"Sweden/Finland NATO accession delay, S-400 Russian purchase, Kurdish PKK conflict, inflation crisis, Syria buffer zones", recentEvents:"Blocking Sweden's NATO bid then approving, drone exports to Ukraine, Grain deal mediation, normalisation with UAE/Saudi" },
  saudi_arabia:{ leader:"Crown Prince Mohammed bin Salman (MBS)", capital:"Riyadh", currency:"Saudi Riyal", keyRivals:"Iran, Houthi rebels, Qatar (historic)", keyAllies:"UAE, USA, Egypt, Jordan", hotIssues:"Vision 2030 diversification, Yemen war exit, Iran normalisation via China, OPEC+ cuts, Israel normalisation", recentEvents:"China-brokered Iran normalisation, OPEC+ production cuts defying USA, LIV Golf merger, Neom megaproject" },
  israel:      { leader:"PM Benjamin Netanyahu", capital:"Jerusalem (disputed)", currency:"New Israeli Shekel", keyRivals:"Iran, Hamas, Hezbollah, Houthis", keyAllies:"USA, UAE, Bahrain (Abraham Accords)", hotIssues:"Gaza war, West Bank settlements, judicial overhaul protests, Iran nuclear threat, ICC arrest warrant for Netanyahu", recentEvents:"October 7 Hamas attack, Gaza ground offensive, killing of Sinwar, Hezbollah war, Iranian ballistic missile attack" },
  brazil:      { leader:"Luiz Inácio Lula da Silva (President)", capital:"Brasília", currency:"Brazilian Real", keyRivals:"None direct, tensions with USA (historic)", keyAllies:"Argentina, China, South Africa, BRICS", hotIssues:"Amazon deforestation, Bolsonaro coup attempt trial, BRICS expansion, China trade dependence, inequality", recentEvents:"Bolsonaro charged for coup plot, Amazon protection agreements, BRICS summit hosting" },
  poland:      { leader:"Donald Tusk (Prime Minister)", capital:"Warsaw", currency:"Polish Zloty", keyRivals:"Russia, Belarus", keyAllies:"USA, NATO, UK, Baltic states", hotIssues:"Russian border threat, Belarus hybrid warfare/migrants, Ukrainian refugee integration, EU rule-of-law funding, rearmament", recentEvents:"Tusk defeating PiS restoring EU funds, Russian sabotage of infrastructure, largest European army build-up" },
  taiwan:      { leader:"President Lai Ching-te (DPP)", capital:"Taipei", currency:"New Taiwan Dollar", keyRivals:"China (existential)", keyAllies:"USA (informal), Japan, Australia", hotIssues:"Chinese military encirclement exercises, TSMC chip dominance, US arms sales, UN recognition, strait crossings", recentEvents:"PLA record 91 aircraft incursion, TSMC Arizona factory delays, US$19bn arms package, Lai inauguration provocations" },
  afghanistan: { leader:"Supreme Leader Hibatullah Akhundzada (Taliban)", capital:"Kabul", currency:"Afghani", keyRivals:"ISIS-K, USA, Western countries", keyAllies:"Pakistan (uneasy), China (resource deals)", hotIssues:"Women banned from education/work, humanitarian collapse, ISIS-K attacks, opium ban enforcement, UN isolation", recentEvents:"UN special envoy creation, China copper mine deal, girls banned from universities, ISIS-K Kabul attacks" },
  syria:       { leader:"Ahmad al-Sharaa (HTS, post-Assad)", capital:"Damascus", currency:"Syrian Pound", keyRivals:"Israel, ISIS, Kurdish SDF", keyAllies:"Turkey (uneasy)", hotIssues:"Post-Assad reconstruction, HTS governance legitimacy, Israeli airstrikes on military sites, Kurdish autonomy, sanctions", recentEvents:"Assad regime collapse December 2024, HTS taking Damascus, Israeli occupation of buffer zone, EU sanction relief debate" },
  libya:       { leader:"GNU (Tripoli) vs GNS (Benghazi) — split", capital:"Tripoli/Benghazi (contested)", currency:"Libyan Dinar", keyRivals:"Internal factions", keyAllies:"Turkey (GNU), Russia/Wagner (GNS), UAE/Egypt (GNS)", hotIssues:"East-West government split, Wagner/Russian presence, oil revenue disputes, migration gateway to Europe", recentEvents:"Haftar kidnapping of oil minister, Wagner rebranded as Africa Corps, EU migration deal attempts" },
  nepal:       { leader:"PM KP Sharma Oli", capital:"Kathmandu", currency:"Nepalese Rupee", keyRivals:"None direct", keyAllies:"India (historically dominant), China (growing)", hotIssues:"India-China tug-of-war, political instability, Himalayan border disputes with India, hydropower deals", recentEvents:"China BRI road projects, India blocking Nepal-China trade routes, multiple coalition government collapses" },
  bangladesh:  { leader:"Muhammad Yunus (interim Chief Adviser)", capital:"Dhaka", currency:"Bangladeshi Taka", keyRivals:"Myanmar (Rohingya)", keyAllies:"India (complex), China (investment)", hotIssues:"Sheikh Hasina ouster, Rohingya refugee crisis (1.2m in Cox's Bazar), garment industry labour rights, India tensions", recentEvents:"Student revolution ousting Hasina Aug 2024, Yunus installed, India-Bangladesh border tensions, Rohingya camp fires" },
  ukraine:     { leader:"President Volodymyr Zelensky", capital:"Kyiv", currency:"Ukrainian Hryvnia", keyRivals:"Russia (existential war)", keyAllies:"USA, UK, EU, NATO members", hotIssues:"Active war with Russia, F-16 deployment, mobilisation fatigue, Zaporizhzhia nuclear plant, EU accession, frozen Russian assets", recentEvents:"Kursk incursion into Russia, North Korean troops fighting for Russia, US aid delays, long-range strike permissions" },
  north_korea: { leader:"Kim Jong-un (Supreme Leader)", capital:"Pyongyang", currency:"North Korean Won", keyRivals:"USA, South Korea, Japan", keyAllies:"Russia (new arms deal), China", hotIssues:"ICBM missile tests, nuclear warhead miniaturisation, troops sent to Russia, satellite launches, inter-Korean relations collapse", recentEvents:"Troops deployed to fight in Ukraine, ballistic missile over Japan, Kim-Putin summit, destroying inter-Korean roads" },
  ethiopia:    { leader:"PM Abiy Ahmed", capital:"Addis Ababa", currency:"Ethiopian Birr", keyRivals:"Egypt (Nile dam), Eritrea (uneasy)", keyAllies:"USA (historic), China (investment)", hotIssues:"Grand Ethiopian Renaissance Dam vs Egypt/Sudan, Tigray war aftermath, Amhara conflict, Red Sea access ambitions", recentEvents:"Tigray peace deal implementation, Egypt military threats over dam, Somaliland MOU for Red Sea port access" },
};

// ── WORLD EVENTS CATALOGUE — external crises that fire independently ──────────
// These represent events in the rest of the world, not player-controlled

const WORLD_EVENTS = [
  // OIL & ENERGY
  { id:"gulf_war",      category:"War",        severity:"Critical", icon:"💥", title:"Gulf War Erupts",                  description:"Iran and Saudi Arabia exchange strikes after a proxy clash in Yemen spirals out of control. The Strait of Hormuz is blockaded. Oil prices spike 60% overnight.", economyHit:-12, stabilityHit:-8,  militaryHit:0,  diplomacyHit:-5,  prestigeHit:-3,  strifeHit:10, affectedRegions:["Middle East","Eurasia","South Asia","Asia"], oilShock:true  },
  { id:"opec_cut",      category:"Economic",   severity:"High",     icon:"🛢️", title:"OPEC+ Emergency Production Cut",  description:"OPEC+ announces a surprise 3 million barrel/day cut citing 'market instability'. Fuel prices surge globally. Importing nations scramble for alternatives.", economyHit:-8,  stabilityHit:-4,  militaryHit:0,  diplomacyHit:-2,  prestigeHit:0,   strifeHit:6,  affectedRegions:["all"],                                       oilShock:true  },
  { id:"pipeline_bomb", category:"Security",   severity:"High",     icon:"💣", title:"Major Pipeline Sabotaged",         description:"A critical undersea energy pipeline is destroyed in an apparent state-sponsored attack. Energy markets convulse. Three countries immediately blame each other.", economyHit:-7,  stabilityHit:-5,  militaryHit:0,  diplomacyHit:-3,  prestigeHit:0,   strifeHit:5,  affectedRegions:["Europe","Eurasia"],                          oilShock:true  },
  // WARS & MILITARY
  { id:"taiwan_blockade",category:"War",       severity:"Critical", icon:"⚓", title:"China Blockades Taiwan Strait",    description:"The PLA Navy has imposed a full naval blockade of Taiwan, calling it a 'military exercise'. Global shipping lanes are disrupted. The US carrier group is moving in.", economyHit:-10, stabilityHit:-6,  militaryHit:-4, diplomacyHit:-8,  prestigeHit:-5,  strifeHit:8,  affectedRegions:["East Asia","Asia","North America"],          oilShock:false },
  { id:"india_pak_war",  category:"War",       severity:"Critical", icon:"☢️", title:"India-Pakistan Border War",        description:"A terrorist attack attributed to Lashkar-e-Tayyaba has triggered full military mobilisation on both sides of the Line of Control. Nuclear-armed rivals face their most dangerous standoff since 2001.", economyHit:-8,  stabilityHit:-7,  militaryHit:-3, diplomacyHit:-6,  prestigeHit:-4,  strifeHit:12, affectedRegions:["South Asia"],                                oilShock:false },
  { id:"korea_missiles", category:"Military",  severity:"High",     icon:"🚀", title:"North Korea ICBM Launch",          description:"Kim Jong-un has launched three ICBMs over Japan in what Pyongyang calls a 'strategic warning'. Tokyo activates missile defence. The UN Security Council is in emergency session.", economyHit:-5,  stabilityHit:-4,  militaryHit:-3, diplomacyHit:-4,  prestigeHit:-2,  strifeHit:5,  affectedRegions:["East Asia","North America"],                 oilShock:false },
  { id:"africa_coup",    category:"Political", severity:"Medium",   icon:"🎖️", title:"Military Coup in West Africa",     description:"A military junta has seized power in a major West African state, expelling French troops and declaring alignment with Russia's Africa Corps. France and the EU are in emergency consultations.", economyHit:-3,  stabilityHit:-3,  militaryHit:0,  diplomacyHit:-4,  prestigeHit:-2,  strifeHit:4,  affectedRegions:["Africa","Europe"],                           oilShock:false },
  { id:"nato_article5",  category:"War",       severity:"Critical", icon:"🛡️", title:"NATO Article 5 Invoked",           description:"Russia's Wagner forces have crossed into a NATO member state's territory. Article 5 has been formally invoked for the first time in NATO's history. The alliance is mobilising.", economyHit:-9,  stabilityHit:-10, militaryHit:5,  diplomacyHit:-5,  prestigeHit:3,   strifeHit:15, affectedRegions:["Europe","Eurasia","North America"],          oilShock:false },
  // ECONOMIC SHOCKS
  { id:"dollar_crash",   category:"Economic",  severity:"Critical", icon:"📉", title:"US Dollar Flash Crash",            description:"A cascade of sovereign debt downgrades and a surprise Fed announcement triggers a historic dollar sell-off. Emerging market currencies collapse. Global trade is in freefall.", economyHit:-14, stabilityHit:-7,  militaryHit:0,  diplomacyHit:-3,  prestigeHit:-5,  strifeHit:10, affectedRegions:["all"],                                       oilShock:false },
  { id:"chip_shortage",  category:"Economic",  severity:"High",     icon:"💻", title:"Global Semiconductor Collapse",    description:"A Category 5 typhoon has destroyed TSMC's primary fab in Taiwan. The world's chip supply will be cut by 40% for 18 months. Every tech and defence industry on earth just froze.", economyHit:-10, stabilityHit:-5,  militaryHit:-5, diplomacyHit:-2,  prestigeHit:-3,  strifeHit:7,  affectedRegions:["all"],                                       oilShock:false },
  { id:"trade_collapse", category:"Economic",  severity:"High",     icon:"🚢", title:"Red Sea Trade Route Shutdown",     description:"Houthi missile strikes have now sunk two container ships in the Red Sea. Lloyd's of London has suspended insurance for all vessels. 12% of global trade has ground to a halt.", economyHit:-9,  stabilityHit:-4,  militaryHit:0,  diplomacyHit:-3,  prestigeHit:-2,  strifeHit:6,  affectedRegions:["Middle East","Europe","Asia","South Asia"],  oilShock:true  },
  { id:"brics_currency", category:"Economic",  severity:"Medium",   icon:"💴", title:"BRICS Launch Rival Reserve Currency", description:"BRICS nations have formally announced a gold-backed settlement currency, with China, Russia, India and Brazil as founding members. The petrodollar faces its most serious challenge since Bretton Woods.", economyHit:-5,  stabilityHit:-2,  militaryHit:0,  diplomacyHit:3,   prestigeHit:-4,  strifeHit:3,  affectedRegions:["all"],                                       oilShock:false },
  // PANDEMICS & DISASTERS
  { id:"pandemic2",      category:"Pandemic",  severity:"Critical", icon:"🦠", title:"Novel Pathogen — WHO Emergency",   description:"A highly transmissible respiratory pathogen with 8% case fatality rate has been detected in 12 countries simultaneously. The WHO has declared a Public Health Emergency of International Concern.", economyHit:-13, stabilityHit:-9,  militaryHit:0,  diplomacyHit:2,   prestigeHit:-3,  strifeHit:15, affectedRegions:["all"],                                       oilShock:false },
  { id:"earthquake",     category:"Disaster",  severity:"High",     icon:"🌋", title:"Mega-Earthquake Hits Major City",   description:"A 8.4 magnitude earthquake has devastated a major regional capital. Over 80,000 are feared dead. International rescue teams are racing against time as aftershocks continue.", economyHit:-6,  stabilityHit:-6,  militaryHit:0,  diplomacyHit:4,   prestigeHit:3,   strifeHit:5,  affectedRegions:["Asia","Middle East","South Asia","Eurasia"], oilShock:false },
  { id:"drought_famine", category:"Climate",   severity:"High",     icon:"🌵", title:"Catastrophic Drought — Food Crisis", description:"Three consecutive failed monsoon seasons have pushed 200 million people in South Asia and East Africa into acute food insecurity. The UN warns of the worst famine in 40 years.", economyHit:-7,  stabilityHit:-8,  militaryHit:0,  diplomacyHit:-2,  prestigeHit:-2,  strifeHit:12, affectedRegions:["South Asia","Africa","Middle East"],         oilShock:false },
  { id:"cyber_grid",     category:"Security",  severity:"High",     icon:"⚡", title:"Simultaneous Global Cyberattacks",  description:"Power grids in 8 major cities across Europe and North America have gone dark in a coordinated strike. Attribution is unclear — suspected state actors include Russia, China and a new unknown group.", economyHit:-8,  stabilityHit:-7,  militaryHit:-3, diplomacyHit:-5,  prestigeHit:-3,  strifeHit:8,  affectedRegions:["Europe","North America","Eurasia"],          oilShock:false },
  // DIPLOMATIC / POLITICAL
  { id:"un_collapse",    category:"Political", severity:"Medium",   icon:"🏛️", title:"UN Security Council Paralysed",    description:"Russia and China have simultaneously vetoed 7 resolutions in 72 hours, rendering the UN Security Council functionally inoperative. Calls to reform or bypass the Council are growing.", economyHit:-3,  stabilityHit:-4,  militaryHit:0,  diplomacyHit:-8,  prestigeHit:-3,  strifeHit:3,  affectedRegions:["all"],                                       oilShock:false },
  { id:"refugee_wave",   category:"Humanitarian",severity:"High",   icon:"🏕️", title:"Refugee Wave — 5 Million Displaced", description:"The collapse of a regional government has triggered mass displacement. Five million refugees are moving across borders simultaneously. Receiving nations are overwhelmed and closing crossings.", economyHit:-6,  stabilityHit:-6,  militaryHit:0,  diplomacyHit:-4,  prestigeHit:-2,  strifeHit:10, affectedRegions:["Middle East","Europe","South Asia","Africa"], oilShock:false },
  { id:"assassination",  category:"Political", severity:"High",     icon:"🎯", title:"World Leader Assassinated",        description:"A major world leader has been assassinated in their capital. The method suggests a sophisticated state actor. Emergency successions are underway amid global shock and rising tensions.", economyHit:-5,  stabilityHit:-8,  militaryHit:0,  diplomacyHit:-6,  prestigeHit:-3,  strifeHit:8,  affectedRegions:["all"],                                       oilShock:false },
  { id:"space_incident", category:"Military",  severity:"Medium",   icon:"🛰️", title:"Satellite Destroyed — Space Race Crisis", description:"A major power has destroyed a rival's military satellite in low Earth orbit, creating a debris field that threatens 400 other satellites. Space-based communications and GPS are degrading globally.", economyHit:-5,  stabilityHit:-4,  militaryHit:-4, diplomacyHit:-5,  prestigeHit:-2,  strifeHit:5,  affectedRegions:["all"],                                       oilShock:false },
  { id:"nuclear_test",   category:"Military",  severity:"Critical", icon:"☢️", title:"Rogue Nuclear Test Detected",      description:"Seismic sensors have detected a 50-kiloton underground explosion. A non-NPT state has joined the nuclear club. The international non-proliferation regime has effectively collapsed.", economyHit:-7,  stabilityHit:-8,  militaryHit:-5, diplomacyHit:-8,  prestigeHit:-5,  strifeHit:10, affectedRegions:["all"],                                       oilShock:false },
  { id:"ai_crash",       category:"Economic",  severity:"High",     icon:"🤖", title:"AI Infrastructure Catastrophic Failure", description:"A cascading failure in AI-controlled financial systems has triggered $4 trillion in automated sell orders in 11 minutes. Markets are circuit-broken globally. The cause is unknown — sabotage or bug.", economyHit:-11, stabilityHit:-5,  militaryHit:0,  diplomacyHit:-2,  prestigeHit:-3,  strifeHit:7,  affectedRegions:["all"],                                       oilShock:false },
  { id:"arctic_claim",   category:"Political", severity:"Medium",   icon:"🧊", title:"Arctic Sovereignty Claim — Standoff", description:"Russia has planted flags and deployed submarines claiming a newly ice-free Arctic corridor. Canada, Norway and Denmark have scrambled forces. The Arctic Council has suspended operations.", economyHit:-3,  stabilityHit:-3,  militaryHit:-2, diplomacyHit:-5,  prestigeHit:-2,  strifeHit:4,  affectedRegions:["Europe","North America","Eurasia"],          oilShock:false },
];

const SEV_COLOR = { Critical:"#ef4444", High:"#f59e0b", Medium:"#3b82f6" };
const SEV_BG    = { Critical:"#fef2f2", High:"#fffbeb", Medium:"#eff6ff" };
const CAT_ICON  = { War:"⚔️", Economic:"📊", Security:"🔒", Pandemic:"🦠", Disaster:"🌋", Climate:"🌍", Political:"🏛️", Humanitarian:"🏕️", Military:"🛡️" };

// ── ALLIANCES / ACTORS / COUNTRIES ───────────────────────────────────────────

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

const MODELS = [
  { id:"anthropic/claude-3-haiku",       label:"Claude 3 Haiku (cheapest, fast)" },
  { id:"anthropic/claude-3.5-haiku",     label:"Claude 3.5 Haiku (better, moderate cost)" },
  { id:"anthropic/claude-3.5-sonnet",    label:"Claude 3.5 Sonnet (best quality, higher cost)" },
  { id:"openai/gpt-4o-mini",             label:"GPT-4o Mini (cheap, reliable)" },
  { id:"openai/gpt-4o",                  label:"GPT-4o (high quality)" },
  { id:"google/gemini-flash-1.5",        label:"Gemini Flash 1.5 (fast, cheap)" },
];

const COUNTRIES = [
  { id:"usa",         name:"United States",  flag:"🇺🇸", region:"North America", power:"Superpower",    gdp:25000, military:100, diplomacy:90, stability:72, internalStrife:28, alliances:["NATO","QUAD"],        threats:[],                      traits:"Global hegemon, NATO anchor, dollar dominance, polarised domestic politics" },
  { id:"china",       name:"China",          flag:"🇨🇳", region:"Asia",          power:"Superpower",    gdp:18000, military:95,  diplomacy:80, stability:78, internalStrife:18, alliances:["SCO","BRICS"],        threats:[],                      traits:"Rising superpower, Belt & Road, Taiwan ambitions, Xinjiang tensions" },
  { id:"russia",      name:"Russia",         flag:"🇷🇺", region:"Eurasia",       power:"Major Power",   gdp:2200,  military:88,  diplomacy:60, stability:60, internalStrife:30, alliances:["SCO","CSTO","BRICS"], threats:[],                      traits:"Nuclear power, energy weaponisation, revisionist state, Ukraine war" },
  { id:"india",       name:"India",          flag:"🇮🇳", region:"South Asia",    power:"Major Power",   gdp:3700,  military:80,  diplomacy:75, stability:68, internalStrife:32, alliances:["SCO","QUAD","BRICS"], threats:["let"],                  traits:"Strategic autonomy, border disputes with China and Pakistan, fastest-growing major economy" },
  { id:"uk",          name:"United Kingdom", flag:"🇬🇧", region:"Europe",        power:"Regional Power",gdp:3100,  military:72,  diplomacy:82, stability:70, internalStrife:22, alliances:["NATO"],               threats:[],                      traits:"P5 member, post-Brexit pivot, global finance hub, devolution pressures" },
  { id:"germany",     name:"Germany",        flag:"🇩🇪", region:"Europe",        power:"Regional Power",gdp:4400,  military:58,  diplomacy:85, stability:78, internalStrife:20, alliances:["NATO"],               threats:[],                      traits:"EU economic engine, Zeitenwende rearmament, far-right AfD surge" },
  { id:"japan",       name:"Japan",          flag:"🇯🇵", region:"East Asia",     power:"Regional Power",gdp:4200,  military:62,  diplomacy:78, stability:82, internalStrife:10, alliances:["QUAD"],               threats:[],                      traits:"Pacifist constitution revision, China and North Korea threats, US alliance" },
  { id:"france",      name:"France",         flag:"🇫🇷", region:"Europe",        power:"Regional Power",gdp:3000,  military:70,  diplomacy:80, stability:65, internalStrife:35, alliances:["NATO"],               threats:[],                      traits:"Nuclear state, EU co-leader, Sahel withdrawal, Macron's strategic autonomy doctrine" },
  { id:"iran",        name:"Iran",           flag:"🇮🇷", region:"Middle East",   power:"Regional Power",gdp:400,   military:68,  diplomacy:42, stability:55, internalStrife:45, alliances:["SCO","BRICS"],        threats:["houthis","hezbollah"],  traits:"Axis of Resistance proxy network, nuclear programme at 60% enrichment, under heavy sanctions" },
  { id:"pakistan",    name:"Pakistan",       flag:"🇵🇰", region:"South Asia",    power:"Regional Power",gdp:380,   military:65,  diplomacy:50, stability:42, internalStrife:60, alliances:["SCO"],               threats:["ttp","let"],            traits:"Nuclear state, civil-military tension under Army Chief Munir, IMF crisis, TTP insurgency" },
  { id:"turkey",      name:"Turkey",         flag:"🇹🇷", region:"Eurasia",       power:"Regional Power",gdp:1100,  military:70,  diplomacy:68, stability:60, internalStrife:38, alliances:["NATO"],               threats:[],                      traits:"Erdoğan's neo-Ottoman pivot, NATO's most awkward member, balancing Russia and the West" },
  { id:"saudi_arabia",name:"Saudi Arabia",   flag:"🇸🇦", region:"Middle East",   power:"Regional Power",gdp:1100,  military:65,  diplomacy:72, stability:68, internalStrife:22, alliances:["ARAB_LEAGUE"],        threats:["houthis","isis"],       traits:"MBS Vision 2030, OPEC+ kingpin, Yemen war exit strategy, normalisation with Israel paused" },
  { id:"israel",      name:"Israel",         flag:"🇮🇱", region:"Middle East",   power:"Regional Power",gdp:530,   military:80,  diplomacy:55, stability:62, internalStrife:40, alliances:[],                    threats:["hamas","hezbollah"],    traits:"Netanyahu government, Gaza war, Iran nuclear threat, ICC arrest warrant, judicial crisis" },
  { id:"brazil",      name:"Brazil",         flag:"🇧🇷", region:"South America", power:"Regional Power",gdp:2100,  military:55,  diplomacy:70, stability:62, internalStrife:28, alliances:["BRICS"],              threats:[],                      traits:"Lula's return, BRICS leadership, Amazon protection vs development, Bolsonaro coup trial" },
  { id:"poland",      name:"Poland",         flag:"🇵🇱", region:"Europe",        power:"Middle Power",  gdp:750,   military:60,  diplomacy:65, stability:72, internalStrife:25, alliances:["NATO"],               threats:[],                      traits:"Tusk government, Russia border threat, largest European army build-up" },
  { id:"taiwan",      name:"Taiwan",         flag:"🇹🇼", region:"East Asia",     power:"Middle Power",  gdp:790,   military:55,  diplomacy:40, stability:75, internalStrife:15, alliances:[],                    threats:[],                      traits:"Lai Ching-te presidency, TSMC chip dominance, PLA encirclement exercises, US informal ally" },
  { id:"afghanistan", name:"Afghanistan",    flag:"🇦🇫", region:"South Asia",    power:"Weak State",    gdp:15,    military:30,  diplomacy:15, stability:20, internalStrife:80, alliances:[],                    threats:["isis","ttp","alnusra"],  traits:"Taliban under Akhundzada, women banned from education, ISIS-K insurgency, UN isolation" },
  { id:"syria",       name:"Syria",          flag:"🇸🇾", region:"Middle East",   power:"Weak State",    gdp:22,    military:38,  diplomacy:20, stability:18, internalStrife:82, alliances:["ARAB_LEAGUE"],        threats:["isis","alnusra"],       traits:"Post-Assad HTS governance under al-Sharaa, Israeli airstrikes, Kurdish SDF autonomy, sanctions" },
  { id:"libya",       name:"Libya",          flag:"🇱🇾", region:"North Africa",  power:"Weak State",    gdp:50,    military:28,  diplomacy:22, stability:20, internalStrife:78, alliances:["ARAB_LEAGUE"],        threats:["isis","alnusra"],       traits:"East-West government split, Wagner/Africa Corps presence, oil revenue war, Europe migration gateway" },
  { id:"nepal",       name:"Nepal",          flag:"🇳🇵", region:"South Asia",    power:"Small State",   gdp:40,    military:22,  diplomacy:45, stability:58, internalStrife:30, alliances:[],                    threats:[],                      traits:"India-China squeeze, Oli government instability, Himalayan border disputes with India" },
  { id:"bangladesh",  name:"Bangladesh",     flag:"🇧🇩", region:"South Asia",    power:"Small State",   gdp:460,   military:35,  diplomacy:52, stability:55, internalStrife:35, alliances:[],                    threats:["let"],                  traits:"Yunus interim government post-Hasina ouster, Rohingya crisis, garment economy, India tensions" },
  { id:"ukraine",     name:"Ukraine",        flag:"🇺🇦", region:"Europe",        power:"Middle Power",  gdp:200,   military:65,  diplomacy:70, stability:25, internalStrife:20, alliances:[],                    threats:[],                      traits:"Zelensky wartime presidency, Kursk incursion, F-16 deployment, North Korean troops facing them" },
  { id:"north_korea", name:"North Korea",    flag:"🇰🇵", region:"East Asia",     power:"Rogue State",   gdp:18,    military:60,  diplomacy:8,  stability:70, internalStrife:10, alliances:[],                    threats:[],                      traits:"Kim Jong-un, troops fighting in Ukraine for Russia, ICBM tests, nuclear miniaturisation" },
  { id:"ethiopia",    name:"Ethiopia",       flag:"🇪🇹", region:"Africa",        power:"Regional Power",gdp:130,   military:45,  diplomacy:48, stability:38, internalStrife:65, alliances:[],                    threats:["isis"],                 traits:"Abiy Ahmed, GERD dam vs Egypt standoff, Tigray peace, Somaliland Red Sea port deal" },
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
  { id:"civil_war",   title:"Civil War Ignites",       icon:"🔥", description:"Ethnic tensions explode into open armed conflict in your territory.",                  stakes:"Critical", category:"Internal" },
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
function getIntel(id) { return COUNTRY_INTEL[id]||null; }
function buildIntelBlock(country) {
  const i=getIntel(country.id);
  if(!i) return country.traits;
  return `Leader: ${i.leader} | Capital: ${i.capital}\nKey rivals: ${i.keyRivals} | Key allies: ${i.keyAllies}\nLive issues: ${i.hotIssues}\nRecent events: ${i.recentEvents}`;
}

// Pick a world event that hasn't fired yet, biased toward relevant events
function pickWorldEvent(firedIds, country) {
  const pool = WORLD_EVENTS.filter(e => !firedIds.includes(e.id));
  if(!pool.length) return null;
  // Weight: events affecting player's region score 3x
  const weighted = [];
  for(const e of pool) {
    const relevant = e.affectedRegions.includes("all") || e.affectedRegions.includes(country.region);
    weighted.push(e, e); // base 2
    if(relevant) weighted.push(e); // +1 weight if relevant
  }
  return weighted[Math.floor(Math.random() * weighted.length)];
}

// Apply world event stat impacts to player stats
function applyWorldEvent(event, country, stats, strife) {
  const inRegion = event.affectedRegions.includes("all") || event.affectedRegions.includes(country.region);
  const mult = inRegion ? 1.0 : 0.4; // remote events have reduced impact
  return {
    Economy:        clamp(stats.Economy        + Math.round(event.economyHit   * mult)),
    Military:       clamp(stats.Military       + Math.round(event.militaryHit  * mult)),
    Diplomacy:      clamp(stats.Diplomacy      + Math.round(event.diplomacyHit * mult)),
    Stability:      clamp(stats.Stability      + Math.round(event.stabilityHit * mult)),
    GlobalPrestige: clamp(stats.GlobalPrestige + Math.round(event.prestigeHit  * mult)),
    newStrife:      Math.max(0, Math.min(100, strife + Math.round(event.strifeHit * mult))),
  };
}

function safeParseJSON(raw) {
  // Step 1: basic cleanup
  let s = raw
    .replace(/```json|```/g,"")
    .replace(/:\s*\+(\d)/g,": $1")
    .replace(/,(\s*[}\]])/g,"$1")
    .replace(/[\u0000-\u001F\u007F]/g," ")
    .trim();
  // Step 2: extract outermost object
  const start=s.indexOf("{"); const end=s.lastIndexOf("}");
  if(start===-1||end===-1) throw new Error("No JSON found in response");
  s=s.slice(start,end+1);
  // Step 3: direct parse
  try{ return JSON.parse(s); } catch(_){}
  // Step 4: repair truncated JSON by closing unclosed brackets
  const stack=[]; let inStr=false; let esc=false;
  for(let i=0;i<s.length;i++){
    const c=s[i];
    if(esc){esc=false;continue;}
    if(c==="\\" &&inStr){esc=true;continue;}
    if(c==='"'){inStr=!inStr;continue;}
    if(inStr) continue;
    if(c==="{"||c==="[") stack.push(c);
    else if((c==="}"||c==="]")&&stack.length) stack.pop();
  }
  let repaired=s.replace(/,\s*$/,"");
  for(let i=stack.length-1;i>=0;i--){
    repaired+=stack[i]==="{"?"}":")";
  }
  try{ return JSON.parse(repaired); }
  catch(e2){ throw new Error("JSON repair failed: "+e2.message.slice(0,80)); }
}

// ── STYLES ────────────────────────────────────────────────────────────────────

const G = `
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
  @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}
  .action-btn:hover{border-color:var(--color-border-primary)!important;background:var(--color-background-secondary)!important;}
  .country-btn:hover{border-color:var(--color-border-primary)!important;}
  .paper-tab:hover{opacity:0.85;}
  .cont-btn:hover{background:var(--color-background-secondary)!important;}
  .press-btn:hover{border-color:#a09880!important;background:#f0ece0!important;}
  .scen-btn:hover{border-color:var(--color-border-primary)!important;background:var(--color-background-secondary)!important;}
  .world-event-respond:hover{border-color:var(--color-border-primary)!important;background:var(--color-background-secondary)!important;}
`;

// ── UI ATOMS ──────────────────────────────────────────────────────────────────

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
  const color=value>65?"#22c55e":value>35?"#f59e0b":"#ef4444";
  return (
    <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",padding:"10px 8px",textAlign:"center"}}>
      <div style={{fontSize:9,color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)",marginBottom:4}}>{label.slice(0,5).toUpperCase()}</div>
      <div style={{fontSize:17,fontWeight:500,color}}>{value}</div>
    </div>
  );
}
function StatBar({ label, value, prev }) {
  const delta=prev!==undefined?value-prev:0;
  const color=value>65?"#22c55e":value>35?"#f59e0b":"#ef4444";
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

// ── WORLD EVENT CARD ──────────────────────────────────────────────────────────

function WorldEventCard({ event, country, impactedStats, prevStatsBeforeEvent, onRespond, onDismiss }) {
  const [expanded, setExpanded] = useState(true);
  const inRegion = event.affectedRegions.includes("all") || event.affectedRegions.includes(country.region);
  const sevColor = SEV_COLOR[event.severity] || "#888";
  const sevBg    = SEV_BG[event.severity]    || "#f9f9f9";

  // Compute what changed
  const changes = STAT_KEYS.map(k=>({key:k,delta:impactedStats[k]-(prevStatsBeforeEvent[k]||60)})).filter(x=>x.delta!==0);

  return (
    <div style={{border:`1.5px solid ${sevColor}`,borderRadius:"var(--border-radius-lg)",overflow:"hidden",animation:"slideDown 0.4s ease, shake 0.4s ease 0.1s",marginBottom:14}}>
      {/* Header bar */}
      <div style={{background:sevColor,padding:"8px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:18}}>{event.icon}</span>
          <div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.8)",letterSpacing:"0.12em",fontFamily:"var(--font-mono)"}}>
              {CAT_ICON[event.category]||"🌐"} WORLD EVENT — {event.severity.toUpperCase()} {inRegion?"· YOUR REGION AFFECTED":"· GLOBAL"}
            </div>
            <div style={{fontSize:14,fontWeight:500,color:"#fff",lineHeight:1.2}}>{event.title}</div>
          </div>
        </div>
        <button onClick={()=>setExpanded(x=>!x)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:14,padding:"2px 6px"}}>{expanded?"▲":"▼"}</button>
      </div>

      {expanded && (
        <div style={{background:sevBg,padding:"12px 14px"}}>
          <p style={{fontSize:13,lineHeight:1.7,color:"#1a1a1a",margin:"0 0 12px"}}>{event.description}</p>

          {/* Impact summary */}
          <div style={{marginBottom:12}}>
            <div style={{fontSize:10,letterSpacing:"0.1em",fontFamily:"var(--font-mono)",color:"#666",marginBottom:6}}>IMMEDIATE IMPACT ON YOUR NATION</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {changes.length===0
                ? <span style={{fontSize:11,color:"#888"}}>Minimal direct impact on your nation.</span>
                : changes.map(({key,delta})=>(
                  <div key={key} style={{display:"flex",alignItems:"center",gap:4,background:delta>0?"#f0fdf4":"#fef2f2",border:`0.5px solid ${delta>0?"#86efac":"#fca5a5"}`,borderRadius:"var(--border-radius-md)",padding:"3px 9px"}}>
                    <span style={{fontSize:11,color:"#333"}}>{key}</span>
                    <span style={{fontSize:12,fontWeight:500,color:delta>0?"#16a34a":"#dc2626"}}>{delta>0?"+":""}{delta}</span>
                  </div>
                ))
              }
              {event.oilShock && (
                <div style={{display:"flex",alignItems:"center",gap:4,background:"#fffbeb",border:"0.5px solid #fcd34d",borderRadius:"var(--border-radius-md)",padding:"3px 9px"}}>
                  <span style={{fontSize:11}}>🛢️ Oil Shock Active</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{display:"flex",gap:8}}>
            <button onClick={onRespond} className="world-event-respond"
              style={{flex:1,padding:"9px 14px",borderRadius:"var(--border-radius-md)",border:`0.5px solid ${sevColor}`,background:"var(--color-background-primary)",cursor:"pointer",fontSize:12,fontWeight:500,color:"var(--color-text-primary)",fontFamily:"var(--font-sans)",transition:"border-color 0.15s,background 0.15s",textAlign:"center"}}>
              📋 Respond to this crisis
            </button>
            <button onClick={onDismiss}
              style={{padding:"9px 14px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-tertiary)",background:"transparent",cursor:"pointer",fontSize:12,color:"var(--color-text-secondary)",fontFamily:"var(--font-sans)"}}>
              Continue without responding
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── NEWSPAPER COMPONENTS ──────────────────────────────────────────────────────

function NewspaperPanel({ edition, country }) {
  const [tab,setTab]=useState(0);
  useEffect(()=>{setTab(0);},[edition]);
  if(!edition?.papers?.length) return null;
  const paper=edition.papers[tab];
  const outlet=NEWS_OUTLETS.find(o=>o.id===paper.outletId)||NEWS_OUTLETS[tab%NEWS_OUTLETS.length];
  return (
    <div style={{background:"#faf8f2",border:"0.5px solid #d0c8b0",borderRadius:"var(--border-radius-lg)",overflow:"hidden",animation:"fadeUp 0.4s ease"}}>
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
        <div style={{textAlign:"center",borderBottom:`1px solid ${outlet.accentColor}40`,paddingBottom:8,marginBottom:10}}>
          <div style={{fontSize:9,color:"#999",fontFamily:"Georgia,serif",letterSpacing:"0.12em",marginBottom:4}}>TURN {edition.turn} EDITION &nbsp;·&nbsp; {country.name.toUpperCase()}</div>
          <div style={{fontSize:18,fontWeight:700,fontFamily:"Georgia,serif",color:"#1a1a1a"}}>{outlet.name.toUpperCase()}</div>
        </div>
        {paper.breakingTag&&<div style={{display:"inline-block",background:outlet.accentColor,color:"#fff",fontSize:8,padding:"2px 7px",fontFamily:"Georgia,serif",letterSpacing:"0.15em",marginBottom:8}}>▶ {paper.breakingTag}</div>}
        <h2 style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,lineHeight:1.25,color:"#1a1a1a",margin:"0 0 6px"}}>{paper.headline}</h2>
        {paper.subHeadline&&<p style={{fontFamily:"Georgia,serif",fontSize:11,fontStyle:"italic",color:"#444",lineHeight:1.55,margin:"0 0 10px",borderBottom:"1px solid #e0d8c8",paddingBottom:10}}>{paper.subHeadline}</p>}
        <div style={{display:"grid",gridTemplateColumns:paper.pullQuote?"1fr 130px":"1fr",gap:12,marginBottom:10}}>
          <p style={{fontFamily:"Georgia,serif",fontSize:12,lineHeight:1.7,color:"#222",margin:0}}>{paper.body}</p>
          {paper.pullQuote&&(
            <div style={{borderLeft:`3px solid ${outlet.accentColor}`,paddingLeft:10}}>
              <p style={{fontFamily:"Georgia,serif",fontSize:12,fontStyle:"italic",lineHeight:1.5,color:"#1a1a1a",margin:"0 0 5px"}}>"{paper.pullQuote.text}"</p>
              <p style={{fontFamily:"Georgia,serif",fontSize:9,color:"#777",margin:0}}>— {paper.pullQuote.attribution}</p>
            </div>
          )}
        </div>
        {paper.secondaryStories?.length>0&&(
          <><div style={{height:"0.5px",background:"#d0c8b0",margin:"10px 0"}}/>
          <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(paper.secondaryStories.length,3)},1fr)`,gap:0}}>
            {paper.secondaryStories.map((s,i)=>(
              <div key={i} style={{padding:"6px 10px",borderRight:i<paper.secondaryStories.length-1?"0.5px solid #d0c8b0":"none"}}>
                <div style={{fontSize:8,color:outlet.accentColor,fontFamily:"Georgia,serif",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>{s.section}</div>
                <div style={{fontSize:11,fontWeight:700,fontFamily:"Georgia,serif",color:"#1a1a1a",lineHeight:1.3,marginBottom:3}}>{s.headline}</div>
                <div style={{fontSize:10,fontFamily:"Georgia,serif",color:"#555",lineHeight:1.5}}>{s.snippet}</div>
              </div>
            ))}</div></>
        )}
        {paper.opEd&&(<><div style={{height:"0.5px",background:"#d0c8b0",margin:"10px 0"}}/>
          <div style={{background:"#f0ece0",borderRadius:4,padding:"8px 12px",display:"flex",gap:10,alignItems:"flex-start"}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:outlet.accentColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{paper.opEd.authorIcon||"✍"}</div>
            <div>
              <div style={{fontSize:8,color:outlet.accentColor,fontFamily:"Georgia,serif",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>Opinion · {paper.opEd.author}</div>
              <div style={{fontSize:11,fontWeight:700,fontFamily:"Georgia,serif",color:"#1a1a1a",marginBottom:3}}>{paper.opEd.title}</div>
              <div style={{fontSize:10,fontFamily:"Georgia,serif",fontStyle:"italic",color:"#444",lineHeight:1.55}}>{paper.opEd.excerpt}</div>
            </div>
          </div></>
        )}
        {paper.ticker?.length>0&&(
          <div style={{background:"#1c1c1c",margin:"12px -16px -14px",padding:"5px 12px",display:"flex",overflow:"hidden"}}>
            <span style={{fontSize:8,color:outlet.accentColor,fontWeight:700,fontFamily:"Georgia,serif",letterSpacing:"0.1em",marginRight:10,flexShrink:0}}>TICKER</span>
            <span style={{fontSize:9,color:"#bbb",fontFamily:"Georgia,serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{paper.ticker.join("  ·  ")}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function NewspaperSkeleton() {
  return (
    <div style={{background:"#faf8f2",border:"0.5px solid #d0c8b0",borderRadius:"var(--border-radius-lg)",padding:"16px"}}>
      <div style={{textAlign:"center",marginBottom:12}}>
        <div style={{fontSize:9,color:"#999",fontFamily:"Georgia,serif",marginBottom:6}}>PRESS IS PRINTING...</div>
        <div style={{fontSize:16,fontWeight:700,fontFamily:"Georgia,serif",color:"#ccc"}}>THE WORLD HERALD</div>
      </div>
      {[80,55,100,40,70].map((w,i)=>(
        <div key={i} style={{height:i===0?18:10,width:`${w}%`,background:"#e0d8c8",borderRadius:2,marginBottom:8,animation:"pulse 1.5s ease infinite",animationDelay:`${i*0.15}s`}}/>
      ))}
    </div>
  );
}

// ── COUNTRY SELECT ────────────────────────────────────────────────────────────

function CountrySelectScreen({ onSelect, apiKey, setApiKey, showApiInput, setShowApiInput, selectedModel, setSelectedModel }) {
  const [filter,setFilter]=useState("All");
  const regions=["All",...new Set(COUNTRIES.map(c=>c.region))];
  const filtered=filter==="All"?COUNTRIES:COUNTRIES.filter(c=>c.region===filter);
  return (
    <div style={{fontFamily:"var(--font-sans)",maxWidth:920,margin:"0 auto",padding:"1.5rem 1rem"}}>
      <style>{G}</style>
      <div style={{marginBottom:"1.5rem"}}>
        <div style={{fontSize:10,letterSpacing:"0.14em",color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)",marginBottom:6}}>GEOPOLITICS SIMULATOR</div>
        <h1 style={{fontSize:24,fontWeight:500,margin:"0 0 6px",letterSpacing:"-0.02em"}}>Choose your nation</h1>
        <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>Lead a country through real crises with real leaders. The world won't wait for you.</p>
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

      {/* Model selector */}
      <div style={{marginBottom:"1.25rem"}}>
        <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:5}}>AI Model</div>
        <select value={selectedModel} onChange={e=>setSelectedModel(e.target.value)}
          style={{width:"100%",maxWidth:380,fontSize:12,padding:"6px 10px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",cursor:"pointer"}}>
          {MODELS.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}
        </select>
      </div>

      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:"1.25rem"}}>
        {regions.map(r=>(
          <button key={r} onClick={()=>setFilter(r)}
            style={{fontSize:11,padding:"4px 13px",borderRadius:99,border:`0.5px solid ${filter===r?"var(--color-border-primary)":"var(--color-border-tertiary)"}`,background:filter===r?"var(--color-background-secondary)":"transparent",cursor:"pointer",color:"var(--color-text-primary)",fontFamily:"var(--font-mono)"}}>
            {r}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
        {filtered.map(c=>{
          const intel=getIntel(c.id);
          return (
            <button key={c.id} onClick={()=>onSelect(c)} className="country-btn"
              style={{textAlign:"left",padding:"14px",borderRadius:"var(--border-radius-lg)",border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",cursor:"pointer",fontFamily:"var(--font-sans)",transition:"border-color 0.15s",width:"100%"}}>
              <div style={{fontSize:28,marginBottom:8,lineHeight:1}}>{c.flag}</div>
              <div style={{fontSize:13,fontWeight:500,marginBottom:2,color:"var(--color-text-primary)"}}>{c.name}</div>
              <div style={{fontSize:10,color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)",marginBottom:6,letterSpacing:"0.06em"}}>{c.region}</div>
              {intel&&<div style={{fontSize:10,color:"var(--color-text-secondary)",lineHeight:1.4,marginBottom:6}}>{intel.leader}</div>}
              <div style={{display:"inline-block",fontSize:9,padding:"2px 7px",borderRadius:99,background:`${POWER_COLORS[c.power]||"#94a3b8"}18`,color:POWER_COLORS[c.power]||"#94a3b8",border:`0.5px solid ${POWER_COLORS[c.power]||"#94a3b8"}40`,fontFamily:"var(--font-mono)"}}>{c.power}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── SCENARIO SELECT ───────────────────────────────────────────────────────────

function ScenarioSelectScreen({ country, onSelect, onBack, loading }) {
  const intel=getIntel(country.id);
  return (
    <div style={{fontFamily:"var(--font-sans)",maxWidth:860,margin:"0 auto",padding:"1.5rem 1rem"}}>
      <style>{G}</style>
      <button onClick={onBack} style={{fontSize:12,color:"var(--color-text-secondary)",background:"none",border:"none",cursor:"pointer",padding:"0 0 1rem"}}>← Back</button>
      <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:"1.25rem",padding:"14px 16px",background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-lg)",border:"0.5px solid var(--color-border-tertiary)"}}>
        <span style={{fontSize:36,lineHeight:1,flexShrink:0}}>{country.flag}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:10,color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)",letterSpacing:"0.1em",marginBottom:3}}>PLAYING AS</div>
          <div style={{fontSize:18,fontWeight:500,color:"var(--color-text-primary)",marginBottom:4}}>{country.name}</div>
          {intel&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",rowGap:3,columnGap:16}}>
              <div style={{fontSize:11,color:"var(--color-text-secondary)"}}><span style={{color:"var(--color-text-tertiary)"}}>Leader:</span> {intel.leader}</div>
              <div style={{fontSize:11,color:"var(--color-text-secondary)"}}><span style={{color:"var(--color-text-tertiary)"}}>Rivals:</span> {intel.keyRivals}</div>
              <div style={{fontSize:11,color:"var(--color-text-secondary)",gridColumn:"1/-1"}}><span style={{color:"var(--color-text-tertiary)"}}>Live issues:</span> {intel.hotIssues}</div>
            </div>
          )}
        </div>
      </div>
      <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:"1rem"}}>Select a crisis to navigate</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:10}}>
        {SCENARIOS.map(s=>(
          <button key={s.id} onClick={()=>onSelect(s)} disabled={loading} className="scen-btn"
            style={{textAlign:"left",padding:14,borderRadius:"var(--border-radius-lg)",border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",cursor:"pointer",fontFamily:"var(--font-sans)",opacity:loading?0.6:1,transition:"border-color 0.15s,background 0.15s"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:22}}>{s.icon}</span>
              <span style={{fontSize:9,padding:"2px 7px",borderRadius:99,fontFamily:"var(--font-mono)",background:s.stakes==="Critical"?"#fef2f2":s.stakes==="High"?"#fffbeb":"#f0fdf4",color:STAKE_COLORS[s.stakes]}}>{s.stakes.toUpperCase()}</span>
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
  const [phase,setPhase]                       = useState("select_country");
  const [country,setCountry]                   = useState(null);
  const [scenario,setScenario]                 = useState(null);
  const [stats,setStats]                       = useState({Economy:60,Military:60,Diplomacy:60,Stability:65,GlobalPrestige:60});
  const [prevStats,setPrevStats]               = useState(null);
  const [strife,setStrife]                     = useState(30);
  const [relationships,setRelationships]       = useState({});
  const [turn,setTurn]                         = useState(1);
  const [situation,setSituation]               = useState("");
  const [actions,setActions]                   = useState([]);
  const [gameState,setGameState]               = useState("choosing");
  const [reactionText,setReactionText]         = useState("");
  const [statDeltas,setStatDeltas]             = useState(null);
  const [pendingNext,setPendingNext]           = useState(null);
  const [loading,setLoading]                   = useState(false);
  const [newspaper,setNewspaper]               = useState(null);
  const [allEditions,setAllEditions]           = useState([]);
  const [newspaperLoading,setNewspaperLoading] = useState(false);
  const [log,setLog]                           = useState([]);
  const [apiKey,setApiKey]                     = useState("");
  const [showApiInput,setShowApiInput]         = useState(false);
  const [sideTab,setSideTab]                   = useState("alliances");

  // World Events state
  const [activeWorldEvent,setActiveWorldEvent]         = useState(null);  // currently shown event
  const [firedEventIds,setFiredEventIds]               = useState([]);    // events already used
  const [statsBeforeEvent,setStatsBeforeEvent]         = useState(null);  // snapshot pre-event for delta display
  const [worldEventLog,setWorldEventLog]               = useState([]);    // history of all fired events
  const [respondingToEvent,setRespondingToEvent]       = useState(false); // user chose to respond

  const lastActionRef   = useRef("");
  const lastReactionRef = useRef("");
  const lastStatsRef    = useRef({});
  const [selectedModel, setSelectedModel] = useState("anthropic/claude-3-haiku");

  // ── API ──

  async function callClaude(prompt, maxTokens=700, model=null) {
    const useModel = model || selectedModel;
    const key=apiKey||window.__GEO_KEY__;
    const res=await fetch("https://openrouter.ai/api/v1/chat/completions",{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`,"HTTP-Referer":window.location.href,"X-Title":"Geopolitics Simulator"},
      body:JSON.stringify({model:useModel,max_tokens:maxTokens,messages:[{role:"user",content:prompt}]}),
    });
    const data=await res.json();
    if(data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
  }

  function buildCtx() {
    const we = activeWorldEvent ? `\nActive world crisis: "${activeWorldEvent.title}" — ${activeWorldEvent.description}` : "";
    return `Country: ${country.name} (${country.power}, ${country.region})
${buildIntelBlock(country)}
Alliances: ${getCountryAlliances(country).map(a=>a.name).join(", ")||"none"}
Non-state threats: ${getCountryThreats(country).map(a=>a.name).join(", ")||"none"}
Internal strife: ${strife}/100${we}`;
  }

  // ── WORLD EVENT LOGIC ──

  // Rolls for a world event. Called on Continue (after turn 2+, ~40% chance)
  function rollWorldEvent(currentStats, currentStrife) {
    const event = pickWorldEvent(firedEventIds, country);
    if(!event) return;

    // Apply stat impacts
    const impacts = applyWorldEvent(event, country, currentStats, currentStrife);
    const newStats = {
      Economy:        impacts.Economy,
      Military:       impacts.Military,
      Diplomacy:      impacts.Diplomacy,
      Stability:      impacts.Stability,
      GlobalPrestige: impacts.GlobalPrestige,
    };
    const newStrife = impacts.newStrife;

    setStatsBeforeEvent({...currentStats});
    setPrevStats({...currentStats});
    setStats(newStats);
    setStrife(newStrife);
    setFiredEventIds(prev=>[...prev, event.id]);
    setActiveWorldEvent(event);
    setWorldEventLog(prev=>[...prev,{turn, event, statsImpact:{...newStats}}]);
    setGameState("world_event");
  }

  function handleRespondToEvent() {
    // Treat as an action turn: generate AI response actions specific to the world event
    setRespondingToEvent(true);
    setActiveWorldEvent(null);
    setGameState("choosing_response");
    // Generate response actions for the world event
    generateEventResponseActions(activeWorldEvent);
  }

  async function generateEventResponseActions(event) {
    setLoading(true);
    try {
      const prompt=`Geopolitical crisis simulation. A major world event has erupted and demands an immediate response.

COUNTRY: ${country.name} (${country.power}) | LEADER: ${getIntel(country.id)?.leader||"the government"}
ONGOING SCENARIO: ${scenario.title}
WORLD CRISIS: "${event.title}" — ${event.description}
CURRENT STATS: Eco ${stats.Economy} Mil ${stats.Military} Dip ${stats.Diplomacy} Sta ${stats.Stability}

Describe how this specific world crisis is hitting ${country.name} RIGHT NOW — not in the abstract. Name actual domestic actors, specific economic sectors, or real border/trade relationships that are being disrupted. Then generate 4 response options.

Each option must be CONCRETE and name specific actors, institutions, or policy tools available to ${country.name}. Include a clear tradeoff — who benefits, who is alienated.

Return ONLY valid JSON:
{"situation":"2-3 sentences: how is '${event.title}' specifically hitting ${country.name} today? Name the leader, name the specific impact — which sector is collapsing, which border is at risk, which ally is calling for help.","actions":[{"id":"a1","label":"5 word max label","description":"One concrete response sentence naming real actors and tradeoffs","statHints":{"Economy":3,"Military":0,"Diplomacy":5,"Stability":2,"GlobalPrestige":4}},{"id":"a2","label":"5 word max label","description":"One concrete sentence","statHints":{"Economy":5,"Military":2,"Diplomacy":-3,"Stability":4,"GlobalPrestige":1}},{"id":"a3","label":"5 word max label","description":"One concrete sentence","statHints":{"Economy":-3,"Military":5,"Diplomacy":-5,"Stability":-4,"GlobalPrestige":2}},{"id":"a4","label":"5 word max label","description":"One concrete sentence","statHints":{"Economy":-5,"Military":-2,"Diplomacy":8,"Stability":1,"GlobalPrestige":5}}]}`;
      const raw=await callClaude(prompt,600);
      const p=safeParseJSON(raw);
      setSituation(p.situation);
      setActions(p.actions);
      setGameState("choosing");
    } catch(e){ alert("Error: "+e.message); setGameState("choosing"); }
    setLoading(false);
  }

  function handleDismissEvent() {
    // Player ignores the event, just moves on
    setActiveWorldEvent(null);
    setGameState("choosing");
    setRespondingToEvent(false);
  }

  // ── START GAME ──

  async function startGame(c,s) {
    setLoading(true);
    const init={
      Economy:        clamp(c.gdp>3000?70:c.gdp>500?55:35),
      Military:       clamp(c.military),
      Diplomacy:      clamp(c.diplomacy),
      Stability:      clamp(c.stability),
      GlobalPrestige: clamp(c.power==="Superpower"?85:c.power==="Major Power"?70:c.power==="Regional Power"?55:35),
    };
    setStats(init); setPrevStats(null); setStrife(c.internalStrife);
    setTurn(1); setLog([]); setReactionText(""); setPendingNext(null);
    setNewspaper(null); setAllEditions([]); setStatDeltas(null);
    setGameState("choosing"); setActiveWorldEvent(null);
    setFiredEventIds([]); setWorldEventLog([]); setRespondingToEvent(false);
    lastActionRef.current=""; lastReactionRef.current=""; lastStatsRef.current=init;
    const initRel={};
    ["usa","china","russia","india","germany","uk","iran","saudi_arabia"].forEach(id=>{
      const x=COUNTRIES.find(y=>y.id===id);
      if(x&&x.id!==c.id) initRel[id]=Math.floor(Math.random()*40)+30;
    });
    setRelationships(initRel);
    try {
      const allies=getCountryAlliances(c).map(a=>a.name).join(", ");
      const threats=getCountryThreats(c).map(a=>a.name).join(", ");
      const prompt=`You are a geopolitical crisis simulation engine. Write like a veteran foreign policy journalist — vivid, specific, consequential.

COUNTRY: ${c.name} (${c.power}, ${c.region})
${buildIntelBlock(c)}
ALLIANCES: ${allies||"none"} | ACTIVE THREATS: ${threats||"none"}
CRISIS: "${s.title}" — ${s.description}

CRITICAL WRITING RULES:
1. Name the actual leader of ${c.name} by name in the situation text
2. Describe a CONCRETE OPENING EVENT — not a vague tension, but a specific incident that just happened (a military incursion, an assassination, a market crash, a specific vote, troops crossing a border, a missile launch)
3. Name at least 2 specific rival countries or actors and what they are DOING RIGHT NOW, not what they might do
4. The internal event must name a real political faction, opposition figure, or institution in ${c.name} and describe their SPECIFIC reaction
5. Each action must be a concrete policy with a clear downside — not "engage diplomatically" but "offer bilateral talks with China, sidelining US alliance partners"

Return ONLY valid JSON:
{"situation":"3 sentences describing the SPECIFIC incident that just triggered this crisis, who is reacting how right now, and what the immediate stakes are for ${c.name}. Name the leader, name rivals, describe actual events not potential ones.","internalEvent":"1 sentence naming a specific real faction or institution in ${c.name} and their concrete reaction to this crisis.","actions":[{"id":"a1","label":"5 word max label","description":"One concrete sentence with a named tradeoff — e.g. which ally gains, which rival is antagonised","statHints":{"Economy":0,"Military":5,"Diplomacy":-5,"Stability":-3,"GlobalPrestige":2}},{"id":"a2","label":"5 word max label","description":"One concrete sentence with tradeoff","statHints":{"Economy":-3,"Military":0,"Diplomacy":8,"Stability":2,"GlobalPrestige":5}},{"id":"a3","label":"5 word max label","description":"One concrete sentence with tradeoff","statHints":{"Economy":5,"Military":-2,"Diplomacy":-3,"Stability":5,"GlobalPrestige":-2}},{"id":"a4","label":"5 word max label","description":"One concrete sentence with tradeoff","statHints":{"Economy":-5,"Military":8,"Diplomacy":-8,"Stability":-5,"GlobalPrestige":-3}}]}`;
      const raw=await callClaude(prompt,700);
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
    setReactionText(""); setNewspaper(null); setNewspaperLoading(false);
    setStatDeltas(null); lastActionRef.current=action.label;
    setRespondingToEvent(false);

    const actorCtx=getRelatedActors(country).map(a=>a.name).join(", ");
    const allyCtx=getCountryAlliances(country).map(a=>a.name).join(", ");
    const worldEventCtx=activeWorldEvent?`\nActive world crisis affecting this turn: "${activeWorldEvent.title}"`:"";

    try {
      // Narrative arc — forces dramatic escalation each turn
      const PHASES = [
        null,
        "ACT 1 — OPENING MOVE: The crisis breaks. The world is watching. Establish the concrete incident and first movers clearly.",
        "ACT 1 — FIRST CONSEQUENCES: The player's opening choice has rippled outward. A new actor has entered or an existing one has escalated. Something has changed on the ground.",
        "ACT 2 — ESCALATION: The situation is deteriorating OR surprisingly stabilising. A major power has made a decisive move. The stakes are now significantly higher than turn 1.",
        "ACT 2 — CRISIS DEEPENS: A secondary crisis has emerged from the first. The player's resources are stretched. Unexpected alliances or betrayals are happening.",
        "ACT 3 — PEAK DANGER: The situation is at its most volatile. A major irreversible event must occur this turn — a war starting, a government falling, a deal being signed, a weapon being used.",
        "ACT 3 — ENDGAME APPROACHING: The crisis is moving toward resolution. The player's cumulative decisions have shaped the outcome. Consequences of earlier choices are crystallising.",
        "ACT 4 — DENOUEMENT: The crisis ends this turn one way or another. Generate a compelling conclusion based on the player's decisions throughout.",
      ];
      const turnPhase = PHASES[Math.min(turn, PHASES.length-1)] || PHASES[PHASES.length-1];

      // Detect repeated action patterns — punish them
      const recentActionTypes = log.slice(-3).map(l=>l.action.toLowerCase());
      const repeatWarning = recentActionTypes.length >= 2 && recentActionTypes.every(a=>a.includes(recentActionTypes[0].split(" ")[0]))
        ? `WARNING: Player has repeated similar actions (${recentActionTypes.join(", ")}). The world MUST show fatigue, diminishing returns, or backlash this turn.` : "";

      // World event context for the prompt
      const activeWeCtx = worldEventLog.length > 0
        ? `
ACTIVE WORLD CRISIS: "${worldEventLog.slice(-1)[0]?.event.title}" — ${worldEventLog.slice(-1)[0]?.event.description} — This MUST influence the situation this turn.`
        : "";

      // Full history for continuity
      const historyCtx = log.length > 0
        ? "STORY SO FAR:
" + log.map(l=>`Turn ${l.turn}: Player chose "${l.action}" → ${l.reaction.slice(0,150)}`).join("
")
        : "This is the first turn.";

      const prompt=`You are a master geopolitical thriller writer running a strategy simulation. Write with the urgency of a BBC war correspondent filing from the field. Every turn must feel like a new chapter — not a continuation of the same paragraph.

PLAYER'S COUNTRY: ${country.name} (${country.power}, ${country.region})
${buildIntelBlock(country)}
ALLIANCES: ${allyCtx||"none"} | NEARBY THREATS: ${actorCtx||"none"}
CURRENT STATS: Economy ${stats.Economy}/100, Military ${stats.Military}/100, Diplomacy ${stats.Diplomacy}/100, Stability ${stats.Stability}/100, Prestige ${stats.GlobalPrestige}/100, Strife ${strife}/100

SCENARIO: ${scenario.title}
SITUATION ENTERING THIS TURN: ${situation}
PLAYER'S CHOICE THIS TURN: "${action.label}" — ${action.description}

NARRATIVE PHASE: ${turnPhase}
${historyCtx}
${activeWeCtx}
${repeatWarning ? "
"+repeatWarning : ""}

═══ IRON RULES — VIOLATING THESE RUINS THE GAME ═══

RULE 1 — EVENTS NOT STATEMENTS:
worldReaction must describe PHYSICAL EVENTS with named actors:
✓ GOOD: "Putin's FSB detained three American journalists in Moscow and expelled the US Ambassador within 24 hours."
✓ GOOD: "The Chinese carrier Liaoning entered the Taiwan Strait. Markets in Tokyo dropped 8% at open."
✗ BAD: "World leaders expressed concern." "China warned that..." "The US called for restraint."

RULE 2 — MANDATORY STEP CHANGE EACH TURN:
The newSituation CANNOT echo the previous situation. It MUST contain:
- At least one named actor who wasn't in the previous situation, OR
- A concrete deadline (48 hours, UN vote Thursday, troops mobilised by dawn), OR
- An irreversible event that happened (territory taken, leader killed, deal signed, sanctions imposed), OR
- A twist that reframes the whole crisis (secret revealed, unexpected ally, betrayal)

RULE 3 — MAKE STATS HURT AND MATTER:
Good diplomatic breakthrough: Diplomacy +10 to +14, GlobalPrestige +6 to +10
Military aggression backfires: Stability -10 to -14, GlobalPrestige -8 to -12
Economic crisis deepens: Economy -10 to -14, Strife +8 to +12
Successful deterrence: Military +6, Stability +4, Diplomacy -4
Small timid actions get SMALL changes (±2 to ±4). Decisive actions get BIG changes (±8 to ±14).

RULE 4 — WIN/LOSS CONDITIONS:
If stats reach these THRESHOLDS, trigger gameOver:
- Economy drops below 20: economic collapse, revolution inevitable
- Stability drops below 15: state has collapsed or civil war is unwinnable
- Strife exceeds 88: regime change or dissolution
- Economy + Stability both above 80 AND Diplomacy above 75 after turn 5+: VICTORY — crisis resolved
- GlobalPrestige above 85 AND Economy above 75 after turn 5+: DIPLOMATIC VICTORY
When triggering gameOver:true, write a vivid 3-sentence gameOverReason that describes WHAT SPECIFICALLY HAPPENED — not generic "the nation collapsed" but "Modi's government fell in a no-confidence vote after the Arunachal Pradesh military disaster. The BJP lost 180 seats. China signed a border treaty with the new coalition government that ceded the disputed valley permanently."

RULE 5 — WORLD CRISES MUST RESHAPE THE SITUATION:
If there is an active world crisis listed above, it MUST appear concretely in worldReaction AND in newSituation. It cannot be ignored.

═══ OUTPUT ═══
Return ONLY valid JSON (no markdown, no + signs before numbers):
{"worldReaction":"3 sentences of CONCRETE EVENTS. Name leaders by name doing specific things. What physically changed on the ground, in markets, or in governments?","internalConsequence":"1 sentence: a SPECIFIC internal event — a named minister resigned, parliament voted X to Y, protests in [city], a general issued a public statement defying orders.","nonStateActorEvent":null,"newSituation":"3 sentences with a MANDATORY STEP CHANGE. Name at least one new actor or new development. Set a concrete deadline or describe an irreversible event that just occurred.","newActions":[{"id":"a1","label":"5 word max","description":"Concrete action with named tradeoff — who gains, who loses"},{"id":"a2","label":"5 word max","description":"Concrete action with named tradeoff"},{"id":"a3","label":"5 word max","description":"Concrete action with named tradeoff"},{"id":"a4","label":"5 word max","description":"Concrete action with named tradeoff"}],"statChanges":{"Economy":0,"Military":0,"Diplomacy":0,"Stability":0,"GlobalPrestige":0},"strifeChange":0,"relationshipChanges":{"usa":0,"china":0,"russia":0},"gameOver":false,"gameOverReason":null}
Numbers: plain integers only, NO + signs. Large decisive actions get large stat changes (±8 to ±14). Small timid actions get small changes (±2 to ±5). Check WIN/LOSS CONDITIONS above before setting gameOver.`;

      const raw=await callClaude(prompt,900);
      const p=safeParseJSON(raw);

      const snapshot={...stats};
      const newStats={};
      for(const k of STAT_KEYS) newStats[k]=clamp(stats[k]+(p.statChanges[k]||0));
      const newStrife=Math.max(0,Math.min(100,strife+(p.strifeChange||0)));
      const newRel={...relationships};
      for(const [k,v] of Object.entries(p.relationshipChanges||{})){if(newRel[k]!==undefined)newRel[k]=Math.max(0,Math.min(100,newRel[k]+v));}

      let fullText=p.worldReaction;
      if(p.internalConsequence) fullText+="\n\n🏛️ Internally: "+p.internalConsequence;
      if(p.nonStateActorEvent)  fullText+="\n\n⚠️ "+p.nonStateActorEvent;

      lastReactionRef.current=p.worldReaction;
      lastStatsRef.current=newStats;
      setPrevStats(snapshot);
      setStats(newStats);
      setStrife(newStrife);
      setRelationships(newRel);
      setReactionText(fullText);
      setStatDeltas(snapshot);
      setLog(prev=>[...prev,{turn,action:action.label,reaction:p.worldReaction,strife:newStrife}]);

      if(p.gameOver){
        setPendingNext({gameOver:true,reason:p.gameOverReason});
      } else {
        setPendingNext({situation:p.newSituation,actions:p.newActions,statsForEvent:newStats,strifeForEvent:newStrife});
      }
    } catch(e){alert("Error: "+e.message);setGameState("choosing");}
    setLoading(false);
  }

  // ── GENERATE NEWSPAPER ──

  // Generate one paper per call to avoid truncation, run all 3 in parallel
  async function generateOnePaper(outletId, bias, instruction, ctx) {
    const prompt=`You are writing a single fictional newspaper front page for a geopolitical strategy game. Respond with ONLY a JSON object — no preamble, no explanation, nothing outside the JSON.

CONTEXT: ${ctx}
OUTLET BIAS: ${bias}
WRITING INSTRUCTION: ${instruction}

Return this EXACT JSON structure (fill in all fields, keep values short):
{"outletId":"${outletId}","breakingTag":"BREAKING","headline":"Max 10 words","subHeadline":"One sentence deck.","body":"2 sentences. Name actual leaders and events.","pullQuote":{"text":"Under 10 words","attribution":"Name, Title"},"secondaryStories":[{"section":"WORLD","headline":"Short headline","snippet":"One sentence."},{"section":"ECONOMY","headline":"Short headline","snippet":"One sentence."}],"opEd":{"author":"Analyst Name","authorIcon":"✍","title":"Op-ed title","excerpt":"2 short sentences."},"ticker":["Short item 1","Short item 2","Short item 3"]}`;
    const raw = await callClaude(prompt, 500, "anthropic/claude-3.5-haiku");
    return safeParseJSON(raw);
  }

  async function handleGenerateNewspaper() {
    if(newspaperLoading||newspaper) return;
    setNewspaperLoading(true);
    try {
      const intel=getIntel(country.id);
      const allies=getCountryAlliances(country).map(a=>a.name).join(", ");
      const worldCtx=worldEventLog.length>0?` World crisis: ${worldEventLog.slice(-1)[0]?.event.title}.`:"";
      const ctx=`Country: ${country.name}, Leader: ${intel?.leader||"the government"}, Scenario: ${scenario.title}, Decision: "${lastActionRef.current}", Reaction: ${lastReactionRef.current.slice(0,200)}, Alliances: ${allies||"none"}.${worldCtx}`;

      // Generate 3 papers in parallel — each is a separate small call, much less likely to truncate
      const [p1,p2,p3] = await Promise.allSettled([
        generateOnePaper("herald",  "Western liberal broadsheet", "Write from a critical Western perspective. Emphasise democracy, rule of law, or human rights angle. Be pointed and direct.", ctx),
        generateOnePaper("global_t","Eastern state media",        "Write from a pro-sovereignty, multipolar perspective. Emphasise Western hypocrisy or the right of nations to self-determination. Favour Xi Jinping or Russia's framing.", ctx),
        generateOnePaper("al_watan","Gulf/Global South regional", "Write from a regional or Global South perspective. Emphasise humanitarian impact, sovereignty, or consequences for developing nations.", ctx),
      ]);

      const papers = [p1,p2,p3]
        .filter(r=>r.status==="fulfilled")
        .map(r=>r.value);

      if(papers.length===0) throw new Error("All 3 newspaper calls failed");

      const edition={papers, turn};
      setNewspaper(edition);
      setAllEditions(prev=>[...prev,edition]);
    } catch(e){
      console.error("Newspaper error:",e);
      // Show a minimal fallback paper so the UI doesn't break
      const fallback={papers:[{outletId:"herald",breakingTag:"BREAKING",headline:"Press unavailable — try again",subHeadline:"An error occurred generating press coverage.",body:"The press bureau is temporarily unavailable. Your decision has been recorded.",pullQuote:null,secondaryStories:[],opEd:null,ticker:["Press generation failed","Click to retry"]}],turn};
      setNewspaper(fallback);
    }
    setNewspaperLoading(false);
  }

  // ── CONTINUE ──

  function handleContinue() {
    if(!pendingNext) return;
    if(pendingNext.gameOver){
      setSituation(pendingNext.reason);
      setActions([]);
      setPhase("result");
      return;
    }
    // Advance turn
    setSituation(pendingNext.situation);
    setActions(pendingNext.actions);
    setTurn(t=>t+1);
    setGameState("choosing");
    setReactionText(""); setStatDeltas(null);
    setNewspaper(null); setNewspaperLoading(false);
    setPendingNext(null); setActiveWorldEvent(null);

    // Roll for a world event — 50% chance from turn 2, guaranteed by turn 4 if none yet
    const shouldForce = turn >= 4 && worldEventLog.length === 0 && firedEventIds.length === 0;
    if(shouldForce || (turn >= 1 && Math.random() < 0.50)) {
      const evtStats = pendingNext.statsForEvent || stats;
      const evtStrife = pendingNext.strifeForEvent || strife;
      setTimeout(()=>{ rollWorldEvent(evtStats, evtStrife); }, 400);
    }
  }

  // ── PLAYING SCREEN ──

  if(phase==="select_country") return (
    <CountrySelectScreen onSelect={c=>{setCountry(c);setPhase("select_scenario");}} apiKey={apiKey} setApiKey={setApiKey} showApiInput={showApiInput} setShowApiInput={setShowApiInput} selectedModel={selectedModel} setSelectedModel={setSelectedModel}/>
  );
  if(phase==="select_scenario") return (
    <ScenarioSelectScreen country={country} onSelect={s=>{setScenario(s);startGame(country,s);}} onBack={()=>setPhase("select_country")} loading={loading}/>
  );

  if(phase==="playing") return (
    <div style={{fontFamily:"var(--font-sans)",maxWidth:980,margin:"0 auto",padding:"1.25rem 1rem"}}>
      <style>{G}</style>

      {/* TOPBAR */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem",paddingBottom:"0.75rem",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:24}}>{country.flag}</span>
          <div>
            <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)"}}>{country.name}</div>
            <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{scenario.icon} {scenario.title} &nbsp;·&nbsp; {getIntel(country.id)?.leader}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {worldEventLog.length>0&&(
            <div style={{fontSize:10,fontFamily:"var(--font-mono)",color:"#f59e0b",background:"#fffbeb",padding:"4px 10px",borderRadius:99,border:"0.5px solid #fcd34d"}}>
              🌐 {worldEventLog.length} world crisis{worldEventLog.length!==1?"es":""}
            </div>
          )}
          <div style={{fontSize:10,fontFamily:"var(--font-mono)",color:"var(--color-text-tertiary)",background:"var(--color-background-secondary)",padding:"4px 10px",borderRadius:99,border:"0.5px solid var(--color-border-tertiary)"}}>TURN {turn}</div>
          <div style={{fontSize:10,fontFamily:"var(--font-mono)",color:strife>60?"#ef4444":strife>35?"#f59e0b":"#22c55e",background:"var(--color-background-secondary)",padding:"4px 10px",borderRadius:99,border:"0.5px solid var(--color-border-tertiary)"}}>STRIFE {strife}</div>
          <button onClick={()=>setPhase("select_scenario")} style={{fontSize:10,padding:"4px 10px",borderRadius:99,border:"0.5px solid var(--color-border-tertiary)",background:"none",cursor:"pointer",color:"var(--color-text-tertiary)"}}>↩ New Scenario</button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 240px",gap:14,alignItems:"start"}}>

        {/* LEFT */}
        <div>

          {/* WORLD EVENT CARD — interrupts normal flow */}
          {activeWorldEvent && statsBeforeEvent && (
            <WorldEventCard
              event={activeWorldEvent}
              country={country}
              impactedStats={stats}
              prevStatsBeforeEvent={statsBeforeEvent}
              onRespond={handleRespondToEvent}
              onDismiss={handleDismissEvent}
            />
          )}

          {/* SITUATION */}
          {!activeWorldEvent && (
            <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem",marginBottom:12}}>
              <SectionLabel>Situation Report — Turn {turn}{respondingToEvent?" · Responding to World Crisis":""}</SectionLabel>
              <p style={{fontSize:14,lineHeight:1.8,margin:0,color:"var(--color-text-primary)"}}>{situation}</p>
            </div>
          )}

          {/* WORLD REACTION */}
          {reactionText&&!activeWorldEvent&&(
            <div style={{background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",borderLeft:"3px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem",marginBottom:12,animation:"fadeUp 0.3s ease"}}>
              <SectionLabel>🌐 World Reaction</SectionLabel>
              <p style={{fontSize:14,lineHeight:1.8,margin:0,whiteSpace:"pre-wrap",color:"var(--color-text-primary)"}}>
                <TypewriterText text={reactionText} speed={11}/>
              </p>
            </div>
          )}

          {/* STAT DELTAS */}
          {reactionText&&statDeltas&&!activeWorldEvent&&(
            <div style={{marginBottom:12}}>
              <StatDeltaPanel stats={stats} prevStats={statDeltas}/>
            </div>
          )}

          {/* NEWSPAPER */}
          {reactionText&&!activeWorldEvent&&(
            <div style={{marginBottom:12}}>
              {!newspaper&&!newspaperLoading&&(
                <button onClick={handleGenerateNewspaper} className="press-btn"
                  style={{width:"100%",padding:"11px 14px",borderRadius:"var(--border-radius-lg)",border:"0.5px solid #d0c8b0",background:"#faf8f2",cursor:"pointer",fontSize:12,color:"#555",fontFamily:"Georgia,serif",letterSpacing:"0.04em",transition:"border-color 0.15s,background 0.15s",textAlign:"center"}}>
                  📰 Generate press coverage for this turn
                </button>
              )}
              {newspaperLoading&&!newspaper&&<NewspaperSkeleton/>}
              {newspaper&&<NewspaperPanel edition={newspaper} country={country}/>}
            </div>
          )}

          {/* CONTINUE */}
          {reactionText&&pendingNext&&!loading&&!activeWorldEvent&&(
            <div style={{marginBottom:12,animation:"fadeUp 0.4s ease 0.2s both"}}>
              <button onClick={handleContinue} className="cont-btn"
                style={{width:"100%",padding:"13px",borderRadius:"var(--border-radius-lg)",border:"0.5px solid var(--color-border-primary)",background:"var(--color-background-primary)",cursor:"pointer",fontSize:13,fontWeight:500,color:"var(--color-text-primary)",fontFamily:"var(--font-sans)",transition:"background 0.15s"}}>
                {pendingNext.gameOver?"See Final Outcome →":"Continue to Turn "+(turn+1)+" →"}
              </button>
            </div>
          )}

          {/* ACTIONS */}
          {(gameState==="choosing"||gameState==="choosing_response")&&actions.length>0&&!loading&&!activeWorldEvent&&(
            <div style={{animation:"fadeUp 0.3s ease"}}>
              <Divider label={respondingToEvent?"CRISIS RESPONSE OPTIONS":"YOUR MOVE"}/>
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
          {log.length>0&&(gameState==="choosing"||gameState==="choosing_response")&&!loading&&!activeWorldEvent&&(
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

        {/* SIDEBAR */}
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

          {/* World event log in sidebar */}
          {worldEventLog.length>0&&(
            <div style={{background:"var(--color-background-primary)",border:"0.5px solid #fcd34d",borderRadius:"var(--border-radius-lg)",padding:"10px 12px",marginBottom:10}}>
              <SectionLabel>🌐 World Crises</SectionLabel>
              {worldEventLog.map((entry,i)=>(
                <div key={i} style={{marginBottom:7,paddingLeft:8,borderLeft:`2px solid ${SEV_COLOR[entry.event.severity]||"#888"}`}}>
                  <div style={{fontSize:9,color:SEV_COLOR[entry.event.severity],fontFamily:"var(--font-mono)",marginBottom:2}}>T{entry.turn} · {entry.event.severity.toUpperCase()}</div>
                  <div style={{fontSize:11,color:"var(--color-text-primary)",fontWeight:500}}>{entry.event.icon} {entry.event.title}</div>
                </div>
              ))}
            </div>
          )}

          {/* Info tabs */}
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
              {sideTab==="threats"&&Object.entries(NON_STATE_ACTORS).map(([k,a])=>{
                const rel=a.regions.some(r=>r===country.id||country.region.toLowerCase().includes(r))||country.threats.includes(k);
                return rel?(
                  <div key={k} style={{marginBottom:8,display:"flex",gap:6,alignItems:"flex-start"}}>
                    <span style={{fontSize:14}}>{a.icon}</span>
                    <div>
                      <div style={{fontSize:11,fontWeight:500}}>{a.name}</div>
                      <div style={{fontSize:10,color:"var(--color-text-secondary)"}}>{a.ideology}</div>
                    </div>
                  </div>
                ):null;
              })}
              {sideTab==="diplo"&&Object.entries(relationships).map(([id,score])=>{
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
              })}
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
    const eco=stats.Economy, mil=stats.Military, dip=stats.Diplomacy, sta=stats.Stability, pre=stats.GlobalPrestige;
    const avg=Math.round(STAT_KEYS.reduce((s,k)=>s+stats[k],0)/STAT_KEYS.length);

    // Rich outcome calculation based on how different stats ended up
    let outcome;
    if(eco>78 && sta>78 && dip>73 && pre>80)
      outcome={grade:"S",label:"Grand Statesman",sublabel:"A masterclass in crisis diplomacy",color:"#8b5cf6",icon:"👑",bg:"#f5f3ff"};
    else if(eco>72 && sta>72 && dip>68)
      outcome={grade:"A",label:"Diplomatic Triumph",sublabel:"The crisis resolved in your favour",color:"#22c55e",icon:"🏆",bg:"#f0fdf4"};
    else if(pre>78 && dip>70)
      outcome={grade:"A-",label:"Prestige Victory",sublabel:"Your global standing has never been higher",color:"#3b82f6",icon:"🌟",bg:"#eff6ff"};
    else if(mil>80 && sta>60)
      outcome={grade:"B+",label:"Military Deterrence",sublabel:"Strength kept the wolves at bay",color:"#f59e0b",icon:"⚔️",bg:"#fffbeb"};
    else if(avg>55)
      outcome={grade:"B",label:"Managed Crisis",sublabel:"Bruised but still standing",color:"#f59e0b",icon:"⚖️",bg:"#fffbeb"};
    else if(avg>40)
      outcome={grade:"C",label:"Uneasy Stalemate",sublabel:"Neither victory nor defeat — just survival",color:"#94a3b8",icon:"😓",bg:"#f8fafc"};
    else if(eco<20)
      outcome={grade:"F",label:"Economic Collapse",sublabel:"The treasury is empty, the streets are burning",color:"#ef4444",icon:"📉",bg:"#fef2f2"};
    else if(sta<15)
      outcome={grade:"F",label:"State Collapse",sublabel:"The government has fallen",color:"#ef4444",icon:"💥",bg:"#fef2f2"};
    else if(strife>85)
      outcome={grade:"F",label:"Civil War",sublabel:"Internal strife has torn the nation apart",color:"#ef4444",icon:"🔥",bg:"#fef2f2"};
    else
      outcome={grade:"D",label:"Crisis Defeat",sublabel:"The nation is weakened and isolated",color:"#ef4444",icon:"☠️",bg:"#fef2f2"};

    const scorecard = [
      { stat:"Economy",        value:eco, comment: eco>75?"Resilient":eco>50?"Strained":eco>25?"Damaged":"Collapsed" },
      { stat:"Military",       value:mil, comment: mil>75?"Dominant":mil>50?"Capable":mil>25?"Weakened":"Broken" },
      { stat:"Diplomacy",      value:dip, comment: dip>75?"Respected":dip>50?"Engaged":dip>25?"Isolated":"Pariah" },
      { stat:"Stability",      value:sta, comment: sta>75?"Stable":sta>50?"Fragile":sta>25?"Volatile":"Collapsed" },
      { stat:"GlobalPrestige", value:pre, comment: pre>75?"Renowned":pre>50?"Recognised":pre>25?"Diminished":"Disgraced" },
    ];

    return (
      <div style={{fontFamily:"var(--font-sans)",maxWidth:740,margin:"0 auto",padding:"2rem 1rem"}}>
        <style>{G}</style>

        {/* Outcome hero */}
        <div style={{background:outcome.bg,border:`1.5px solid ${outcome.color}40`,borderRadius:"var(--border-radius-lg)",padding:"1.5rem",textAlign:"center",marginBottom:"1.25rem"}}>
          <div style={{fontSize:60,marginBottom:10,lineHeight:1}}>{outcome.icon}</div>
          <div style={{display:"inline-block",fontSize:11,padding:"3px 10px",borderRadius:99,background:outcome.color,color:"#fff",fontFamily:"var(--font-mono)",letterSpacing:"0.1em",marginBottom:8}}>
            GRADE {outcome.grade} &nbsp;·&nbsp; {turn} TURNS
          </div>
          <h2 style={{fontSize:26,fontWeight:500,color:outcome.color,margin:"6px 0 4px",letterSpacing:"-0.02em"}}>{outcome.label}</h2>
          <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>{outcome.sublabel}</p>
        </div>

        {/* Final situation narrative */}
        <div style={{background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem",marginBottom:"1.25rem"}}>
          <SectionLabel>Final Report</SectionLabel>
          <p style={{fontSize:14,lineHeight:1.8,margin:0}}>{situation}</p>
        </div>

        {/* Scorecard */}
        <div style={{marginBottom:"1.25rem"}}>
          <SectionLabel>Final Scorecard</SectionLabel>
          <div style={{display:"grid",gap:8}}>
            {scorecard.map(({stat,value,comment})=>{
              const color=value>65?"#22c55e":value>35?"#f59e0b":"#ef4444";
              return (
                <div key={stat} style={{display:"grid",gridTemplateColumns:"110px 1fr 60px 80px",alignItems:"center",gap:10,background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",padding:"8px 14px"}}>
                  <span style={{fontSize:12,color:"var(--color-text-secondary)",fontFamily:"var(--font-mono)"}}>{stat.toUpperCase().slice(0,8)}</span>
                  <div style={{height:6,background:"var(--color-background-tertiary)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${value}%`,background:color,borderRadius:3}}/>
                  </div>
                  <span style={{fontSize:13,fontWeight:500,color,textAlign:"right"}}>{value}</span>
                  <span style={{fontSize:10,color:color,textAlign:"right",fontFamily:"var(--font-mono)"}}>{comment}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* World crisis summary */}
        {worldEventLog.length>0&&(
          <div style={{marginBottom:"1.25rem"}}>
            <Divider label={"WORLD CRISES NAVIGATED ("+worldEventLog.length+")"}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:8}}>
              {worldEventLog.map((entry,i)=>(
                <div key={i} style={{padding:"10px 12px",borderRadius:"var(--border-radius-md)",border:`0.5px solid ${SEV_COLOR[entry.event.severity]}40`,borderLeft:`3px solid ${SEV_COLOR[entry.event.severity]}`,background:SEV_BG[entry.event.severity]}}>
                  <div style={{fontSize:9,color:SEV_COLOR[entry.event.severity],fontFamily:"var(--font-mono)",marginBottom:3}}>T{entry.turn} · {entry.event.severity.toUpperCase()}</div>
                  <div style={{fontSize:11,fontWeight:500,color:"#1a1a1a"}}>{entry.event.icon} {entry.event.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Press archive */}
        {allEditions.length>0&&(
          <div style={{marginBottom:"1.5rem"}}>
            <Divider label="YOUR TENURE IN THE WORLD PRESS"/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:8}}>
              {allEditions.flatMap((ed,i)=>(ed.papers||[]).slice(0,1).map((p,j)=>{
                const o=NEWS_OUTLETS.find(x=>x.id===p.outletId)||NEWS_OUTLETS[0];
                return (
                  <div key={`${i}-${j}`} style={{padding:"10px 12px",borderRadius:"var(--border-radius-md)",border:`0.5px solid ${o.accentColor}40`,borderLeft:`3px solid ${o.accentColor}`,background:"#faf8f2"}}>
                    <div style={{fontSize:9,color:o.accentColor,fontFamily:"Georgia,serif",fontWeight:700,marginBottom:3}}>T{ed.turn} · {o.name}</div>
                    <div style={{fontSize:11,fontFamily:"Georgia,serif",lineHeight:1.4,color:"#1a1a1a"}}>{p.headline}</div>
                  </div>
                );
              }))}
            </div>
          </div>
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
