import type { Lesson } from './content.ts';

export const motionLessons: Lesson[] = [
  {
    id: 'motor-nameplate', title: 'Read the motor story', category: 'MOTION / MOTOR FUNDAMENTALS', symbol: '36', minutes: 5,
    brief: 'Connect the rotating-field model to nameplate information without turning a classroom calculation into a connection or protection rule.',
    points: [
      'In a basic three-phase induction motor, the stator field rotates and induces rotor current. Synchronous field speed is 120 × frequency ÷ pole count in RPM. In normal motoring operation the rotor runs below that field speed; the difference is slip.',
      'Nameplate voltage, frequency, rated current, output power, speed, duty, and connection diagram describe specified operating conditions. Mechanical output power differs from electrical input power because real motors have losses.',
      'Motor variants can require different winding connections even when they look alike. Actual connections, supply compatibility, thermal performance, and protection require the exact documentation and approved engineering process. Service factor is not blanket permission to overload a machine.',
    ],
    questions: [
      { prompt: 'What is the synchronous field speed for the ideal four-pole, 40 Hz example?', choices: ['1,200 RPM', '40 RPM', '4,800 RPM'], correct: 0, explanation: 'Synchronous speed is 120 × 40 ÷ 4 = 1,200 RPM. This is field speed, not a guaranteed shaft speed or operating approval.' },
      { prompt: 'An induction motor runs at 1,160 RPM while its rotating field is at 1,200 RPM in normal motoring operation. What does the difference represent?', choices: ['Proof of a ground fault', 'Slip between the rotor and rotating field', 'A mandatory wiring change'], correct: 1, explanation: 'An induction motor needs slip in normal motoring operation. The example alone does not establish a fault or a suitable operating point for actual equipment.' },
      { prompt: 'Two motors look identical but have different connection diagrams. Which source controls the connection decision?', choices: ['The more familiar motor’s lead pattern', 'A remembered universal lead chart', 'The exact motor documentation and applicable approved design'], correct: 2, explanation: 'Winding arrangements and operating requirements differ. Appearance and a generic chart cannot replace the correct connection information.' },
    ],
  },
  {
    id: 'starter-drive-choice', title: 'Tell the starters apart', category: 'MOTION / CONTROL METHODS', symbol: '37', minutes: 5,
    brief: 'Distinguish a contactor starter, a soft starter, and a variable-frequency drive by their basic functions.',
    points: [
      'A contactor repeatedly switches a motor power path; a starter includes appropriate motor-control and protection functions. Overload and short-circuit protection address different duties. An ordinary contactor is not proof of isolation or a complete safety system.',
      'A conventional soft starter controls applied voltage during starting to influence current and torque. It does not provide the same ongoing variable-frequency speed control as a VFD. Reduced starting current can also mean reduced available starting torque; the load and thermal duty matter.',
      'A VFD controls motor output frequency and voltage/current behavior within its design. Choosing any method requires the motor, load, starting and stopping needs, environment, protection, and instructions. This mission makes no product selection or parameter-setting recommendation.',
    ],
    questions: [
      { prompt: 'Which description matches a conventional soft starter?', choices: ['A device that makes every motor safe to touch', 'A voltage-control starting method rather than a substitute for continuous variable-frequency speed control', 'An encoder that reports absolute position'], correct: 1, explanation: 'A soft starter manages starting behavior through applied voltage. A VFD provides a different control method; suitability depends on the complete application.' },
      { prompt: 'Does reducing starting voltage guarantee the load will accelerate successfully?', choices: ['Yes, torque is unaffected', 'Yes, for every mechanical load', 'No; available torque, acceleration duty, and thermal limits must be considered'], correct: 2, explanation: 'Reducing voltage can reduce starting torque. A low-current start that cannot accelerate the load can still cause problems and needs an appropriate engineering assessment.' },
      { prompt: 'Which pair serves different protective purposes?', choices: ['Motor overload protection and short-circuit protection', 'Two copies of the same label', 'Two identical screen icons'], correct: 0, explanation: 'Overload and short-circuit duties are distinct and must be addressed by the applicable motor circuit design. One function cannot automatically replace the other.' },
    ],
  },
  {
    id: 'drive-energy-path', title: 'Follow the drive energy', category: 'MOTION / VFD CONCEPTS', symbol: '38', minutes: 5,
    brief: 'Follow a common AC-input drive architecture and understand why a stopped motor or dark display does not establish isolation.',
    points: [
      'A common AC-input VFD has a rectifier or controlled front end, a DC link, and an inverter. The inverter switches to produce a controlled motor waveform. The output is not simply an ordinary adjustable sine-wave utility supply.',
      'The DC link may store hazardous energy after the incoming supply is removed. Other supplies, shared buses, or driven loads can also matter. A dark display and an elapsed generic wait time do not prove a safe condition; qualified personnel need the exact approved energy-control and verification process.',
      'At different speeds, torque capability and cooling depend on the motor, drive, control method, speed range, and load. Constant torque at every speed is not guaranteed. PWM waveforms also require appropriate instrument capabilities and an approved test method; this app supplies no test connections or bus-voltage target.',
    ],
    questions: [
      { prompt: 'In a common AC-input VFD, which sequence describes the main energy path?', choices: ['Encoder → paint stripe → motor', 'Contactor → software only → zero energy', 'Front end → DC link → inverter → motor'], correct: 2, explanation: 'This common architecture converts the input to a DC link and uses an inverter to control the motor waveform. Actual drive architectures and connections must be checked in their own documentation.' },
      { prompt: 'A drive display goes dark after its incoming supply is removed. What can you conclude?', choices: ['The display is dark; stored energy and other sources still require the approved controls and verification', 'The DC link is definitely discharged', 'All motor conductors are safe to touch'], correct: 0, explanation: 'A display state is not an absence-of-energy test. Stored energy, alternate supplies, and equipment-specific requirements remain part of the qualified safe-work process.' },
      { prompt: 'Can a generic meter reading of PWM output be interpreted as an ordinary utility sine-wave reading without checking the instrument and method?', choices: ['Yes, every meter responds identically', 'No; waveform, filtering, bandwidth, and the approved method matter', 'Yes, if the motor is quiet'], correct: 1, explanation: 'A switched drive waveform can produce misleading results with an unsuitable measurement setup. This lesson does not provide a live-testing method or authorize energized testing.' },
    ],
  },
  {
    id: 'drive-fault-evidence', title: 'Interpret the drive alarm', category: 'MOTION / DRIVE DIAGNOSTICS', symbol: '39', minutes: 5,
    brief: 'Treat drive diagnostics as evidence to interpret, rather than instructions to reset or change parameters.',
    points: [
      'Record the exact drive identity, firmware/document applicability, fault label, operating state, command source, reference source, and event history. A run command, an enabled state, and actual shaft motion are different observations.',
      'During deceleration a driven load can return energy to a drive system; this is one possible contributor to a DC-link overvoltage event. Supply conditions, configuration, braking provisions, and equipment faults can also matter. A fault label does not automatically authorize extending ramps or adding a resistor.',
      'Overcurrent, undervoltage, thermal, or feedback alarms can have multiple electrical, mechanical, or configuration causes. Repeated resets, higher protection settings, uncontrolled tuning, and generic shield rewiring can hide a problem or create a new one. Preserve evidence and use the approved diagnostic/change process.',
    ],
    questions: [
      { prompt: 'A drive logs an overvoltage alarm during deceleration. Which statement is justified?', choices: ['A returned-energy mechanism is a hypothesis to check with the exact system information', 'A braking resistor must always be added', 'The motor windings are definitely shorted'], correct: 0, explanation: 'Regeneration during deceleration can be relevant, but the alarm and timing do not prove the cause or authorize a hardware or ramp change.' },
      { prompt: 'The PLC run-command bit is true, but the motor is stationary. What remains possible?', choices: ['Nothing; a true bit proves motion', 'Missing enables, drive state, reference/configuration, power-path, load, or feedback issues', 'Only a failed PLC'], correct: 1, explanation: 'A logical command is one layer of evidence. It does not establish drive acceptance, available torque, or actual mechanical motion.' },
      { prompt: 'A drive faults repeatedly after reset. What is the best response?', choices: ['Keep resetting until production resumes', 'Increase protection settings without review', 'Preserve the event evidence and investigate through the approved process'], correct: 2, explanation: 'A reset can clear an indication without resolving its cause. Repeated faults need investigation and appropriate authorization before corrective changes.' },
    ],
  },
  {
    id: 'servo-feedback-safety', title: 'Close the motion loop', category: 'MOTION / SERVOS', symbol: '40', minutes: 5,
    brief: 'Connect command, feedback, and mechanical behavior while keeping torque control separate from hazardous-energy isolation.',
    points: [
      'A servo system compares commanded motion with feedback and controls its output to reduce error. Excessive following error can involve loading, mechanical obstruction, feedback, configuration, or other causes; it is not proof that the gains should be increased.',
      'Feedback type, motor compatibility, cable construction, commutation, and referencing are system-specific. Do not transfer a generic phase-swap reversal rule to a servo. Replacement and motion-direction changes need the approved equipment and engineering process.',
      'Safe Torque Off is a safety function within a validated system; it does not establish electrical isolation, discharge the DC link, or guarantee a stationary load. Inertia, gravity, and external forces can still move an axis. A holding brake alone is not permission to work beneath a suspended load; use the approved hazardous-energy and mechanical-restraint process.',
    ],
    questions: [
      { prompt: 'A servo has excessive following error after a mechanical collision. What does that establish?', choices: ['The gains must be increased', 'A mismatch between commanded and reported motion that needs cause-specific investigation', 'All feedback is healthy'], correct: 1, explanation: 'Following error describes a discrepancy. Mechanical damage, binding, feedback, and configuration are among the possibilities; the error alone does not select a repair or tuning change.' },
      { prompt: 'STO is active. Which statement remains true?', choices: ['All drive circuits are electrically isolated', 'The axis cannot move under gravity', 'Electrical and mechanical hazards still require the approved control and verification process'], correct: 2, explanation: 'Removing torque capability is not the same as isolating energy or restraining a load. The exact safety function and system behavior need their validated context.' },
      { prompt: 'Someone proposes swapping servo motor phases to reverse motion. What should happen?', choices: ['Reject the generic swap and use the approved system-specific engineering procedure', 'Apply the induction-motor shortcut to every servo', 'Try random combinations until the axis moves'], correct: 0, explanation: 'Servo commutation and feedback relationships are system-specific. Unapproved phase changes can produce faults or hazardous motion.' },
    ],
  },
];
