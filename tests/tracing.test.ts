import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialTrace, selectTraceNode, traceChallenges, traceSheets } from '../src/tracing.ts';

test('wrong nodes and wrong sheets cannot advance a trace', () => {
  const wrongNode = selectTraceNode(initialTrace, 'LIGHT', 'light-fuse');
  const wrongSheet = selectTraceNode(initialTrace, 'COIL', 'light-lamp');
  assert.equal(wrongNode.step, 0);
  assert.equal(wrongNode.correct, false);
  assert.equal(wrongSheet.step, 0);
  assert.deepEqual(wrongNode.visited, []);
  assert.deepEqual(initialTrace.visited, []);
});

test('a complete trace follows the lamp, contact, associated coil, command, and return', () => {
  let state = initialTrace;
  const route = [
    ['LIGHT', 'light-lamp'], ['LIGHT', 'light-contact'], ['COIL', 'coil-device'],
    ['COIL', 'coil-command'], ['LIGHT', 'light-return'],
  ] as const;
  for (const [sheet, node] of route) state = selectTraceNode(state, sheet, node);
  assert.equal(state.step, 5);
  assert.equal(state.correct, true);
  assert.deepEqual(state.visited, route.map(([,node]) => node));
});

test('completed and repeated selections cannot create extra trace progress', () => {
  const first = selectTraceNode(initialTrace, 'LIGHT', 'light-lamp');
  const duplicate = selectTraceNode(first, 'LIGHT', 'light-lamp');
  assert.equal(duplicate.step, 1);
  assert.deepEqual(duplicate.visited, ['light-lamp']);
  let complete = initialTrace;
  for (const challenge of traceChallenges) complete = selectTraceNode(complete, challenge.sheet, challenge.node);
  assert.equal(selectTraceNode(complete, 'LIGHT', 'light-lamp'), complete);
});

test('fictional reference targets resolve as device associations and every challenge target exists', () => {
  const ids = traceSheets.flatMap(sheet => sheet.nodes.map(node => node.id));
  assert.equal(new Set(ids).size, ids.length);
  for (const sheet of traceSheets) for (const node of sheet.nodes) {
    if (!node.reference) continue;
    assert.equal(node.reference.relationship, 'device-association');
    const target = traceSheets.find(s => s.id === node.reference!.sheet)?.nodes.find(n => n.id === node.reference!.node);
    assert.ok(target);
    assert.equal(target.reference?.node, node.id);
  }
  for (const challenge of traceChallenges) {
    assert.ok(traceSheets.find(s => s.id === challenge.sheet)?.nodes.some(n => n.id === challenge.node));
  }
});
