// ---------- Swara tuning (just intonation, traditional Bhatkhande ratios) ----------
const SWARA_RATIOS = {
  S: 1 / 1,
  r: 16 / 15,
  R: 9 / 8,
  g: 6 / 5,
  G: 5 / 4,
  m: 4 / 3,
  M: 45 / 32,
  P: 3 / 2,
  d: 8 / 5,
  D: 5 / 3,
  n: 9 / 5,
  N: 15 / 8,
};

const OCTAVE_MULT = { mandra: 0.5, madhya: 1, taar: 2 };

// Standard equal-tempered reference frequencies for Sa choices (octave 4)
const SA_OPTIONS = [
  ["C", 261.63], ["C#", 277.18], ["D", 293.66], ["D#", 311.13],
  ["E", 329.63], ["F", 349.23], ["F#", 369.99], ["G", 392.00],
  ["G#", 415.30], ["A", 440.00], ["A#", 466.16], ["B", 493.88],
];

// ---------- Instruments ----------
// Sustained voices (bowed/blown/reed) hold for the written note length then
// release; plucked/struck voices trigger and ring out their natural decay.
const INSTRUMENTS = {
  sitar: { label: "Sitar", sustained: false },
  sarod: { label: "Sarod", sustained: false },
  santoor: { label: "Santoor", sustained: false },
  tanpura: { label: "Tanpura", sustained: false },
  harmonium: { label: "Harmonium", sustained: true },
  esraj: { label: "Esraj", sustained: true },
  sarangi: { label: "Sarangi", sustained: true },
  bansuri: { label: "Bansuri", sustained: true },
};

// Exact filenames available per instrument under samples/<inst>/<name>.m4a
// (recordings from github.com/dipikasgp/ragaloop). Missing notes are covered
// by nearest-neighbour playback-rate pitch shifting.
const SAMPLE_MANIFEST = {
  sitar: ["A2", "A3", "A4", "A5", "Ab2", "Ab3", "Ab4", "Ab5", "B2", "B3", "B4", "Bb2", "Bb3", "Bb4", "C3", "C4", "C5", "D2", "D3", "D4", "D5", "Db3", "Db4", "Db5", "E2", "E3", "E4", "E5", "Eb2", "Eb3", "Eb4", "Eb5", "F2", "F3", "F4", "F5", "G2", "G3", "G4", "G5", "Gb2", "Gb3", "Gb4", "Gb5"],
  sarod: ["A2", "A3", "A4", "Ab2", "Ab3", "Ab4", "B2", "B3", "B4", "Bb2", "Bb3", "Bb4", "C3", "C4", "C5", "D2", "D3", "D4", "D5", "Db3", "Db4", "Db5", "E2", "E3", "E4", "Eb2", "Eb3", "Eb4", "F2", "F3", "F4", "G2", "G3", "G4", "Gb2", "Gb3", "Gb4"],
  santoor: ["A3", "A4", "A5", "A6", "Ab3", "Ab4", "Ab5", "Ab6", "B3", "B4", "B5", "Bb3", "Bb4", "Bb5", "C4", "C5", "C6", "D3", "D4", "D5", "D6", "Db4", "Db5", "Db6", "E3", "E4", "E5", "E6", "Eb3", "Eb4", "Eb5", "Eb6", "F3", "F4", "F5", "F6", "G3", "G4", "G5", "G6", "Gb3", "Gb4", "Gb5", "Gb6"],
  tanpura: ["A2", "A3", "Ab2", "Ab3", "B2", "B3", "Bb2", "Bb3", "C3", "C4", "D2", "D3", "D4", "Db3", "Db4", "E2", "E3", "Eb2", "Eb3", "F2", "F3", "G2", "G3", "Gb2", "Gb3"],
  harmonium: ["A3", "A4", "A5", "Ab3", "Ab4", "Ab5", "B3", "B4", "B5", "Bb3", "Bb4", "Bb5", "C4", "C5", "C6", "D3", "D4", "D5", "D6", "Db4", "Db5", "Db6", "E3", "E4", "E5", "Eb3", "Eb4", "Eb5", "F3", "F4", "F5", "G3", "G4", "G5", "Gb3", "Gb4", "Gb5"],
  esraj: ["A3", "A4", "A5", "Ab3", "Ab4", "Ab5", "B3", "B4", "B5", "Bb3", "Bb4", "Bb5", "C4", "C5", "C6", "D3", "D4", "D5", "D6", "Db4", "Db5", "Db6", "E3", "E4", "E5", "Eb3", "Eb4", "Eb5", "F3", "F4", "F5", "G3", "G4", "G5", "Gb3", "Gb4", "Gb5"],
  sarangi: ["A3", "A4", "A5", "Ab3", "Ab4", "Ab5", "B3", "B4", "B5", "Bb3", "Bb4", "Bb5", "C4", "C5", "C6", "D3", "D4", "D5", "D6", "Db4", "Db5", "Db6", "E3", "E4", "E5", "Eb3", "Eb4", "Eb5", "F3", "F4", "F5", "G3", "G4", "G5", "Gb3", "Gb4", "Gb5"],
  bansuri: ["A3", "A4", "A5", "A6", "Ab3", "Ab4", "Ab5", "Ab6", "B3", "B4", "B5", "Bb3", "Bb4", "Bb5", "C4", "C5", "C6", "D3", "D4", "D5", "D6", "Db4", "Db5", "Db6", "E3", "E4", "E5", "E6", "Eb3", "Eb4", "Eb5", "Eb6", "F3", "F4", "F5", "F6", "G3", "G4", "G5", "G6", "Gb3", "Gb4", "Gb5"],
};

const NOTE_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

function noteNameToFreq(name) {
  const m = /^([A-G]b?)(\d+)$/.exec(name);
  if (!m) return null;
  const idx = NOTE_NAMES.indexOf(m[1]);
  if (idx === -1) return null;
  const octave = parseInt(m[2], 10);
  const midi = idx + (octave + 1) * 12;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

let currentInstrument = "sitar";

// ---------- DOM ----------
const saSelect = document.getElementById("saSelect");
const instrumentSelect = document.getElementById("instrumentSelect");
const tempoInput = document.getElementById("tempo");
const loopToggle = document.getElementById("loopToggle");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const sargamInput = document.getElementById("sargamInput");
const statusLine = document.getElementById("statusLine");
const noteDisplay = document.getElementById("noteDisplay");
const droneBtn = document.getElementById("droneBtn");
const droneVolumeInput = document.getElementById("droneVolume");
const savedSelect = document.getElementById("savedSelect");
const saveLehraBtn = document.getElementById("saveLehraBtn");
const deleteLehraBtn = document.getElementById("deleteLehraBtn");

SA_OPTIONS.forEach(([name, freq]) => {
  const opt = document.createElement("option");
  opt.value = freq;
  opt.textContent = name;
  if (name === "C") opt.selected = true;
  saSelect.appendChild(opt);
});

Object.entries(INSTRUMENTS).forEach(([key, cfg]) => {
  const opt = document.createElement("option");
  opt.value = key;
  opt.textContent = cfg.label;
  if (key === currentInstrument) opt.selected = true;
  instrumentSelect.appendChild(opt);
});

// ---------- Parser ----------
// Token forms: "|" bar, "-" extend, "." rest, note like ",S" "S" "S'" "r" "G'" etc.
// "[" ... "]" groups several sub-beats into a single beat's worth of time,
// e.g. "[S R G M]" plays those four notes in the space of one beat.
const NOTE_RE = /^(,)?([SRGMPDNsrgmpdn])(')?$/;

// Brackets may be glued to an adjacent note ("[S", "M]") with no space, so
// split them out into their own tokens before the main pass.
function tokenizeSargam(text) {
  const tokens = [];
  for (const raw of text.trim().split(/\s+/).filter(Boolean)) {
    let s = raw;
    while (s.startsWith("[")) {
      tokens.push("[");
      s = s.slice(1);
    }
    const trailing = [];
    while (s.endsWith("]") && s !== "]") {
      trailing.unshift("]");
      s = s.slice(0, -1);
    }
    if (s.length) tokens.push(s);
    tokens.push(...trailing);
  }
  return tokens;
}

let groupIdCounter = 0;

function parseSargam(text) {
  const rawTokens = tokenizeSargam(text);
  const events = []; // {type: 'note'|'rest', freqRatio, octave, letter, beats, dotPos}
  const displayTokens = []; // includes bar markers, for rendering
  const errors = [];

  // When inside [...], notes/rests accumulate here instead of directly into
  // events/displayTokens; on "]" their beats are rescaled to add up to 1.
  let group = null; // { subEvents: [] }

  function pushEvent(ev) {
    if (group) {
      group.subEvents.push(ev);
    } else {
      events.push(ev);
      displayTokens.push(ev);
    }
  }

  function closeGroup() {
    const subEvents = group.subEvents;
    group = null;
    if (subEvents.length === 0) return;
    const totalUnits = subEvents.reduce((sum, ev) => sum + ev.beats, 0);
    const groupId = ++groupIdCounter;
    subEvents.forEach((ev) => {
      ev.beats = ev.beats / totalUnits;
      ev.groupId = groupId;
      events.push(ev);
      displayTokens.push(ev);
    });
  }

  for (const tok of rawTokens) {
    if (tok === "[") {
      if (group) {
        errors.push(`nested "[" is not supported`);
        continue;
      }
      group = { subEvents: [] };
      continue;
    }
    if (tok === "]") {
      if (!group) {
        errors.push(`"]" with no matching "["`);
        continue;
      }
      closeGroup();
      continue;
    }
    if (tok === "|") {
      if (group) {
        errors.push(`"|" not allowed inside "[...]"`);
        continue;
      }
      displayTokens.push({ type: "bar" });
      continue;
    }
    if (tok === "-") {
      const pool = group ? group.subEvents : events;
      const last = pool[pool.length - 1];
      if (last) {
        last.beats += 1;
      } else {
        errors.push(`"-" with no preceding note`);
      }
      continue;
    }
    if (tok === "." || tok === "_") {
      pushEvent({ type: "rest", beats: 1 });
      continue;
    }
    const m = NOTE_RE.exec(tok);
    if (!m) {
      errors.push(`unrecognized token "${tok}"`);
      continue;
    }
    const [, mandraMark, letterRaw, taarMark] = m;
    let letter = letterRaw;
    // s / p have no komal/tivra variant; normalize case
    if (letter === "s") letter = "S";
    if (letter === "p") letter = "P";
    const ratio = SWARA_RATIOS[letter];
    if (ratio === undefined) {
      errors.push(`unknown swara "${letterRaw}"`);
      continue;
    }
    let octave = "madhya";
    if (mandraMark) octave = "mandra";
    else if (taarMark) octave = "taar";

    pushEvent({
      type: "note",
      letter,
      octave,
      ratio,
      beats: 1,
    });
  }

  if (group) {
    errors.push(`unclosed "[" — treating remaining notes as one beat`);
    closeGroup();
  }

  return { events, displayTokens, errors };
}

function freqFor(saFreq, ev) {
  return saFreq * ev.ratio * OCTAVE_MULT[ev.octave];
}

// ---------- Rendering ----------
function renderNotes(displayTokens, saFreq) {
  noteDisplay.innerHTML = "";
  let currentGroupEl = null;
  let currentGroupId = null;
  displayTokens.forEach((tok, i) => {
    if (tok.type === "bar") {
      currentGroupEl = null;
      currentGroupId = null;
      const sep = document.createElement("div");
      sep.className = "bar-sep";
      noteDisplay.appendChild(sep);
      return;
    }

    let container = noteDisplay;
    if (tok.groupId) {
      if (tok.groupId !== currentGroupId) {
        currentGroupEl = document.createElement("div");
        currentGroupEl.className = "beat-group";
        noteDisplay.appendChild(currentGroupEl);
        currentGroupId = tok.groupId;
      }
      container = currentGroupEl;
    } else {
      currentGroupEl = null;
      currentGroupId = null;
    }

    const block = document.createElement("div");
    block.className = "note-block";
    if (tok.groupId) block.classList.add("grouped");
    block.dataset.index = i;
    if (tok.type === "rest") {
      block.classList.add("rest");
      block.textContent = "𝄽";
    } else {
      block.classList.add(tok.octave);
      block.textContent = tok.letter;
      if (tok.beats > 1) {
        const dur = document.createElement("span");
        dur.style.fontSize = "10px";
        dur.style.marginTop = "2px";
        dur.textContent = tok.beats + "b";
        block.appendChild(dur);
      }
      if (tok.octave === "taar") {
        const dot = document.createElement("span");
        dot.className = "dot above";
        block.appendChild(dot);
      } else if (tok.octave === "mandra") {
        const dot = document.createElement("span");
        dot.className = "dot below";
        block.appendChild(dot);
      }
    }
    container.appendChild(block);
  });
}

// ---------- Audio engine ----------
let audioCtx = null;

function ensureAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // Android/Chrome can suspend the context mid-playback (audio-focus loss,
    // output-device change, power management) even with the tab in the
    // foreground and the screen on. Nothing else resumes it, which is why the
    // melody dies after a while until Stop→Play is pressed. Auto-resume so it
    // self-heals without user intervention.
    audioCtx.onstatechange = () => {
      if (audioCtx.state !== "running" && (isPlaying || droneActive)) {
        audioCtx.resume().catch(() => {});
      }
    };
  }
  return audioCtx;
}

// ---------- Sample playback (recorded instrument notes) ----------
const sampleStore = new Map(); // inst -> [{freq, buffer}], sorted by freq
const loadedInstruments = new Set();

function normalizeBuffer(buffer, target = 0.85) {
  let peak = 0;
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < data.length; i++) peak = Math.max(peak, Math.abs(data[i]));
  }
  if (peak === 0) return;
  const g = target / peak;
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < data.length; i++) data[i] *= g;
  }
}

// Fetches & decodes every recorded note for an instrument once, caching the
// result. Missing/undecodable files are skipped — nearest-neighbour playback
// covers the gap. If every file fails (e.g. opened as a local file:// page,
// where the browser blocks fetch() of local resources), sampleStore is left
// empty for this instrument and playNote() falls back to the synth voice.
async function loadInstrumentSamples(inst) {
  if (loadedInstruments.has(inst)) return sampleStore.has(inst);
  loadedInstruments.add(inst);
  const ctx = ensureAudioCtx();
  const names = SAMPLE_MANIFEST[inst] || [];
  const entries = [];
  await Promise.all(names.map(async (name) => {
    const freq = noteNameToFreq(name);
    if (freq === null) return;
    try {
      const res = await fetch(`samples/${inst}/${name}.m4a`);
      if (!res.ok) return;
      const buffer = await ctx.decodeAudioData(await res.arrayBuffer());
      normalizeBuffer(buffer);
      entries.push({ freq, buffer });
    } catch (e) {
      // missing/undecodable sample — skip, nearest neighbour covers it
    }
  }));
  entries.sort((a, b) => a.freq - b.freq);
  if (entries.length > 0) sampleStore.set(inst, entries);
  return entries.length > 0;
}

function findNearestSample(inst, freq) {
  const entries = sampleStore.get(inst);
  if (!entries || entries.length === 0) return null;
  let best = entries[0];
  let bestDiff = Math.abs(Math.log2(best.freq / freq));
  for (let i = 1; i < entries.length; i++) {
    const diff = Math.abs(Math.log2(entries[i].freq / freq));
    if (diff < bestDiff) {
      best = entries[i];
      bestDiff = diff;
    }
  }
  return best;
}

function playSampledNote(inst, freq, startTime, duration, opts = {}) {
  const { output = null, sustainOverride = null, attack: attackOverride = null, release: releaseOverride = null, holdLevel = 1, envelope = null } = opts;
  const ctx = audioCtx;
  const sample = findNearestSample(inst, freq);
  if (!sample) return false;

  const rate = freq / sample.freq;
  const src = ctx.createBufferSource();
  src.buffer = sample.buffer;
  src.playbackRate.value = rate;

  const gain = ctx.createGain();
  src.connect(gain).connect(output || ctx.destination);

  const sustained = sustainOverride !== null ? sustainOverride : INSTRUMENTS[inst].sustained;

  let stopAt;
  if (sustained) {
    // Bowed/blown/reed voice: hold for the written note length, then release.
    const attack = attackOverride !== null ? attackOverride : 0.04;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(1, startTime + attack);
    if (envelope) {
      // Explicit breakpoints: [secondsAfterStart, level], linear between them.
      for (const [t, v] of envelope) gain.gain.linearRampToValueAtTime(v, startTime + t);
      stopAt = startTime + envelope[envelope.length - 1][0] + 0.05;
    } else {
      const release = releaseOverride !== null ? releaseOverride : 0.12;
      // holdLevel < 1 means the note is already gently easing off by the end
      // of its own beat, then continues fading from there across the next
      // note's full length — a two-stage decay instead of a flat hold
      // followed by a sudden drop.
      gain.gain.linearRampToValueAtTime(holdLevel, startTime + duration);
      gain.gain.linearRampToValueAtTime(0, startTime + duration + release);
      stopAt = startTime + duration + release + 0.05;
    }
  } else {
    // Plucked/struck voice: let the recording's own decay ring out, only
    // taper it if it would otherwise still be sounding well past the note.
    const attack = attackOverride !== null ? attackOverride : 0.008;
    const tail = Math.min(sample.buffer.duration / rate, 3.0);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(1, startTime + attack);
    gain.gain.setValueAtTime(1, Math.max(startTime + attack, startTime + tail - 0.1));
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + tail);
    stopAt = startTime + tail + 0.05;
  }

  src.start(startTime);
  src.stop(stopAt);

  const cleanupMs = Math.max(0, stopAt + 0.15 - ctx.currentTime) * 1000;
  setTimeout(() => {
    try { src.disconnect(); gain.disconnect(); } catch (e) { /* already disconnected */ }
  }, cleanupMs);

  return true;
}

function playNote(freq, startTime, duration) {
  if (sampleStore.has(currentInstrument) && playSampledNote(currentInstrument, freq, startTime, duration)) {
    return;
  }
  playFallbackSynth(freq, startTime, duration);
}

// ---------- Fallback synth (Karplus-Strong pluck) ----------
// Used only when an instrument's samples fail to load entirely, so the app
// is never silent (e.g. opened directly as a file:// page).

// Mild asymmetric soft-clip + a touch of ripple: emulates the sitar's
// buzzy "jawari" bridge contact rather than a clean plucked-string tone.
const BUZZ_CURVE = (() => {
  const n = 256;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * 2.2) * 0.9 + Math.sin(x * Math.PI * 3) * 0.03;
  }
  return curve;
})();

const STRING_DECAY_TARGET_S = 1.5; // time for a plucked string to fall to ~ -60dB

function playFallbackSynth(freq, startTime, duration, opts = {}) {
  const { output = null, holdSec = null, attack: attackOverride = null, release: releaseOverride = null, holdLevel = 1, envelope = null } = opts;
  const ctx = audioCtx;
  const period = 1 / freq;
  const attack = attackOverride !== null ? attackOverride : 0.006;
  const release = releaseOverride !== null ? releaseOverride : 0.12;

  // Feedback coefficient chosen per-frequency so every note rings for
  // roughly the same wall-clock time regardless of pitch (Karplus-Strong
  // decay time is otherwise proportional to period length). When holdSec is
  // given, the note is gated to that length instead of ringing out.
  const feedbackAmount = Math.exp(Math.log(0.001) * period / STRING_DECAY_TARGET_S);
  const tail = envelope
    ? envelope[envelope.length - 1][0]
    : holdSec !== null ? holdSec + release : STRING_DECAY_TARGET_S + 0.3;

  // Excitation: a short, tapered noise burst — the "pluck".
  const burstDuration = Math.min(period * 3, 0.015);
  const noiseBuffer = ctx.createBuffer(1, Math.max(1, Math.ceil(ctx.sampleRate * burstDuration)), ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const env = 1 - i / data.length;
    data[i] = (Math.random() * 2 - 1) * env;
  }
  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = noiseBuffer;

  const exciteFilter = ctx.createBiquadFilter();
  exciteFilter.type = "highpass";
  exciteFilter.frequency.value = freq * 0.5;

  // Karplus-Strong loop: delay of one period + damping filter + buzz,
  // fed back on itself to sustain a decaying string oscillation.
  const delay = ctx.createDelay(1);
  delay.delayTime.value = period;

  const loopFilter = ctx.createBiquadFilter();
  loopFilter.type = "lowpass";
  loopFilter.frequency.value = Math.min(freq * 5, 7000);
  loopFilter.Q.value = 1.2;

  const buzz = ctx.createWaveShaper();
  buzz.curve = BUZZ_CURVE;
  buzz.oversample = "2x";

  const feedbackGain = ctx.createGain();
  feedbackGain.gain.value = feedbackAmount;

  noiseSrc.connect(exciteFilter).connect(delay);
  delay.connect(loopFilter);
  loopFilter.connect(buzz);
  buzz.connect(feedbackGain);
  feedbackGain.connect(delay);

  // Output tap: quick pluck attack, then a final short fade so we can
  // cleanly tear the loop down without a click once it's inaudible.
  const outGain = ctx.createGain();
  outGain.gain.setValueAtTime(0.0001, startTime);
  outGain.gain.exponentialRampToValueAtTime(0.9, startTime + attack);
  if (envelope) {
    for (const [t, v] of envelope) outGain.gain.linearRampToValueAtTime(0.9 * v, startTime + t);
  } else if (holdSec !== null) {
    // Ease from the attack peak down to holdLevel*peak by the end of the
    // beat, then keep fading from there across the next note's full length.
    outGain.gain.linearRampToValueAtTime(0.9 * holdLevel, startTime + holdSec);
    outGain.gain.linearRampToValueAtTime(0, startTime + tail);
  } else {
    outGain.gain.setValueAtTime(0.9, Math.max(startTime + attack, startTime + tail - 0.08));
    outGain.gain.exponentialRampToValueAtTime(0.0001, startTime + tail);
  }

  delay.connect(outGain).connect(output || ctx.destination);

  noiseSrc.start(startTime);
  noiseSrc.stop(startTime + burstDuration + 0.01);

  const cleanupDelayMs = Math.max(0, startTime + tail + 0.2 - ctx.currentTime) * 1000;
  setTimeout(() => {
    [noiseSrc, exciteFilter, delay, loopFilter, buzz, feedbackGain, outGain].forEach((n) => {
      try { n.disconnect(); } catch (e) { /* already disconnected */ }
    });
  }, cleanupDelayMs);
}

// ---------- Scheduler (lookahead pattern) ----------
const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD_S = 0.15;

let schedulerTimer = null;
let isPlaying = false;
let events = [];
let displayTokens = [];
let eventDisplayIndex = []; // index into displayTokens for each event (for highlighting)
let nextEventPos = 0;
let nextNoteTime = 0;
let highlightQueue = []; // {domIndex, time, duration}
let rafHandle = null;
let currentSaFreq = 261.63;

function buildEventDisplayIndex() {
  eventDisplayIndex = [];
  let eIdx = 0;
  displayTokens.forEach((tok, i) => {
    if (tok.type === "note" || tok.type === "rest") {
      eventDisplayIndex[eIdx] = i;
      eIdx++;
    }
  });
}

function scheduler() {
  const ctx = audioCtx;
  // If the context was suspended and has just resumed, its clock jumped
  // forward while nextNoteTime stood still. Re-anchor rather than dump the
  // whole backlog of now-overdue notes at once.
  if (nextNoteTime < ctx.currentTime) nextNoteTime = ctx.currentTime + 0.1;
  while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD_S) {
    if (nextEventPos >= events.length) {
      if (loopToggle.checked && events.length > 0) {
        nextEventPos = 0;
      } else {
        stopPlayback();
        return;
      }
    }
    const ev = events[nextEventPos];
    const beatDur = 60 / Number(tempoInput.value);
    const duration = ev.beats * beatDur;

    if (ev.type === "note") {
      const freq = freqFor(currentSaFreq, ev);
      playNote(freq, nextNoteTime, duration);
    }
    highlightQueue.push({
      domIndex: eventDisplayIndex[nextEventPos],
      time: nextNoteTime,
      endTime: nextNoteTime + duration,
    });

    nextNoteTime += duration;
    nextEventPos++;
  }
  schedulerTimer = setTimeout(scheduler, LOOKAHEAD_MS);
}

function highlightLoop() {
  const ctx = audioCtx;
  const now = ctx.currentTime;

  while (highlightQueue.length && highlightQueue[0].endTime < now) {
    highlightQueue.shift();
  }
  document.querySelectorAll(".note-block.active").forEach((el) => el.classList.remove("active"));
  const current = highlightQueue.find((h) => h.time <= now && now < h.endTime);
  if (current) {
    const el = noteDisplay.querySelector(`[data-index="${current.domIndex}"]`);
    if (el) el.classList.add("active");
  }
  if (isPlaying) rafHandle = requestAnimationFrame(highlightLoop);
}

function startPlayback() {
  if (samplesLoading) return;
  const parsed = parseSargam(sargamInput.value);
  if (parsed.errors.length) {
    statusLine.textContent = "Ignored: " + parsed.errors.join("; ");
    statusLine.classList.remove("ok");
  } else {
    statusLine.textContent = "Playing…";
    statusLine.classList.add("ok");
  }
  if (parsed.events.length === 0) {
    statusLine.textContent = "Nothing to play — enter some swaras.";
    statusLine.classList.remove("ok");
    return;
  }

  events = parsed.events;
  displayTokens = parsed.displayTokens;
  buildEventDisplayIndex();
  renderNotes(displayTokens, currentSaFreq);

  currentSaFreq = Number(saSelect.value);
  ensureAudioCtx();
  if (audioCtx.state === "suspended") audioCtx.resume();

  nextEventPos = 0;
  nextNoteTime = audioCtx.currentTime + 0.1;
  highlightQueue = [];
  isPlaying = true;

  playBtn.disabled = true;
  stopBtn.disabled = false;
  sargamInput.disabled = true;

  scheduler();
  rafHandle = requestAnimationFrame(highlightLoop);
}

function stopPlayback() {
  isPlaying = false;
  clearTimeout(schedulerTimer);
  cancelAnimationFrame(rafHandle);
  document.querySelectorAll(".note-block.active").forEach((el) => el.classList.remove("active"));
  playBtn.disabled = false;
  stopBtn.disabled = true;
  sargamInput.disabled = false;
  if (statusLine.textContent === "Playing…") statusLine.textContent = "Stopped.";
}

// ---------- Live preview render (before playing) ----------
function updatePreview() {
  const parsed = parseSargam(sargamInput.value);
  displayTokens = parsed.displayTokens;
  renderNotes(displayTokens, Number(saSelect.value));
  if (parsed.errors.length) {
    statusLine.textContent = "Ignored: " + parsed.errors.join("; ");
    statusLine.classList.remove("ok");
  } else {
    statusLine.textContent = "";
  }
}

// ---------- Instrument loading ----------
let samplesLoading = false;

async function switchInstrument(inst) {
  currentInstrument = inst;
  samplesLoading = true;
  playBtn.disabled = true;
  statusLine.textContent = `Loading ${INSTRUMENTS[inst].label.toLowerCase()} samples…`;
  statusLine.classList.remove("ok");

  const ok = await loadInstrumentSamples(inst);

  samplesLoading = false;
  playBtn.disabled = false;
  statusLine.textContent = ok
    ? ""
    : `Couldn't load ${INSTRUMENTS[inst].label.toLowerCase()} samples — using synthesized fallback.`;
}

// ---------- Saved lehras (localStorage) ----------
const SAVED_LEHRAS_KEY = "lehra.savedLehras";

function loadSavedLehras() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_LEHRAS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function persistSavedLehras(list) {
  localStorage.setItem(SAVED_LEHRAS_KEY, JSON.stringify(list));
}

function refreshSavedSelect(selectName) {
  const list = loadSavedLehras();
  savedSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "— none —";
  savedSelect.appendChild(placeholder);
  list.forEach((entry) => {
    const opt = document.createElement("option");
    opt.value = entry.name;
    opt.textContent = entry.name;
    savedSelect.appendChild(opt);
  });
  if (selectName) savedSelect.value = selectName;
  deleteLehraBtn.disabled = !savedSelect.value;
}

function saveLehra() {
  const name = window.prompt("Name for this Lehra:", savedSelect.value || "");
  if (!name) return;
  const list = loadSavedLehras();
  const entry = {
    name,
    sargam: sargamInput.value,
    sa: saSelect.value,
    tempo: tempoInput.value,
    instrument: instrumentSelect.value,
    loop: loopToggle.checked,
  };
  const idx = list.findIndex((l) => l.name === name);
  if (idx >= 0) list[idx] = entry; else list.push(entry);
  persistSavedLehras(list);
  refreshSavedSelect(name);
}

async function loadLehra(name) {
  const entry = loadSavedLehras().find((l) => l.name === name);
  if (!entry) return;
  if (isPlaying) stopPlayback();
  sargamInput.value = entry.sargam;
  saSelect.value = entry.sa;
  tempoInput.value = entry.tempo;
  loopToggle.checked = entry.loop;
  if (entry.instrument && entry.instrument !== currentInstrument) {
    instrumentSelect.value = entry.instrument;
    await switchInstrument(entry.instrument);
  }
  updatePreview();
}

function deleteLehra() {
  const name = savedSelect.value;
  if (!name) return;
  if (!window.confirm(`Delete saved Lehra "${name}"?`)) return;
  persistSavedLehras(loadSavedLehras().filter((l) => l.name !== name));
  refreshSavedSelect("");
}

// ---------- Tanpura drone ----------
// A single sustained drone recording per pitch class (samples/drone/<name>.m4a),
// tuned to whatever Sa is currently selected and looped back-to-back with a
// razor-thin crossfade at the splice point so the loop has no click.
const DRONE_LOOP_OVERLAP_S = 0.0002;

// saSelect option labels use sharps; drone filenames use flats (matches NOTE_NAMES).
const SHARP_TO_DRONE_NAME = {
  "C": "C", "C#": "Db", "D": "D", "D#": "Eb", "E": "E", "F": "F",
  "F#": "Gb", "G": "G", "G#": "Ab", "A": "A", "A#": "Bb", "B": "B",
};

// Drone recordings have several seconds of near-silence at the head/tail
// (room tone before/after the note rings). Looping the raw file length would
// splice in that silence as an audible gap, so we scan each buffer once for
// where the actual tone starts/ends and only loop that trimmed span.
const DRONE_SILENCE_THRESHOLD_DB = -50;

function findLoopBounds(buffer) {
  const threshold = Math.pow(10, DRONE_SILENCE_THRESHOLD_DB / 20);
  const channels = [];
  for (let c = 0; c < buffer.numberOfChannels; c++) channels.push(buffer.getChannelData(c));
  const length = buffer.length;
  const isLoudAt = (i) => channels.some((data) => Math.abs(data[i]) > threshold);

  let start = 0;
  while (start < length && !isLoudAt(start)) start++;

  let end = length - 1;
  while (end > start && !isLoudAt(end)) end--;

  if (start >= end) return { start: 0, end: buffer.duration }; // no signal detected — fall back to full buffer

  return { start: start / buffer.sampleRate, end: (end + 1) / buffer.sampleRate };
}

const droneSampleCache = new Map(); // name -> { buffer, bounds }

async function loadDroneSample(name) {
  if (droneSampleCache.has(name)) return droneSampleCache.get(name);
  const ctx = ensureAudioCtx();
  try {
    const res = await fetch(`samples/drone/${name}.m4a`);
    if (!res.ok) throw new Error("not found");
    const buffer = await ctx.decodeAudioData(await res.arrayBuffer());
    normalizeBuffer(buffer);
    const entry = { buffer, bounds: findLoopBounds(buffer) };
    droneSampleCache.set(name, entry);
    return entry;
  } catch (e) {
    return null;
  }
}

function currentDroneName() {
  const label = saSelect.options[saSelect.selectedIndex]?.text || "C";
  return SHARP_TO_DRONE_NAME[label] || label;
}

let droneActive = false;
let droneTimer = null;
let droneBus = null;
let droneGate = null; // final gain before destination; snapped shut on stop
let droneSample = null; // { buffer, bounds }
let droneNodes = []; // {src, gain, endTime} currently scheduled/playing loop iterations

// Separate volume + a synthetic hall reverb (no assets needed) so the drone
// can sit further back than the melody instrument, on its own fader.
function ensureDroneBus() {
  if (droneBus) return droneBus;
  const ctx = audioCtx;
  droneBus = ctx.createGain();
  droneBus.gain.value = Number(droneVolumeInput.value);

  // Dry + reverb both pass through a shared compressor so the overlapping
  // held tones and the reverb tail don't add up into big volume swings.
  const droneOut = ctx.createGain();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.knee.value = 18;
  comp.ratio.value = 4;
  comp.attack.value = 0.02;
  comp.release.value = 0.4;

  // The reverb tail (4.5s) keeps sounding for a while after the dry signal
  // is faded — on a sustained drone tone that tail reads almost identically
  // to the note itself continuing. This gate sits after everything and gets
  // snapped to 0 on stop so the tail is cut immediately too, not just the
  // per-note gains that feed into it.
  droneGate = ctx.createGain();
  droneGate.gain.value = 1;
  comp.connect(droneGate).connect(ctx.destination);
  droneOut.connect(comp);

  droneBus.connect(droneOut);

  const convolver = ctx.createConvolver();
  convolver.buffer = createReverbImpulse(ctx, 4.5, 1.3);
  const wetSend = ctx.createGain();
  wetSend.gain.value = 0.2;
  droneBus.connect(wetSend).connect(convolver).connect(droneOut);

  return droneBus;
}

function createReverbImpulse(ctx, duration, decay) {
  const sr = ctx.sampleRate;
  const len = Math.ceil(duration * sr);
  const buffer = ctx.createBuffer(2, len, sr);
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buffer;
}

// Schedules one loop iteration starting at `startTime`, playing only the
// trimmed (silence-free) span of the buffer, then schedules the next
// iteration `loopDur - overlap` seconds later so consecutive copies overlap
// by DRONE_LOOP_OVERLAP_S with a linear crossfade across that overlap — the
// loop point is spliced rather than cut, so there's no click and no gap.
function scheduleDroneIteration(startTime) {
  if (!droneActive || !droneSample) return;
  const ctx = audioCtx;
  const { buffer, bounds } = droneSample;
  const loopDur = bounds.end - bounds.start;
  const overlap = Math.min(DRONE_LOOP_OVERLAP_S, loopDur / 2);

  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const gain = ctx.createGain();
  src.connect(gain).connect(droneBus);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(1, startTime + overlap);
  gain.gain.setValueAtTime(1, startTime + loopDur - overlap);
  gain.gain.linearRampToValueAtTime(0, startTime + loopDur);

  src.start(startTime, bounds.start, loopDur);
  src.stop(startTime + loopDur + 0.02);

  const endTime = startTime + loopDur + 0.02;
  const node = { src, gain, endTime };
  droneNodes.push(node);
  const cleanupMs = Math.max(0, endTime + 0.05 - ctx.currentTime) * 1000;
  setTimeout(() => {
    try { src.disconnect(); gain.disconnect(); } catch (e) { /* already disconnected */ }
    droneNodes = droneNodes.filter((n) => n !== node);
  }, cleanupMs);

  const nextStart = startTime + loopDur - overlap;
  // Lookahead: schedule the next iteration's audio nodes ~0.5s before it's
  // due, same pattern as the main note scheduler.
  const delay = Math.max(0, nextStart - ctx.currentTime - 0.5) * 1000;
  droneTimer = setTimeout(() => scheduleDroneIteration(nextStart), delay);
}

// Immediately silences any currently playing/scheduled loop iterations with
// a short fade (rather than just cancelling the JS timer, which would leave
// already-started AudioBufferSourceNodes ringing out for up to a full loop).
function fadeOutActiveDroneNodes(fadeSec = 0.05) {
  const ctx = audioCtx;
  const now = ctx.currentTime;
  droneNodes.forEach(({ src, gain }) => {
    try {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + fadeSec);
      src.stop(now + fadeSec + 0.01);
    } catch (e) { /* already stopped */ }
  });
  droneNodes = [];
}

async function startDrone() {
  ensureAudioCtx();
  if (audioCtx.state === "suspended") audioCtx.resume();
  ensureDroneBus();
  droneBtn.disabled = true;
  droneBtn.textContent = "Loading drone…";
  const name = currentDroneName();
  droneSample = await loadDroneSample(name);
  droneBtn.disabled = false;
  if (!droneSample) {
    statusLine.textContent = `Couldn't load drone sample for ${name}.`;
    droneBtn.textContent = "🎻 Tanpura Drone";
    return;
  }
  droneActive = true;
  droneBtn.textContent = "⏹ Stop Drone";
  droneBtn.classList.add("active");
  const now = audioCtx.currentTime;
  droneGate.gain.cancelScheduledValues(now);
  droneGate.gain.setValueAtTime(1, now);
  scheduleDroneIteration(now + 0.05);
}

function stopDrone() {
  droneActive = false;
  clearTimeout(droneTimer);
  fadeOutActiveDroneNodes();
  const now = audioCtx.currentTime;
  droneGate.gain.cancelScheduledValues(now);
  droneGate.gain.setValueAtTime(droneGate.gain.value, now);
  droneGate.gain.linearRampToValueAtTime(0, now + 0.05);
  droneBtn.textContent = "🎻 Tanpura Drone";
  droneBtn.classList.remove("active");
}

// Re-pitches the running drone to the newly selected Sa without stopping it.
async function retuneDrone() {
  if (!droneActive) return;
  const name = currentDroneName();
  const sample = await loadDroneSample(name);
  if (!sample) return;
  clearTimeout(droneTimer);
  fadeOutActiveDroneNodes();
  droneSample = sample;
  scheduleDroneIteration(audioCtx.currentTime + 0.06);
}

// ---------- Wire up ----------
playBtn.addEventListener("click", startPlayback);
stopBtn.addEventListener("click", stopPlayback);
sargamInput.addEventListener("input", updatePreview);
saSelect.addEventListener("change", () => {
  currentSaFreq = Number(saSelect.value);
  updatePreview();
  retuneDrone();
});
instrumentSelect.addEventListener("change", () => switchInstrument(instrumentSelect.value));
droneBtn.addEventListener("click", () => (droneActive ? stopDrone() : startDrone()));
droneVolumeInput.addEventListener("input", () => {
  if (droneBus) droneBus.gain.value = Number(droneVolumeInput.value);
});
saveLehraBtn.addEventListener("click", saveLehra);
deleteLehraBtn.addEventListener("click", deleteLehra);
savedSelect.addEventListener("change", () => {
  deleteLehraBtn.disabled = !savedSelect.value;
  if (savedSelect.value) loadLehra(savedSelect.value);
});

updatePreview();
switchInstrument(currentInstrument);
refreshSavedSelect();
