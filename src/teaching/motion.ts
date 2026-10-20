import type { TeachingLesson } from './types.ts';

export const motionTeaching = {
  'motor-nameplate': {
    coach: 'A motor nameplate describes rated conditions. It does not measure the load right now.',
    sections: [
      { title: 'Read the conditions with the numbers', body: 'Voltage, current, frequency, speed and power markings describe specified motor duties and conditions. Rated current is not a live current measurement, and mechanical rated output is not automatically electrical input. Exact connection and application decisions need the equipment’s own documentation and approved engineering.' },
      { title: 'Understand speed and slip', body: 'For an induction-motor teaching model, synchronous speed is 120 times frequency divided by pole count. Rotor speed under normal motoring load is lower; that difference is slip. Slip depends on operating conditions. A nameplate speed alone does not tell you a current shaft speed or establish that a driven load is safe.' },
    ],
    visual: { kind: 'compare', component: 'motor', title: 'A fictional four-pole induction model', caption: 'Teaching values only; no physical connections or application selection.', nodes: [
      { label: 'Frequency', value: '50 Hz', detail: 'The model uses a 50-cycle-per-second supply.' },
      { label: 'Synchronous speed', value: '1,500 RPM', detail: '120 × 50/4 = 1,500 RPM for four poles.' },
      { label: 'Rotor example', value: '1,440 RPM', detail: 'Slip is (1,500 − 1,440)/1,500 = 0.04, or 4%, in this supplied operating example.' },
    ] },
    example: { scenario: 'A motor label lists a rated speed, but the actual shaft condition is unknown.', steps: ['Identify the label as rated-condition information.', 'Keep actual speed, loading and operating state as separate evidence questions.', 'Use the exact equipment information before any application or replacement decision.'], takeaway: 'A rating describes a specified duty; an observation describes an actual condition.' },
    practice: { prompt: 'For a six-pole ideal synchronous-speed calculation at 60 Hz, what is the result?', choices: ['3,600 RPM', '1,200 RPM'], correct: 1, explanation: 'Synchronous speed is 120 × 60/6 = 1,200 RPM. This is not a claim about an actual rotor’s measured speed.' },
  },
  'starter-drive-choice': {
    coach: 'Across-line starting, soft starting and variable-frequency control solve different problems.',
    sections: [
      { title: 'Starting is not continuous speed control', body: 'An across-line starter applies the supply through its switching and protection arrangement. A soft starter manages starting behavior through its specified method; that alone does not provide a general variable-speed running system. Mechanical load, supply and starting duty all matter to the application.' },
      { title: 'A drive changes the control possibilities', body: 'A VFD controls output frequency and voltage behavior within its capabilities and configuration. It does not guarantee motor torque, cooling or load suitability at every speed. Each method needs approved selection, protection and equipment compatibility. None is a substitute for hazardous-energy isolation.' },
    ],
    visual: { kind: 'compare', component: 'drive', title: 'Compare the control methods', caption: 'Functional comparison only; no sizing or settings.', nodes: [
      { label: 'Across-line starter', value: 'Switch supply', detail: 'Provides the documented starting and switching behavior without general electronic variable-speed control.' },
      { label: 'Soft starter', value: 'Manage starting', detail: 'Changes specified starting/stopping behavior; do not assume continuous variable-frequency running.' },
      { label: 'VFD', value: 'Control frequency', detail: 'Supports controlled operating frequency within the motor, drive and load constraints.' },
    ] },
    example: { scenario: 'A training process needs two continuous operating speeds, rather than only a gentler start.', steps: ['Separate the running-speed requirement from starting behavior.', 'Recognize that a soft-start label alone does not answer the running-speed question.', 'Require application-specific evaluation of the motor, controller and load.'], takeaway: 'Choose a method by the full duty, not a familiar device name.' },
    practice: { prompt: 'Does a soft-start function alone establish variable-frequency running capability?', choices: ['No. Starting behavior and continuous speed control differ.', 'Yes. All electronic starters do the same thing.'], correct: 0, explanation: 'A soft starter and a VFD have different functions. Actual capabilities come from the exact device and application.' },
  },
  'drive-energy-path': {
    coach: 'A drive’s command path and energy path are different. Follow both without confusing STOP with isolation.',
    sections: [
      { title: 'A simplified VFD energy model', body: 'A common VFD model includes an incoming conversion stage, a DC link and an inverter output stage. The DC link can store energy. The inverter produces controlled output rather than simply passing an unchanged sine wave. Actual topology and behavior depend on the device.' },
      { title: 'Energy can remain or return', body: 'Removing a run command does not isolate incoming power or establish a discharged DC link. A driven load can also return energy under some conditions. Suitable cables, output measurement and discharge verification are equipment-specific tasks for qualified personnel. No display state or generic waiting time in an app can establish a safe work condition.' },
    ],
    visual: { kind: 'chain', component: 'drive', title: 'A common conceptual VFD energy path', caption: 'Blocks describe function, not connections or service locations.', nodes: [
      { label: 'Incoming conversion', detail: 'The incoming supply feeds the device’s conversion stage in this simplified model.' },
      { label: 'DC link', value: 'Stored energy', detail: 'Energy storage may remain relevant after the run command is removed.' },
      { label: 'Inverter output', detail: 'The output stage creates the controlled waveform within the device’s design.' },
      { label: 'Motor and load', detail: 'Mechanical behavior and returned energy can affect the system independently of a STOP display.' },
    ] },
    example: { scenario: 'The drive shows STOP while its incoming supply remains connected.', steps: ['Read STOP as an operating-state indication.', 'Keep incoming supply, DC-link energy and mechanical load hazards separate.', 'Use the approved energy-control and verification process for any service decision.'], takeaway: 'Commanded state cannot establish the state of every energy source.' },
    practice: { prompt: 'Does removing RUN prove the DC link is discharged?', choices: ['Yes. RUN controls every energy source.', 'No. Stored energy requires the applicable control and verification process.'], correct: 1, explanation: 'A run command is not energy isolation or discharge verification. Exact device behavior and safe-work requirements remain essential.' },
  },
  'drive-fault-evidence': {
    coach: 'An alarm names a detected condition. Use its timing and context to test explanations.',
    sections: [
      { title: 'Command, acceptance and motion', body: 'A PLC run bit, the drive’s accepted command, its reference, its operating state and actual movement are different layers. A true command cannot prove available torque, power-path health or successful movement. Identify which layer each record actually describes.' },
      { title: 'Timing can suggest a mechanism', body: 'An overvoltage alarm during deceleration may make returned energy relevant, but it does not establish a required braking device or ramp change. Record the exact alarm, model, state and relevant history. Repeated reset, uncontrolled tuning or higher protection settings can erase evidence or create hazards; use the approved diagnostic and change process.' },
    ],
    visual: { kind: 'chain', component: 'drive', title: 'Command to physical result', caption: 'Evidence layers only; no operational troubleshooting commands.', nodes: [
      { label: 'PLC request', value: 'RUN true', detail: 'The controller requests operation; this is a logical condition.' },
      { label: 'Drive conditions', value: 'Enable + state', detail: 'Acceptance, references and device conditions may still prevent output.' },
      { label: 'Motor response', value: 'Torque / motion', detail: 'Power path and load conditions affect actual response.' },
      { label: 'Process feedback', value: 'Result observed', detail: 'A separate observation is needed to establish the intended process outcome.' },
    ] },
    example: { scenario: 'A supplied event log shows a drive alarm during each deceleration.', steps: ['Record the alarm identity and synchronized operating context.', 'Treat returned energy as one hypothesis among the applicable possibilities.', 'Compare exact system information before any approved corrective decision.'], takeaway: 'A plausible mechanism is a hypothesis until evidence supports it.' },
    practice: { prompt: 'The drive repeatedly faults after reset. What is the useful response?', choices: ['Preserve the event evidence and investigate through the approved process.', 'Keep resetting until the indication stays clear.'], correct: 0, explanation: 'Clearing the indication does not remove its cause. Repeated faults require cause-specific investigation and appropriate authorization.' },
  },
  'servo-feedback-safety': {
    coach: 'A servo compares requested and reported motion. A mismatch does not automatically call for more gain.',
    sections: [
      { title: 'A closed loop uses feedback', body: 'A servo system compares a command with feedback and adjusts its output to reduce error. Following error describes the mismatch. Load, obstruction, feedback and configuration can all contribute; the error by itself does not select a repair or tuning change. Commutation and direction relationships are system-specific.' },
      { title: 'Torque control is not isolation', body: 'Safe Torque Off is a function within a validated system. It does not establish electrical isolation, discharge stored energy or restrain gravity. A load may move under inertia or external forces even without commanded torque. Approved hazardous-energy and mechanical-restraint processes remain necessary; a holding brake alone is not permission to work beneath a load.' },
    ],
    visual: { kind: 'loop', component: 'motor', title: 'A conceptual servo feedback loop', caption: 'Information relationship only, not a wiring or safety design.', nodes: [
      { label: 'Motion command', detail: 'The system defines the requested motion under its configuration.' },
      { label: 'Controller and drive', detail: 'Output is adjusted using the error and the system’s control behavior.' },
      { label: 'Axis and load', detail: 'Mechanical forces and loading affect actual motion.' },
      { label: 'Reported feedback', detail: 'Reported motion is compared with the command; feedback errors can also affect the comparison.' },
    ] },
    example: { scenario: 'Following error rises after a documented mechanical collision.', steps: ['Identify the error as a command/feedback mismatch.', 'Keep obstruction, damage and feedback effects among the hypotheses.', 'Use the approved system-specific investigation rather than increase gains or swap phases.'], takeaway: 'A control symptom and a hazardous-energy condition require their own evidence.' },
    practice: { prompt: 'With STO active, can gravity still move an axis?', choices: ['No. STO physically supports every load.', 'Yes. Electrical isolation and mechanical restraint remain separate concerns.'], correct: 1, explanation: 'Removing torque capability does not restrain gravity, inertia or external forces. Exact system behavior and approved controls govern the task.' },
  },
} satisfies Record<string, TeachingLesson>;
