import { safetyLessons } from './safety-content.ts';
import { fundamentalsLessons } from './fundamentals-content.ts';
import { schematicLessons } from './schematic-content.ts';
import { standardsLessons } from './standards-content.ts';
import { panelLessons } from './panel-content.ts';
import { troubleshootingLessons } from './troubleshooting-content.ts';
import { motionLessons } from './motion-content.ts';
import { sensorLessons } from './sensor-content.ts';

export type PracticeReference = { id: string; title: string; context: string; content: string };

export type Question = {
  prompt: string;
  choices: string[];
  correct: number;
  explanation: string;
  referenceCards?: PracticeReference[];
};

export type Lesson = {
  id: string;
  title: string;
  category: string;
  symbol: string;
  minutes: number;
  brief: string;
  points: string[];
  questions: Question[];
};

// Original training scenarios. Reference prints must never be bundled here.
export const lessons: Lesson[] = [
  {
    id: 'safety', title: 'Start with safety', category: 'FOUNDATIONS', symbol: '01', minutes: 4,
    brief: 'A machine that looks stopped may still contain hazardous energy. Build the right mindset before studying the circuit.',
    points: [
      'A stop button or emergency stop is a control function. It does not establish an electrically safe work condition.',
      'Electrical work requires qualified personnel, site-specific procedures, and control of every hazardous energy source, including stored energy.',
      'Lockout/tagout and absence-of-voltage verification are parts of a formal procedure. A dark indicator or open contactor is not proof of isolation.',
    ],
    questions: [
      { prompt: 'A conveyor is stopped and its power lamp is dark. What can you conclude?', choices: ['The cabinet is safe to touch', 'The lamp alone does not prove isolation', 'All stored energy is gone'], correct: 1, explanation: 'Indicators can fail or represent only part of a system. Qualified personnel must follow the complete site-specific safe-work procedure.' },
      { prompt: 'Which item can remain hazardous after a machine stops?', choices: ['Only its software', 'Nothing if the motor is quiet', 'Stored electrical or mechanical energy'], correct: 2, explanation: 'Capacitors, moving loads, pneumatic pressure, and other stored-energy sources can remain hazardous after stopping.' },
      { prompt: 'Who should perform electrical testing on industrial equipment?', choices: ['Qualified, authorized personnel following site procedures', 'Anyone who completed this game', 'Anyone wearing gloves'], correct: 0, explanation: 'This app provides conceptual practice. It does not qualify or authorize anyone to work on industrial electrical systems.' },
    ],
  },
  ...safetyLessons,
  {
    id: 'fundamentals', title: 'Follow the current', category: 'CIRCUIT BASICS', symbol: '07', minutes: 4,
    brief: 'Understand the relationship between voltage, current, and resistance in an idealized DC circuit.',
    points: [
      'Voltage is electrical potential difference. Current is the flow of charge, and resistance opposes that flow.',
      'For an ideal resistor, Ohm’s law is V = I × R. With 24 V across 120 Ω, current is 0.2 A.',
      'A complete path is required for steady current. An open switch breaks the intended path; a short circuit can create dangerous fault current.',
    ],
    questions: [
      { prompt: 'A 120 Ω resistor has 24 V across it. What is the ideal current?', choices: ['5 A', '0.2 A', '2,880 A'], correct: 1, explanation: 'I = V ÷ R = 24 ÷ 120 = 0.2 amperes. This is an ideal resistor calculation, not a rule for all industrial loads.' },
      { prompt: 'What happens to the intended current path when a series switch opens?', choices: ['It is interrupted', 'It always doubles', 'The supply voltage becomes zero everywhere'], correct: 0, explanation: 'An open series switch interrupts that path. Other parts of the circuit may still be energized.' },
      { prompt: 'At the same voltage, increasing an ideal resistor’s resistance will…', choices: ['Increase its current', 'Leave its current unchanged', 'Decrease its current'], correct: 2, explanation: 'Ohm’s law gives I = V/R. Increasing resistance reduces current at a fixed voltage.' },
    ],
  },
  ...fundamentalsLessons,
  {
    id: 'motor', title: 'Make it hold', category: 'MOTOR CONTROLS', symbol: '14', minutes: 5,
    brief: 'Explore a simplified three-wire motor starter: start, stop, a coil, and an auxiliary holding contact.',
    points: [
      'A momentary START contact can energize a contactor coil when the control path is healthy.',
      'An auxiliary holding contact can keep that coil energized after START is released. STOP or an overload contact interrupts the path.',
      'Overload protection and short-circuit protection serve different purposes. An overload reset must not cause an unintended restart.',
    ],
    questions: [
      { prompt: 'What keeps a basic three-wire starter coil energized after START is released?', choices: ['A bypass around every protective contact', 'The motor’s noise', 'An auxiliary holding contact'], correct: 2, explanation: 'The holding contact provides a parallel path around the momentary START contact while the stop and protective contacts remain in series.' },
      { prompt: 'The overload contact opens in the control path. What should the simulated coil do?', choices: ['De-energize', 'Run faster', 'Ignore the overload'], correct: 0, explanation: 'Opening a series protective contact removes the coil’s control path. Real equipment needs appropriate protection and engineered safety functions.' },
      { prompt: 'After the simulated overload is reset, what should happen?', choices: ['The motor must start automatically', 'The motor remains stopped until a new START command', 'The overload is permanently bypassed'], correct: 1, explanation: 'The holding state has been lost. In this three-wire model, a new START command is needed after reset.' },
    ],
  },
  {
    id: 'schematics', title: 'Read the logic', category: 'SCHEMATICS', symbol: '15', minutes: 4,
    brief: 'Separate the logical story on a schematic from the physical arrangement inside a panel.',
    points: [
      'A schematic shows functional relationships. A wiring or layout drawing describes physical connections or locations.',
      'Normally open and normally closed describe a contact in its specified normal, unactuated state. Always check the drawing’s conventions.',
      'Device tags and cross-references connect related contacts and coils across a drawing. Read the legend and revision information first.',
    ],
    questions: [
      { prompt: 'Does a schematic necessarily show each device’s physical location?', choices: ['No, it mainly shows functional relationships', 'Yes, it is always drawn to scale', 'Only for motors'], correct: 0, explanation: 'Use the appropriate panel layout and wiring documentation for physical locations. Schematic placement primarily communicates circuit function.' },
      { prompt: '“Normally open” describes a contact in which state?', choices: ['Whenever a motor is running', 'Its specified normal, unactuated state', 'Every possible operating state'], correct: 1, explanation: 'The normal state is defined by the device and drawing conventions. An actuated contact may have a different state.' },
      { prompt: 'Two contacts share a device tag with a coil. What should you check?', choices: ['Their screen color', 'Whether they are close together on paper', 'The legend and device cross-references'], correct: 2, explanation: 'Tags and cross-references identify device relationships even when components appear on different pages.' },
    ],
  },
  ...schematicLessons,
  ...standardsLessons,
  ...panelLessons,
  ...troubleshootingLessons,
  ...motionLessons,
  ...sensorLessons,
  {
    id: 'plc', title: 'Think like a PLC', category: 'AUTOMATION', symbol: '46', minutes: 5,
    brief: 'Learn the basic input–logic–output model without confusing software status with a safe machine.',
    points: [
      'In a simplified cyclic model, a PLC reads inputs, evaluates its program, and updates outputs. Actual controllers may use additional tasks and I/O behavior.',
      'A field sensor, an input status bit, a program condition, and a physical output are related but distinct parts of the system.',
      'An ordinary PLC program or a screen indicator is not a substitute for an engineered, validated safety system.',
    ],
    questions: [
      { prompt: 'Which sequence describes a simplified cyclic PLC scan?', choices: ['Update outputs → ignore inputs', 'Read inputs → evaluate logic → update outputs', 'Run a motor → write a drawing'], correct: 1, explanation: 'This input–logic–output sequence is a useful introductory model. Consult the controller documentation for its actual execution behavior.' },
      { prompt: 'An input status bit is ON. Does that prove the machine is safe to enter?', choices: ['No', 'Yes, for every controller', 'Yes, if the screen is green'], correct: 0, explanation: 'A status bit represents a signal, not proof of a safe condition. Safe access requires the appropriate engineered controls and site procedure.' },
      { prompt: 'A commanded output is ON, but a device does not operate. What does this suggest?', choices: ['The device is definitely healthy', 'All wiring must be correct', 'The command alone does not prove the field device operated'], correct: 2, explanation: 'Software commands and physical operation are distinct. An authorized diagnosis considers the complete signal path using approved procedures.' },
    ],
  },
  {
    id: 'diagnosis', title: 'Find the missing link', category: 'TROUBLESHOOTING', symbol: '47', minutes: 5,
    brief: 'Use evidence and a clear hypothesis to reason about faults in a fictional system.',
    points: [
      'Start with the reported symptom, operating context, and current documentation. Avoid assuming that the most recently changed part is always at fault.',
      'Compare expected behavior with observed behavior. Divide the functional path into supply, permissives, commands, and response.',
      'Never defeat a protective function to make a machine run. Stop and escalate when the situation exceeds your training or authorization.',
    ],
    questions: [
      { prompt: 'A fictional starter will not run and its overload flag is active. What is the best conclusion?', choices: ['Bypass the overload', 'Replace the motor immediately', 'An unmet protective condition is relevant and needs authorized investigation'], correct: 2, explanation: 'The active protective condition is evidence. The cause must be investigated under site procedures; bypassing it is not an acceptable diagnostic shortcut.' },
      { prompt: 'What makes a troubleshooting hypothesis useful?', choices: ['It predicts an observable result that can be checked safely', 'It assumes every component has failed', 'It avoids the documentation'], correct: 0, explanation: 'A useful hypothesis explains the evidence and predicts what an appropriate, authorized check should show.' },
      { prompt: 'The next step requires work beyond your authorization. What should you do?', choices: ['Continue because the game was easy', 'Stop and involve qualified, authorized personnel', 'Disable the interlock'], correct: 1, explanation: 'Knowing when to stop and escalate is part of competent troubleshooting. Game progress never grants work authorization.' },
    ],
  },
];
