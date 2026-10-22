import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialMeter, readMeter, type MeterMode, type MeterFixture } from '../src/meter.ts';

test('the source only permits voltage; current input cannot yield a reading in any function', () => {
  const modes: MeterMode[] = ['dc-volts', 'resistance', 'continuity'];
  const fixtures: MeterFixture[] = ['dc-source', 'resistor', 'link', 'open'];
  for (const mode of modes) {
    for (const fixture of fixtures) {
      assert.equal(readMeter({ ...initialMeter, mode, fixture, input: 'current' }).kind, 'blocked');
    }
    assert.equal(readMeter({ ...initialMeter, mode }).kind, mode === 'dc-volts' ? 'reading' : 'blocked');
  }
});

test('reference reversal changes DC sign without changing isolated resistance', () => {
  assert.equal(readMeter(initialMeter).display, '18.0 V');
  assert.equal(readMeter({ ...initialMeter, reversed: true }).display, '−18.0 V');
  const isolated = { ...initialMeter, fixture: 'resistor' as const, mode: 'resistance' as const };
  assert.equal(readMeter(isolated).display, '220 Ω');
  assert.equal(readMeter({ ...isolated, reversed: true }).display, '220 Ω');
});

test('open, finite resistance, and continuity threshold produce distinct results', () => {
  assert.equal(readMeter({ ...initialMeter, fixture: 'open', mode: 'resistance' }).display, 'OL');
  assert.equal(readMeter({ ...initialMeter, fixture: 'open', mode: 'continuity' }).display, 'OL · NO TONE');
  assert.equal(readMeter({ ...initialMeter, fixture: 'resistor', mode: 'continuity' }).display, '220 Ω · NO TONE');
  assert.equal(readMeter({ ...initialMeter, fixture: 'link', mode: 'continuity' }).display, '0.2 Ω · TONE');
});

test('a virtual zero voltage result does not claim field safety', () => {
  const result = readMeter({ ...initialMeter, fixture: 'resistor' });
  assert.equal(result.display, '0.0 V');
  assert.match(result.explanation, /one zero reading does not establish isolation/);
  assert.equal(initialMeter.fixture, 'dc-source');
});

test('probe placement distinguishes lifted leads, a shared reference point and reversed polarity', async () => {
  const { readMeterAtProbes } = await import('../src/meter.ts');
  assert.equal(readMeterAtProbes(initialMeter, 'A', 'B').display, '18.0 V');
  assert.equal(readMeterAtProbes(initialMeter, 'B', 'A').display, '−18.0 V');
  assert.equal(readMeterAtProbes(initialMeter, 'A', 'A').display, '0.0 V');
  assert.equal(readMeterAtProbes(initialMeter, null, 'B').display, 'LEADS');
  assert.equal(readMeterAtProbes({ ...initialMeter, mode: 'resistance' }, 'A', 'A').kind, 'blocked');
  assert.equal(readMeterAtProbes({ ...initialMeter, input: 'current' }, null, null).kind, 'blocked');
  assert.equal(readMeterAtProbes({ ...initialMeter, fixture: 'open', mode: 'resistance' }, 'A', 'A').display, '0.0 Ω');
  assert.equal(readMeterAtProbes({ ...initialMeter, fixture: 'open', mode: 'resistance' }, 'A', 'B').display, 'OL');
});
