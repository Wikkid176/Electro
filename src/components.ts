export type ComponentId = 'breaker' | 'contactor' | 'relay' | 'terminal' | 'transformer' | 'motor' | 'drive' | 'sensor';
export type ComponentPart = { id: string; name: string; description: string; x: number; y: number; target?: { x: number; y: number } };
export type WorkshopComponent = {
  id: ComponentId; name: string; purpose: string;
  states: [string, string]; stateDescriptions: [string, string];
  symbols: [string, string]; symbolDescription: string;
  parts: ComponentPart[];
};

// Independent stylized teaching devices. Positions are illustration coordinates,
// never terminal/pin assignments, dimensions, or manufacturer instructions.
export const workshopComponents: WorkshopComponent[] = [
  {
    id: 'breaker', name: 'Circuit breaker', purpose: 'Recognize a switching/protection device and distinguish its handle from its connection points.',
    states: ['Open', 'Closed'],
    stateDescriptions: ['The modeled contacts are open. Handle position alone does not prove isolation or absence of voltage.', 'The modeled contacts are closed. This illustration does not evaluate protection, ratings, or fault duty.'],
    symbols: ['—o/  o—', '—o──o—'], symbolDescription: 'Simplified switching-contact teaching symbol; actual breaker notation and trip functions depend on the drawing legend.',
    parts: [
      { id: 'handle', name: 'Operating handle', description: 'Commands a mechanical switching action. An actual device may also have a separate tripped indication; this two-state model omits it.', x: 151, y: 164 },
      { id: 'connections', name: 'Connection area', description: 'Conductors connect through specified terminal arrangements. Exact conductor, tightening, and acceptance requirements come from the actual equipment instructions.', x: 205, y: 59 },
      { id: 'housing', name: 'Insulating housing', description: 'Supports and encloses internal parts. Visible damage is an inspection finding for qualified review, not evidence that the rest of a device is healthy.', x: 55, y: 220, target: { x: 94, y: 218 } },
    ],
  },
  {
    id: 'contactor', name: 'Contactor', purpose: 'Recognize an electromagnet-operated switching device with separate control and main-contact functions.',
    states: ['Coil off', 'Coil on'],
    stateDescriptions: ['The ideal spring-return contactor is released; its modeled normally open main contacts are open.', 'The ideal armature is pulled in and the modeled main contacts are closed. This does not establish the physical state of real contacts.'],
    symbols: ['Coil —( )—\nNO —o/ o—', 'Coil —(●)—\nNO —o──o—'], symbolDescription: 'The coil and one associated normally open contact are shown separately in their selected teaching state; this does not electrically connect their terminals.',
    parts: [
      { id: 'main-contacts', name: 'Main contact area', description: 'The main poles switch the modeled load path. A contactor is not automatically a complete protective or safety system.', x: 197, y: 57 },
      { id: 'coil', name: 'Coil and armature', description: 'In this ideal model, the coil operates the armature. Coil input requirements and main-contact switching duty must be checked separately.', x: 88, y: 128, target: { x: 148, y: 128 } },
      { id: 'auxiliary', name: 'Moving contact bridge', description: 'The teaching bridge moves with the armature to change the modeled main-contact state. Exact contact construction and any auxiliary functions depend on the actual device and design.', x: 239, y: 163, target: { x: 158, y: 157 } },
    ],
  },
  {
    id: 'relay', name: 'Control relay', purpose: 'Explore a transparent-style relay with a coil, moving armature, and separate contact section.',
    states: ['Coil off', 'Coil on'],
    stateDescriptions: ['The ideal relay is released. The illustrated normally open contact is open.', 'The ideal relay is operated. The illustrated normally open contact is closed; other contact arrangements are possible on actual devices.'],
    symbols: ['Coil —( )—\nNO —o/ o—', 'Coil —(●)—\nNO —o──o—'], symbolDescription: 'A coil and one associated NO teaching contact, not an internal wiring diagram or a universal relay pinout.',
    parts: [
      { id: 'contact', name: 'Switching contact', description: 'The movable contact changes the output path in this model. A relay input rating does not establish the output contact duty.', x: 215, y: 79, target: { x: 175, y: 100 } },
      { id: 'relay-coil', name: 'Electromagnetic coil', description: 'The coil operates the ideal armature. Connections, supply characteristics, and any polarity requirements must be verified for the actual model.', x: 72, y: 151, target: { x: 109, y: 122 } },
      { id: 'socket', name: 'Plug-in socket', description: 'The illustrated base provides a mounting/connection interface. Physical fit alone does not establish an approved compatible relay/socket combination.', x: 213, y: 226, target: { x: 165, y: 213 } },
    ],
  },
  {
    id: 'terminal', name: 'Terminal block', purpose: 'Recognize a modular connection point, its identification marker, and its mounting interface.',
    states: ['Path intact', 'Path open'],
    stateDescriptions: ['The disconnect-style terminal has its modeled link closed. This does not establish a real connection’s resistance or acceptance.', 'The disconnect-style terminal link is open. Ordinary feed-through terminals may have no disconnect function.'],
    symbols: ['—○──○—', '—○/  ○—'], symbolDescription: 'A simplified disconnect-terminal path. Not all terminal blocks have a switchable link; use the actual part and drawing legend.',
    parts: [
      { id: 'clamp', name: 'Conductor clamp area', description: 'The conductor is secured by the specified connection mechanism. This illustration provides no strip length, ferrule requirement, or tightening value.', x: 71, y: 134, target: { x: 103, y: 139 } },
      { id: 'marker', name: 'Identification marker', description: 'A readable identifier helps match the controlled drawing and connection record. A missing marker leaves an identification gap that needs resolution.', x: 244, y: 126, target: { x: 167, y: 131 } },
      { id: 'rail', name: 'Rail mounting foot', description: 'The foot secures a compatible terminal to its mounting system. Mounting on a metal rail does not by itself establish a protective-earth function.', x: 226, y: 233, target: { x: 188, y: 215 } },
    ],
  },
  {
    id: 'transformer', name: 'Transformer', purpose: 'Recognize windings and a magnetic core without treating the artwork as a connection diagram.',
    states: ['Supply off', 'Supply on'],
    stateDescriptions: ['The teaching model has no applied supply. The selected screen state is not an electrical verification.', 'The model represents changing magnetic flux coupling two windings. No voltage, winding connection, or safe-touch condition is specified.'],
    symbols: ['))) ‖ (((', '))) ‖ ((('], symbolDescription: 'Two windings and a core, using a simplified teaching representation. The physical placement does not identify primary/secondary terminals or ratings.',
    parts: [
      { id: 'winding', name: 'Winding', description: 'Turns of conductor participate in magnetic coupling. Exact winding functions, insulation, ratios, and connections require the applicable equipment information.', x: 110, y: 151 },
      { id: 'core', name: 'Magnetic core', description: 'Provides a magnetic flux path. A transformer transfers energy; real losses, temperature, and application limits still matter.', x: 46, y: 74, target: { x: 65, y: 115 } },
      { id: 'transformer-terminals', name: 'Terminal shroud', description: 'Connection details are specific to the exact model and approved diagram. The illustration intentionally supplies no tap or jumper assignments.', x: 204, y: 217 },
    ],
  },
  {
    id: 'motor', name: 'Electric motor', purpose: 'Recognize the enclosure, shaft, and cable entry of a stylized industrial motor.',
    states: ['Stopped', 'Running'],
    stateDescriptions: ['The modeled shaft is stopped. A stationary motor can still present electrical, stored-energy, or mechanical hazards.', 'The model marks shaft rotation. Rotation alone says nothing about direction suitability, loading, or actual machine safety.'],
    symbols: ['—( M )—', '—( M )—  ↻'], symbolDescription: 'Motor function with a separate rotation cue in the running illustration. It is not a phase, winding, or drive connection diagram.',
    parts: [
      { id: 'shaft', name: 'Output shaft', description: 'Transfers mechanical motion to the load. Inertia and external forces can matter even after electrical torque is removed.', x: 254, y: 138 },
      { id: 'motor-body', name: 'Motor housing and cooling ribs', description: 'The housing supports the motor; external cooling features participate in thermal management. Exact cooling needs and guarding depend on the design.', x: 133, y: 110 },
      { id: 'cable-entry', name: 'Cable and entry', description: 'Cable condition, support, entry compatibility, and routing require inspection. Visible jacket damage is a finding, not proof of a specific internal failure.', x: 37, y: 234, target: { x: 70, y: 214 } },
    ],
  },
  {
    id: 'drive', name: 'Variable-frequency drive', purpose: 'Recognize a drive’s operator interface, cooling openings, and protected connection compartment.',
    states: ['Stopped', 'Run command'],
    stateDescriptions: ['The model shows a stopped indication. A display state does not establish DC-link discharge or isolation.', 'The display accepts a run command. A run indication is not proof of shaft movement or a safe machine state.'],
    symbols: ['[ ~ → = → ~ ]', '[ ~ → = → ~ ]'], symbolDescription: 'Functional AC/DC/AC conversion icon for a common architecture, not a standard-specific schematic symbol or connection plan.',
    parts: [
      { id: 'keypad', name: 'Operator display and keys', description: 'Present commands, status, or diagnostics according to the actual model. A displayed command and a motor’s physical response are different evidence.', x: 151, y: 75 },
      { id: 'vents', name: 'Cooling openings', description: 'Required airflow and clearances depend on the design and instructions. An obstruction of a required opening is an inspection finding.', x: 65, y: 180, target: { x: 162, y: 184 } },
      { id: 'drive-connections', name: 'Connection compartment', description: 'Actual power, control, and protective connections are equipment-specific. Stored DC-link energy can remain after removal of an incoming supply.', x: 198, y: 223 },
    ],
  },
  {
    id: 'sensor', name: 'Proximity sensor', purpose: 'Recognize a stylized cylindrical sensor, sensing face, indication, and cable connection.',
    states: ['No detection', 'Target detected'],
    stateDescriptions: ['The model reports no detection. Target placement is illustrative and does not define a real sensing distance or a universal indicator meaning.', 'The metal target meets the model’s detection condition and its indicator changes. Actual range and indicator meaning are model-specific.'],
    symbols: ['[◇] ⇢ ○', '[◇] ⇢ ●'], symbolDescription: 'Functional sensing/output icon, not a universal pinout or a standardized sensor-symbol claim.',
    parts: [
      { id: 'face', name: 'Sensing face', description: 'Interacts with the target according to the sensing principle. Material, mounting, geometry, environment, and exact model affect usable detection.', x: 45, y: 180, target: { x: 99, y: 124 } },
      { id: 'indicator', name: 'Status indicator', description: 'In this model it follows detection. Real indicators may mean power, output, target detection, or fault; verify their documented meaning.', x: 208, y: 63, target: { x: 239, y: 124 } },
      { id: 'sensor-cable', name: 'Cable connection', description: 'Supply, output compatibility, connector function, sealing, and cable assignment require exact documentation. Appearance does not establish a replacement match.', x: 247, y: 180 },
    ],
  },
];

export type ComponentChallenge = { id: string; kind: 'identify' | 'defect'; component: ComponentId; prompt: string; choices: { id: string; label: string }[]; answer: string; explanation: string };
const identify = (id: ComponentId, distractors: ComponentId[]): ComponentChallenge => {
  const component = workshopComponents.find(item => item.id === id)!;
  const order = [...distractors]; order.splice(workshopComponents.indexOf(component) % 3, 0, id);
  return { id: `identify-${id}`, kind: 'identify', component: id, prompt: 'Which component is illustrated?', choices: order.map(key => ({ id: key, label: workshopComponents.find(item => item.id === key)!.name })), answer: id, explanation: `${component.name}: ${component.purpose} Appearance is a recognition clue; actual identity and suitability require the exact equipment documentation.` };
};
const defect = (component: ComponentId, answer: string, prompt: string, explanation: string): ComponentChallenge => ({ id: `inspect-${component}`, kind: 'defect', component, prompt, answer, explanation, choices: workshopComponents.find(item => item.id === component)!.parts.map((part, i) => ({ id: part.id, label: `Area ${i + 1}: ${part.name}` })) });
export const componentChallenges: ComponentChallenge[] = [
  identify('contactor', ['relay', 'drive']),
  defect('terminal', 'marker', 'The exercise requires readable connection identification. Which marked area has a missing identifier?', 'Area 2 has a blank identification marker. Record the missing identification and resolve it against controlled documentation before acceptance; do not infer the connection from appearance.'),
  identify('breaker', ['transformer', 'sensor']),
  identify('relay', ['contactor', 'terminal']),
  defect('motor', 'cable-entry', 'Which marked area shows visible cable-jacket damage in this illustration?', 'Area 3 shows a jacket split. Record and refer the damage for the approved inspection/corrective process. Its appearance does not establish the condition of internal conductors or authorize handling.'),
  identify('transformer', ['motor', 'breaker']),
  identify('terminal', ['relay', 'sensor']),
  defect('drive', 'vents', 'This mock-up requires its cooling openings clear. Which marked area has an obstruction?', 'Area 2 has an obstruction across the cooling openings. Hold acceptance and resolve the conflict with the approved design/instructions. This is not an instruction to remove an obstruction from energized equipment.'),
  identify('drive', ['terminal', 'motor']),
  identify('motor', ['transformer', 'drive']),
  defect('breaker', 'housing', 'Which marked area shows a crack in the insulating housing?', 'Area 3 shows visible housing damage. Record the finding and obtain the approved qualified assessment. The game does not diagnose internal failure or authorize repair or energization.'),
  identify('sensor', ['breaker', 'relay']),
];

export type ComponentQuizState = { index: number; selection: string | null; checked: boolean; correct: number };
export const initialComponentQuiz: ComponentQuizState = { index: 0, selection: null, checked: false, correct: 0 };
export function componentQuizReducer(state: ComponentQuizState, action: { type: 'select'; id: string } | { type: 'check' | 'next' | 'restart' }): ComponentQuizState {
  if (action.type === 'restart') return initialComponentQuiz;
  const challenge = componentChallenges[state.index];
  if (!challenge) return state;
  if (action.type === 'select') return state.checked || !challenge.choices.some(choice => choice.id === action.id) ? state : { ...state, selection: action.id };
  if (action.type === 'check') return state.checked || state.selection === null ? state : { ...state, checked: true, correct: state.correct + Number(state.selection === challenge.answer) };
  return state.checked ? { ...state, index: state.index + 1, selection: null, checked: false } : state;
}
