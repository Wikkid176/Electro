import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newWiring, newWiringBook, restoreWiringBook, serializeWiringBook, simulateWiring, wiringBenches, wiringDiagnosis, wiringReducer, type Bench, type ControlAction, type Wire, type WiringState } from '../src/wiring.ts';
const [lamp, relay, holding] = wiringBenches;
const wired = (bench: Bench): WiringState => ({ ...newWiring(), wires: bench.connections.map(([a, b]) => ({ a, b, color: 'red' })) });
const act = (bench: Bench, state: WiringState, action: ControlAction) => wiringReducer(bench, state, { type: 'control', action });
const wire = (a: string, b: string): Wire => ({ a, b, color: 'blue' });

test('all three builds pass only after their complete functional sequence', () => {
  for (const bench of wiringBenches) {
    let state = wired(bench);
    for (let i = 0; i < bench.steps.length; i++) {
      assert.equal(state.passed, false);
      state = act(bench, state, bench.steps[i].action);
      assert.equal(state.step, i + 1, `${bench.id}: step ${i}`);
      const output = simulateWiring(bench, state);
      assert.equal(bench.id === 'holding' ? output.coil : output.lamp, bench.steps[i].on);
      assert.equal(output.fault, null);
    }
    assert.equal(state.passed, true);
  }
});

test('a missing return prevents load operation and names the open connection', () => {
  let state = { ...wired(lamp), wires: wired(lamp).wires.slice(0, -1) };
  state = act(lamp, state, 'power-on'); state = act(lamp, state, 'switch-on');
  assert.equal(simulateWiring(lamp, state).lamp, false);
  assert.equal(state.step, 0);
  assert.match(wiringDiagnosis(lamp, state.wires).message, /H1 −.*PS 0V/);
});

test('supply shorts trip immediately, including shorts made by a closing contact', () => {
  let state = act(lamp, { ...newWiring(), wires: [wire('P', 'N')] }, 'power-on');
  assert.equal(state.powered, false); assert.match(state.feedback, /without a load/);
  state = { ...newWiring(), wires: [wire('P', 'S1'), wire('S2', 'N')] };
  state = act(lamp, state, 'power-on'); assert.equal(state.powered, true);
  state = act(lamp, state, 'switch-on');
  assert.equal(state.powered, false); assert.equal(state.switchOn, false); assert.equal(state.step, 0);
});

test('relay coil and contacts are electrically separate; lamp is not fed by a coil reference', () => {
  let state = wired(relay); state.wires = state.wires.filter(w => !(w.a === 'P' && w.b === 'K13'));
  state = act(relay, state, 'power-on'); state = act(relay, state, 'switch-on');
  const output = simulateWiring(relay, state);
  assert.equal(output.coil, true); assert.equal(output.lamp, false); assert.equal(state.passed, false);
});

test('a powered lamp with a bypassed switch cannot pass the connection or behavior checks', () => {
  let state = { ...newWiring(), wires: [wire('P', 'L+'), wire('L-', 'N')] };
  state = act(lamp, state, 'power-on');
  assert.equal(simulateWiring(lamp, state).lamp, true); assert.equal(state.step, 0); assert.equal(state.passed, false);
  assert.equal(wiringDiagnosis(lamp, state.wires).correct, false);
});

test('holding branch remembers START but drops on STOP and power loss', () => {
  let state = act(holding, wired(holding), 'power-on');
  state = act(holding, state, 'start-press'); state = act(holding, state, 'start-release'); assert.equal(state.coil, true);
  state = act(holding, state, 'stop-press'); assert.equal(state.coil, false);
  state = act(holding, state, 'stop-release'); assert.equal(state.coil, false);
  state = act(holding, state, 'start-press'); state = act(holding, state, 'start-release');
  state = act(holding, state, 'power-off'); state = act(holding, state, 'power-on');
  assert.equal(state.coil, false); assert.equal(state.start, false); assert.equal(state.stop, false);
});

test('an actual STOP bypass can keep the coil on, but coach identifies it and build never passes', () => {
  let state = wired(holding); state.wires.push(wire('P', 'T2'));
  state = act(holding, state, 'power-on'); state = act(holding, state, 'start-press'); state = act(holding, state, 'start-release'); state = act(holding, state, 'stop-press');
  assert.equal(state.coil, true); assert.equal(state.step, 0); assert.match(state.feedback, /bypasses a control contact/);
});

test('equivalent branching is accepted, floating nodes stay distinct and colors have no electrical effect', () => {
  let state = wired(relay);
  state.wires = state.wires.map(w => w.a === 'P' && w.b === 'K13' ? wire('S1', 'K13') : { ...w, color: 'black' });
  assert.equal(wiringDiagnosis(relay, state.wires).correct, true);
  state = act(relay, state, 'power-on'); assert.equal(simulateWiring(relay, state).potential['L+'], 'floating');
  state = act(relay, state, 'switch-on'); assert.equal(simulateWiring(relay, state).lamp, true);
});

test('wire tools reject duplicate/self/unknown terminals and lock edits while powered', () => {
  let state = newWiring();
  state = wiringReducer(lamp, state, { type: 'terminal', id: 'P' }); state = wiringReducer(lamp, state, { type: 'terminal', id: 'P' }); assert.equal(state.wires.length, 0);
  state = wiringReducer(lamp, state, { type: 'terminal', id: 'unknown' }); assert.equal(state.selected, null);
  state = wired(lamp); state = wiringReducer(lamp, state, { type: 'terminal', id: 'S1' }); state = wiringReducer(lamp, state, { type: 'terminal', id: 'P' }); assert.equal(state.wires.length, 3);
  state = act(lamp, state, 'power-on');
  for (const action of [{ type: 'clear' }, { type: 'undo' }, { type: 'remove', index: 0 }, { type: 'terminal', id: 'P' }] as const) {
    const next = wiringReducer(lamp, state, action); assert.deepEqual(next.wires, state.wires); assert.equal(next.powered, true);
  }
  state = act(lamp, state, 'power-off'); state = wiringReducer(lamp, state, { type: 'undo' }); assert.equal(state.wires.length, 2); assert.equal(state.step, 0);
});

test('test steps require actual state transitions, not repeated clicks or incomplete wiring', () => {
  let state = act(lamp, wired(lamp), 'power-on'); assert.equal(state.step, 1);
  state = act(lamp, state, 'power-on'); assert.equal(state.step, 1);
  state = act(lamp, state, 'switch-off'); assert.equal(state.step, 1);
  state = act(lamp, state, 'switch-on'); state = act(lamp, state, 'switch-on'); assert.equal(state.step, 2);
  let wrong = act(holding, { ...newWiring(), wires: [wire('P', 'A1'), wire('N', 'A2')] }, 'power-on');
  wrong = act(holding, wrong, 'start-press'); assert.equal(wrong.coil, true); assert.equal(wrong.step, 0);
});

test('saved builds preserve wires and badges, never restore power, held buttons or test position', () => {
  const book = newWiringBook(); book.holding = wired(holding);
  for (const step of holding.steps) book.holding = act(holding, book.holding, step.action);
  assert.equal(book.holding.powered, true); assert.equal(book.holding.passed, true);
  const restored = restoreWiringBook(serializeWiringBook(book))!;
  assert.deepEqual(restored.holding.wires, book.holding.wires); assert.equal(restored.holding.passed, true);
  assert.equal(restored.holding.powered, false); assert.equal(restored.holding.coil, false); assert.equal(restored.holding.step, 0);
  assert.equal(restored.holding.start, false); assert.equal(restored.holding.stop, false);
  assert.notEqual(restoreWiringBook(null), null);
});

test('corrupt saved builds fail closed without importing arbitrary terminals or unbounded leads', () => {
  assert.equal(restoreWiringBook('{'), null);
  const book = newWiringBook(); book.lamp.wires = [wire('P', 'unknown')]; assert.equal(restoreWiringBook(serializeWiringBook(book)), null);
  book.lamp.wires = [wire('P', 'N'), wire('N', 'P')]; assert.equal(restoreWiringBook(serializeWiringBook(book)), null);
  book.lamp.wires = [wire('P', 'S1'), wire('P', 'S2'), wire('P', 'L+'), wire('P', 'L-')]; assert.equal(restoreWiringBook(serializeWiringBook(book)), null);
});
