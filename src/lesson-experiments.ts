export type ExperimentKind = 'energy' | 'ohms' | 'network' | 'starter' | 'timer' | 'analog' | 'sampling';
export const experiments: Partial<Record<string, ExperimentKind>> = {
  safety: 'energy', 'energy-sources': 'energy', verification: 'energy',
  fundamentals: 'ohms', 'electrical-units': 'ohms', 'electrical-power': 'ohms', 'measurement-evidence': 'ohms',
  'circuit-paths': 'network', motor: 'starter', diagnosis: 'starter',
  'panel-control-devices': 'timer', 'analog-scaling': 'analog', 'intermittent-evidence': 'sampling',
};

export function dcValues(voltage: number, resistance: number) {
  if (!Number.isFinite(voltage) || voltage < 0 || !Number.isFinite(resistance) || resistance <= 0) throw new RangeError('Use finite nonnegative voltage and positive resistance.');
  const current = voltage / resistance;
  return { current, power: voltage * current };
}

export function networkValues(parallel: boolean, open: boolean) {
  const branch = 12 / 60;
  const current = parallel ? branch + (open ? 0 : branch) : open ? 0 : 12 / 120;
  return { current, branchOne: open ? 0 : parallel ? branch : current, branchTwo: parallel ? branch : current };
}

export function analogTemperature(current: number): number | null {
  return Number.isFinite(current) && current >= 4 && current <= 20 ? -10 + ((current - 4) / 16) * 60 : null;
}

export type TimerState = { enabled: boolean; elapsed: number };
export function timerStep(state: TimerState, action: 'toggle' | 'tick'): TimerState {
  if (action === 'toggle') return { enabled: !state.enabled, elapsed: 0 };
  return { ...state, elapsed: state.enabled ? Math.min(4, state.elapsed + 1) : 0 };
}

export function samplingPoints(fine: boolean) {
  const interval = fine ? 2 : 20;
  return Array.from({ length: 20 / interval + 1 }, (_, index) => {
    const time = index * interval;
    return { time, event: time >= 5 && time < 10 };
  });
}
