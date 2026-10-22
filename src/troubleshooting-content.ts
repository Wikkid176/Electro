import type { Lesson, PracticeReference } from './content.ts';

const pathEvidence: PracticeReference[] = [
  { id: 'CASE-MODEL', title: 'SIM-PATH / Model assumptions', context: 'ideal DC teaching model; records are supplied, not instructions to probe equipment.', content: 'One intended series path contains a source, closed links, and a resistive load with an intact return. There is exactly one open connection, no alternate feeds, and no parallel paths. Source reference is fixed. All recorded values refer to the same operating snapshot.' },
  { id: 'CASE-RECORD', title: 'SIM-PATH / Supplied evidence', context: 'observations only; location letters are independent exercise labels.', content: 'Path order: source → A → B → C → load → return. Source, A, and B are recorded at 12 V relative to the defined return; C is recorded at 0 V. The exercise has not identified the physical cause of the open connection.' },
];

export const troubleshootingLessons: Lesson[] = [
  {
    id: 'diagnostic-plan', title: 'Build a testable theory', category: 'TROUBLESHOOTING / METHOD', symbol: '32', minutes: 5,
    brief: 'Start with a clear symptom, the changed conditions, and a question that evidence can answer.',
    points: [
      'Record what should happen, what actually happens, when it began, operating mode, alarms, and recent changes. An operator report and an alarm are useful observations; neither alone establishes a failed component.',
      'Establish the task boundary, authorization, hazardous-energy controls, and approved diagnostic plan before physical work. Observing a safety status is different from defeating a safety function. Production urgency does not authorize a bypass, forced output, or larger protective setting.',
      'State a hypothesis, the expected evidence, and what would support or weaken it. Prefer an informative check to random part swapping. Preserve relevant records and change one controlled variable at a time when the approved process allows.',
    ],
    questions: [
      { prompt: 'An operator reports that a machine stopped after a recipe change. What is a useful first record?', choices: ['Replace the nearest sensor', 'The expected and actual behavior, mode, timestamps, alarms, and recent change', 'Write only “machine broken”'], correct: 1, explanation: 'A specific symptom and context let later evidence test a theory. Timing after a change is a lead, not proof that the change caused the fault.' },
      { prompt: 'A proposed diagnostic action needs a guard input bypassed. What should happen?', choices: ['Bypass it briefly to save time', 'Ask the operator to watch the danger area', 'Stop that action and use the approved safe diagnostic process'], correct: 2, explanation: 'A safety function must not be defeated to complete this exercise or meet production pressure. Physical diagnostics require appropriate authorization and controls.' },
      { prompt: 'Which plan makes a hypothesis testable?', choices: ['Predict an observation and define how different results affect the theory', 'Replace several parts and hope', 'Choose the most expensive part as the cause'], correct: 0, explanation: 'An explicit prediction makes evidence useful. Uncontrolled simultaneous changes can hide the actual cause and make the outcome hard to interpret.' },
    ],
  },
  {
    id: 'fault-boundaries', title: 'Narrow the fault region', category: 'TROUBLESHOOTING / EVIDENCE CASE', symbol: '33', minutes: 5,
    brief: 'Use supplied records to narrow a region while keeping the model assumptions visible.',
    points: [
      'Splitting a path can reduce the search region when the path, reference, state, and expected result are known. It does not guarantee a fixed number of checks on branching circuits, multiple faults, pulsed signals, or systems with alternate feeds.',
      'A reading is a difference between defined points under defined conditions. Check the return, source, loading, and actual control state before transferring a simplified series-circuit inference to a real system.',
      'A region is not a root cause. A missing expected condition can involve a connection, command, component, or an incorrect assumption. The practice cards supply ideal records only; they do not specify physical measurements or authorize repairs.',
    ],
    questions: [
      { prompt: 'Using both SIM-PATH cards, which region contains the one modeled open connection?', choices: ['Somewhere after the intact return', 'Definitely inside the source', 'Between B and C'], correct: 2, explanation: 'Under the supplied single-open, intact-return, fixed-reference assumptions, the change from 12 V at B to 0 V at C bounds the modeled open to B–C. The records do not identify its physical cause.', referenceCards: pathEvidence },
      { prompt: 'Can the same conclusion be transferred unchanged to an unknown circuit with alternate supplies?', choices: ['No; those conditions violate the model assumptions and need a different analysis', 'Yes; any zero reading proves the same fault', 'Yes; a midpoint check works on every circuit'], correct: 0, explanation: 'Alternate feeds, return faults, parallel paths, changing states, and measurement limitations can change the inference. The cards only support the stated ideal model.', referenceCards: pathEvidence },
      { prompt: 'The modeled open is bounded to B–C. What has the evidence actually established?', choices: ['A real component replacement is authorized', 'A fault region within this exercise, not the physical root cause or safe-work status', 'The entire installation is safe to touch'], correct: 1, explanation: 'Narrowing the region is progress in reasoning. It does not prove a particular part failed, establish isolation, or authorize physical work.', referenceCards: pathEvidence },
    ],
  },
  {
    id: 'intermittent-evidence', title: 'Catch the pattern', category: 'TROUBLESHOOTING / INTERMITTENT FAULTS', symbol: '34', minutes: 5,
    brief: 'Use timing and shared dependencies to form better hypotheses without confusing correlation with proof.',
    points: [
      'When several channels change together, examine shared dependencies in the documentation: supply, return, communication, module, logic, and common process conditions. Several simultaneous symptoms need not mean several failed sensors.',
      'Preserve timestamped alarms, trends, operating states, and relevant environmental changes. Check timestamp alignment, sampling, bandwidth, and event duration. A recorder can miss an event or show the wrong sequence if these limits are ignored.',
      'Drive operation coinciding with signal noise is a hypothesis lead. Supply disturbances, routing, shielding, bonding, feedback, and mechanical conditions can be involved. Resolve the system-specific cause through approved analysis; do not perform live cable movement or change shield connections from a general rule.',
    ],
    questions: [
      { prompt: 'Four input indications drop together. Which hypothesis deserves investigation?', choices: ['Four independent sensors must have failed at once', 'Their shared supply, return, module, communications, or process conditions', 'Their screen colors are incorrect'], correct: 1, explanation: 'Common dependencies can explain grouped symptoms. They are candidates to investigate, not a diagnosis established by simultaneous indications alone.' },
      { prompt: 'An event lasts 5 ms, but a trend samples every second. Does a normal-looking trend exclude that event?', choices: ['Yes; every trend captures every fault', 'Yes; only the display refresh matters', 'No; the sampling and capture behavior may miss it'], correct: 2, explanation: 'A short event can occur between samples or outside the capture conditions. Instrument and logging limits affect what an apparently normal record can establish.' },
      { prompt: 'A feedback alarm often coincides with drive acceleration. What is a sound conclusion?', choices: ['The timing suggests hypotheses that need corroborating evidence', 'The shield must always be disconnected at one end', 'The encoder is definitely defective'], correct: 0, explanation: 'Correlation helps target investigation but does not prove mechanism. Applicable equipment information and additional evidence are needed before changing hardware, wiring, or settings.' },
    ],
  },
  {
    id: 'root-cause-record', title: 'Prove and record the repair', category: 'TROUBLESHOOTING / ROOT CAUSE', symbol: '35', minutes: 5,
    brief: 'Separate symptom relief, the failure mechanism, corrective action, and evidence that the problem was resolved.',
    points: [
      'Replacing a failed item can restore operation while leaving the damaging condition in place. In a case, repeated cable damage at a documented moving edge requires review of the damage mechanism and the approved routing/support design, not another unexplained replacement.',
      'Verification must match the original failure conditions and any affected functions. An intermittent fault needs an appropriate evidence-based observation plan; a few successful cycles do not prove permanent elimination. Safety-related changes require the responsible validation process.',
      'Record the symptom, context, evidence, limitations, identified cause, approved change, and verification outcome. Update controlled documentation through the approved change process. Keep unresolved questions visible rather than recording certainty the evidence does not support.',
    ],
    questions: [
      { prompt: 'A cable has repeatedly failed where it rubs a moving edge. Which repair proposal addresses more than the symptom?', choices: ['Replace the cable again with no record', 'Increase the fuse rating', 'Replace damaged parts and resolve the documented routing/support cause through the approved design process'], correct: 2, explanation: 'The damaging condition can cause another failure if it remains. Corrective action needs to address the supported mechanism without making unauthorized design or protection changes.' },
      { prompt: 'An intermittent fault previously appeared once per shift. Ten good minutes follow a repair. What can you report?', choices: ['Permanent resolution is proven', 'A limited successful observation; more verification under the relevant conditions is needed', 'All safety functions are automatically validated'], correct: 1, explanation: 'A short observation does not cover the historical failure pattern. Report its actual duration and conditions and follow the appropriate verification and acceptance plan.' },
      { prompt: 'Which report best supports future diagnosis?', choices: ['Symptoms, evidence, confirmed and unresolved causes, approved changes, and verification conditions/results', 'Only “fixed”', 'Only the replacement part price'], correct: 0, explanation: 'A traceable record helps others assess what was found and whether the change addressed it. Findings and uncertainty should be recorded with the supporting evidence.' },
    ],
  },
];
