import type { TeachingLesson } from './types.ts';

export const sensorTeaching = {
  'sensor-selection': {
    coach: 'Choose a sensing principle from the target and environment before comparing connectors.',
    sections: [
      { title: 'The target determines the question', body: 'Inductive sensing is commonly used for metal targets. Capacitive sensing can respond to conductive and nonconductive materials. Photoelectric arrangements use light in different ways. Material, geometry, mounting and contamination change performance, so a device family name is only a starting point.' },
      { title: 'Principle and interface both matter', body: 'Through-beam uses separate emitter and receiver, retroreflective uses a reflector and diffuse uses light returned by the target. A suitable sensing principle still needs compatible supply, output, switching behavior, response time and environment. An indicator may mean power, detection, output or fault depending on the exact device.' },
    ],
    visual: { kind: 'compare', component: 'sensor', title: 'Compare three sensing questions', caption: 'Conceptual examples only; no ranges, pinouts or replacement approvals.', nodes: [
      { label: 'Inductive', value: 'Metal target', detail: 'Model, target material and geometry affect usable response.' },
      { label: 'Capacitive', value: 'Material influence', detail: 'Moisture, deposits and surrounding material can affect detection.' },
      { label: 'Photoelectric', value: 'Light path', detail: 'Optical arrangement, target finish, background and contamination matter.' },
    ] },
    example: { scenario: 'A steel target is replaced with a different metal while the sensor remains unchanged.', steps: ['Identify the changed target material.', 'Check the exact model’s performance under the new target and mounting conditions.', 'Do not assume the earlier sensing distance still applies.'], takeaway: 'Similar appearance and connector fit do not establish functional compatibility.' },
    practice: { prompt: 'Which optical arrangement uses a reflector as part of the specified light path?', choices: ['Retroreflective.', 'Through-beam with a separate receiver.'], correct: 0, explanation: 'Retroreflective sensing uses a reflector. Through-beam uses separate sending and receiving units; suitability still needs application review.' },
  },
  'sensor-output-match': {
    coach: 'Source and sink describe current-path functions in a stated interface model, not a connector color code.',
    sections: [
      { title: 'Use a complete conventional DC path', body: 'In this conventional model, a PNP sourcing output supplies current toward a compatible sinking input. An NPN sinking output provides a path toward the negative reference for a compatible sourcing input. Those names are not a physical wiring procedure; actual diagrams and configurable interface definitions must be checked.' },
      { title: 'Compatibility is more than on/off', body: 'Supply, common/reference, thresholds, voltage drop and leakage all affect interface behavior. An off output need not be an ideal zero-current open. A small leakage can matter to a sensitive input. Connector shells and wire colors cannot establish pin functions, sealing or a permitted circuit; use exact system documentation.' },
    ],
    visual: { kind: 'compare', component: 'sensor', title: 'Conventional DC source/sink functions', caption: 'Functional descriptions only; no physical pins or connections.', nodes: [
      { label: 'PNP sourcing output', value: 'Supplies current', detail: 'Pairs with a compatible sinking input under the stated model and device conditions.' },
      { label: 'NPN sinking output', value: 'Path to negative', detail: 'Pairs with a compatible sourcing input under the stated model and device conditions.' },
      { label: 'Complete interface', value: 'Check limits', detail: 'References, thresholds, leakage and permitted circuit arrangements still matter.' },
    ] },
    example: { scenario: 'A sensor reports off, but a sensitive input record stays active.', steps: ['Separate the sensor’s stated output state from the input’s detected state.', 'Consider leakage, thresholds and the documented circuit as hypotheses.', 'Resolve compatibility through the approved process rather than add an improvised load.'], takeaway: 'An interface is a complete permitted current path with real operating limits.' },
    practice: { prompt: 'Does an off-state label guarantee exactly zero current for every sensor?', choices: ['Yes. Off always means an ideal open.', 'No. Specified leakage and input thresholds can matter.'], correct: 1, explanation: 'Real electronic outputs may pass limited off-state current. Its effect depends on the complete documented interface.' },
  },
  'io-evidence-chain': {
    coach: 'Follow the evidence one layer at a time, from the process all the way to the program.',
    sections: [
      { title: 'Each observation has a location', body: 'A target position, sensor light, output signal, module indication and PLC tag are different observations. Establish what each means and whether they refer to the same channel and time. An indicator changing cannot by itself prove a cable, input mapping or communication path is healthy.' },
      { title: 'Data can lag or be transformed', body: 'A PLC tag may be filtered, stale, mapped incorrectly or simulated. Similarly, an output command does not prove mechanical response. Safety I/O adds application-specific diagnostics and validated behavior; ordinary bits and steady readings cannot substitute for that system. Never force or bridge a real safety function to make the chain appear complete.' },
    ],
    visual: { kind: 'chain', component: 'sensor', title: 'From target to controller data', caption: 'Evidence layers, not field test instructions.', nodes: [
      { label: 'Process target', detail: 'What physical condition is actually observed?' },
      { label: 'Sensor indication', detail: 'What does the exact model say that light represents?' },
      { label: 'Interface and module', detail: 'Are electrical compatibility, channel identity and module state established?' },
      { label: 'PLC data', detail: 'Are mapping, communications, timestamps and processing consistent with the observation?' },
    ] },
    example: { scenario: 'A sensor light changes while a PLC tag remains unchanged.', steps: ['Record both observations with their channel identity and timing.', 'Keep indication meaning, interface, module and mapping as possible explanations.', 'Use applicable evidence to narrow the disagreement rather than declare a single failed part.'], takeaway: 'A disagreement identifies a question; it does not uniquely identify a cause.' },
    practice: { prompt: 'Does a true output command prove a valve physically moved?', choices: ['No. Actual load and process response need separate evidence.', 'Yes. Program commands guarantee process completion.'], correct: 0, explanation: 'The command does not establish delivered power, pressure, mechanism health or completed motion.' },
  },
  'analog-scaling': {
    coach: 'A linear scale has an offset and a span. Keep both, then check whether the signal is valid.',
    sections: [
      { title: 'Find the fraction of span', body: 'For this valid linear 4–20 mA example, subtract 4 mA and divide by the 16 mA signal span. Multiply that fraction by the engineering span, then add the engineering minimum. A negative lower bound must stay in the calculation; the midpoint is not automatically half the maximum.' },
      { title: 'Validity comes before display', body: 'A live zero separates a valid minimum from zero current, but abnormal current does not uniquely identify an open wire. Power, configuration, transmitter and input diagnostics can all matter. The formula alone must not turn invalid data into a trustworthy process value. Failure signaling is equipment-specific.' },
    ],
    visual: { kind: 'scale', title: 'Valid linear scale: −10 to 50 °C', caption: 'A separate fictional example from the quiz. Tap a signal point to see its fraction.', nodes: [
      { label: '4 mA', value: '−10 °C', level: 0, detail: 'Fraction (4−4)/16 = 0. Add zero span to the −10 °C minimum.' },
      { label: '12 mA', value: '20 °C', level: 0.5, detail: 'Fraction is 0.5. −10 + 0.5 × 60 = 20 °C.' },
      { label: '20 mA', value: '50 °C', level: 1, detail: 'Fraction is 1. −10 + 1 × 60 = 50 °C.' },
    ] },
    example: { scenario: 'The separate −10 to 50 °C teaching scale has a valid 8 mA signal.', steps: ['Find the engineering span: 50 − (−10) = 60 °C.', 'Find the signal fraction: (8−4)/16 = 0.25.', 'Add the offset: −10 + 0.25 × 60 = 5 °C.'], takeaway: 'Convert a valid signal fraction, then add the engineering minimum.' },
    practice: { prompt: 'At the midpoint of a valid −10 to 50 °C scale, what is the temperature?', choices: ['25 °C, because half of 50 is 25.', '20 °C, because −10 + half of the 60 °C span is 20.'], correct: 1, explanation: 'The lower bound is part of the scale. Ignoring it gives the wrong midpoint.' },
  },
  'feedback-signals': {
    coach: 'A health clue, a signal cycle and a decoded count describe different things.',
    sections: [
      { title: 'Sensor health is more than a plausible bias', body: 'An IEPE vibration sensor uses compatible constant-current excitation and provides a dynamic signal on a DC bias. A plausible bias can support a limited health assessment, but mounting, cable behavior, sensitivity and bandwidth can still affect the measurement. Exact acceptable values come from the actual equipment.' },
      { title: 'Define cycles and counts', body: 'Quadrature encoder A/B channels provide phase information for direction. A-channel cycles per revolution differ from counts obtained by decoding all A/B edges. Define the convention before calculating frequency. An absolute encoder also needs exact format, referencing and retention information; its label alone does not establish every power-loss behavior.' },
    ],
    visual: { kind: 'compare', title: 'Separate encoder quantities', caption: 'Fictional 100 A-cycle/revolution model at 120 RPM.', nodes: [
      { label: 'Mechanical speed', value: '2 rev/s', detail: '120 RPM divided by 60 gives two revolutions per second.' },
      { label: 'A-channel frequency', value: '200 Hz', detail: '100 A cycles per revolution × 2 revolutions per second = 200 cycles per second.' },
      { label: 'Four-edge decoding', value: '800 counts/s', detail: 'Four counts per A cycle gives 400 counts per revolution, or 800 counts per second here.' },
    ] },
    example: { scenario: 'A report calls a four-edge count rate the A-channel frequency.', steps: ['Identify whether each number means cycles or decoded edges.', 'Use mechanical speed in revolutions per second.', 'Keep the A-channel cycle frequency separate from the higher decoded count rate.'], takeaway: 'A number needs its counting convention as well as its unit.' },
    practice: { prompt: 'Does a plausible IEPE bias prove complete dynamic accuracy?', choices: ['No. It is one clue; mounting, cable and dynamic response still matter.', 'Yes. Bias alone proves every vibration result.'], correct: 0, explanation: 'A normal-looking DC bias does not establish sensitivity, bandwidth, mounting condition or dynamic signal accuracy.' },
  },
} satisfies Record<string, TeachingLesson>;
