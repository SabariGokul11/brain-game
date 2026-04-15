// ─── Data ─────────────────────────────────────────────────────
const PAIRS = [
  {
    id: 1, cat: "source", term: "Source Control",
    def: "Git repo stores code & history",
    svg: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <circle cx="7" cy="8" r="4" stroke="#38bdf8" stroke-width="1.5"/>
      <circle cx="23" cy="8" r="4" stroke="#38bdf8" stroke-width="1.5"/>
      <circle cx="15" cy="22" r="4" stroke="#38bdf8" stroke-width="1.5"/>
      <path d="M11 8h8M15 12v6" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 2, cat: "source", term: "Build Trigger",
    def: "Push event starts the pipeline run",
    svg: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M6 15l11-10v7h7L13 25v-7H6z" stroke="#38bdf8" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`
  },
  {
    id: 3, cat: "build", term: "Artifact",
    def: "Compiled output of a build step",
    svg: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <rect x="6" y="6" width="18" height="18" rx="3" stroke="#a78bfa" stroke-width="1.5"/>
      <path d="M10 15h10M15 10v10" stroke="#a78bfa" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 4, cat: "build", term: "Docker Image",
    def: "Containerized snapshot of your app",
    svg: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <rect x="5" y="14" width="20" height="11" rx="2" stroke="#a78bfa" stroke-width="1.5"/>
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="#a78bfa" stroke-width="1.2"/>
      <rect x="15" y="9" width="5" height="5" rx="1" stroke="#a78bfa" stroke-width="1.2"/>
      <rect x="9" y="3" width="5" height="5" rx="1" stroke="#a78bfa" stroke-width="1.2"/>
    </svg>`
  },
  {
    id: 5, cat: "test", term: "Unit Tests",
    def: "Isolated function-level code checks",
    svg: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M5 22l5-10 4 7 4-5 5 8" stroke="#fb923c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="24" cy="8" r="3.5" stroke="#fb923c" stroke-width="1.5"/>
      <path d="M22.8 8l.9 1 1.9-2" stroke="#fb923c" stroke-width="1.2" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 6, cat: "test", term: "Code Coverage",
    def: "% of code executed by test suite",
    svg: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M5 24a10 10 0 0 1 10-10 10 10 0 0 1 10 10" stroke="#fb923c" stroke-width="1.5"/>
      <path d="M15 14v10" stroke="#fb923c" stroke-width="1" stroke-dasharray="2 2" opacity=".5"/>
      <path d="M15 24l-6-5" stroke="#fb923c" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 7, cat: "deploy", term: "Staging",
    def: "Pre-production mirror environment",
    svg: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <rect x="5" y="10" width="20" height="14" rx="2" stroke="#4ade80" stroke-width="1.5"/>
      <path d="M10 10V8a5 5 0 0 1 10 0v2" stroke="#4ade80" stroke-width="1.5"/>
      <circle cx="15" cy="18" r="3" stroke="#4ade80" stroke-width="1.3"/>
    </svg>`
  },
  {
    id: 8, cat: "deploy", term: "Blue / Green",
    def: "Zero-downtime live slot swap",
    svg: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <rect x="3" y="9" width="11" height="12" rx="2" fill="#0f4a6e" stroke="#38bdf8" stroke-width="1.2"/>
      <rect x="16" y="9" width="11" height="12" rx="2" fill="#155230" stroke="#4ade80" stroke-width="1.2"/>
      <path d="M14 15h2" stroke="#7a7f96" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 9, cat: "deploy", term: "Rollback",
    def: "Revert to last known good build",
    svg: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M9 11H5V7" stroke="#fb923c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5 11a10 10 0 1 1 0 8" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M15 11v6l3.5 3.5" stroke="#fb923c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  },
];

const CAT_TAG   = { source:"tag-source", build:"tag-build", test:"tag-test", deploy:"tag-deploy" };
const CAT_LABEL = { source:"Source", build:"Build", test:"Test", deploy:"Deploy" };

// ─── State ─────────────────────────────────────────────────────
let flipped = [], matched = 0, moves = 0, locked = false;
let timerID = null, seconds = 0;

// ─── Helpers ───────────────────────────────────────────────────
const shuffle = a => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

const fmtTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const $ = id => document.getElementById(id);

function setMsg(text, type = '') {
  const bar = $('msg-bar');
  bar.className = type;
  $('msg-text').textContent = text;
}

function updateStats() {
  $('s-moves').textContent = moves;
  $('s-pairs').textContent = matched;
  $('s-time').textContent  = fmtTime(seconds);
}

// ─── Init ──────────────────────────────────────────────────────
function initGame() {
  clearInterval(timerID);
  seconds = 0; moves = 0; matched = 0; flipped = []; locked = false;
  updateStats();
  $('win-screen').classList.add('hidden');
  setMsg('Flip two cards — find the matching pair');

  timerID = setInterval(() => {
    seconds++;
    $('s-time').textContent = fmtTime(seconds);
  }, 1000);

  const deck = shuffle([
    ...PAIRS.map(p => ({ ...p, type: 'term', uid: p.id + 't' })),
    ...PAIRS.map(p => ({ ...p, type: 'def',  uid: p.id + 'd' })),
  ]);

  const board = $('board');
  board.innerHTML = '';

  deck.forEach((card, i) => {
    const el = document.createElement('div');
    el.className = 'card';
    el.dataset.id   = card.id;
    el.dataset.type = card.type;
    el.style.animationDelay = `${i * 0.035}s`;

    const backClass = `card-back ${card.cat}`;
    const tagClass  = CAT_TAG[card.cat];
    const tagLabel  = CAT_LABEL[card.cat];

    const backHTML = card.type === 'term'
      ? `<span class="card-tag ${tagClass}">${tagLabel}</span>
         ${card.svg}
         <span class="card-term">${card.term}</span>`
      : `<span class="card-tag ${tagClass}">${tagLabel}</span>
         <span class="card-def">${card.def}</span>`;

    el.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <span class="card-front-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.3" opacity=".5"/>
              <circle cx="11" cy="11" r="3" stroke="currentColor" stroke-width="1.3" opacity=".5"/>
            </svg>
          </span>
        </div>
        <div class="${backClass}">${backHTML}</div>
      </div>`;

    el.addEventListener('click', () => onFlip(el));
    board.appendChild(el);
  });
}

// ─── Flip Logic ────────────────────────────────────────────────
function onFlip(el) {
  if (locked || el.classList.contains('flipped') || el.classList.contains('matched')) return;
  el.classList.add('flipped');
  flipped.push(el);

  if (flipped.length < 2) return;

  moves++;
  updateStats();
  locked = true;

  const [a, b] = flipped;
  const isMatch = a.dataset.id === b.dataset.id && a.dataset.type !== b.dataset.type;

  if (isMatch) {
    a.classList.add('matched');
    b.classList.add('matched');
    matched++;
    updateStats();
    const term = PAIRS.find(p => p.id == a.dataset.id)?.term || '';
    setMsg(`✓ Matched — ${term}`, 'match');
    flipped = [];
    locked  = false;
    if (matched === 9) { clearInterval(timerID); showWin(); }
  } else {
    setMsg('✗ No match — try again', 'miss');
    setTimeout(() => {
      a.classList.remove('flipped');
      b.classList.remove('flipped');
      flipped = [];
      locked  = false;
      setMsg('Flip two cards — find the matching pair');
    }, 900);
  }
}

// ─── Win ───────────────────────────────────────────────────────
function showWin() {
  $('win-detail').textContent =
    `Completed in ${moves} moves · ${fmtTime(seconds)} · All 9 pipeline stages mapped. Your DevOps knowledge is production-ready!`;
  $('win-screen').classList.remove('hidden');
}

// ─── Start ─────────────────────────────────────────────────────
initGame();
