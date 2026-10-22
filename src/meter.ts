export type MeterMode = 'dc-volts' | 'resistance' | 'continuity';
export type MeterFixture = 'dc-source' | 'resistor' | 'link' | 'open';
export type MeterInput = 'voltage-resistance' | 'current';
export type MeterState = { mode: MeterMode; fixture: MeterFixture; input: MeterInput; reversed: boolean };
export type MeterReading = { kind: 'reading' | 'blocked'; display: string; explanation: string };
export const initialMeter: MeterState = { mode: 'dc-volts', fixture: 'dc-source', input: 'voltage-resistance', reversed: false };

// A fictional two-terminal fixture model, not a physical meter or safety system.
// The only energized fixture is the ideal DC source. Other fixtures are defined
// as already isolated, with no external or stored energy and no parallel paths.
export function readMeter(state: MeterState): MeterReading {
  if (state.input === 'current') {
    return { kind: 'blocked', display: 'INPUT', explanation: 'These simulated functions require the V/Ω input, not the current input. A real current input across a voltage source can create a dangerous short circuit. Direct current measurement is not simulated here.' };
  }
  if (state.fixture === 'dc-source' && state.mode !== 'dc-volts') {
    return { kind: 'blocked', display: 'STOP', explanation: 'This fixture is energized. Resistance and continuity functions are blocked. Real resistance testing requires the approved de-energized condition, including stored-energy control and verification by qualified personnel.' };
  }
  if (state.mode === 'dc-volts') {
    return state.fixture === 'dc-source'
      ? { kind: 'reading', display: state.reversed ? '−18.0 V' : '18.0 V', explanation: 'This is an ideal 18 V DC source. Reversing the virtual reference changes the sign, not the magnitude. It does not by itself identify a fault.' }
      : { kind: 'reading', display: '0.0 V', explanation: 'This ideal fixture is defined to have no external or stored energy. In real equipment, one zero reading does not establish isolation or a safe work condition.' };
  }
  if (state.fixture === 'open') {
    return { kind: 'reading', display: state.mode === 'continuity' ? 'OL · NO TONE' : 'OL', explanation: 'This ideal open path has no finite resistance reading. OL is not zero resistance and is not a voltage-safety result.' };
  }
  const resistance = state.fixture === 'resistor' ? 220 : 0.2;
  if (state.mode === 'continuity') {
    // 30 Ω is a teaching-model setting, never a universal instrument threshold.
    const tone = resistance < 30;
    return { kind: 'reading', display: `${resistance} Ω · ${tone ? 'TONE' : 'NO TONE'}`, explanation: `This model indicates a tone below 30 Ω. The ${resistance} Ω path ${tone ? 'meets' : 'does not meet'} that condition. Real thresholds vary; a tone does not prove component health or electrical safety.` };
  }
  return { kind: 'reading', display: `${resistance} Ω`, explanation: `The isolated virtual ${state.fixture === 'resistor' ? 'resistor is 220 Ω' : 'link is 0.2 Ω'}. There are no parallel paths in this model. Real in-circuit paths can change the measured result.` };
}

export type ProbePoint = 'A' | 'B' | null;
export function readMeterAtProbes(state: MeterState, red: ProbePoint, black: ProbePoint): MeterReading {
  const setup = readMeter(state);
  if (setup.kind === 'blocked') return setup;
  if (red === null || black === null) return { kind: 'reading', display: 'LEADS', explanation: 'Place both virtual probe tips to measure between two points. A lifted lead is not a zero-voltage result.' };
  if (red === black) return {
    kind: 'reading', display: state.mode === 'dc-volts' ? '0.0 V' : state.mode === 'continuity' ? '0.0 Ω · TONE' : '0.0 Ω',
    explanation: 'Both ideal probe tips touch the same terminal, so there is no difference between their reference points. This result does not describe the path between A and B or establish a safe condition.',
  };
  return readMeter({ ...state, reversed: red === 'B' });
}
