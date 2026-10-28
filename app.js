/**
 * Forge Master Optimizer - Mobile & Desktop Web Edition v2.2.0
 * Features:
 * - 10 Equipment Rarities for Slots 1-8 (Primitive, Medieval, Early-Modern, Modern, Space, Interstellar, Multiverse, Quantum, Underworld, Divine)
 * - 6 Pet/Mount Rarities for Slots 9-12 & Storage (Common, Rare, Epic, Legendary, Ultimate, Mythic)
 * - Attack Speed 203% & 233.4% Breakpoints
 * - Responsive 2-Column Desktop & 1-Column Mobile Layout
 * - Metric k/m base inputs without legacy x1000 multiplier
 */

const ITEM_RARITIES = {
  "Primitive": { name: "Primitive", color: "#95a5a6", border: "#95a5a6" },
  "Medieval": { name: "Medieval", color: "#3498db", border: "#3498db" },
  "Early-Modern": { name: "Early-Modern", color: "#2ecc71", border: "#2ecc71" },
  "Modern": { name: "Modern", color: "#f1c40f", border: "#f1c40f" },
  "Space": { name: "Space", color: "#e74c3c", border: "#e74c3c" },
  "Interstellar": { name: "Interstellar", color: "#d980fa", border: "#d980fa" },
  "Multiverse": { name: "Multiverse", color: "#00d2d3", border: "#00d2d3" },
  "Quantum": { name: "Quantum", color: "#6c5ce7", border: "#6c5ce7" },
  "Underworld": { name: "Underworld", color: "#cd6133", border: "#cd6133" },
  "Divine": { name: "Divine", color: "#ff793f", border: "#ff793f" }
};

const PET_RARITIES = {
  "Common": { name: "Common", color: "#bdc3c7", border: "#bdc3c7" },
  "Rare": { name: "Rare", color: "#3498db", border: "#3498db" },
  "Epic": { name: "Epic", color: "#2ecc71", border: "#2ecc71" },
  "Legendary": { name: "Legendary", color: "#f1c40f", border: "#f1c40f" },
  "Ultimate": { name: "Ultimate", color: "#e74c3c", border: "#e74c3c" },
  "Mythic": { name: "Mythic", color: "#9b59b6", border: "#9b59b6" }
};

const ALL_RARITIES_MAP = {};
for (const k in ITEM_RARITIES) {
  ALL_RARITIES_MAP[k.toLowerCase()] = ITEM_RARITIES[k];
}
for (const k in PET_RARITIES) {
  ALL_RARITIES_MAP[k.toLowerCase()] = PET_RARITIES[k];
}
ALL_RARITIES_MAP["earlymodern"] = ITEM_RARITIES["Early-Modern"];

const STAT_NAMES = {
  md: "Melee DMG", as: "Attack Speed", ls: "Lifesteal",
  dc: "Double Chance", cc: "Crit Chance", cd: "Crit Damage",
  sd: "Skill Damage", bc: "Block Chance", hr: "HP Regen",
  dmg: "Damage %", rd: "Ranged DMG", scd: "Skill CD", hp: "Health %"
};

const ITEM_CAPS = {
  sd: 30.0, bc: 5.0, hr: 4.0, dmg: 15.0, rd: 15.0, scd: 7.0, hp: 15.0
};

const MAX_ROLLS = {
  cc: 12.0, cd: 80.0, as: 40.0, md: 70.0, rd: 15.0, dmg: 15.0,
  sd: 30.0, dc: 20.0, ls: 20.0, bc: 5.0, hr: 4.0, hp: 15.0, scd: 7.0
};

const BENCHMARKS = {
  "Pre-Quantum Melee": 9.0,
  "Post-Quantum Ranged": 18.7,
  "Post-Quantum Melee": 40.6
};

const BPS = [
  { req: 400.1, interval: 0.3, delay: 0.1 },
  { req: 233.4, interval: 0.35, delay: 0.1 },
  { req: 203.0, interval: 0.4, delay: 0.1 },
  { req: 150.1, interval: 0.5, delay: 0.1 },
  { req: 100.1, interval: 0.6, delay: 0.1 },
  { req: 66.7, interval: 0.7, delay: 0.1 },
  { req: 42.9, interval: 0.8, delay: 0.1 },
  { req: 25.1, interval: 0.9, delay: 0.1 },
  { req: 11.2, interval: 1.0, delay: 0.2 },
  { req: 0.1, interval: 1.1, delay: 0.2 },
  { req: 0.0, interval: 1.2, delay: 0.2 }
];

const DEFAULT_STATE = {
  format_version: 2,
  fairy_lvl: 11.0,
  target_build: "Post-Quantum Ranged",
  items: [
    "Primitive, 2970000h, 25.6as, 19.4sd",
    "Primitive, 1580000h, 27.9as, 75cd",
    "Primitive, 197000d, 19.4dc, 55.3cd",
    "Primitive, 397000d, 38.3as, 10.2cc",
    "Primitive, 239000d, 39.8as, 21.4sd",
    "R, Space, 243000d, 75.6cd, 5.84rd",
    "Primitive, 1880000h, 39.7as, 22.2sd",
    "Primitive, 1840000h, 67.2cd, 33.1as",
    "Common, 3015000h, 381000d, 19.1ls",
    "Legendary, 1040000h, 406000d, 16.6ls, 79.8cd",
    "Legendary, 696000h, 270000d, 27.6sd, 13.7dmg",
    "Ultimate, 3480000h, 1350000d, 34.4cd, 7.71rd"
  ],
  mount_storage: [
    "Common, 3050000h, 381000d, 19.1ls",
    "Rare, 81600h, 10200d, 37.1as",
    "Common, 3500000h, 438000d, 71.6cd",
    "Common, 3010000h, 377000d, 19.9dc",
    "Common, 2440000h, 306000d, 28sd"
  ],
  pet_storage: [
    "Legendary, 1040000h, 406000d, 16.6ls, 79.8cd",
    "Legendary, 696000h, 270000d, 27.6sd, 13.7dmg",
    "Legendary, 1390000h, 180000d, 18.9dc, 67.6cd",
    "Legendary, 1390000h, 180000d, 11.4cc, 23.8sd",
    "Legendary, 1390000h, 180000d, 3.77ls, 68.4cd",
    "Legendary, 696000h, 270000d, 19.8dc, 1.99dmg",
    "Legendary, 696000h, 270000d, 60.7cd, 27sd",
    "Ultimate, 3480000h, 1350000d, 34.4cd, 7.71rd"
  ]
};

// Global Application State
let appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
let activeStorageCombo = null;

// --- Helper Functions ---

function parseMetricValue(valStr) {
  if (!valStr) return 0.0;
  const s = String(valStr).trim().toLowerCase();
  if (!s || s === '0') return 0.0;
  try {
    if (s.endsWith('m')) {
      return parseFloat(s.slice(0, -1)) * 1000000.0;
    } else if (s.endsWith('k')) {
      return parseFloat(s.slice(0, -1)) * 1000.0;
    } else {
      return parseFloat(s) || 0.0;
    }
  } catch (e) {
    return 0.0;
  }
}

function formatMetricValue(val) {
  if (!val || val === 0) return "";
  if (typeof val === 'string') val = parseMetricValue(val);
  if (val <= 0) return "";
  if (val >= 1000000) {
    const m = val / 1000000.0;
    return `${parseFloat(m.toFixed(3))}m`;
  } else if (val >= 1000) {
    const k = val / 1000.0;
    return `${parseFloat(k.toFixed(3))}k`;
  } else {
    return Number.isInteger(val) ? String(val) : String(parseFloat(val.toFixed(2)));
  }
}

function parseItemRarity(itemStr, isWeapon = false) {
  if (!itemStr) return { rarity: null, weapon: null, cleanStr: "" };
  let parts = itemStr.split(",").map(p => p.trim());
  let rarity = null;
  let weapon = null;

  for (let step = 0; step < 2 && parts.length > 0; step++) {
    const token = parts[0];
    const tokenLower = token.toLowerCase();
    if (isWeapon && ['M', 'R'].includes(token.toUpperCase()) && !weapon) {
      weapon = token.toUpperCase();
      parts = parts.slice(1);
    } else if (ALL_RARITIES_MAP[tokenLower] && !rarity) {
      rarity = ALL_RARITIES_MAP[tokenLower].name;
      parts = parts.slice(1);
    }
  }

  return { rarity, weapon, cleanStr: parts.join(", ") };
}


function formatItemSummary(rawStr) {
  if (!rawStr) return "(Empty)";
  const { rarity, weapon, cleanStr } = parseItemRarity(rawStr, false);
  const formattedStats = formatDisplayItemString(cleanStr);
  const rarityPrefix = rarity ? `[${rarity.toUpperCase()}] ` : "";
  return `${rarityPrefix}${formattedStats}`;
}

function formatDisplayItemString(cleanStr) {
  if (!cleanStr) return "";
  const parts = cleanStr.split(",").map(p => p.trim());
  const formatted = [];
  for (const p of parts) {
    const m = p.toLowerCase().match(/^([0-9.]+)([a-z]+)$/);
    if (m) {
      const val = parseFloat(m[1]);
      const tag = m[2];
      if (['h', 'kh', 'mh'].includes(tag)) {
        const mult = tag === 'mh' ? 1000000.0 : (tag === 'kh' ? 1000.0 : 1.0);
        formatted.push(`${formatMetricValue(val * mult)}h`);
      } else if (['d', 'kd'].includes(tag)) {
        const mult = tag === 'kd' ? 1000.0 : 1.0;
        formatted.push(`${formatMetricValue(val * mult)}d`);
      } else {
        formatted.push(p);
      }
    } else {
      formatted.push(p);
    }
  }
  return formatted.join(", ");
}

function migrateLegacyItemString(itemStr) {
  if (!itemStr) return "";
  const parts = itemStr.split(",").map(p => p.trim());
  const newParts = [];
  for (const p of parts) {
    const m = p.toLowerCase().match(/^([0-9.]+)([a-z]+)$/);
    if (m) {
      let val = parseFloat(m[1]);
      const tag = m[2];
      if (['h', 'd'].includes(tag) && val <= 6000.0) {
        val = val * 1000.0;
        const valStr = Number.isInteger(val) ? String(val) : String(val);
        newParts.push(`${valStr}${tag}`);
      } else {
        newParts.push(p);
      }
    } else {
      newParts.push(p);
    }
  }
  return newParts.join(", ");
}

function getAttackTiming(asPercent) {
  for (let i = 0; i < BPS.length; i++) {
    if (asPercent >= BPS[i].req) {
      const nextBp = i > 0 ? BPS[i - 1].req : 400.1;
      return { interval: BPS[i].interval, delay: BPS[i].delay, nextBp };
    }
  }
  return { interval: 1.2, delay: 0.2, nextBp: 0.1 };
}

// --- Engine Math Calculations ---

function computeCoreStats(targetBuild) {
  let totalDmg = 0.0;
  let totalHp = 0.0;
  const stats = {};
  for (const k in STAT_NAMES) stats[k] = 0.0;
  const logs = [];
  let weaponType = 'R';

  for (let i = 0; i < 12; i++) {
    const rawText = targetBuild[i];
    const isWeapon = (i === 5);
    if (!rawText) continue;

    try {
      const { rarity, weapon, cleanStr } = parseItemRarity(rawText, isWeapon);
      if (isWeapon) {
        if (weapon) {
          weaponType = weapon;
        } else {
          throw new Error("Requires 'M' or 'R' weapon flag!");
        }
      }

      const parts = cleanStr.split(",").map(p => p.trim());
      for (let p of parts) {
        p = p.toLowerCase();
        if (p === '0' || !p) continue;
        const m = p.match(/^([0-9.]+)([a-z]+)$/);
        if (!m) throw new Error(`Invalid format: '${p}'`);

        let val = parseFloat(m[1]);
        const tag = m[2];

        if (tag === 'h') {
          totalHp += val;
        } else if (tag === 'kh') {
          totalHp += val * 1000.0;
        } else if (tag === 'mh') {
          totalHp += val * 1000000.0;
        } else if (tag === 'd') {
          totalDmg += val;
        } else if (tag === 'kd') {
          totalDmg += val * 1000.0;
        } else if (STAT_NAMES[tag] !== undefined) {
          if (ITEM_CAPS[tag] && val > ITEM_CAPS[tag]) {
            val = ITEM_CAPS[tag];
          }
          stats[tag] += val;
        } else {
          throw new Error(`Invalid param: '${tag}'`);
        }
      }
    } catch (e) {
      logs.push(`S${i + 1} INVALID INPUT: ${e.message}`);
    }
  }

  return { totalDmg, totalHp, stats, weaponType, logs };
}

function computeMultipliers(stats, weaponType, fairyLvl) {
  let realMd = Math.min(stats.md / 100.0, 3.50);
  let realRd = stats.rd / 100.0;

  if (weaponType === 'R') {
    realMd = 0.0;
  } else if (weaponType === 'M') {
    realRd = 0.0;
  }

  const realDmg = stats.dmg / 100.0;
  const realDc = Math.min(stats.dc / 100.0, 1.00);

  const fairyBlocks = Math.floor(stats.sd / 15.0);
  const fairyCc = Math.min(fairyBlocks * (fairyLvl / 100.0), 0.80);

  const realCc = Math.min((stats.cc / 100.0) + fairyCc, 1.00);
  const realCd = 1.20 + (stats.cd / 100.0);

  const timing = getAttackTiming(stats.as);
  const timePerHit = (timing.interval + realDc * timing.delay) / (1.0 + realDc);

  const ampMult = (1.0 + realDmg) * (1.0 + realMd + realRd);
  const critMult = 1.0 + (realCc * (realCd - 1.0));

  const dpsMult = (ampMult * critMult) / timePerHit;

  return {
    dpsMult, fairyBlocks, fairyCc, realCc, realCd,
    interval: timing.interval, delay: timing.delay, nextBp: timing.nextBp,
    timePerHit
  };
}

function calculateBuildScore(realDps, realHp, realHps) {
  const sustainRatio = Math.min(realHps / (realDps + 1.0), 1.5);
  const ehpFactor = Math.min(realHp / 8000000.0, 2.0);
  const compositeWeight = 1.0 + (0.10 * sustainRatio) + (0.05 * ehpFactor);
  return realDps * compositeWeight;
}

function calculateEffectiveQuality(itemStr, isWeapon, oldStats, newStats, fairyLvl) {
  const { cleanStr } = parseItemRarity(itemStr, isWeapon);
  const parts = cleanStr.split(",").map(p => p.trim());

  const pctScores = [];
  for (let p of parts) {
    p = p.toLowerCase();
    if (p === '0' || !p) continue;
    const m = p.match(/^([0-9.]+)([a-z]+)$/);
    if (m) {
      const val = parseFloat(m[1]);
      const tag = m[2];
      if (MAX_ROLLS[tag] !== undefined) {
        let effVal = val;
        if (tag === 'md') {
          effVal = Math.min(newStats.md, 350.0) - Math.min(oldStats.md, 350.0);
        } else if (tag === 'rd') {
          effVal = Math.min(newStats.rd, 100.0) - Math.min(oldStats.rd, 100.0);
        } else if (tag === 'cc') {
          const oldFBl = Math.floor(oldStats.sd / 15.0);
          const oldFCC = Math.min(oldFBl * (fairyLvl / 100.0), 0.80) * 100.0;
          const oldRealCc = Math.min(oldStats.cc + oldFCC, 100.0);

          const newFBl = Math.floor(newStats.sd / 15.0);
          const newFCC = Math.min(newFBl * (fairyLvl / 100.0), 0.80) * 100.0;
          const newRealCc = Math.min(newStats.cc + newFCC, 100.0);

          effVal = newRealCc - oldRealCc;
        } else if (tag === 'dc') {
          effVal = Math.min(newStats.dc, 100.0) - Math.min(oldStats.dc, 100.0);
        } else if (tag === 'as') {
          const oldInt = getAttackTiming(oldStats.as).interval;
          const newInt = getAttackTiming(newStats.as).interval;
          if (newStats.as > 150.1 && newInt >= oldInt) {
            effVal = 0.0;
          }
        }
        effVal = Math.max(effVal, 0.0);
        effVal = Math.min(effVal, val);
        const score = Math.min(effVal / MAX_ROLLS[tag], 1.0);
        pctScores.push(score);
      }
    }
  }
  if (pctScores.length === 0) return 0.0;
  return (pctScores.reduce((a, b) => a + b, 0) / pctScores.length) * 100.0;
}

function combinations(arr, k) {
  const result = [];
  function backtrack(start, path) {
    if (path.length === k) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      path.push(arr[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  return result;
}

function simulateDpsWithItem(slotIdx, testItem) {
  const oldCore = computeCoreStats(appState.items);
  const oldMultObj = computeMultipliers(oldCore.stats, oldCore.weaponType, appState.fairy_lvl);
  const oldRealDps = oldCore.totalDmg * oldMultObj.dpsMult;
  const oldRealHp = oldCore.totalHp * (1.0 + (oldCore.stats.hp / 100.0));
  const oldRealHps = (oldRealDps * (oldCore.stats.ls / 100.0)) + (oldRealHp * (oldCore.stats.hr / 100.0));

  const tempBuild = [...appState.items];
  if (testItem !== null) {
    tempBuild[slotIdx] = testItem;
  }

  const curCore = computeCoreStats(tempBuild);
  const curMultObj = computeMultipliers(curCore.stats, curCore.weaponType, appState.fairy_lvl);
  const curDps = curCore.totalDmg * curMultObj.dpsMult;
  const curHp = curCore.totalHp * (1.0 + (curCore.stats.hp / 100.0));
  const curHps = (curDps * (curCore.stats.ls / 100.0)) + (curHp * (curCore.stats.hr / 100.0));
  const currentComboScore = calculateBuildScore(curDps, curHp, curHps);

  let bestCombo = null;
  let bestScore = -1.0;

  const mounts = [...appState.mount_storage];
  const pets = [...appState.pet_storage];

  if (mounts.length > 0 && pets.length >= 3) {
    const petCombos = combinations(pets, 3);
    for (const m of mounts) {
      for (const pCombo of petCombos) {
        const iterBuild = [...tempBuild];
        iterBuild[8] = m;
        iterBuild[9] = pCombo[0];
        iterBuild[10] = pCombo[1];
        iterBuild[11] = pCombo[2];

        const iterCore = computeCoreStats(iterBuild);
        const iterMult = computeMultipliers(iterCore.stats, iterCore.weaponType, appState.fairy_lvl);
        const iterDps = iterCore.totalDmg * iterMult.dpsMult;
        const iterHp = iterCore.totalHp * (1.0 + (iterCore.stats.hp / 100.0));
        const iterHps = (iterDps * (iterCore.stats.ls / 100.0)) + (iterHp * (iterCore.stats.hr / 100.0));
        const iterScore = calculateBuildScore(iterDps, iterHp, iterHps);

        if (iterCore.stats.ls >= 30.0 && iterScore > bestScore) {
          bestScore = iterScore;
          bestCombo = [m, pCombo[0], pCombo[1], pCombo[2]];
        }
      }
    }
  }

  if (bestCombo && bestScore > currentComboScore) {
    tempBuild[8] = bestCombo[0];
    tempBuild[9] = bestCombo[1];
    tempBuild[10] = bestCombo[2];
    tempBuild[11] = bestCombo[3];
  } else {
    bestCombo = null;
  }

  const newCore = computeCoreStats(tempBuild);
  const newMultObj = computeMultipliers(newCore.stats, newCore.weaponType, appState.fairy_lvl);
  const newRealDps = newCore.totalDmg * newMultObj.dpsMult;
  const newRealHp = newCore.totalHp * (1.0 + (newCore.stats.hp / 100.0));
  const newRealHps = (newRealDps * (newCore.stats.ls / 100.0)) + (newRealHp * (newCore.stats.hr / 100.0));

  let itemQuality = 0.0;
  if (testItem !== null) {
    itemQuality = calculateEffectiveQuality(testItem, slotIdx === 5, oldCore.stats, newCore.stats, appState.fairy_lvl);
  }

  return {
    oldRealDps, oldMult: oldMultObj.dpsMult, oldLs: oldCore.stats.ls, oldRealHps,
    newRealDps, newMult: newMultObj.dpsMult, newLs: newCore.stats.ls, newRealHps,
    itemQuality, bestCombo
  };
}

// --- Persistence & Storage ---

function loadState() {
  try {
    const raw = localStorage.getItem('forge_master_build_web');
    if (raw) {
      const data = JSON.parse(raw);
      if (data && typeof data === 'object') {
        const version = data.format_version || 1;
        appState.fairy_lvl = parseFloat(data.fairy_lvl) || 11.0;
        appState.target_build = data.target_build || "Post-Quantum Ranged";
        appState.items = Array.isArray(data.items) ? data.items : DEFAULT_STATE.items;
        appState.mount_storage = Array.isArray(data.mount_storage) ? data.mount_storage : DEFAULT_STATE.mount_storage;
        appState.pet_storage = Array.isArray(data.pet_storage) ? data.pet_storage : DEFAULT_STATE.pet_storage;

        if (version < 2) {
          appState.items = appState.items.map(migrateLegacyItemString);
          appState.mount_storage = appState.mount_storage.map(migrateLegacyItemString);
          appState.pet_storage = appState.pet_storage.map(migrateLegacyItemString);
          saveState();
        }
        return;
      }
    }
  } catch (e) {
    console.error("Failed to load localStorage:", e);
  }
  appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
  saveState();
}

function saveState() {
  appState.format_version = 2;
  localStorage.setItem('forge_master_build_web', JSON.stringify(appState));
}

// --- UI Rendering ---

function updateUI() {
  const core = computeCoreStats(appState.items);
  const multObj = computeMultipliers(core.stats, core.weaponType, appState.fairy_lvl);

  const realDps = core.totalDmg * multObj.dpsMult;
  const realTotalHp = core.totalHp * (1.0 + (core.stats.hp / 100.0));
  const realHps = (realDps * (core.stats.ls / 100.0)) + (realTotalHp * (core.stats.hr / 100.0));

  const targetMult = BENCHMARKS[appState.target_build] || 18.7;
  const matchProg = (multObj.dpsMult / targetMult) * 100.0;

  // Desktop Hero stats
  document.getElementById('lbl-dps').textContent = `REAL DPS: ${realDps.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
  document.getElementById('lbl-hps').textContent = `${realHps.toLocaleString('en-US', { maximumFractionDigits: 1 })}`;
  document.getElementById('lbl-mult').textContent = `${multObj.dpsMult.toFixed(1)}x`;
  document.getElementById('lbl-match').textContent = `OPTIMAL BUILD MATCH: ${matchProg.toFixed(1)}%`;
  document.getElementById('lbl-base-summary').textContent = `BASE DMG: ${core.totalDmg.toLocaleString('en-US', { maximumFractionDigits: 1 })} | TOTAL HP: ${realTotalHp.toLocaleString('en-US', { maximumFractionDigits: 1 })} (+${core.stats.hp.toFixed(1)}%)`;

  // Mobile Sticky Header stats
  document.getElementById('mob-lbl-dps').textContent = `DPS: ${realDps.toLocaleString('en-US', { maximumFractionDigits: 1 })}`;
  document.getElementById('mob-lbl-hps').textContent = `HPS: ${realHps.toLocaleString('en-US', { maximumFractionDigits: 1 })}`;
  document.getElementById('mob-lbl-mult').textContent = `MULT: ${multObj.dpsMult.toFixed(1)}x`;
  document.getElementById('mob-lbl-match').textContent = `MATCH: ${matchProg.toFixed(1)}%`;

  document.getElementById('lbl-time-per-hit').textContent = `TIME PER HIT: ${multObj.timePerHit.toFixed(2)}s`;
  document.getElementById('lbl-crit-dmg').textContent = `CRIT DMG: ${core.stats.cd.toFixed(1)}% -> ${multObj.realCd.toFixed(2)}x`;

  // Saturation Monitor Progress Bars
  updateProgressBar('md', core.stats.md, 350.0, core.weaponType === 'R');
  updateProgressBar('rd', core.stats.rd, 100.0, core.weaponType === 'M');

  const asVal = core.stats.as;
  let asText = `${asVal.toFixed(1)}% (Next BP: ${multObj.nextBp}%)`;
  if (asVal >= 400.1) asText = `${asVal.toFixed(1)}% (MAX TIER)`;
  updateProgressBar('as', asVal, 400.1, false, asText);

  updateProgressBar('dc', core.stats.dc, 100.0);
  updateProgressBar('ls', core.stats.ls, 100.0, false, `${core.stats.ls.toFixed(1)}% (Min 30.0%)`);
  updateProgressBar('sd', core.stats.sd, 150.0, false, `${core.stats.sd.toFixed(1)}% -> ${multObj.fairyBlocks} Fairy blocks`);
  updateProgressBar('cc', multObj.realCc * 100.0, 100.0, false, `${(multObj.realCc * 100.0).toFixed(1)}% (Gear: ${core.stats.cc.toFixed(1)}%)`);

  // Render Gear Grid (Slots 1-8)
  for (let i = 0; i < 8; i++) {
    renderSlotButton(i);
  }

  // Render Mount & Pets (Slots 9-12)
  for (let i = 8; i < 12; i++) {
    renderSlotButton(i);
  }

  // Render Errors if any
  const errContainer = document.getElementById('error-logs');
  if (core.logs.length > 0) {
    errContainer.innerHTML = core.logs.map(l => `<div class="error-msg">⚠️ ${l}</div>`).join("");
    errContainer.classList.remove('hidden');
  } else {
    errContainer.innerHTML = "";
    errContainer.classList.add('hidden');
  }

  saveState();
}

function updateProgressBar(key, cur, cap, isCut = false, customText = null) {
  const fill = document.getElementById(`pb-fill-${key}`);
  const lbl = document.getElementById(`pb-lbl-${key}`);
  if (!fill || !lbl) return;

  const pct = Math.min((cur / cap) * 100.0, 100.0);
  fill.style.width = `${pct}%`;

  if (isCut) {
    fill.style.backgroundColor = '#dc3545';
    lbl.textContent = `${cur.toFixed(1)}% [CUT]`;
    lbl.style.color = '#dc3545';
  } else {
    fill.style.backgroundColor = pct >= 100.0 ? '#dc3545' : (pct > 0 ? '#28a745' : '#1f538d');
    lbl.style.color = '#ffffff';
    lbl.textContent = customText ? customText : `${cur.toFixed(1)}% / ${cap.toFixed(1)}%`;
  }
}

function renderSlotButton(idx) {
  const btn = document.getElementById(`slot-btn-${idx}`);
  if (!btn) return;

  const raw = appState.items[idx];
  const isWeapon = (idx === 5);
  const isHybrid = (idx >= 8);

  let title = `S${idx + 1}`;
  if (isWeapon) title = "WEAPON";
  else if (idx === 8) title = "MOUNT";
  else if (idx === 9) title = "PET 1";
  else if (idx === 10) title = "PET 2";
  else if (idx === 11) title = "PET 3";

  if (!raw) {
    btn.innerHTML = `<div class="slot-header"><span class="slot-title">${title}</span></div><div class="slot-empty">(EMPTY)</div>`;
    btn.style.borderColor = '#2c3e50';
    btn.style.boxShadow = 'none';
    return;
  }

  const { rarity, weapon, cleanStr } = parseItemRarity(raw, isWeapon);
  const formatted = formatDisplayItemString(cleanStr);
  const lines = formatted.split(", ").map(l => `<div class="slot-stat">${l}</div>`).join("");

  const raritiesMap = isHybrid ? PET_RARITIES : ITEM_RARITIES;
  const rCfg = rarity && raritiesMap[rarity] ? raritiesMap[rarity] : (rarity && ALL_RARITIES_MAP[rarity.toLowerCase()] ? ALL_RARITIES_MAP[rarity.toLowerCase()] : null);

  let badge = "";
  let border = isWeapon ? '#e74c3c' : '#3498db';
  let glow = 'none';

  if (rCfg) {
    border = rCfg.border;
    glow = `0 0 12px ${rCfg.border}55`;
    badge = `<span class="rarity-badge" style="background:${rCfg.color}; color:#121217;">${rCfg.name.toUpperCase()}</span>`;
  }

  if (isWeapon && weapon) {
    const wpColor = weapon === 'M' ? '#e74c3c' : '#3498db';
    const wpBadge = `<span class="weapon-flag-badge" style="background:${wpColor}; color:#fff;">${weapon}</span>`;
    badge = `${wpBadge} ${badge}`;
  }

  btn.style.borderColor = border;
  btn.style.boxShadow = glow;
  btn.innerHTML = `
    <div class="slot-header">
      <span class="slot-title">${title}</span>
      <div class="slot-badges">${badge}</div>
    </div>
    <div class="slot-body">${lines}</div>
  `;
}

// --- Modals & Calibration Logic ---

let currentCalibrationSlot = null;
let currentStorageItem = null;

function openCalibrationModal(idx) {
  currentCalibrationSlot = idx;
  const modal = document.getElementById('calibration-modal');
  const isWeapon = (idx === 5);
  const isHybrid = (idx >= 8);

  let title = `Slot ${idx + 1}`;
  if (isWeapon) title = "Slot 6 (WEAPON)";
  else if (idx === 8) title = "MOUNT Slot";
  else if (idx >= 9) title = `PET ${idx - 8} Slot`;
  document.getElementById('calib-modal-title').textContent = `Calibration - ${title}`;

  // Weapon controls
  const wpSection = document.getElementById('calib-weapon-toggle');
  if (isWeapon) {
    wpSection.classList.remove('hidden');
  } else {
    wpSection.classList.add('hidden');
  }

  // Parse existing data
  const raw = appState.items[idx] || "";
  const { rarity: loadedRarity, weapon: loadedWeapon, cleanStr } = parseItemRarity(raw, isWeapon);

  // Populate Rarity options
  const raritySelect = document.getElementById('calib-rarity-select');
  const raritiesObj = isHybrid ? PET_RARITIES : ITEM_RARITIES;

  let optionsHtml = "";
  if (!isHybrid) {
    optionsHtml += `<option value="None" style="color:#7f8c8d;">(None)</option>`;
  }
  optionsHtml += Object.keys(raritiesObj).map(rName => {
    const cfg = raritiesObj[rName];
    return `<option value="${rName}" style="color:${cfg.color}; font-weight:bold;">${rName}</option>`;
  }).join("");

  raritySelect.innerHTML = optionsHtml;
  raritySelect.value = loadedRarity || (isHybrid ? "Common" : (Object.keys(ITEM_RARITIES)[0]));

  setWeaponButtonActive(loadedWeapon || "R");

  // Clear all input fields
  document.querySelectorAll('.calib-input').forEach(inp => inp.value = "");

  // Populate inputs
  const parts = cleanStr.split(",").map(p => p.trim());
  for (const p of parts) {
    const m = p.toLowerCase().match(/^([0-9.]+)([a-z]+)$/);
    if (m) {
      const val = parseFloat(m[1]);
      const tag = m[2];
      if (['h', 'kh', 'mh'].includes(tag)) {
        const mult = tag === 'mh' ? 1000000.0 : (tag === 'kh' ? 1000.0 : 1.0);
        document.getElementById('inp-calib-h').value = formatMetricValue(val * mult);
      } else if (['d', 'kd'].includes(tag)) {
        const mult = tag === 'kd' ? 1000.0 : 1.0;
        document.getElementById('inp-calib-d').value = formatMetricValue(val * mult);
      } else {
        const inp = document.getElementById(`inp-calib-${tag}`);
        if (inp) inp.value = String(val);
      }
    }
  }

  document.getElementById('sim-swap-result').innerHTML = "";
  modal.classList.remove('hidden');
}

function setWeaponButtonActive(type) {
  const btnM = document.getElementById('btn-wp-m');
  const btnR = document.getElementById('btn-wp-r');
  if (type === 'M') {
    btnM.classList.add('active-melee');
    btnR.classList.remove('active-ranged');
  } else {
    btnR.classList.add('active-ranged');
    btnM.classList.remove('active-melee');
  }
}

function constructItemStringFromCalibrationForm(isWeapon, isHybrid) {
  const parts = [];
  if (isWeapon) {
    const isMelee = document.getElementById('btn-wp-m').classList.contains('active-melee');
    parts.push(isMelee ? "M" : "R");
  }

  const rarity = document.getElementById('calib-rarity-select').value;
  if (rarity && rarity !== "None") {
    parts.push(rarity);
  }

  const hVal = parseMetricValue(document.getElementById('inp-calib-h').value);
  if (hVal > 0) parts.push(`${Math.round(hVal)}h`);

  const dVal = parseMetricValue(document.getElementById('inp-calib-d').value);
  if (dVal > 0) parts.push(`${Math.round(dVal)}d`);

  for (const tag in STAT_NAMES) {
    const inp = document.getElementById(`inp-calib-${tag}`);
    if (inp) {
      const v = parseFloat(inp.value);
      if (!isNaN(v) && v > 0) {
        parts.push(`${v}${tag}`);
      }
    }
  }

  return parts.join(", ");
}

function runMarginalSimulation() {
  const isWeapon = (currentCalibrationSlot === 5);
  const isHybrid = (currentCalibrationSlot >= 8);
  const testItemStr = constructItemStringFromCalibrationForm(isWeapon, isHybrid);

  const res = simulateDpsWithItem(currentCalibrationSlot, testItemStr);
  const dpsDiff = ((res.newRealDps / res.oldRealDps) - 1.0) * 100.0;
  const sign = dpsDiff >= 0 ? "+" : "";

  let dpsColor = dpsDiff > 0 ? "#28a745" : (dpsDiff < 0 ? "#dc3545" : "#bdc3c7");
  let lsWarning = res.newLs < 30.0 ? `<div style="color:#dc3545; font-weight:bold; margin-top:4px;">⚠️ WARNING: Lifesteal falls below 30% (${res.newLs.toFixed(1)}%)!</div>` : "";

  let petReopt = "";
  if (res.bestCombo) {
    petReopt = `<div style="color:#9b59b6; margin-top:4px; font-size:12px;">✨ Auto-adjusted pets from storage for maximum DPS & sustain!</div>`;
  }

  document.getElementById('sim-swap-result').innerHTML = `
    <div style="background:#121217; padding:12px; border-radius:8px; border:1px solid #2c3e50; margin-top:8px;">
      <div style="font-weight:bold; color:${dpsColor}; font-size:15px;">
        DPS: ${res.newRealDps.toLocaleString('en-US', { maximumFractionDigits: 1 })} (${sign}${dpsDiff.toFixed(1)}%)
      </div>
      <div style="font-size:13px; color:#bdc3c7; margin-top:2px;">
        Eff. Mult: ${res.newMult.toFixed(2)}x (was ${res.oldMult.toFixed(2)}x) | HPS: ${res.newRealHps.toLocaleString('en-US', { maximumFractionDigits: 1 })}
      </div>
      <div style="font-size:13px; color:#3498db; margin-top:2px;">
        Item Quality Score: ${res.itemQuality.toFixed(1)}%
      </div>
      ${petReopt}
      ${lsWarning}
    </div>
  `;
}


function runSimulationWithStorage() {
  const isWeapon = (currentCalibrationSlot === 5);
  const isHybrid = (currentCalibrationSlot >= 8);
  const testItemStr = constructItemStringFromCalibrationForm(isWeapon, isHybrid);

  // 1. Current Baseline stats
  const currCore = computeCoreStats(appState.items);
  const currMultObj = computeMultipliers(currCore.stats, currCore.weaponType, appState.fairy_lvl);
  const currDps = currCore.totalDmg * currMultObj.dpsMult;
  const currHp = currCore.totalHp * (1.0 + (currCore.stats.hp / 100.0));
  const currHps = (currDps * (currCore.stats.ls / 100.0)) + (currHp * (currCore.stats.hr / 100.0));
  const currLs = currCore.stats.ls;
  const currScore = calculateBuildScore(currDps, currHp, currHps);

  // 2. Base test build with new item in currentCalibrationSlot
  const tempBuild = [...appState.items];
  tempBuild[currentCalibrationSlot] = testItemStr;

  // 3. Candidate Mounts
  let candidateMounts = [];
  if (currentCalibrationSlot === 8) {
    candidateMounts = [testItemStr];
  } else {
    const mSet = new Set();
    if (tempBuild[8]) mSet.add(tempBuild[8]);
    for (const m of appState.mount_storage) {
      if (m) mSet.add(m);
    }
    candidateMounts = Array.from(mSet);
    if (candidateMounts.length === 0) candidateMounts = [tempBuild[8] || ""];
  }

  // 4. Candidate Combinations & Optimization Loop
  let bestCombo = null;
  let bestScore = -1.0;
  let bestDps = 0.0;
  let bestMult = 0.0;
  let bestHp = 0.0;
  let bestHps = 0.0;
  let bestLs = 0.0;

  // Check testBuild as-is first (without any storage swaps)
  const noSwapCore = computeCoreStats(tempBuild);
  const noSwapMult = computeMultipliers(noSwapCore.stats, noSwapCore.weaponType, appState.fairy_lvl);
  const noSwapDps = noSwapCore.totalDmg * noSwapMult.dpsMult;
  const noSwapHp = noSwapCore.totalHp * (1.0 + (noSwapCore.stats.hp / 100.0));
  const noSwapHps = (noSwapDps * (noSwapCore.stats.ls / 100.0)) + (noSwapHp * (noSwapCore.stats.hr / 100.0));
  const noSwapScore = calculateBuildScore(noSwapDps, noSwapHp, noSwapHps);

  if (noSwapCore.stats.ls >= 30.0) {
    bestScore = noSwapScore;
    bestDps = noSwapDps;
    bestMult = noSwapMult.dpsMult;
    bestHp = noSwapHp;
    bestHps = noSwapHps;
    bestLs = noSwapCore.stats.ls;
    bestCombo = [tempBuild[8] || "", tempBuild[9] || "", tempBuild[10] || "", tempBuild[11] || ""];
  }

  if (currentCalibrationSlot >= 9) {
    // Calibrating a specific pet slot (9, 10, or 11):
    // testItemStr is mandatory as one of the pets.
    const otherCandidatePets = [];
    for (let pIdx = 9; pIdx <= 11; pIdx++) {
      if (pIdx !== currentCalibrationSlot && tempBuild[pIdx]) {
        otherCandidatePets.push(tempBuild[pIdx]);
      }
    }
    for (const sp of appState.pet_storage) {
      if (sp) otherCandidatePets.push(sp);
    }

    const petCombos = otherCandidatePets.length >= 2 ? combinations(otherCandidatePets, 2) : [];
    for (const m of candidateMounts) {
      if (petCombos.length > 0) {
        for (const [pA, pB] of petCombos) {
          const trial = [...tempBuild];
          trial[8] = m;
          trial[9] = testItemStr;
          trial[10] = pA;
          trial[11] = pB;

          const c = computeCoreStats(trial);
          const mObj = computeMultipliers(c.stats, c.weaponType, appState.fairy_lvl);
          const d = c.totalDmg * mObj.dpsMult;
          const h = c.totalHp * (1.0 + (c.stats.hp / 100.0));
          const hps = (d * (c.stats.ls / 100.0)) + (h * (c.stats.hr / 100.0));
          const score = calculateBuildScore(d, h, hps);

          if (c.stats.ls >= 30.0 && score > bestScore) {
            bestScore = score;
            bestDps = d;
            bestMult = mObj.dpsMult;
            bestHp = h;
            bestHps = hps;
            bestLs = c.stats.ls;
            bestCombo = [m, testItemStr, pA, pB];
          }
        }
      } else {
        const trial = [...tempBuild];
        trial[8] = m;
        const c = computeCoreStats(trial);
        const mObj = computeMultipliers(c.stats, c.weaponType, appState.fairy_lvl);
        const d = c.totalDmg * mObj.dpsMult;
        const h = c.totalHp * (1.0 + (c.stats.hp / 100.0));
        const hps = (d * (c.stats.ls / 100.0)) + (h * (c.stats.hr / 100.0));
        const score = calculateBuildScore(d, h, hps);

        if (c.stats.ls >= 30.0 && score > bestScore) {
          bestScore = score;
          bestDps = d;
          bestMult = mObj.dpsMult;
          bestHp = h;
          bestHps = hps;
          bestLs = c.stats.ls;
          bestCombo = [m, trial[9] || "", trial[10] || "", trial[11] || ""];
        }
      }
    }
  } else {
    // Calibrating Slots 0..8 (Forge item or Mount)
    const candidatePetPool = [];
    for (let pIdx = 9; pIdx <= 11; pIdx++) {
      if (tempBuild[pIdx]) candidatePetPool.push(tempBuild[pIdx]);
    }
    for (const sp of appState.pet_storage) {
      if (sp) candidatePetPool.push(sp);
    }

    const petCombos = candidatePetPool.length >= 3 ? combinations(candidatePetPool, 3) : [];

    for (const m of candidateMounts) {
      if (petCombos.length > 0) {
        for (const [p0, p1, p2] of petCombos) {
          const trial = [...tempBuild];
          trial[8] = m;
          trial[9] = p0;
          trial[10] = p1;
          trial[11] = p2;

          const c = computeCoreStats(trial);
          const mObj = computeMultipliers(c.stats, c.weaponType, appState.fairy_lvl);
          const d = c.totalDmg * mObj.dpsMult;
          const h = c.totalHp * (1.0 + (c.stats.hp / 100.0));
          const hps = (d * (c.stats.ls / 100.0)) + (h * (c.stats.hr / 100.0));
          const score = calculateBuildScore(d, h, hps);

          if (c.stats.ls >= 30.0 && score > bestScore) {
            bestScore = score;
            bestDps = d;
            bestMult = mObj.dpsMult;
            bestHp = h;
            bestHps = hps;
            bestLs = c.stats.ls;
            bestCombo = [m, p0, p1, p2];
          }
        }
      } else {
        const trial = [...tempBuild];
        trial[8] = m;
        const c = computeCoreStats(trial);
        const mObj = computeMultipliers(c.stats, c.weaponType, appState.fairy_lvl);
        const d = c.totalDmg * mObj.dpsMult;
        const h = c.totalHp * (1.0 + (c.stats.hp / 100.0));
        const hps = (d * (c.stats.ls / 100.0)) + (h * (c.stats.hr / 100.0));
        const score = calculateBuildScore(d, h, hps);

        if (c.stats.ls >= 30.0 && score > bestScore) {
          bestScore = score;
          bestDps = d;
          bestMult = mObj.dpsMult;
          bestHp = h;
          bestHps = hps;
          bestLs = c.stats.ls;
          bestCombo = [m, trial[9] || "", trial[10] || "", trial[11] || ""];
        }
      }
    }
  }

  // 5. Verdict and Results
  const container = document.getElementById('sim-swap-result');

  if (!bestCombo || bestLs < 30.0) {
    const reachableLs = noSwapCore.stats.ls.toFixed(1);
    container.innerHTML = `
      <div class="sim-verdict-card verdict-reject">
        <div class="verdict-header">
          <span class="verdict-badge reject">⚠️ REJECT: LIFESTEAL &lt; 30%</span>
          <span class="verdict-diff">SURVIVAL FAILED</span>
        </div>
        <div class="verdict-stats">
          <div><strong>Lifesteal:</strong> ${reachableLs}% (Threshold: &ge; 30.0%)</div>
          <div><strong>Reason:</strong> Even testing all pet & mount storage combinations, Lifesteal cannot reach 30%. Taking this item breaks survival protocol!</div>
        </div>
      </div>
    `;
    return;
  }

  const dpsDiff = currDps > 0 ? ((bestDps / currDps) - 1.0) * 100.0 : 0.0;
  const hpsDiff = currHps > 0 ? ((bestHps / currHps) - 1.0) * 100.0 : 0.0;
  const dpsSign = dpsDiff >= 0 ? "+" : "";
  const hpsSign = hpsDiff >= 0 ? "+" : "";

  const targetMult = BENCHMARKS[appState.target_build] || 18.7;
  const newMatchProg = (bestMult / targetMult) * 100.0;

  // Criteria for recommendation: composite score increases and DPS does not regress (> 98%)
  const isUpgrade = (bestScore > currScore && bestDps >= currDps * 0.98);

  // 6. Analyze required swaps
  const currentMount = appState.items[8] || "";
  const winningMount = bestCombo[0] || "";
  let mountChanged = (currentMount !== winningMount && currentCalibrationSlot !== 8);

  const currPets = [appState.items[9] || "", appState.items[10] || "", appState.items[11] || ""];
  const winningPets = [bestCombo[1] || "", bestCombo[2] || "", bestCombo[3] || ""];

  // Pair up swapped pets
  const remainingWinning = [...winningPets];
  const retainedCurr = [];
  for (const cp of currPets) {
    const idx = remainingWinning.indexOf(cp);
    if (idx !== -1) {
      retainedCurr.push(cp);
      remainingWinning.splice(idx, 1);
    }
  }
  const removedPets = currPets.filter(cp => !retainedCurr.includes(cp));
  const addedPets = remainingWinning;

  let swapsHtml = "";
  let hasSwaps = false;

  if (mountChanged) {
    hasSwaps = true;
    swapsHtml += `
      <div class="swap-item">
        <span class="swap-type">Mount</span>
        <span class="swap-old">${formatItemSummary(currentMount)}</span>
        <span class="swap-arrow">➔</span>
        <span class="swap-new">${formatItemSummary(winningMount)}</span>
      </div>
    `;
  }

  if (addedPets.length > 0) {
    hasSwaps = true;
    for (let i = 0; i < addedPets.length; i++) {
      const oldP = removedPets[i] || "(Empty)";
      const newP = addedPets[i];
      swapsHtml += `
        <div class="swap-item">
          <span class="swap-type">Pet</span>
          <span class="swap-old">${formatItemSummary(oldP)}</span>
          <span class="swap-arrow">➔</span>
          <span class="swap-new">${formatItemSummary(newP)}</span>
        </div>
      `;
    }
  }

  const swapsSectionHtml = hasSwaps ? `
    <div class="swaps-section">
      <div class="swaps-title">⚡ REQUIRED STORAGE SWAPS:</div>
      ${swapsHtml}
    </div>
  ` : `
    <div class="swaps-section">
      <div class="swaps-none">✨ No pet or mount swaps required — your currently equipped loadout is already optimal!</div>
    </div>
  `;

  if (isUpgrade) {
    container.innerHTML = `
      <div class="sim-verdict-card verdict-take">
        <div class="verdict-header">
          <span class="verdict-badge take">✅ VERDICT: TAKE THIS ITEM!</span>
          <span class="verdict-diff">${dpsSign}${dpsDiff.toFixed(1)}% DPS</span>
        </div>
        <div class="verdict-stats">
          <div><strong>New Real DPS:</strong> ${bestDps.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} (was ${currDps.toLocaleString('en-US', { maximumFractionDigits: 1 })})</div>
          <div><strong>Multiplier:</strong> ${bestMult.toFixed(2)}x | <strong>HPS:</strong> ${bestHps.toLocaleString('en-US', { maximumFractionDigits: 1 })} (${hpsSign}${hpsDiff.toFixed(1)}%) | <strong>LS:</strong> ${bestLs.toFixed(1)}%</div>
          <div><strong>Optimal Build Match:</strong> ${newMatchProg.toFixed(1)}%</div>
        </div>
        ${swapsSectionHtml}
        <button id="btn-apply-sim-all" class="btn-primary btn-apply-all">⚡ Equip Item & Apply Swaps</button>
      </div>
    `;

    document.getElementById('btn-apply-sim-all').addEventListener('click', () => {
      appState.items[currentCalibrationSlot] = testItemStr;
      appState.items[8] = bestCombo[0];
      appState.items[9] = bestCombo[1];
      appState.items[10] = bestCombo[2];
      appState.items[11] = bestCombo[3];
      saveState();
      closeModals();
      updateUI();
    });
  } else {
    container.innerHTML = `
      <div class="sim-verdict-card verdict-reject">
        <div class="verdict-header">
          <span class="verdict-badge reject">❌ VERDICT: DO NOT TAKE</span>
          <span class="verdict-diff">${dpsSign}${dpsDiff.toFixed(1)}% DPS</span>
        </div>
        <div class="verdict-stats">
          <div><strong>Best Possible DPS:</strong> ${bestDps.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} (Current: ${currDps.toLocaleString('en-US', { maximumFractionDigits: 1 })})</div>
          <div><strong>Reason:</strong> New item results in a weaker build (${dpsSign}${dpsDiff.toFixed(1)}% DPS). Storage pets & mount cannot compensate for the stat loss.</div>
        </div>
        ${hasSwaps ? swapsSectionHtml : ''}
      </div>
    `;
  }
}

function saveCalibrationToBuild() {
  const isWeapon = (currentCalibrationSlot === 5);
  const isHybrid = (currentCalibrationSlot >= 8);
  const itemStr = constructItemStringFromCalibrationForm(isWeapon, isHybrid);

  appState.items[currentCalibrationSlot] = itemStr;
  closeModals();
  updateUI();
}

// --- Storage Optimizer Dialog & Calculations ---

function openStorageModal() {
  renderStorageLists();
  document.getElementById('storage-modal').classList.remove('hidden');
}

function renderStorageLists() {
  const mountContainer = document.getElementById('mount-storage-list');
  const petContainer = document.getElementById('pet-storage-list');

  mountContainer.innerHTML = appState.mount_storage.map((m, idx) => createStorageItemRow(m, idx, true)).join("");
  petContainer.innerHTML = appState.pet_storage.map((p, idx) => createStorageItemRow(p, idx, false)).join("");
}

function createStorageItemRow(itemStr, idx, isMount) {
  const { rarity, cleanStr } = parseItemRarity(itemStr, false);
  const formatted = formatDisplayItemString(cleanStr || itemStr);
  const rCfg = rarity && PET_RARITIES[rarity] ? PET_RARITIES[rarity] : (rarity && ALL_RARITIES_MAP[rarity.toLowerCase()] ? ALL_RARITIES_MAP[rarity.toLowerCase()] : { color: '#bdc3c7', name: rarity || 'Common' });
  const badge = `<span class="rarity-badge" style="background:${rCfg.color}; color:#121217; margin-right:6px;">${rCfg.name.toUpperCase()}</span>`;

  return `
    <div class="storage-row" style="border-left: 4px solid ${rCfg.color};">
      <div class="storage-info" onclick="openStorageItemEdit(${idx}, ${isMount})">
        ${badge} <span class="storage-stats">${formatted}</span>
      </div>
      <div class="storage-actions">
        <button class="btn-sm btn-edit" onclick="openStorageItemEdit(${idx}, ${isMount})">Edit</button>
        <button class="btn-sm btn-del" onclick="deleteStorageItem(${idx}, ${isMount})">✕</button>
      </div>
    </div>
  `;
}

function deleteStorageItem(idx, isMount) {
  if (isMount) {
    appState.mount_storage.splice(idx, 1);
  } else {
    appState.pet_storage.splice(idx, 1);
  }
  saveState();
  renderStorageLists();
}

function openStorageItemEdit(idx, isMount) {
  currentStorageItem = { idx, isMount };
  const isEdit = idx !== null;
  const itemType = isMount ? "Mount" : "Pet";
  document.getElementById('storage-item-modal-title').textContent = `${isEdit ? "Edit" : "Add"} ${itemType}`;

  // Reset inputs
  document.querySelectorAll('.storage-input').forEach(inp => inp.value = "");

  // Populate pet rarities
  const raritySelect = document.getElementById('storage-rarity-select');
  raritySelect.innerHTML = Object.keys(PET_RARITIES).map(rName => {
    const cfg = PET_RARITIES[rName];
    return `<option value="${rName}" style="color:${cfg.color}; font-weight:bold;">${rName}</option>`;
  }).join("");
  raritySelect.value = "Common";

  if (isEdit) {
    const raw = isMount ? appState.mount_storage[idx] : appState.pet_storage[idx];
    const { rarity: loadedRarity, cleanStr } = parseItemRarity(raw || "", false);
    if (loadedRarity && PET_RARITIES[loadedRarity]) {
      raritySelect.value = loadedRarity;
    }
    const parts = cleanStr.split(",").map(p => p.trim());
    for (const p of parts) {
      const m = p.toLowerCase().match(/^([0-9.]+)([a-z]+)$/);
      if (m) {
        const val = parseFloat(m[1]);
        const tag = m[2];
        if (['h', 'kh', 'mh'].includes(tag)) {
          const mult = tag === 'mh' ? 1000000.0 : (tag === 'kh' ? 1000.0 : 1.0);
          document.getElementById('inp-storage-h').value = formatMetricValue(val * mult);
        } else if (['d', 'kd'].includes(tag)) {
          const mult = tag === 'kd' ? 1000.0 : 1.0;
          document.getElementById('inp-storage-d').value = formatMetricValue(val * mult);
        } else {
          const inp = document.getElementById(`inp-storage-${tag}`);
          if (inp) inp.value = String(val);
        }
      }
    }
  }

  document.getElementById('storage-item-modal').classList.remove('hidden');
}

function saveStorageItem() {
  const parts = [];
  const rarity = document.getElementById('storage-rarity-select').value;
  if (rarity && PET_RARITIES[rarity]) {
    parts.push(rarity);
  }

  const hVal = parseMetricValue(document.getElementById('inp-storage-h').value);
  if (hVal > 0) parts.push(`${Math.round(hVal)}h`);

  const dVal = parseMetricValue(document.getElementById('inp-storage-d').value);
  if (dVal > 0) parts.push(`${Math.round(dVal)}d`);

  for (const tag in STAT_NAMES) {
    const inp = document.getElementById(`inp-storage-${tag}`);
    if (inp) {
      const v = parseFloat(inp.value);
      if (!isNaN(v) && v > 0) parts.push(`${v}${tag}`);
    }
  }

  const itemStr = parts.join(", ");
  if (currentStorageItem.isMount) {
    if (currentStorageItem.idx !== null) {
      appState.mount_storage[currentStorageItem.idx] = itemStr;
    } else {
      appState.mount_storage.push(itemStr);
    }
  } else {
    if (currentStorageItem.idx !== null) {
      appState.pet_storage[currentStorageItem.idx] = itemStr;
    } else {
      appState.pet_storage.push(itemStr);
    }
  }

  saveState();
  closeModals();
  renderStorageLists();
}

function runStorageOptimization() {
  const mounts = [...appState.mount_storage];
  const pets = [...appState.pet_storage];
  const resLbl = document.getElementById('opti-result-lbl');
  const btnApply = document.getElementById('btn-apply-opti');

  if (mounts.length === 0 || pets.length < 3) {
    resLbl.innerHTML = `<span style="color:#dc3545;">ERROR: You need at least 1 Mount and 3 Pets in storage!</span>`;
    btnApply.disabled = true;
    return;
  }

  const currCore = computeCoreStats(appState.items);
  const currMultObj = computeMultipliers(currCore.stats, currCore.weaponType, appState.fairy_lvl);
  const currDps = currCore.totalDmg * currMultObj.dpsMult;
  const currHp = currCore.totalHp * (1.0 + (currCore.stats.hp / 100.0));
  const currHps = (currDps * (currCore.stats.ls / 100.0)) + (currHp * (currCore.stats.hr / 100.0));
  const currScore = calculateBuildScore(currDps, currHp, currHps);

  let bestCombo = null;
  let bestScore = -1.0;
  let bestDps = 0.0;
  let bestMult = 0.0;
  let bestHps = 0.0;

  const petCombos = combinations(pets, 3);
  for (const m of mounts) {
    for (const pCombo of petCombos) {
      const tempBuild = [...appState.items];
      tempBuild[8] = m;
      tempBuild[9] = pCombo[0];
      tempBuild[10] = pCombo[1];
      tempBuild[11] = pCombo[2];

      const c = computeCoreStats(tempBuild);
      const mObj = computeMultipliers(c.stats, c.weaponType, appState.fairy_lvl);
      const dps = c.totalDmg * mObj.dpsMult;
      const hp = c.totalHp * (1.0 + (c.stats.hp / 100.0));
      const hps = (dps * (c.stats.ls / 100.0)) + (hp * (c.stats.hr / 100.0));
      const score = calculateBuildScore(dps, hp, hps);

      if (c.stats.ls >= 30.0 && score > bestScore) {
        bestScore = score;
        bestDps = dps;
        bestMult = mObj.dpsMult;
        bestHps = hps;
        bestCombo = [m, pCombo[0], pCombo[1], pCombo[2]];
      }
    }
  }

  if (bestCombo) {
    if (bestScore > currScore && (bestDps >= currDps * 0.98)) {
      activeStorageCombo = bestCombo;
      const dpsDiff = ((bestDps / currDps) - 1.0) * 100.0;
      const sign = dpsDiff >= 0 ? "+" : "";
      resLbl.innerHTML = `
        <div style="color:#28a745; font-weight:bold; font-size:15px;">FOUND BETTER ALL-AROUND COMBINATION!</div>
        <div style="margin-top:4px; color:#ecf0f1;">
          Best DPS: <b>${bestDps.toLocaleString('en-US', { maximumFractionDigits: 1 })}</b> (${sign}${dpsDiff.toFixed(1)}%) | HPS: ${bestHps.toLocaleString('en-US', { maximumFractionDigits: 1 })} | Mult: ${bestMult.toFixed(2)}x
        </div>
        <div style="font-size:12px; color:#bdc3c7; margin-top:2px;">
          Current DPS: ${currDps.toLocaleString('en-US', { maximumFractionDigits: 1 })} | Mult: ${currMultObj.dpsMult.toFixed(2)}x
        </div>
      `;
      btnApply.disabled = false;
    } else if (Math.abs(bestScore - currScore) / (currScore + 1e-6) < 0.005 || (bestDps <= currDps && bestScore <= currScore)) {
      activeStorageCombo = null;
      resLbl.innerHTML = `
        <div style="color:#f39c12; font-weight:bold; font-size:15px;">CURRENT BUILD IS ALREADY OPTIMAL!</div>
        <div style="margin-top:4px; color:#ecf0f1;">
          Current DPS: <b>${currDps.toLocaleString('en-US', { maximumFractionDigits: 1 })}</b> | Mult: ${currMultObj.dpsMult.toFixed(2)}x
        </div>
        <div style="font-size:12px; color:#bdc3c7; margin-top:2px;">
          Storage pets cannot beat your equipped all-around stats.
        </div>
      `;
      btnApply.disabled = true;
    } else {
      activeStorageCombo = null;
      resLbl.innerHTML = `
        <div style="color:#dc3545; font-weight:bold; font-size:15px;">STORAGE IS WEAKER THAN CURRENT BUILD!</div>
        <div style="margin-top:4px; color:#ecf0f1;">
          Best storage DPS: ${bestDps.toLocaleString('en-US', { maximumFractionDigits: 1 })} (Current: ${currDps.toLocaleString('en-US', { maximumFractionDigits: 1 })}) | Mult: ${bestMult.toFixed(2)}x
        </div>
      `;
      btnApply.disabled = true;
    }
  } else {
    activeStorageCombo = null;
    resLbl.innerHTML = `<span style="color:#dc3545;">No valid combinations found (All drop LS < 30%).</span>`;
    btnApply.disabled = true;
  }
}

function applyOptimizedCombo() {
  if (activeStorageCombo) {
    appState.items[8] = activeStorageCombo[0];
    appState.items[9] = activeStorageCombo[1];
    appState.items[10] = activeStorageCombo[2];
    appState.items[11] = activeStorageCombo[3];
    saveState();
    updateUI();
    closeModals();
  }
}

// --- Import / Export Modal ---

function openImportExportModal() {
  document.getElementById('json-area').value = JSON.stringify(appState, null, 2);
  document.getElementById('import-export-modal').classList.remove('hidden');
}

function handleJsonImport() {
  try {
    const raw = document.getElementById('json-area').value.trim();
    if (!raw) return alert("Please paste valid JSON!");
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') throw new Error("Invalid format");

    const version = data.format_version || 1;
    appState.fairy_lvl = parseFloat(data.fairy_lvl) || 11.0;
    appState.target_build = data.target_build || "Post-Quantum Ranged";
    appState.items = Array.isArray(data.items) ? data.items : DEFAULT_STATE.items;
    appState.mount_storage = Array.isArray(data.mount_storage) ? data.mount_storage : DEFAULT_STATE.mount_storage;
    appState.pet_storage = Array.isArray(data.pet_storage) ? data.pet_storage : DEFAULT_STATE.pet_storage;

    if (version < 2) {
      appState.items = appState.items.map(migrateLegacyItemString);
      appState.mount_storage = appState.mount_storage.map(migrateLegacyItemString);
      appState.pet_storage = appState.pet_storage.map(migrateLegacyItemString);
    }

    saveState();
    closeModals();
    updateUI();
    alert("Build and storage imported successfully!");
  } catch (e) {
    alert("Error parsing JSON: " + e.message);
  }
}

function downloadJsonFile() {
  const jsonStr = JSON.stringify(appState, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "forge_master_build.json";
  a.click();
  URL.revokeObjectURL(url);
}

function copyJsonToClipboard() {
  const txt = JSON.stringify(appState, null, 2);
  navigator.clipboard.writeText(txt).then(() => {
    alert("JSON copied to clipboard!");
  }).catch(() => {
    alert("Could not copy automatically. You can manually copy from the text box.");
  });
}

function closeModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
}

// --- App Initialization & Event Listeners ---

window.addEventListener('DOMContentLoaded', () => {
  loadState();

  // Target Build dropdown
  const targetSelect = document.getElementById('select-target-build');
  targetSelect.innerHTML = Object.keys(BENCHMARKS).map(k => `<option value="${k}">${k}</option>`).join("");
  targetSelect.value = appState.target_build;
  targetSelect.addEventListener('change', (e) => {
    appState.target_build = e.target.value;
    updateUI();
  });

  // Fairy Level input
  const fairyInp = document.getElementById('inp-fairy-lvl');
  fairyInp.value = appState.fairy_lvl;
  fairyInp.addEventListener('input', (e) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) {
      appState.fairy_lvl = v;
      updateUI();
    }
  });

  // Weapon toggle buttons in modal
  document.getElementById('btn-wp-m').addEventListener('click', () => setWeaponButtonActive('M'));
  document.getElementById('btn-wp-r').addEventListener('click', () => setWeaponButtonActive('R'));

  // Calibration buttons
  document.getElementById('btn-sim-swap').addEventListener('click', runMarginalSimulation);
  document.getElementById('btn-sim-storage').addEventListener('click', runSimulationWithStorage);
  document.getElementById('btn-save-calib').addEventListener('click', saveCalibrationToBuild);

  // Storage buttons
  document.getElementById('btn-open-storage').addEventListener('click', openStorageModal);
  document.getElementById('btn-add-mount').addEventListener('click', () => openStorageItemEdit(null, true));
  document.getElementById('btn-add-pet').addEventListener('click', () => openStorageItemEdit(null, false));
  document.getElementById('btn-run-opti').addEventListener('click', runStorageOptimization);
  document.getElementById('btn-apply-opti').addEventListener('click', applyOptimizedCombo);
  document.getElementById('btn-save-storage-item').addEventListener('click', saveStorageItem);

  // Top Action buttons
  document.getElementById('btn-import-export').addEventListener('click', openImportExportModal);
  document.getElementById('btn-json-import').addEventListener('click', handleJsonImport);
  document.getElementById('btn-json-download').addEventListener('click', downloadJsonFile);
  document.getElementById('btn-json-copy').addEventListener('click', copyJsonToClipboard);

  const fileInput = document.getElementById('inp-json-file');
  const browseBtn = document.getElementById('btn-browse-json');
  const fileNameLbl = document.getElementById('lbl-file-name');

  if (browseBtn && fileInput) {
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        fileNameLbl.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (evt) => {
          document.getElementById('json-area').value = evt.target.result;
        };
        reader.readAsText(file);
      }
    });
  }

  document.getElementById('btn-open-info').addEventListener('click', () => {
    document.getElementById('info-modal').classList.remove('hidden');
  });
  document.getElementById('btn-open-notes').addEventListener('click', () => {
    document.getElementById('notes-modal').classList.remove('hidden');
  });

  // Slot clicks
  for (let i = 0; i < 12; i++) {
    const btn = document.getElementById(`slot-btn-${i}`);
    if (btn) {
      btn.addEventListener('click', () => openCalibrationModal(i));
    }
  }

  // Close modals on click background or close button
  document.querySelectorAll('.btn-close-modal').forEach(btn => {
    btn.addEventListener('click', closeModals);
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModals();
    });
  });

  // Register PWA Service Worker if supported
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.log('SW registration error:', err);
    });
  }

  updateUI();
});
