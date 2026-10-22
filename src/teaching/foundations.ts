import type { TeachingLesson } from './types.ts';

export const foundationTeaching = {
  safety: {
    coach: 'Before we study circuits, learn the difference between stopping a machine and controlling its energy.',
    sections: [
      { title: 'Stopped describes behavior', body: 'A machine can stop because a controller removed a command, an overload operated, or a connection failed. Those events tell us about operation. They do not identify every supply inside the machine. A dark screen is another observation, not an energy-control certificate.' },
      { title: 'Energy control answers a different question', body: 'An electrically safe work condition requires the applicable formal process, performed by qualified and authorized people. Electrical, mechanical, pneumatic and stored-energy hazards must be addressed for the actual task. Your job in this lesson is to recognize when the evidence is insufficient, rather than infer safety from appearance.' },
    ],
    visual: { kind: 'energy', title: 'One machine, several possible hazards', caption: 'Tap each source. This is a hazard-awareness map, not an isolation procedure.', nodes: [
      { label: 'Electrical supply', value: 'Voltage', detail: 'A control command can stop motion while a supply remains present.' },
      { label: 'Stored charge', value: 'Capacitor', detail: 'Stored electrical energy can remain after the incoming supply changes state.' },
      { label: 'Raised load', value: 'Gravity', detail: 'A suspended or elevated load can move without a motor command.' },
      { label: 'Compressed air', value: 'Pressure', detail: 'Pressure may remain in parts of a system after the machine stops.' },
    ] },
    example: { scenario: 'A conveyor stops and its screen goes dark. A learner says the cabinet must now be safe.', steps: ['List what is actually observed: no motion and no display.', 'Notice what is missing: source identification, task-specific energy control and verification.', 'Keep the cabinet-work decision with qualified, authorized personnel using the approved process.'], takeaway: 'An observation about machine behavior cannot establish that hazardous energy is controlled.' },
    practice: { prompt: 'A different machine is silent after STOP is pressed. Which statement uses only the available evidence?', choices: ['It is stopped; its energy-control status is not established.', 'Every conductor and moving part is now safe.'], correct: 0, explanation: 'Silence is an operating observation. It does not establish electrical isolation, discharge or restraint of stored mechanical energy.' },
  },
  'energy-sources': {
    coach: 'Think like an energy detective: follow every possible source, not just the biggest switch.',
    sections: [
      { title: 'Incoming energy and stored energy', body: 'A main electrical feed supplies energy from outside a machine. A backup battery is another supply. A capacitor, spring or raised load stores energy already inside the system. These categories help organize questions, but the actual machine documentation and task-specific procedure determine which hazards exist.' },
      { title: 'Hazards can return', body: 'Energy control must remain effective during the work. A separate feed, accumulating pressure or external movement can change conditions after an initial shutdown. If the documented sources and the equipment disagree, that discrepancy needs resolution; it is not a reason to improvise a missing step.' },
    ],
    visual: { kind: 'energy', title: 'Packaging cell energy map', caption: 'Each card is a separate question for the approved process.', nodes: [
      { label: 'Main feed', value: 'Incoming', detail: 'The main feed is one documented supply, not automatically the whole system.' },
      { label: 'Backup unit', value: 'Separate', detail: 'A battery-backed circuit may not follow the main disconnect state.' },
      { label: 'Air reservoir', value: 'Stored', detail: 'A reservoir can retain pressure after its upstream source is stopped.' },
      { label: 'Lifted assembly', value: 'Mechanical', detail: 'Gravity remains relevant even if every motor is stopped.' },
    ] },
    example: { scenario: 'A training cell has its main feed open, but the current equipment register also lists a backup supply.', steps: ['Compare the claim “main feed open” with the list of sources.', 'Identify the backup as an unresolved source rather than assume it follows the main feed.', 'Refer the discrepancy to the approved energy-control process before service decisions.'], takeaway: 'A complete source inventory is necessary; a single switch position is incomplete evidence.' },
    practice: { prompt: 'Which entry belongs in a hazardous-energy review?', choices: ['Only the highest-voltage supply.', 'The raised load and backup supply as well as the main feed.'], correct: 1, explanation: 'Voltage is only one hazard dimension. Stored mechanical energy and independent supplies can remain relevant to the task.' },
  },
  'loto-roles': {
    coach: 'Good teamwork starts by knowing who operates, who controls energy and who is qualified for the electrical task.',
    sections: [
      { title: 'Different responsibilities', body: 'An affected employee operates the equipment or works in the area affected by energy control. An authorized employee has employer-designated responsibilities and training for the applicable energy-control work. Communication connects these roles so nobody mistakes a planned shutdown for equipment ready to restart.' },
      { title: 'Authorization is specific', body: 'Electrical qualification concerns the knowledge and skills needed for particular electrical hazards and tasks. Lockout authorization concerns responsibilities under the employer’s program. A person may need both, and neither follows from a job title or game score. Stopping, isolating, protecting people and verifying each serve different purposes.' },
    ],
    visual: { kind: 'compare', title: 'Roles are related, not interchangeable', caption: 'These descriptions explain responsibilities; they do not grant authorization.', nodes: [
      { label: 'Affected employee', detail: 'Understands the purpose of the controls and follows the workplace communication and operating restrictions.' },
      { label: 'Authorized employee', detail: 'Performs designated energy-control responsibilities under the applicable employer program.' },
      { label: 'Electrical qualification', detail: 'Matches the electrical task and hazards; it is separate from a generic operator or technician title.' },
    ] },
    example: { scenario: 'An operator reports a jam to a service technician. The operator has completed this app.', steps: ['Treat the operator’s symptom report as useful information.', 'Check the designated responsibilities and qualifications for the planned work.', 'Use the employer’s notification and energy-control arrangements; app completion changes no authorization.'], takeaway: 'Knowledge supports communication; formal task authorization remains essential.' },
    practice: { prompt: 'Does being designated to operate a machine automatically authorize its electrical service?', choices: ['No. The specific electrical qualifications and energy-control responsibilities must be established.', 'Yes. Operating experience grants every service role.'], correct: 0, explanation: 'Operating, energy-control and electrical-service responsibilities have different requirements. They must be assigned and supported through the employer’s process.' },
  },
  verification: {
    coach: 'A failed start attempt and an electrical verification answer different questions. Let’s separate them.',
    sections: [
      { title: 'Know what the observation tests', body: 'A start attempt may show that the machine did not respond to that command. A control fault could produce exactly that result even with hazardous voltage present. Before accepting evidence, ask which claim it actually tests and whether it covers the intended point of work.' },
      { title: 'The tester is part of the evidence', body: 'An absence-of-voltage process uses suitable equipment and qualified personnel under the approved procedure. Checking tester operation before and after the circuit assessment helps prevent a failed instrument from appearing to prove a safe condition. This conceptual lesson does not define test connections, PPE, discharge times or a field sequence.' },
    ],
    visual: { kind: 'compare', title: 'Match the claim to its evidence', caption: 'Select a claim to see the limits of its evidence.', nodes: [
      { label: 'Machine did not start', detail: 'Supported by the observed response to a command; it does not prove why it failed to start.' },
      { label: 'Voltage absence established', detail: 'Needs the applicable qualified verification process at the relevant work location, with all relevant sources addressed.' },
      { label: 'Tester is functional', detail: 'Tester-operation checks support the reliability of the assessment; appearance alone cannot establish function.' },
    ] },
    example: { scenario: 'An inspection report says only “pressed START; no response.”', steps: ['Identify the report’s limited claim: the commanded motion did not occur.', 'Consider a counterexample: a failed control supply can prevent starting while another supply remains.', 'Request the applicable verification record rather than relabel the start attempt as electrical proof.'], takeaway: 'Useful evidence must support the actual claim being made.' },
    practice: { prompt: 'A failed tester displays nothing. Why is its operation important to verify?', choices: ['A blank display always proves a de-energized circuit.', 'A failed tester can conceal a hazardous condition.'], correct: 1, explanation: 'The instrument’s ability to respond is part of reliable evidence. Qualified personnel follow the complete approved verification process.' },
  },
  'shared-protection': {
    coach: 'A shared job needs protection for each person, including during handovers.',
    sections: [
      { title: 'Personal protection inside a group process', body: 'Group energy control coordinates multiple people without erasing individual protection. A statement that someone else locked a device does not, by itself, establish your status under the approved program. The arrangement must account for every authorized worker, including contractors when applicable.' },
      { title: 'Handover is a planned transition', body: 'A shift change can create a gap if one person removes protection before the next person’s arrangements are effective. The employer’s process governs continuity, exceptional lock removal, temporary testing and return to service. Urgency does not justify an improvised transfer or removing another person’s lock.' },
    ],
    visual: { kind: 'timeline', title: 'Continuity across a shift change', caption: 'Conceptual responsibilities, not a lock-transfer procedure.', nodes: [
      { label: 'Crew at work', detail: 'Each authorized worker’s protection is accounted for under the group arrangement.' },
      { label: 'Planned handover', detail: 'The designated process maintains effective protection through the change in personnel.' },
      { label: 'Next crew', detail: 'The continuing work uses verified protection and current communication, not an assumption about the earlier shift.' },
    ] },
    example: { scenario: 'A technician is missing at shift change and their lock is still present.', steps: ['Recognize an unresolved protection and personnel-accountability issue.', 'Do not treat production pressure as authority to remove the lock.', 'Use the employer’s documented exceptional-removal and handover processes through the responsible personnel.'], takeaway: 'The protection system must account for people, not just equipment status.' },
    practice: { prompt: 'A coworker says “my lock covers you.” What is still needed?', choices: ['Confirmation of your personal protection within the approved group program.', 'Only their verbal promise.'], correct: 0, explanation: 'A group program must preserve each authorized worker’s protection. A promise does not replace that arrangement.' },
  },
  'electrical-hazards': {
    coach: 'Shock and arc flash are different hazards. Understand the distinction before comparing protective measures.',
    sections: [
      { title: 'Different injury mechanisms', body: 'Electric shock involves current through the body. An arc flash releases energy through an arc, potentially exposing people to intense heat, pressure and flying material. Because the mechanisms differ, a control aimed at one does not automatically address the other.' },
      { title: 'Assess the task and current conditions', body: 'Equipment condition, the planned task and the applicable hazard assessment inform safe-work controls. Labels and PPE information must be valid for the actual configuration. A changed protective device can make an old assessment questionable. Historical slides can introduce ideas, but they cannot select today’s task-specific PPE or authorize energized work.' },
    ],
    visual: { kind: 'compare', title: 'Two hazards, separate questions', caption: 'No protection selection or numerical boundary is supplied by this model.', nodes: [
      { label: 'Shock', value: 'Body current', detail: 'Assess the possible current path and required electrical protection within the approved task assessment.' },
      { label: 'Arc flash', value: 'Released energy', detail: 'Assess the exposure and controls using valid system information and applicable requirements.' },
      { label: 'Task controls', value: 'Complete plan', detail: 'The qualified team resolves both hazards and the appropriate work method; PPE is only one part.' },
    ] },
    example: { scenario: 'An old label is still attached after the panel’s protective device was changed.', steps: ['Identify that the configuration and assessment evidence may no longer match.', 'Keep the old label’s applicability as an unresolved question.', 'Have the responsible qualified process resolve the assessment before it is relied upon.'], takeaway: 'Familiar equipment and familiar labels do not remove the need for current applicable evidence.' },
    practice: { prompt: 'Does protection against body current automatically establish adequate arc-flash protection?', choices: ['Yes, the mechanisms are identical.', 'No, the task assessment must address both hazards.'], correct: 1, explanation: 'Current through the body and released arc energy are different mechanisms. Neither can be inferred away from protection aimed only at the other.' },
  },
  fundamentals: {
    coach: 'Let’s give voltage, current and resistance different jobs in one simple DC circuit.',
    sections: [
      { title: 'Three quantities, one relationship', body: 'Voltage is a potential difference between two points. Current is the rate of charge flow along a path. Resistance describes how an element opposes current. In an ideal resistor at steady DC, V = I × R relates the voltage across that resistor to the current through it.' },
      { title: 'Read the path before calculating', body: 'A complete intended path includes a source, a load and a return. An open path interrupts steady current in this model. That does not make every point voltage-free. A short changes the path and may allow dangerous current in real systems; it is never an experiment to perform on actual equipment.' },
    ],
    visual: { kind: 'loop', title: 'An ideal DC resistor loop', caption: 'calculation model: tap the source, load and return. Not a connection drawing.', nodes: [
      { label: 'Source', value: '24 V', detail: 'The defined source potential difference is 24 volts across the complete load path.' },
      { label: 'Resistor', value: '120 Ω', detail: 'The ideal resistance is 120 ohms. Current is 24 ÷ 120 = 0.2 amperes.' },
      { label: 'Return', value: '0.2 A', detail: 'The same 0.2 A returns along this single path. Current is not used up inside the resistor.' },
    ] },
    example: { scenario: 'A separate ideal example has 15 V across a 75 Ω resistor.', steps: ['Choose I = V ÷ R because current is unknown.', 'Substitute consistent units: 15 V ÷ 75 Ω.', 'Calculate 0.2 A. This is a model result, not a rating or a safe-work conclusion.'], takeaway: 'Keep voltage across and current through an element distinct.' },
    practice: { prompt: 'For an ideal 12 V source and 60 Ω resistor in one complete loop, what is the current?', choices: ['0.2 A', '720 A'], correct: 0, explanation: 'I = V/R = 12/60 = 0.2 A. Multiplying voltage by resistance does not produce current.' },
  },
  'electrical-units': {
    coach: 'Units tell us what a number means. Prefixes tell us its scale.',
    sections: [
      { title: 'Name the quantity first', body: 'Volts describe voltage, amperes describe current, ohms describe resistance and watts describe power. Power is a rate of energy transfer; energy over time is a different quantity. Before using a number, identify the quantity and keep its unit attached to the calculation.' },
      { title: 'Convert before substituting', body: 'Milli means one thousandth and kilo means one thousand. A small prefix can change a result by a factor of a thousand. Write a conversion explicitly, cancel the old unit and then use a consistent set of units in your formula. AC or DC also matters when interpreting a specified voltage or instrument function.' },
    ],
    visual: { kind: 'compare', title: 'Same quantity, different scale', caption: 'Tap a conversion to unpack the prefix.', nodes: [
      { label: 'Current', value: '50 mA = 0.050 A', detail: 'Multiply 50 by 0.001. The quantity remains current; only its unit scale changes.' },
      { label: 'Resistance', value: '3 kΩ = 3,000 Ω', detail: 'Multiply 3 by 1,000 before using ohms in a formula.' },
      { label: 'Power', value: '2 W', detail: 'Two watts is a rate of energy transfer, not a current or a resistance.' },
    ] },
    example: { scenario: 'An ideal calculation needs the current listed as 80 mA.', steps: ['Recognize mA as milliamperes, not amperes.', 'Use 80 × 0.001 A.', 'Write 0.080 A and keep the unit with the value.'], takeaway: 'A correct number with the wrong unit represents a different physical claim.' },
    practice: { prompt: 'Which is equivalent to 1.5 kΩ?', choices: ['0.0015 Ω', '1,500 Ω'], correct: 1, explanation: 'Kilo means 1,000. Therefore 1.5 × 1,000 = 1,500 ohms.' },
  },
  'circuit-paths': {
    coach: 'Count the paths before choosing a series or parallel calculation.',
    sections: [
      { title: 'Series means one intended path', body: 'In an ideal series resistor network, the same current passes through every resistor. Resistances add. Each resistor has a voltage drop, and those drops add to the source voltage. Current is not consumed as it passes through the first resistor.' },
      { title: 'Parallel means shared end nodes', body: 'Parallel branches connect between the same two nodes, so each branch has the same voltage. Branch currents depend on branch resistance and add at the source. Opening one branch may leave another supplied. Real circuits can have alternate feeds and non-ideal loads, so always keep the model’s assumptions visible.' },
    ],
    visual: { kind: 'compare', title: 'Series and parallel at 12 V', caption: 'Ideal resistors only. Select a path model to compare what stays equal.', nodes: [
      { label: 'Series: 60 Ω + 60 Ω', value: '0.1 A throughout', detail: 'Total is 120 Ω. Current is 12/120 = 0.1 A, with 6 V across each equal resistor.' },
      { label: 'Parallel: 60 Ω and 60 Ω', value: '0.4 A total', detail: 'Each branch has 12 V and takes 0.2 A. The source supplies their sum, 0.4 A.' },
      { label: 'One parallel branch open', value: '0.2 A remains', detail: 'The intact 60 Ω branch still has its supply in this ideal model.' },
    ] },
    example: { scenario: 'Two 50 Ω resistors are in series across an ideal 10 V source.', steps: ['Add series resistance: 50 + 50 = 100 Ω.', 'Calculate one path current: 10/100 = 0.1 A.', 'Each drop is 0.1 × 50 = 5 V; the drops add to 10 V.'], takeaway: 'Series shares current; parallel shares voltage across common nodes.' },
    practice: { prompt: 'Two 100 Ω branches each have 20 V across them. What is their total current?', choices: ['0.4 A', '0.1 A'], correct: 0, explanation: 'Each parallel branch takes 20/100 = 0.2 A. Adding the two branch currents gives 0.4 A.' },
  },
  'electrical-power': {
    coach: 'Power describes how quickly energy is transferred. Let’s calculate it without confusing input and output.',
    sections: [
      { title: 'DC input power', body: 'For a steady DC load, P = V × I. An ideal resistor also follows V = IR, so substitution gives P = I²R and P = V²/R. These equivalent forms help when different quantities are known. Doubling current at unchanged resistance gives four times the resistive heating.' },
      { title: 'Know where the shortcut ends', body: 'RMS AC voltage multiplied by RMS AC current gives apparent power in VA for a single-phase case. Real power in watts also depends on power factor. A motor has losses, so its electrical input and mechanical output are different. An ideal DC formula cannot establish a real machine’s efficiency or loading.' },
    ],
    visual: { kind: 'scale', title: 'Current and resistive heating', caption: 'Same ideal 10 Ω resistor. Tap each current; compare the power bars.', nodes: [
      { label: '1 A', value: '10 W', level: 0.111, detail: 'P = 1² × 10 = 10 W. This is the baseline power for the same ideal 10 Ω resistor.' },
      { label: '2 A', value: '40 W', level: 0.444, detail: 'P = 2² × 10 = 40 W: twice the current produces four times the power.' },
      { label: '3 A', value: '90 W', level: 1, detail: 'P = 3² × 10 = 90 W: three times the current produces nine times the power.' },
    ] },
    example: { scenario: 'An ideal steady DC load has 10 V across it and takes 0.3 A.', steps: ['Choose P = V × I for the stated DC conditions.', 'Multiply 10 by 0.3.', 'Record 3 W of electrical input power, without claiming a mechanical output.'], takeaway: 'Always identify the power quantity and the model before calculating.' },
    practice: { prompt: 'At unchanged resistance, current triples. What happens to resistive power?', choices: ['It triples.', 'It becomes nine times as large.'], correct: 1, explanation: 'P = I²R. Replacing I with 3I produces 9I²R, so resistive power rises by a factor of nine rather than three.' },
  },
  'meter-setup': {
    coach: 'A display is useful only when the instrument configuration suits the question.',
    sections: [
      { title: 'Function and input work together', body: 'Selecting a voltage function does not make a current input a voltage input. A current input can form a low-resistance path, making a mismatch hazardous across a source. The virtual bench blocks that combination. Physical testing needs qualified personnel and the approved equipment-specific process.' },
      { title: 'Suitability includes the whole setup', body: 'The instrument, leads, probes and accessories must match the task, ratings and conditions together. Resistance and continuity functions generate their own test signal and need the appropriate de-energized condition. A large display range, a familiar case or a low expected number does not establish a suitable test arrangement.' },
    ],
    visual: { kind: 'meter', title: 'Virtual instrument decision cards', caption: 'Conceptual configurations only; no physical test connections are shown.', nodes: [
      { label: 'DC voltage question', value: 'V DC', detail: 'Function, input, ratings, condition and task all need to agree.' },
      { label: 'Current-input mismatch', value: 'BLOCK', detail: 'Changing the dial cannot turn the wrong input into a suitable voltage arrangement.' },
      { label: 'Powered resistance test', value: 'BLOCK', detail: 'External energy is incompatible with the modeled resistance-test condition.' },
    ] },
    example: { scenario: 'A virtual voltage task is configured with the A input.', steps: ['Identify the requested quantity as voltage.', 'Compare that quantity with the selected current input.', 'Keep the reading blocked and correct the simulated mismatch; do not model a hazardous experiment.'], takeaway: 'A valid reading requires a suitable complete configuration, not just a selected dial label.' },
    practice: { prompt: 'A meter case has a suitable rating, but its test lead is damaged. Is the setup acceptable?', choices: ['No. The complete setup and its condition must be suitable.', 'Yes. Only the case marking matters.'], correct: 0, explanation: 'Leads and accessories are part of the measurement system. Damaged equipment requires the applicable removal-from-use process.' },
  },
  'meter-readings': {
    coach: 'Read the function first. The same display characters can mean different things in different modes.',
    sections: [
      { title: 'Interpret the indication', body: 'In this resistance model, OL means the open path exceeds the range; it is not zero resistance. A negative DC voltage describes polarity relative to the chosen reference. A continuity tone indicates that an instrument-specific threshold has been met, not that an entire component is healthy.' },
      { title: 'Separate the number from the conclusion', body: 'The path being measured, parallel branches, range and signal type all affect interpretation. A low voltage result does not establish an electrically safe work condition. A plausible indication can still answer the wrong question if the reference or assumptions are wrong. Actual display definitions come from the instrument manual.' },
    ],
    visual: { kind: 'meter', title: 'Three displays, three meanings', caption: 'Select a display and read the function-specific explanation.', nodes: [
      { label: 'Resistance: open path', value: 'OL', detail: 'The modeled open is beyond the resistance range, rather than a zero-ohm path.' },
      { label: 'DC: reversed reference', value: '−18 V', detail: 'The measured potential difference is negative relative to the defined reference.' },
      { label: 'Continuity threshold met', value: 'TONE', detail: 'The threshold is met; load capability, correct path identity and safe-work status remain unproven.' },
    ] },
    example: { scenario: 'An ideal DC display changes from +9 V to −9 V when the reference orientation is reversed.', steps: ['Compare magnitudes: both are nine volts.', 'Identify the sign as relative polarity.', 'Do not convert that sign change into a claim that the source failed.'], takeaway: 'Mode, reference and context give the display its meaning.' },
    practice: { prompt: 'In the isolated open-path resistance model, is OL the same as a zero-ohm connection?', choices: ['Yes.', 'No. It represents an out-of-range/open path here.'], correct: 1, explanation: 'Zero resistance and an open path are opposite conditions in this ideal model. Actual display meanings depend on function and manual.' },
  },
  'measurement-evidence': {
    coach: 'A measurement is evidence under specific conditions. Those conditions are part of the result.',
    sections: [
      { title: 'A load can reveal a weak path', body: 'For an ideal resistance, voltage drop grows with current. A connection can appear unremarkable with almost no load, then lose voltage as current rises. Comparing supplied records at different loads can test a hypothesis. It does not authorize probing, bypassing or modifying a real circuit.' },
      { title: 'Every capture has limits', body: 'A clamp responds to the combined magnetic effect of enclosed conductors; equal opposite currents can cancel. Logging, Min/Max and true-RMS features also have bandwidth, waveform and timing limits. An apparently normal record only covers what the instrument was capable of observing under those conditions.' },
    ],
    visual: { kind: 'scale', title: 'Connection: 4 Ω unchanged', caption: 'Supplied ideal DC records, not measurement instructions.', nodes: [
      { label: '0.1 A load', value: '0.4 V drop', level: 0.2, detail: 'V = IR = 0.1 × 4. A small current produces a smaller drop.' },
      { label: '0.3 A load', value: '1.2 V drop', level: 0.6, detail: 'The same resistance now drops three times as much voltage.' },
      { label: '0.5 A load', value: '2.0 V drop', level: 1, detail: 'Changing the load changes the evidence even though modeled resistance is unchanged.' },
    ] },
    example: { scenario: 'A supplied ideal record lists 1.5 V across a connection at 0.3 A.', steps: ['State the resistive model and the recorded conditions.', 'Calculate R = V/I = 1.5/0.3 = 5 Ω.', 'Report the modeled resistance as a hypothesis aid, not a unique physical cause.'], takeaway: 'A numerical inference is only as strong as its assumptions and capture conditions.' },
    practice: { prompt: 'A one-second logger shows no anomaly. Can it exclude an event lasting two milliseconds?', choices: ['No. The event may fall outside its capture behavior.', 'Yes. A normal trend excludes every short event.'], correct: 0, explanation: 'A fast event can occur between samples. Sampling, triggering and capture limits must support the claim.' },
  },
} satisfies Record<string, TeachingLesson>;
