// MMT Ship — Budget Strategy Prototype
// All vanilla JS, no frameworks. Accessible and responsive.

// ========= Data =========
const categories = [
  { id: 'employment', name: 'Employment' },
  { id: 'climate', name: 'Climate' },
  { id: 'productivity', name: 'Productivity' },
  { id: 'taxes', name: 'Taxes' },
  { id: 'public_services', name: 'Public Services' }
];

const goals = [
  { id:'full_employment', name:'Full Employment', description:'Jobs for all who want them at decent wages.', objectives:['Raise employment','Provide automatic stabilizers','Reduce involuntary unemployment'] },
  { id:'reduce_inequality', name:'Reduce Inequality', description:'Shrink income and wealth gaps.', objectives:['Progressive taxation','Boost low-end incomes','Access to services'] },
  { id:'climate', name:'Climate Action', description:'Accelerate the clean energy transition.', objectives:['Lower emissions','Invest in resilience','Green innovation'] },
  { id:'productivity', name:'Productivity & Innovation', description:'Ease bottlenecks and raise capacity.', objectives:['Targeted supply','R&D and training','Infrastructure'] },
  { id:'invest_in_future', name:'Invest in the Future', description:'Long-term public investments.', objectives:['Education','Infrastructure','Research'] },
  { id:'equality', name:'Equality & Care', description:'Support participation and care.', objectives:['Childcare','Health access','Inclusive growth'] }
];

const policies = [
  {
    id: 'job_guarantee',
    name: 'Federal Job Guarantee',
    category: 'employment',
    description: 'Offer a public service job at a living wage to anyone who wants one.',
    argumentsFor: 'Stabilizes incomes; automatic stabilizer.',
    argumentsAgainst: 'Implementation complexity; administrative costs.',
    type: 'demand',
    phaseInYears: 3,
    durationYears: 25,
    decayAfterYears: 0,
    demandImpulse: 0.7,
    supplyImpulse: 0.2,
    bottleneckRelief: {},
    sector: ['public_services'],
    capacityUse: 0.8,
    employmentImpact: 8,
    inflationImpact: 0.15,
    inflationPath: null,
    stabilizerStrength: 0.5,
    bufferStock: true,
    goalsImpact: { full_employment: 3, reduce_inequality: 1 },
    tags: ['automatic-stabilizer','buffer-stock']
  },
  {
    id: 'green_investment',
    name: 'Green Public Investment',
    category: 'climate',
    description: 'Scale clean energy and efficiency upgrades.',
    argumentsFor: 'Boosts productivity and reduces energy costs.',
    argumentsAgainst: 'Supply chain risks; project delivery capacity.',
    type: 'mixed',
    phaseInYears: 4,
    durationYears: 25,
    decayAfterYears: 0,
    demandImpulse: 0.6,
    supplyImpulse: 0.8,
    bottleneckRelief: {},
    sector: ['infrastructure'],
    capacityUse: 1.0,
    employmentImpact: 2,
    inflationImpact: 0.10,
    inflationPath: null,
    stabilizerStrength: 0.2,
    bufferStock: false,
    goalsImpact: { climate: 2, invest_in_future: 2 },
    tags: ['infrastructure','productivity']
  },
  {
    id: 'top_tax',
    name: 'Raise Top-Bracket Taxes',
    category: 'taxes',
    description: 'Increase top marginal rates and close loopholes.',
    argumentsFor: 'Progressive; cools excess demand at the top end.',
    argumentsAgainst: 'Lobbying resistance; avoidance behavior.',
    type: 'demand',
    phaseInYears: 1,
    durationYears: 25,
    decayAfterYears: 0,
    demandImpulse: -0.4,
    supplyImpulse: 0.1,
    bottleneckRelief: {},
    sector: ['tax'],
    capacityUse: -0.6,
    employmentImpact: -1,
    inflationImpact: -0.20,
    inflationPath: null,
    stabilizerStrength: 0.1,
    bufferStock: false,
    goalsImpact: { reduce_inequality: 2 },
    tags: ['progressive-tax']
  },
  {
    id: 'targeted_supply_boost',
    name: 'Targeted Supply Boost (Childcare, Chips)',
    category: 'productivity',
    description: 'Alleviate bottlenecks in care and semiconductors.',
    argumentsFor: 'Raises participation; eases key bottlenecks.',
    argumentsAgainst: 'Execution risk; coordination with states.',
    type: 'supply',
    phaseInYears: 3,
    durationYears: 25,
    decayAfterYears: 0,
    demandImpulse: 0.2,
    supplyImpulse: 0.9,
    bottleneckRelief: { care: 0.5, semiconductors: 0.4 },
    sector: ['care','semiconductors'],
    capacityUse: 0.3,
    employmentImpact: 1,
    inflationImpact: -0.05,
    inflationPath: Array(25).fill(0).map((_,i)=> i<5 ? 0 : -0.10),
    stabilizerStrength: 0.1,
    bufferStock: false,
    goalsImpact: { productivity: 2, equality: 1 },
    tags: ['bottlenecks','participation']
  },
  {
    id: 'universal_childcare',
    name: 'Universal Childcare',
    category: 'public_services',
    description: 'Guarantee affordable childcare to expand participation.',
    argumentsFor: 'Raises labor force participation; supports families.',
    argumentsAgainst: 'Requires provider capacity buildout; coordination.',
    type: 'supply',
    phaseInYears: 3,
    durationYears: 25,
    decayAfterYears: 0,
    demandImpulse: 0.3,
    supplyImpulse: 0.4,
    bottleneckRelief: { care: 0.6 },
    sector: ['care'],
    capacityUse: 0.6,
    employmentImpact: 2,
    inflationImpact: -0.03,
    inflationPath: Array(25).fill(0).map((_,i)=> i<4 ? 0 : -0.08),
    stabilizerStrength: 0.2,
    bufferStock: false,
    goalsImpact: { equality: 2, full_employment: 1 },
    tags: ['care','participation']
  },
  {
    id: 'training_apprenticeships',
    name: 'National Training & Apprenticeships',
    category: 'productivity',
    description: 'Scale apprenticeships, on-the-job training, and reskilling.',
    argumentsFor: 'Boosts productivity and job matching over time.',
    argumentsAgainst: 'Benefits arrive with a lag; coordination with employers.',
    type: 'supply',
    phaseInYears: 3,
    durationYears: 25,
    decayAfterYears: 0,
    demandImpulse: 0.2,
    supplyImpulse: 0.7,
    bottleneckRelief: { skills: 0.4 },
    sector: ['labor'],
    capacityUse: 0.4,
    employmentImpact: 1,
    inflationImpact: -0.02,
    inflationPath: Array(25).fill(0).map((_,i)=> i<6 ? 0 : -0.07),
    stabilizerStrength: 0.2,
    bufferStock: false,
    goalsImpact: { productivity: 2, invest_in_future: 1 },
    tags: ['skills','training']
  },
  {
    id: 'transit_infrastructure',
    name: 'Transit Infrastructure',
    category: 'climate',
    description: 'Build rail, buses, and safe streets for access and emissions.',
    argumentsFor: 'Improves mobility and productivity; lowers emissions.',
    argumentsAgainst: 'Large upfront resource use; delivery risk.',
    type: 'mixed',
    phaseInYears: 4,
    durationYears: 25,
    decayAfterYears: 0,
    demandImpulse: 0.6,
    supplyImpulse: 0.6,
    bottleneckRelief: { transport: 0.4 },
    sector: ['infrastructure'],
    capacityUse: 0.8,
    employmentImpact: 1,
    inflationImpact: 0.08,
    inflationPath: null,
    stabilizerStrength: 0.15,
    bufferStock: false,
    goalsImpact: { climate: 2, invest_in_future: 1 },
    tags: ['infrastructure','mobility']
  },
  {
    id: 'immigration_reform',
    name: 'Immigration Reform',
    category: 'productivity',
    description: 'Increase lawful immigration and work authorization.',
    argumentsFor: 'Boosts labor supply and innovation; eases aging pressures.',
    argumentsAgainst: 'Political contention; integration capacity.',
    type: 'supply',
    phaseInYears: 2,
    durationYears: 25,
    decayAfterYears: 0,
    demandImpulse: 0.1,
    supplyImpulse: 0.8,
    bottleneckRelief: { skills: 0.3, care: 0.2 },
    sector: ['labor'],
    capacityUse: 0.2,
    employmentImpact: 2,
    inflationImpact: -0.05,
    inflationPath: null,
    stabilizerStrength: 0.1,
    bufferStock: false,
    goalsImpact: { productivity: 1, equality: 1 },
    tags: ['labor-supply']
  },
  {
    id: 'antitrust_enforcement',
    name: 'Antitrust & Competition Enforcement',
    category: 'productivity',
    description: 'Strengthen competition policy and curb monopoly pricing power.',
    argumentsFor: 'Improves pricing dynamics and innovation.',
    argumentsAgainst: 'Legal process is slow; uncertain outcomes.',
    type: 'supply',
    phaseInYears: 2,
    durationYears: 25,
    decayAfterYears: 0,
    demandImpulse: 0.0,
    supplyImpulse: 0.5,
    bottleneckRelief: { markets: 0.3 },
    sector: ['markets'],
    capacityUse: 0.0,
    employmentImpact: 0,
    inflationImpact: -0.10,
    inflationPath: null,
    stabilizerStrength: 0.1,
    bufferStock: false,
    goalsImpact: { productivity: 2 },
    tags: ['competition','prices']
  },
  {
    id: 'public_housing_buildout',
    name: 'Public Housing Buildout',
    category: 'public_services',
    description: 'Build social housing to improve affordability and stability.',
    argumentsFor: 'Reduces rent pressure; stabilizes communities.',
    argumentsAgainst: 'High material demand; build capacity needed.',
    type: 'mixed',
    phaseInYears: 4,
    durationYears: 25,
    decayAfterYears: 0,
    demandImpulse: 0.7,
    supplyImpulse: 0.5,
    bottleneckRelief: { construction: 0.3 },
    sector: ['housing'],
    capacityUse: 1.2,
    employmentImpact: 2,
    inflationImpact: 0.12,
    inflationPath: null,
    stabilizerStrength: 0.2,
    bufferStock: false,
    goalsImpact: { equality: 2, invest_in_future: 1 },
    tags: ['housing']
  },
  {
    id: 'payroll_tax_holiday',
    name: 'Temporary Payroll Tax Holiday',
    category: 'taxes',
    description: 'Cut payroll taxes temporarily as a countercyclical boost.',
    argumentsFor: 'Quick demand support; raises take-home pay.',
    argumentsAgainst: 'Less targeted than direct hiring; sunset needed.',
    type: 'demand',
    phaseInYears: 1,
    durationYears: 5,
    decayAfterYears: 2,
    demandImpulse: 0.6,
    supplyImpulse: 0.0,
    bottleneckRelief: {},
    sector: ['tax'],
    capacityUse: 0.5,
    employmentImpact: 1,
    inflationImpact: 0.10,
    inflationPath: null,
    stabilizerStrength: 0.2,
    bufferStock: false,
    goalsImpact: { full_employment: 1 },
    tags: ['countercyclical']
  },
  {
    id: 'rd_grants',
    name: 'R&D Grants',
    category: 'productivity',
    description: 'Public R&D and innovation grants to accelerate technology.',
    argumentsFor: 'Raises long-run productivity; positive spillovers.',
    argumentsAgainst: 'Payoff uncertain; requires governance.',
    type: 'supply',
    phaseInYears: 3,
    durationYears: 25,
    decayAfterYears: 0,
    demandImpulse: 0.2,
    supplyImpulse: 0.9,
    bottleneckRelief: { innovation: 0.4 },
    sector: ['research'],
    capacityUse: 0.3,
    employmentImpact: 0,
    inflationImpact: -0.02,
    inflationPath: Array(25).fill(0).map((_,i)=> i<8 ? 0 : -0.08),
    stabilizerStrength: 0.1,
    bufferStock: false,
    goalsImpact: { invest_in_future: 2, productivity: 2 },
    tags: ['innovation','research']
  }
];

// ========= State =========
const BASELINE_INFLATION = Array(25).fill(2.0);
const BASE_EMPLOYMENT = 88;
const BASE_CAPACITY = 85;

const state = {
  selectedGoals: [],
  chosenPolicies: [],
  inflationPath: BASELINE_INFLATION.slice(),
  employment: BASE_EMPLOYMENT,
  capacityUtilization: BASE_CAPACITY,
  goalScores: {},
  currentCategory: 'all',
  orthodoxMode: false,
  difficulty: 'kelton',
  scenarioSeed: 0,
  policyById: new Map()
};

policies.forEach(p => state.policyById.set(p.id, p));

// ========= DOM =========
const screens = {
  start: document.getElementById('screen-start'),
  goals: document.getElementById('screen-goals'),
  policies: document.getElementById('screen-policies'),
  plan: document.getElementById('screen-plan')
};

const els = {
  btnStart: document.getElementById('btnStart'),
  btnProceedPolicies: document.getElementById('btnProceedPolicies'),
  btnViewPlan: document.getElementById('btnViewPlan'),
  btnSubmitPlan: document.getElementById('btnSubmitPlan'),
  btnBackToPolicies: document.getElementById('btnBackToPolicies'),
  goalsList: document.getElementById('goalsList'),
  selectedGoalsPills: document.getElementById('selectedGoalsPills'),
  categoryChips: document.getElementById('categoryChips'),
  policiesGrid: document.getElementById('policiesGrid'),
  planList: document.getElementById('planList'),
  goalProgress: document.getElementById('goalProgress'),
  inflationChart: document.getElementById('inflationChart'),
  inflationText: document.getElementById('inflationText'),
  employmentBar: document.getElementById('employmentBar'),
  employmentText: document.getElementById('employmentText'),
  capacityBar: document.getElementById('capacityBar'),
  capacityText: document.getElementById('capacityText')
};

// Policy Modal elements
const policyModal = document.getElementById('policyModal');
const policyModalTitle = document.getElementById('policyModalTitle');
const policyModalDesc = document.getElementById('policyModalDesc');
const policyArgumentsFor = document.getElementById('policyArgumentsFor');
const policyArgumentsAgainst = document.getElementById('policyArgumentsAgainst');
const policyImpacts = document.getElementById('policyImpacts');
const policyGoalsList = document.getElementById('policyGoalsList');
const btnChoosePolicy = document.getElementById('btnChoosePolicy');
const btnRemovePolicy = document.getElementById('btnRemovePolicy');

// Results Modal elements
const resultsModal = document.getElementById('resultsModal');
const resultsSummary = document.getElementById('resultsSummary');
const resultsOutcomes = document.getElementById('resultsOutcomes');
const resultsPlan = document.getElementById('resultsPlan');

let currentPolicyId = null;

// ========= Init =========
function init() {
  attachGlobalListeners();
  renderGoals();
  renderCategoryChips();
  renderPolicies();
  recalcAll();
}

document.addEventListener('DOMContentLoaded', init);

// ========= Navigation =========
function showScreen(key) {
  Object.values(screens).forEach(sec => sec.classList.remove('is-active'));
  screens[key].classList.add('is-active');
}

// ========= Rendering =========
function renderGoals() {
  els.goalsList.innerHTML = goals.map(g => {
    const selected = state.selectedGoals.includes(g.id) ? 'selected' : '';
    return `
      <li class="card ${selected}" role="listitem">
        <button class="goal-card" data-goal-id="${g.id}" aria-pressed="${selected ? 'true' : 'false'}">
          <div class="title"><span class="ico">${goalIcon(g.id)}</span>${g.name}</div>
          <div class="muted">${g.description}</div>
        </button>
      </li>
    `;
  }).join('');
}

function goalIcon(id) {
  switch(id) {
    case 'full_employment': return '👥';
    case 'reduce_inequality': return '⚖️';
    case 'climate': return '🌿';
    case 'productivity': return '⚙️';
    case 'invest_in_future': return '🚀';
    case 'equality': return '🧑‍🍼';
    default: return '🏷️';
  }
}

function renderSelectedGoalPills() {
  els.selectedGoalsPills.innerHTML = state.selectedGoals.map(id => {
    const g = goals.find(x => x.id === id);
    return `<span class="pill" data-goal-id="${id}"><span class="ico">${goalIcon(id)}</span>${g ? g.name : id}</span>`;
  }).join('');
}

function renderCategoryChips() {
  const chips = [{ id: 'all', name: 'All' }, ...categories];
  els.categoryChips.innerHTML = chips.map(c => `
    <button class="chip ${state.currentCategory===c.id ? 'is-active' : ''}" role="tab" aria-selected="${state.currentCategory===c.id}" data-category-id="${c.id}">${c.name}</button>
  `).join('');
}

function renderPolicies() {
  const list = state.currentCategory==='all' ? policies : policies.filter(p => p.category === state.currentCategory);
  els.policiesGrid.innerHTML = list.map(p => renderPolicyCard(p)).join('');
}

function renderPolicyCard(p) {
  const selected = state.chosenPolicies.some(cp => cp.id === p.id);
  const impacts = compactPolicyImpacts(p);
  return `
    <div class="card ${selected ? 'selected' : ''}" role="listitem">
      <div class="card-head">
        <div class="title">${p.name}</div>
        <span class="badge"><span class="ico">${categoryIcon(p.category)}</span>${categoryName(p.category)}</span>
      </div>
      <div class="muted">${p.description}</div>
      <div class="impact-chips">${impacts.map(i=>`<span class=\"impact-chip ${i.className}\" title=\"${i.title}\"><span class=\"ico\">${i.icon}</span>${i.text}</span>`).join('')}</div>
      <div class="toolbar">
        <button class="btn" data-open-policy="${p.id}">${selected ? 'View' : 'Details'}</button>
        ${selected ? '<span aria-hidden="true">✓ Selected</span>' : ''}
      </div>
    </div>
  `;
}

function categoryName(id){ return (categories.find(c=>c.id===id)||{name:id}).name; }
function categoryIcon(id){
  switch(id){
    case 'employment': return '👥';
    case 'climate': return '🌿';
    case 'productivity': return '⚙️';
    case 'taxes': return '💸';
    case 'public_services': return '🏛️';
    default: return '🏷️';
  }
}

function compactPolicyImpacts(p) {
  const chips = [];
  if (p.employmentImpact) chips.push({ text: `Employment ${p.employmentImpact>0?'+':''}${p.employmentImpact}`, title: `Employment impact: ${p.employmentImpact>0?'+':''}${p.employmentImpact} pp`, icon: '👥', className: `emp ${p.employmentImpact<0?'neg':''}` });
  if (p.capacityUse) chips.push({ text: `Capacity ${p.capacityUse>0?'+':''}${p.capacityUse}`, title: `Capacity use: ${p.capacityUse>0?'+':''}${p.capacityUse}`, icon: '⚙️', className: `cap ${p.capacityUse<0?'neg':''}` });
  if (p.inflationImpact) chips.push({ text: `Inflation ${p.inflationImpact>0?'+':''}${p.inflationImpact}`, title: `Inflation impact: ${p.inflationImpact>0?'+':''}${p.inflationImpact} per year (before buffers)`, icon: '🔥', className: `inf ${p.inflationImpact<0?'neg':''}` });
  if (p.phaseInYears) chips.push({ text: `${p.phaseInYears}y ramp`, title: `Phase-in period: ${p.phaseInYears} years`, icon: '⏳', className: '' });
  if (p.type) chips.push({ text: p.type, title: `Policy type: ${p.type}`, icon: '🏷️', className: '' });
  return chips;
}

function renderPlanList() {
  els.planList.innerHTML = state.chosenPolicies.map(p => `
    <div class="plan-item">
      <div>
        <div class="title">${p.name}</div>
        <div class="muted">${p.description}</div>
      </div>
      <div class="toolbar">
        <button class="btn" data-open-policy="${p.id}">Edit</button>
        <button class="btn danger" data-remove-policy="${p.id}">Remove</button>
      </div>
    </div>
  `).join('');
}

function renderGoalProgress() {
  els.goalProgress.innerHTML = state.selectedGoals.map(id => {
    const g = goals.find(x => x.id===id);
    const score = state.goalScores[id] || 0;
    const pct = Math.max(0, Math.min(100, (score/3)*100));
    return `
      <li class="goal-item">
        <span>${g ? g.name : id}</span>
        <span class="goal-bar" aria-hidden="true"><span style="width:${pct}%"></span></span>
        <span class="muted" aria-label="${score} of 3 points">${score}/3</span>
      </li>
    `;
  }).join('');
}

// ========= Gauges =========
function drawInflationGauge() {
  const w = 120, h = 40;
  const maxY = Math.max(4, ...state.inflationPath);
  const minY = Math.min(1, ...state.inflationPath);
  const points = state.inflationPath.map((v, i) => {
    const x = (i/(state.inflationPath.length-1)) * w;
    const y = h - ((v - minY) / (maxY - minY || 1)) * h;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
  const lastIdx = state.inflationPath.length - 1;
  const lastX = (lastIdx/(state.inflationPath.length-1)) * w;
  const lastY = h - ((state.inflationPath[lastIdx] - minY) / (maxY - minY || 1)) * h;
  els.inflationChart.innerHTML = `
    <polyline points="${points}" fill="none" stroke="#1261ff" stroke-width="2" />
    <polygon class="boat-marker" points="${(lastX-2).toFixed(2)},${(lastY+2).toFixed(2)} ${lastX.toFixed(2)},${(lastY-3).toFixed(2)} ${(lastX+2).toFixed(2)},${(lastY+2).toFixed(2)}" />
  `;
  const last = state.inflationPath[state.inflationPath.length-1].toFixed(2);
  const max = Math.max(...state.inflationPath).toFixed(2);
  els.inflationText.textContent = `Inflation ends at ${last}%, max ${max}% over 25 years.`;
}

function drawEmploymentGauge() {
  const v = Math.round(state.employment);
  els.employmentBar.style.width = `${v}%`;
  els.employmentBar.parentElement.setAttribute('aria-valuenow', String(v));
  els.employmentText.textContent = `${v}%`;
}

function drawCapacityGauge() {
  const v = Math.round(state.capacityUtilization);
  els.capacityBar.style.width = `${v}%`;
  els.capacityBar.parentElement.setAttribute('aria-valuenow', String(v));
  const spare = Math.max(0, 100 - v);
  els.capacityText.textContent = `${v}% (spare: ${spare}%)`;
}

// ========= Simulation =========
function recalcAll() {
  recalcEmployment();
  recalcCapacity();
  recalcInflation();
  recalcGoalScores();
}

function recalcEmployment() {
  let delta = 0;
  state.chosenPolicies.forEach(p => { delta += (p.employmentImpact || 0); });
  const cap = 10;
  if (delta > cap) delta = cap + (delta - cap) * 0.5; // diminishing returns past +10pp
  state.employment = clamp(BASE_EMPLOYMENT + delta, 50, 100);
  drawEmploymentGauge();
}

function recalcCapacity() {
  let value = BASE_CAPACITY;
  let supplyRelief = 0;
  state.chosenPolicies.forEach(p => {
    value += (p.capacityUse || 0) * 2;
    value -= (p.supplyImpulse || 0) * 1.5;
    if (p.bottleneckRelief) {
      for (const k in p.bottleneckRelief) supplyRelief += p.bottleneckRelief[k] || 0;
    }
  });
  value -= supplyRelief; // small nudge from bottleneck relief
  state.capacityUtilization = clamp(value, 60, 100);
  drawCapacityGauge();
}

function recalcInflation() {
  const emp = state.employment/100;
  const cap = state.capacityUtilization/100;
  const noise = makeNoise(state.scenarioSeed || 0);
  const path = BASELINE_INFLATION.slice();
  for (let i = 0; i < path.length; i++) {
    const tightDemand = Math.max(0, emp + cap - 1.8);
    let add = 0;
    let sectorRelief = 0;
    state.chosenPolicies.forEach(p => {
      const phase = computePhase(p, i);
      if (p.bottleneckRelief) {
        let total = 0; for (const k in p.bottleneckRelief) total += p.bottleneckRelief[k] || 0;
        sectorRelief += Math.min(0.4, total * phase);
      }
      const baseAdd = (Array.isArray(p.inflationPath) && p.inflationPath[i] != null)
        ? p.inflationPath[i]
        : (p.inflationImpact || 0) * phase;
      const bufferFactor = (p.bufferStock && state.employment > 95)
        ? Math.min(1, 1 - 0.4 * (p.stabilizerStrength || 0.5))
        : 1.0;
      const pressure = Math.max(0, tightDemand - sectorRelief);
      add += baseAdd * pressure * bufferFactor;
    });
    const scenario = state.scenarioSeed ? (noise(i) * 0.1) : 0; // small ±0.1pp wobble
    path[i] = 2.0 + add + scenario;
  }
  state.inflationPath = path;
  drawInflationGauge();
}

function computePhase(p, yearIndex) {
  const rampYears = Math.max(1, p.phaseInYears || 1);
  const duration = Math.max(1, p.durationYears || 25);
  const decay = Math.max(0, p.decayAfterYears || 0);
  const t = yearIndex + 1; // 1..25
  const ramp = clamp(t / rampYears, 0, 1);
  if (t <= duration) return ramp; // fully active after ramp
  if (decay === 0) return 0;
  const over = t - duration;
  const left = clamp(1 - (over / decay), 0, 1);
  return ramp * left;
}

function recalcGoalScores() {
  const scores = {};
  state.selectedGoals.forEach(g => { scores[g] = 0; });
  state.chosenPolicies.forEach(p => {
    if (!p.goalsImpact) return;
    Object.entries(p.goalsImpact).forEach(([g, pts]) => {
      if (scores[g] != null) scores[g] += pts;
    });
  });
  state.goalScores = scores;
  renderGoalProgress();
}

// ========= Results =========
function submitPlan() {
  const maxInfl = Math.max(...state.inflationPath);
  const last10 = state.inflationPath.slice(-10).slice().sort((a,b)=>a-b);
  const medianLast10 = last10.length ? (last10[Math.floor((last10.length-1)/2)] + last10[Math.ceil((last10.length-1)/2)]) / 2 : 2.0;
  const empOk = state.employment >= 95;
  const capOk = state.capacityUtilization <= 98;
  const inflOk = maxInfl <= 4.0 && medianLast10 <= 3.0;
  const goalsOk = state.selectedGoals.every(g => (state.goalScores[g]||0) >= 3);
  const ok = empOk && capOk && inflOk && goalsOk;

  const unmet = [];
  if (!inflOk) unmet.push(`Inflation exceeded target (max ${maxInfl.toFixed(2)}%, median last-10 ${medianLast10.toFixed(2)}%).`);
  if (!empOk) unmet.push(`Employment too low (${Math.round(state.employment)}%).`);
  if (!capOk) unmet.push(`Capacity too tight (${Math.round(state.capacityUtilization)}%).`);
  if (!goalsOk) unmet.push('Some goals below 3 points.');

  resultsSummary.innerHTML = `<p>${ok ? 'You win! 🌈 Calm seas and steady prices.' : 'Not quite. 🌊 Here’s what to improve:'}</p>`;

  // Fill stat cards
  document.getElementById('statInflationValue').textContent = `${maxInfl.toFixed(2)}% / ${state.inflationPath[state.inflationPath.length-1].toFixed(2)}%`;
  document.getElementById('statEmploymentValue').textContent = `${Math.round(state.employment)}%`;
  document.getElementById('statCapacityValue').textContent = `${Math.round(state.capacityUtilization)}%`;

  // Draw a larger chart
  drawResultsChart();

  // Goals grid
  const goalsHtml = state.selectedGoals.map(id => {
    const g = goals.find(x => x.id===id);
    const score = state.goalScores[id] || 0;
    const pct = Math.max(0, Math.min(100, (score/3)*100));
    return `<div class="results-goal"><span>${goalIcon(id)} ${g ? g.name : id}</span><span class="bar"><span style="width:${pct}%"></span></span><span class="muted">${score}/3</span></div>`;
  }).join('');
  document.getElementById('resultsGoals').innerHTML = goalsHtml;

  // Unmet list
  document.getElementById('resultsUnmet').innerHTML = unmet.length ? `<ul>${unmet.map(x=>`<li>${x}</li>`).join('')}</ul>` : '';

  // Plan inline
  document.getElementById('resultsPlanInline').innerHTML = state.chosenPolicies.map(p => `
    <div class="plan-item">
      <div>
        <div class="title">${p.name}</div>
        <div class="muted">${p.description}</div>
      </div>
    </div>
  `).join('');

  openModal(resultsModal);
}

function drawResultsChart(){
  const w = 240, h = 60;
  const arr = state.inflationPath;
  const maxY = Math.max(4, ...arr);
  const minY = Math.min(1, ...arr);
  const pts = arr.map((v, i) => {
    const x = (i/(arr.length-1)) * w;
    const y = h - ((v - minY) / (maxY - minY || 1)) * h;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
  document.getElementById('resultsChart').innerHTML = `<polyline points="${pts}" fill="none" stroke="#1261ff" stroke-width="2" />`;
}

// Results tabs switching
document.addEventListener('click', (e) => {
  const tab = e.target.closest('#resultsModal .tab');
  if (!tab) return;
  const name = tab.getAttribute('data-tab');
  const allTabs = resultsModal.querySelectorAll('.tab');
  allTabs.forEach(t => t.classList.toggle('is-active', t === tab));
  resultsOutcomes.classList.toggle('is-active', name === 'outcomes');
  resultsPlan.classList.toggle('is-active', name === 'plan');
});

// ========= Events =========
function attachGlobalListeners() {
  // Navigation
  els.btnStart.addEventListener('click', () => { showScreen('goals'); });
  els.btnProceedPolicies.addEventListener('click', () => { showScreen('policies'); });
  els.btnViewPlan.addEventListener('click', () => { renderPlanList(); showScreen('plan'); });
  els.btnBackToPolicies.addEventListener('click', () => { showScreen('policies'); });
  els.btnSubmitPlan.addEventListener('click', submitPlan);

  // Goal select via delegation
  els.goalsList.addEventListener('click', (e) => {
    const btn = e.target.closest('.goal-card');
    if (!btn) return;
    const id = btn.getAttribute('data-goal-id');
    toggleGoal(id);
  });

  // Category chips
  els.categoryChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const id = chip.getAttribute('data-category-id');
    state.currentCategory = id;
    renderCategoryChips();
    renderPolicies();
  });

  // Policies open/remove
  els.policiesGrid.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-open-policy]');
    if (openBtn) {
      const id = openBtn.getAttribute('data-open-policy');
      openPolicyModal(id);
      return;
    }
  });

  els.planList.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-open-policy]');
    if (openBtn) { openPolicyModal(openBtn.getAttribute('data-open-policy')); return; }
    const rmBtn = e.target.closest('[data-remove-policy]');
    if (rmBtn) { removePolicy(rmBtn.getAttribute('data-remove-policy')); }
  });

  // Modal close
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-close-modal]')) closeAnyModal(e.target.closest('.modal'));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!policyModal.hasAttribute('hidden')) closeAnyModal(policyModal);
      if (!resultsModal.hasAttribute('hidden')) closeAnyModal(resultsModal);
    }
  });
}

function toggleGoal(id) {
  const i = state.selectedGoals.indexOf(id);
  if (i >= 0) state.selectedGoals.splice(i,1);
  else if (state.selectedGoals.length < 3) state.selectedGoals.push(id);
  renderGoals();
  renderSelectedGoalPills();
  renderGoalProgress();
  const ready = state.selectedGoals.length === 3;
  els.btnProceedPolicies.disabled = !ready;
  const helper = document.getElementById('goalsHelper');
  if (helper) helper.textContent = ready ? 'Ready — proceed to choose policies' : 'Choose 3 goals to continue';
}

// ========= Modal: Policy =========
function openPolicyModal(id) {
  const p = state.policyById.get(id);
  if (!p) return;
  currentPolicyId = id;
  policyModalTitle.textContent = p.name;
  policyModalDesc.textContent = p.description;
  policyArgumentsFor.textContent = `For: ${p.argumentsFor || ''}`;
  policyArgumentsAgainst.textContent = `Against: ${p.argumentsAgainst || ''}`;
  policyImpacts.innerHTML = compactPolicyImpacts(p).map(i => `<span class="impact-chip ${i.className}"><span class="ico">${i.icon}</span>${i.text}</span>`).join('');
  policyGoalsList.innerHTML = Object.entries(p.goalsImpact || {}).map(([g,pts]) => {
    const goal = goals.find(x=>x.id===g);
    return `<li>${goal ? goal.name : g}: +${pts}</li>`;
  }).join('');

  const selected = state.chosenPolicies.some(cp => cp.id === id);
  btnChoosePolicy.disabled = selected;
  btnRemovePolicy.disabled = !selected;

  btnChoosePolicy.onclick = () => { choosePolicy(id); };
  btnRemovePolicy.onclick = () => { removePolicy(id); };

  openModal(policyModal);
}

function choosePolicy(id) {
  const p = state.policyById.get(id);
  if (!p) return;
  if (!state.chosenPolicies.some(cp => cp.id === id)) {
    state.chosenPolicies.push(p);
    renderPolicies();
    recalcAll();
  }
  closeAnyModal(policyModal);
}

function removePolicy(id) {
  const i = state.chosenPolicies.findIndex(cp => cp.id === id);
  if (i >= 0) {
    state.chosenPolicies.splice(i,1);
    renderPolicies();
    renderPlanList();
    recalcAll();
  }
}

// ========= Modal utils (accessibility) =========
function openModal(modal) {
  modal.removeAttribute('hidden');
  const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusables[0];
  if (first) first.focus();
  modal.addEventListener('keydown', trapFocus);
}

function closeAnyModal(modal) {
  modal.setAttribute('hidden', '');
  modal.removeEventListener('keydown', trapFocus);
}

function trapFocus(e) {
  if (e.key !== 'Tab') return;
  const modal = e.currentTarget;
  const focusables = [...modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => !el.closest('[hidden]'));
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length-1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

// ========= Utils =========
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function makeNoise(seed) {
  let s = seed || 1;
  return function(n) {
    // simple LCG
    s = (s * 1664525 + 1013904223 + n) % 4294967296;
    return (s / 4294967296) * 2 - 1; // [-1,1)
  };
} 