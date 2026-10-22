// Original low-voltage teaching model. Loads are ideal; this is not a design tool.
export type BenchId = 'lamp' | 'relay' | 'holding';
export type WireColor = 'red' | 'blue' | 'black';
export type Wire = { a: string; b: string; color: WireColor };
export type Terminal = { id: string; label: string; x: number; y: number; purpose: string };
export type Hardware = { kind: 'supply' | 'switch' | 'lamp' | 'relay' | 'start' | 'stop'; x: number; y: number; label: string };
export type ControlAction = 'power-on' | 'power-off' | 'switch-on' | 'switch-off' | 'start-press' | 'start-release' | 'stop-press' | 'stop-release';
export type Bench = { id: BenchId; title: string; brief: string; learn: string; terminals: Terminal[]; hardware: Hardware[]; connections: [string, string][]; steps: { action: ControlAction; label: string; on: boolean }[] };
const supply: Terminal[] = [
  { id: 'P', label: 'PS +24', x: 60, y: 200, purpose: 'Positive output of the ideal 24 V DC supply.' },
  { id: 'N', label: 'PS 0V', x: 128, y: 200, purpose: 'DC circuit return. This terminal is not protective earth.' },
];
const switchPorts: Terminal[] = [
  { id: 'S1', label: 'S1 13', x: 242, y: 200, purpose: 'First terminal of the maintained normally open switch.' },
  { id: 'S2', label: 'S1 14', x: 316, y: 200, purpose: 'Second switch terminal. The switch joins 13 and 14 when ON.' },
];
function lampPorts(left: boolean): Terminal[] {
  return [
    { id: 'L+', label: 'H1 +', x: left ? 60 : 242, y: 465, purpose: 'Positive terminal of the polarized 24 V indicator.' },
    { id: 'L-', label: 'H1 −', x: left ? 128 : 316, y: 465, purpose: 'Negative terminal of the indicator; it needs a return path.' },
  ];
}
const relayPorts: Terminal[] = [
  { id: 'A1', label: 'K1 A1+', x: 242, y: 360, purpose: 'Positive terminal of the DC relay coil. The coil operates the separate contact below.' },
  { id: 'A2', label: 'K1 A2−', x: 316, y: 360, purpose: 'Coil return terminal. It is not internally connected to contact 13 or 14.' },
  { id: 'K13', label: 'K1 13', x: 242, y: 475, purpose: 'First terminal of K1’s normally open contact. Electrically separate from the coil.' },
  { id: 'K14', label: 'K1 14', x: 316, y: 475, purpose: 'Second contact terminal. K1 joins 13 and 14 only while its coil is energized.' },
];
const ps: Hardware = { kind: 'supply', x: 28, y: 60, label: 'PS / 24 V DC' };
const relay: Hardware = { kind: 'relay', x: 210, y: 294, label: 'K1 / DC RELAY' };
export const wiringBenches: Bench[] = [
  {
    id: 'lamp', title: 'Switch a pilot light',
    brief: 'Build a complete supply → switch → indicator → return circuit. Then prove that the switch controls the light.',
    learn: 'The switch interrupts one path; the lamp is the load. A wire directly between +24 and 0V bypasses the load and creates a short. Wire colors here are visual labels, not a voltage or safety test.',
    terminals: [...supply, ...switchPorts, ...lampPorts(false)],
    hardware: [ps, { kind: 'switch', x: 210, y: 60, label: 'S1 / SELECTOR' }, { kind: 'lamp', x: 210, y: 310, label: 'H1 / INDICATOR' }],
    connections: [['P', 'S1'], ['S2', 'L+'], ['L-', 'N']],
    steps: [{ action: 'power-on', label: 'Turn bench power on: lamp stays off', on: false }, { action: 'switch-on', label: 'Switch S1 on: lamp lights', on: true }, { action: 'switch-off', label: 'Switch S1 off: lamp goes dark', on: false }],
  },
  {
    id: 'relay', title: 'Let the relay do the switching',
    brief: 'Wire S1 to the relay coil. Use K1’s separate normally open contact to switch H1. The command and load paths share this supply, but the coil and contact have no internal conductor connection.',
    learn: 'A1/A2 energize the coil. Terminals 13/14 belong to a separate contact. The mechanical link moves that contact; it does not carry current from the coil to the lamp. Feed 13 from +24 and give both loads their own return.',
    terminals: [...supply, ...switchPorts, ...lampPorts(true), ...relayPorts],
    hardware: [ps, { kind: 'switch', x: 210, y: 60, label: 'S1 / SELECTOR' }, { kind: 'lamp', x: 28, y: 310, label: 'H1 / INDICATOR' }, relay],
    connections: [['P', 'S1'], ['S2', 'A1'], ['A2', 'N'], ['P', 'K13'], ['K14', 'L+'], ['L-', 'N']],
    steps: [{ action: 'power-on', label: 'Turn power on: relay and lamp stay off', on: false }, { action: 'switch-on', label: 'Switch S1 on: relay pulls in and lamp lights', on: true }, { action: 'switch-off', label: 'Switch S1 off: relay and lamp drop out', on: false }],
  },
  {
    id: 'holding', title: 'Build a holding circuit',
    brief: 'Wire a normally closed STOP in series with a START / K1 holding-contact branch. Make the coil hold after START is released, drop on STOP, and stay off when power returns.',
    learn: 'STOP 11/12 is closed at rest. START 13/14 is open at rest. K1’s 13/14 contact goes in parallel with START, downstream of STOP. If it bypasses STOP, the stop command loses control. This relay exercise omits motor power, overload protection and safety-rated functions.',
    terminals: [...supply,
      { id: 'T1', label: 'STOP 11', x: 242, y: 200, purpose: 'Input of the normally closed STOP contact.' },
      { id: 'T2', label: 'STOP 12', x: 316, y: 200, purpose: 'STOP output: feeds both START and the holding contact.' },
      { id: 'B1', label: 'START 13', x: 60, y: 465, purpose: 'First terminal of the momentary normally open START contact.' },
      { id: 'B2', label: 'START 14', x: 128, y: 465, purpose: 'START output: feeds A1 and the output of the holding branch.' }, ...relayPorts],
    hardware: [ps, { kind: 'stop', x: 210, y: 60, label: 'STOP / NC' }, { kind: 'start', x: 28, y: 310, label: 'START / NO' }, relay],
    connections: [['P', 'T1'], ['T2', 'B1'], ['B2', 'A1'], ['A2', 'N'], ['T2', 'K13'], ['K14', 'A1']],
    steps: [
      { action: 'power-on', label: 'Turn power on: coil remains off', on: false },
      { action: 'start-press', label: 'Press START: coil pulls in', on: true },
      { action: 'start-release', label: 'Release START: coil holds', on: true },
      { action: 'stop-press', label: 'Press STOP: coil drops out', on: false },
      { action: 'stop-release', label: 'Release STOP: no restart', on: false },
      { action: 'start-press', label: 'Press START again: coil pulls in', on: true },
      { action: 'start-release', label: 'Release START again: coil holds', on: true },
      { action: 'power-off', label: 'Turn power off: coil drops out', on: false },
      { action: 'power-on', label: 'Restore power: no automatic restart', on: false },
    ],
  },
];
export const WIRING_KEY = 'ell.wiring.v1';
export type WiringState = { wires: Wire[]; selected: string | null; color: WireColor; powered: boolean; switchOn: boolean; start: boolean; stop: boolean; coil: boolean; step: number; passed: boolean; feedback: string };
export const newWiring = (): WiringState => ({ wires: [], selected: null, color: 'red', powered: false, switchOn: false, start: false, stop: false, coil: false, step: 0, passed: false, feedback: 'Tap a screw terminal, then its destination to fit a wire. Power is off while you build.' });
const label = (bench: Bench, id: string) => bench.terminals.find(t => t.id === id)?.label ?? id;
function connected(pairs: [string, string][], a: string, b: string): boolean {
  const seen = new Set([a]); const queue = [a];
  for (let i = 0; i < queue.length; i++) for (const [x, y] of pairs) {
    const next = x === queue[i] ? y : y === queue[i] ? x : null;
    if (next !== null && !seen.has(next)) { seen.add(next); queue.push(next); }
  }
  return seen.has(b);
}
const wirePairs = (wires: Wire[]): [string, string][] => wires.map(w => [w.a, w.b]);
export function wiringDiagnosis(bench: Bench, wires: Wire[]): { correct: boolean; message: string; hint: string } {
  const actual = wirePairs(wires);
  for (const wire of wires) if (!connected(bench.connections, wire.a, wire.b)) {
    const bypass = bench.id === 'holding' && [wire.a, wire.b].includes('P') && [wire.a, wire.b].some(t => ['T2', 'B1', 'B2', 'K13', 'K14', 'A1'].includes(t));
    return { correct: false, message: `${label(bench, wire.a)} → ${label(bench, wire.b)} joins two different intended circuit nodes.${bypass ? ' This bypasses a control contact, so STOP or START may lose control.' : ' Remove this wire and check which device should sit between those nodes.'}`, hint: [wire.a, wire.b].includes('P') && [wire.a, wire.b].includes('N')
      ? 'Remove the PS +24 → PS 0V bridge. The supply needs a path through a load; a wire across its two outputs bypasses every load.'
      : bypass ? 'Remove this bypass. Feed STOP 11 from PS +24; take both START 13 and K1 13 from STOP 12. STOP must remain in series with both branches.'
      : [wire.a, wire.b].some(t => ['A1', 'A2'].includes(t)) && [wire.a, wire.b].some(t => ['K13', 'K14'].includes(t))
        ? `Remove ${label(bench, wire.a)} → ${label(bench, wire.b)}. K1’s coil operates its contact mechanically. Wire A1/A2 as the coil path and 13/14 as the separate switched path.`
        : `Remove ${label(bench, wire.a)} → ${label(bench, wire.b)}. The plan keeps these on separate nodes. Start with ${label(bench, bench.connections.find(pair => pair.includes(wire.a))![0])} → ${label(bench, bench.connections.find(pair => pair.includes(wire.a))![1])}, then follow the next device.` };
  }
  const missing = bench.connections.find(([a, b]) => !connected(actual, a, b));
  if (missing) return { correct: false, message: `The path between ${label(bench, missing[0])} and ${label(bench, missing[1])} is still open.`, hint: `With bench power off, connect ${label(bench, missing[0])} to ${label(bench, missing[1])}. Electrically equivalent branch connections also work.` };
  return { correct: true, message: 'The connections match the circuit plan. Now prove the behavior with the test sequence.', hint: bench.id === 'holding' ? 'Watch K1 after releasing START, then after releasing STOP. A holding path should remember START, never defeat STOP.' : 'Watch the load when S1 changes. A complete return matters as much as the positive feed.' };
}
export type CircuitResult = { coil: boolean; lamp: boolean; fault: string | null; potential: Record<string, 'positive' | 'return' | 'floating'> };
export function simulateWiring(bench: Bench, state: WiringState): CircuitResult {
  const result: CircuitResult = { coil: false, lamp: false, fault: null, potential: {} };
  if (!state.powered) return result;
  let coil = state.coil;
  const seen = new Set<boolean>();
  for (let i = 0; i < 4; i++) {
    const pairs = wirePairs(state.wires);
    if (state.switchOn && bench.id !== 'holding') pairs.push(['S1', 'S2']);
    if (bench.id === 'holding') {
      if (!state.stop) pairs.push(['T1', 'T2']);
      if (state.start) pairs.push(['B1', 'B2']);
    }
    if (coil) pairs.push(['K13', 'K14']);
    if (connected(pairs, 'P', 'N')) return { ...result, fault: 'A conductive path joins PS +24 directly to PS 0V without a load. The virtual current limit cut bench power. Look for a bridge or a contact that closes across the supply.' };
    const across = (a: string, b: string) => connected(pairs, 'P', a) && connected(pairs, 'N', b);
    const next = bench.id !== 'lamp' && across('A1', 'A2');
    if (next !== coil) {
      if (seen.has(next)) return { ...result, fault: 'This connection produces an unstable relay state in the ideal model. Bench power was cut. Recheck the coil and holding-contact paths.' };
      seen.add(coil); coil = next; continue;
    }
    result.coil = coil;
    result.lamp = bench.id !== 'holding' && across('L+', 'L-');
    for (const terminal of bench.terminals) result.potential[terminal.id] = connected(pairs, 'P', terminal.id) ? 'positive' : connected(pairs, 'N', terminal.id) ? 'return' : 'floating';
    return result;
  }
  return { ...result, fault: 'The ideal relay model could not settle. Bench power was cut; check the contact and coil connections.' };
}
export type WiringAction = { type: 'terminal'; id: string } | { type: 'color'; color: WireColor } | { type: 'remove'; index: number } | { [K in 'undo' | 'clear' | 'check' | 'hint' | 'cancel']: { type: K } }['undo' | 'clear' | 'check' | 'hint' | 'cancel'] | { type: 'control'; action: ControlAction };
export function wiringReducer(bench: Bench, state: WiringState, action: WiringAction): WiringState {
  if (action.type === 'color') return { ...state, color: action.color };
  if (action.type === 'cancel') return { ...state, selected: null };
  if (action.type === 'hint' || action.type === 'check') {
    const diagnosis = wiringDiagnosis(bench, state.wires);
    return { ...state, feedback: action.type === 'hint' ? diagnosis.hint : diagnosis.message };
  }
  if (action.type === 'control') {
    let next = { ...state, selected: null };
    switch (action.action) {
      case 'power-on': if (state.powered) return state; next.powered = true; break;
      case 'power-off': if (!state.powered) return state; next.powered = false; next.coil = false; next.switchOn = false; next.start = false; next.stop = false; break;
      case 'switch-on': if (!state.powered || state.switchOn) return state; next.switchOn = true; break;
      case 'switch-off': if (!state.powered || !state.switchOn) return state; next.switchOn = false; break;
      case 'start-press': if (!state.powered || state.start) return state; next.start = true; break;
      case 'start-release': if (!state.powered || !state.start) return state; next.start = false; break;
      case 'stop-press': if (!state.powered || state.stop) return state; next.stop = true; break;
      case 'stop-release': if (!state.powered || !state.stop) return state; next.stop = false; break;
    }
    const result = simulateWiring(bench, next);
    if (result.fault) return { ...next, powered: false, coil: false, switchOn: false, start: false, stop: false, step: 0, feedback: result.fault };
    next.coil = result.coil;
    const diagnosis = wiringDiagnosis(bench, next.wires);
    const expected = bench.steps[state.step];
    const output = bench.id === 'holding' ? result.coil : result.lamp;
    const relayAgrees = bench.id !== 'relay' || result.coil === output;
    if (diagnosis.correct && expected?.action === action.action && expected.on === output && relayAgrees) {
      next.step++;
      next.passed = next.passed || next.step === bench.steps.length;
      next.feedback = next.step === bench.steps.length ? 'Circuit proved! You checked the connections and demonstrated every required state. Replay or try another build.' : `Test ${next.step} passed. ${bench.steps[next.step].label}.`;
    } else {
      next.feedback = !diagnosis.correct ? `${diagnosis.message} Switch power off to edit.` : `${bench.id === 'holding' ? 'Coil' : 'Lamp'} ${output ? 'ON' : 'OFF'}. ${expected ? `Next test: ${expected.label}.` : 'The test sequence is complete.'}`;
    }
    return next;
  }
  if (state.powered) return { ...state, feedback: 'Switch bench power off before changing any wire. This edit lock only controls the app.' };
  if (action.type === 'clear') return { ...newWiring(), passed: state.passed, feedback: 'Wires cleared. Your completed-build badge is kept. Build and test again.' };
  if (action.type === 'undo' || action.type === 'remove') {
    const index = action.type === 'undo' ? state.wires.length - 1 : action.index;
    const removed = state.wires[index];
    if (!removed) return state;
    return { ...state, wires: state.wires.filter((_, i) => i !== index), selected: null, step: 0, feedback: `Removed ${label(bench, removed.a)} → ${label(bench, removed.b)}. Test sequence reset for the changed circuit.` };
  }
  if (!bench.terminals.some(t => t.id === action.id)) return state;
  if (!state.selected) return { ...state, selected: action.id, feedback: `${label(bench, action.id)} selected. ${bench.terminals.find(t => t.id === action.id)!.purpose} Now tap the other end.` };
  if (state.selected === action.id) return { ...state, selected: null, feedback: 'Connection cancelled. Pick a different pair of terminals.' };
  if (state.wires.some(w => [w.a, w.b].includes(state.selected!) && [w.a, w.b].includes(action.id))) return { ...state, selected: null, feedback: 'Those terminals already have a wire. Use the wire list to remove it.' };
  if ([state.selected, action.id].some(id => state.wires.filter(w => w.a === id || w.b === id).length >= 3)) return { ...state, selected: null, feedback: 'This bench allows three virtual leads at one terminal. Remove a lead before adding another. Actual terminal capacity depends on its manufacturer.' };
  return { ...state, selected: null, step: 0, wires: [...state.wires, { a: state.selected, b: action.id, color: state.color }], feedback: `Wire fitted: ${label(bench, state.selected)} → ${label(bench, action.id)}. Use Check wiring or ask Click for a connection-specific hint.` };
}
export type WiringBook = Record<BenchId, WiringState>;
export const newWiringBook = (): WiringBook => ({ lamp: newWiring(), relay: newWiring(), holding: newWiring() });
export function restoreWiringBook(raw: string | null): WiringBook | null {
  if (raw === null) return newWiringBook();
  try {
    const data = JSON.parse(raw); if (data?.version !== 1 || !data.boards) return null;
    const book = newWiringBook();
    for (const bench of wiringBenches) {
      const saved = data.boards[bench.id];
      if (!saved || typeof saved.passed !== 'boolean' || !Array.isArray(saved.wires) || saved.wires.length > 20) return null;
      const pairs = new Set<string>(); const count: Record<string, number> = {};
      for (const wire of saved.wires) {
        if (!wire || !bench.terminals.some(t => t.id === wire.a) || !bench.terminals.some(t => t.id === wire.b) || wire.a === wire.b || !['red', 'blue', 'black'].includes(wire.color)) return null;
        const key = [wire.a, wire.b].sort().join(':'); if (pairs.has(key)) return null; pairs.add(key);
        for (const id of [wire.a, wire.b]) { count[id] = (count[id] ?? 0) + 1; if (count[id] > 3) return null; }
      }
      book[bench.id] = { ...newWiring(), wires: saved.wires, passed: saved.passed, feedback: 'Your wiring is restored with bench power OFF. Run the test sequence again when ready.' };
    }
    return book;
  } catch { return null; }
}
export function serializeWiringBook(book: WiringBook): string {
  return JSON.stringify({ version: 1, boards: Object.fromEntries(wiringBenches.map(b => [b.id, { wires: book[b.id].wires, passed: book[b.id].passed }])) });
}
