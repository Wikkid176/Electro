import type { TeachingLesson } from './types.ts';

export const diagnosticTeaching = {
  'diagnostic-plan': {
    coach: 'Turn “it is broken” into a question that evidence can answer.',
    sections: [
      { title: 'Describe a reproducible symptom', body: 'Record expected behavior, actual behavior, operating mode, timing, alarms and recent changes. A statement such as “the actuator stops during recipe Q” supports a more focused investigation than “machine failed.” Timing after a change is useful context but does not prove causation.' },
      { title: 'Make a prediction', body: 'A hypothesis should say what evidence would support it and what would weaken it. Select informative checks within the approved authorization and hazardous-energy controls. Never defeat a safety function, force an output or increase protection to make a theory easier to test. Preserve the relevant records and change only controlled variables when permitted.' },
    ],
    visual: { kind: 'chain', title: 'From symptom to testable question', caption: 'Planning with records, not physical diagnostic instructions.', nodes: [
      { label: 'Symptom', detail: 'The fictional actuator stops only in recipe Q.' },
      { label: 'Hypothesis', detail: 'A required command condition may differ in that recipe.' },
      { label: 'Prediction', detail: 'The supplied command-state record should differ at the relevant time if the theory is supported.' },
      { label: 'Alternative result', detail: 'Matching records weaken that theory and require a different explanation.' },
    ] },
    example: { scenario: 'Someone proposes replacing three sensors after one unexplained stop.', steps: ['Ask for the symptom and operating context first.', 'State a hypothesis and the expected supporting record.', 'Use the approved diagnostic plan rather than simultaneous random replacements.'], takeaway: 'An informative question can reduce uncertainty without hiding the cause.' },
    practice: { prompt: 'Which hypothesis is testable?', choices: ['“Something electrical is bad.”', '“If the enable is missing, the synchronized command record should show it false.”'], correct: 1, explanation: 'The second claim predicts an observation that can support or weaken it. The first is too vague to test meaningfully.' },
  },
  'fault-boundaries': {
    coach: 'Narrow a region using stated assumptions. A region is still not a physical root cause.',
    sections: [
      { title: 'A boundary needs a defined model', body: 'Comparing neighboring records can bound a missing condition when the path, reference and operating state are known. A single-open series model is especially simple. Alternate supplies, changing states, return faults and parallel paths can break the inference, so keep those assumptions attached to the result.' },
      { title: 'Locate uncertainty honestly', body: 'A transition between two supplied values can identify a region in the model. It does not establish why the path is open, which real component failed or whether any conductor is safe. An increasingly narrow hypothesis still needs evidence appropriate to the actual system and an approved diagnostic process.' },
    ],
    visual: { kind: 'loop', title: 'Separate ideal evidence example', caption: 'One open, intact return, no alternate feeds, fixed reference and snapshot. Supplied records only.', nodes: [
      { label: 'P', value: '10 V', detail: 'The recorded condition matches the ideal source side.' },
      { label: 'Q', value: '10 V', detail: 'The source-side condition is still present at Q.' },
      { label: 'R', value: '0 V', detail: 'Under these assumptions, the modeled open is bounded between Q and R.' },
      { label: 'Load and return', value: 'Intact return', detail: 'This stated assumption is essential; a different return condition changes the reasoning.' },
    ] },
    example: { scenario: 'In this separate ideal model, P and Q are 10 V and R is 0 V.', steps: ['Confirm the single-open, intact-return and fixed-snapshot assumptions.', 'Find where the supplied condition changes: Q to R.', 'Report the modeled region Q–R, without naming an unsupported failed part.'], takeaway: 'Region-finding is progress, not proof of a specific failure mechanism.' },
    practice: { prompt: 'Can this single-open inference be applied unchanged when an alternate feed exists?', choices: ['No. The assumptions have changed.', 'Yes. Any zero reading identifies the same fault.'], correct: 0, explanation: 'An alternate feed changes possible paths and reference conditions. The original model no longer supports the same deduction.' },
  },
  'intermittent-evidence': {
    coach: 'Patterns suggest where to look. They do not prove the mechanism on their own.',
    sections: [
      { title: 'Look for shared dependencies', body: 'Several channels changing together may share supply, return, communications, logic or process conditions. That pattern can be more informative than assuming multiple independent sensors failed simultaneously. Preserve timestamps and channel identities so the observations can actually be compared.' },
      { title: 'A recorder can miss the story', body: 'Event duration, sample interval, trigger behavior and clock alignment affect what a trend shows. A short disturbance can fall between samples. Drive acceleration and feedback noise occurring together is a lead, not proof of a shield defect. System-specific analysis is needed before changes; do not move live cables or improvise shield connections.' },
    ],
    visual: { kind: 'timeline', title: 'A supplied event and a slower logger', caption: 'Illustrative times, not live measurements.', nodes: [
      { label: '0.000 s', value: 'Sample normal', detail: 'The logger captures one normal point.' },
      { label: '0.400–0.405 s', value: 'Brief event', detail: 'A five-millisecond event happens between the one-second samples.' },
      { label: '1.000 s', value: 'Sample normal', detail: 'The next normal sample does not show what happened between samples.' },
    ] },
    example: { scenario: 'Three input tags drop together while their shared supply record is unavailable.', steps: ['Record the grouped symptom and align timestamps.', 'List shared dependencies as hypotheses, including the supply and communication path.', 'Keep the mechanism unconfirmed until appropriate evidence is available.'], takeaway: 'A normal-looking trend only covers the recorder’s actual capture capability.' },
    practice: { prompt: 'Signal noise often coincides with acceleration. What does that establish?', choices: ['The shield must be rewired.', 'A correlation that can guide further approved investigation.'], correct: 1, explanation: 'Coincidence does not isolate the cause. Supply, routing, mechanical conditions and other shared dependencies remain possible.' },
  },
  'root-cause-record': {
    coach: 'A repair record should explain what changed, why it helped and what remains uncertain.',
    sections: [
      { title: 'Symptom, mechanism and correction', body: 'Replacing a failed cable can restore operation while leaving an abrasive route unchanged. The failed item is the symptom location; rubbing at a moving edge may be the supported damage mechanism. An approved correction needs to address the mechanism as well as the damaged part.' },
      { title: 'Verification covers relevant conditions', body: 'A few successful cycles cannot prove the permanent elimination of a once-per-shift fault. Record the observation duration, operating conditions, affected functions and remaining limits. Safety-related changes need the responsible validation process. Controlled documentation should reflect approved changes, without recording certainty unsupported by the evidence.' },
    ],
    visual: { kind: 'chain', title: 'A traceable correction record', caption: 'Fictional maintenance reasoning, not authorization to modify equipment.', nodes: [
      { label: 'Symptom', detail: 'A cable channel repeatedly loses continuity during movement.' },
      { label: 'Supported mechanism', detail: 'The documented moving-edge contact aligns with the repeated damage location.' },
      { label: 'Approved correction', detail: 'Resolve the damaged item and the reviewed routing/support cause.' },
      { label: 'Verification limits', detail: 'Record the actual tested conditions, duration and any remaining uncertainty.' },
    ] },
    example: { scenario: 'A fault previously appeared once each shift. It has not appeared during ten minutes after a repair.', steps: ['Record ten successful minutes under the observed conditions.', 'Compare that duration with the historical failure pattern.', 'Continue the relevant verification plan instead of claiming permanent elimination.'], takeaway: 'An honest limited result is more useful than an unsupported “fixed forever.”' },
    practice: { prompt: 'Which record best supports future investigation?', choices: ['Evidence, approved change, verification conditions and unresolved questions.', 'Only “fixed” and the part price.'], correct: 0, explanation: 'A traceable record lets others assess the reasoning, action and limits of the result.' },
  },
} satisfies Record<string, TeachingLesson>;
