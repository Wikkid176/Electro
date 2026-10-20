export type TraceSheetId = 'LIGHT' | 'COIL';
export type TraceNode = { id: string; tag: string; name: string; location: string; symbol: string; reference?: { sheet: TraceSheetId; node: string; relationship: 'device-association' } };
export type TraceSheet = { id: TraceSheetId; title: string; nodes: TraceNode[] };

// Entirely fictional teaching map. Device references are relationships, not wires.
export const traceSheets: TraceSheet[] = [
  { id: 'LIGHT', title: 'Indicator path', nodes: [
    { id: 'light-source', tag: 'V+', name: 'Virtual control source', location: 'A0', symbol: '⊕' },
    { id: 'light-fuse', tag: 'F-DEMO', name: 'Protective device', location: 'A1', symbol: '—[ ]—' },
    { id: 'light-contact', tag: 'K-DEMO.1', name: 'Normally open relay contact', location: 'A2', symbol: '—| |—', reference: { sheet: 'COIL', node: 'coil-device', relationship: 'device-association' } },
    { id: 'light-lamp', tag: 'L-DEMO', name: 'Indicator lamp', location: 'A3', symbol: '⊗' },
    { id: 'light-return', tag: '0 V', name: 'Load return', location: 'A4', symbol: '⊖' },
  ] },
  { id: 'COIL', title: 'Relay command path', nodes: [
    { id: 'coil-source', tag: 'V+', name: 'Virtual control source', location: 'B0', symbol: '⊕' },
    { id: 'coil-command', tag: 'S-DEMO', name: 'Normally open command switch', location: 'B1', symbol: '—| |—' },
    { id: 'coil-device', tag: 'K-DEMO', name: 'Relay coil', location: 'B2', symbol: '—( )—', reference: { sheet: 'LIGHT', node: 'light-contact', relationship: 'device-association' } },
    { id: 'coil-return', tag: '0 V', name: 'Control return', location: 'B3', symbol: '⊖' },
  ] },
];

export const traceChallenges = [
  { sheet: 'LIGHT', node: 'light-lamp', prompt: 'Use the index to open LIGHT. Select the indicator load.', explanation: 'L-DEMO is the indicator load at LIGHT A3. The index identifies the relevant functional sheet.' },
  { sheet: 'LIGHT', node: 'light-contact', prompt: 'Trace backward from the indicator. Select the switching contact immediately before it.', explanation: 'K-DEMO.1 is the contact in the indicator path. Its operating-coil reference points to COIL B2.' },
  { sheet: 'COIL', node: 'coil-device', prompt: 'Follow the device reference to COIL B2. Select the relay coil that operates K-DEMO.1.', explanation: 'K-DEMO is the associated coil. This is a device relationship; it does not electrically join the two circuit paths.' },
  { sheet: 'COIL', node: 'coil-command', prompt: 'On COIL, select the command switch in the relay coil’s path.', explanation: 'S-DEMO is the command condition in the coil path. The symbols show their specified normal state, not a live operating state.' },
  { sheet: 'LIGHT', node: 'light-return', prompt: 'Return to LIGHT. Select the return node that completes the indicator’s documented loop.', explanation: 'The load return completes the documented path. A 0 V return label does not automatically establish a protective-earth connection.' },
] as const;

export type TraceState = { step: number; visited: string[]; feedback: string; correct: boolean | null };
export const initialTrace: TraceState = { step: 0, visited: [], feedback: '', correct: null };

export function selectTraceNode(state: TraceState, sheet: TraceSheetId, nodeId: string): TraceState {
  const challenge = traceChallenges[state.step];
  if (!challenge) return state;
  if (sheet !== challenge.sheet || nodeId !== challenge.node) {
    return { ...state, correct: false, feedback: 'That is not the target for this challenge. Check the prompt, sheet index, location labels, and device reference. A reference is not automatically a conductor connection.' };
  }
  return { step: state.step + 1, visited: [...state.visited, nodeId], feedback: challenge.explanation, correct: true };
}
