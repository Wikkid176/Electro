import type { TeachingLesson } from './types.ts';

export const panelTeaching = {
  'panel-layout': {
    coach: 'A panel layout is an engineered arrangement of heat, access and signal paths—not just a tidy picture.',
    sections: [
      { title: 'Position affects performance', body: 'Moving a drive or duct can change airflow, cable length, service access and interference. Match the controlled layout and component identity before considering appearance. A visually neat change can violate an equipment requirement or an evaluated construction condition even when all the wires still reach.' },
      { title: 'Routes serve different needs', body: 'Power, drive-output and sensitive feedback circuits have different routing concerns. Equipment instructions and the approved plan govern separation, bend limits, cooling and environmental conditions. There is no universal clearance or duct-fill number supplied here. Resolve a conflict through engineering instead of applying a distance remembered from another machine.' },
    ],
    visual: { kind: 'compare', component: 'drive', title: 'Three layout questions', caption: 'Conceptual zones, not a dimensioned construction drawing.', nodes: [
      { label: 'Heat and airflow', detail: 'Required cooling paths must remain effective with the actual ducts and nearby equipment.' },
      { label: 'Sensitive signals', detail: 'Feedback routing follows the approved noise-control and cable requirements.' },
      { label: 'Access and movement', detail: 'Terminals, doors and service areas need the specified access and movement provisions.' },
    ] },
    example: { scenario: 'A proposed duct position makes the panel symmetrical but covers a documented cooling route.', steps: ['Compare the proposal with the current approved plan.', 'Identify cooling as a functional conflict, not a cosmetic issue.', 'Hold the change for the responsible design review.'], takeaway: 'Neatness supports workmanship, but it does not establish an acceptable design.' },
    practice: { prompt: 'What should determine a feedback cable route near drive wiring?', choices: ['The approved routing plan and exact equipment instructions.', 'Whichever route is shortest.'], correct: 0, explanation: 'Signal performance, protection and cable limits depend on the application. Shortness alone does not establish suitability.' },
  },
  'panel-terminations': {
    coach: 'A reliable termination is a matched system: conductor, terminal, preparation and tooling.',
    sections: [
      { title: 'Physical fit is only one observation', body: 'A terminal’s permitted conductor materials, sizes, strand classes, preparation and conductor count come from its exact instructions. Ferrules are not automatically accepted or required everywhere. Two wires fitting in an opening does not establish that the arrangement is approved.' },
      { title: 'Acceptance needs evidence', body: 'Preparation defects and incorrect tightening can both undermine a connection. The specified method, compatible tools and required records matter. A witness stripe only proves a mark is present. Existing connections need their equipment-specific maintenance process; a universal re-tightening habit can damage rather than improve them.' },
    ],
    visual: { kind: 'chain', component: 'terminal', title: 'The termination compatibility chain', caption: 'Conceptual checks only; no strip length or tightening value is supplied.', nodes: [
      { label: 'Conductor', detail: 'Material, size, strand class and quantity match the permitted arrangement.' },
      { label: 'Preparation', detail: 'The approved end treatment and compatible tooling match that conductor and terminal.' },
      { label: 'Connection', detail: 'The specified assembly and tightening method is followed by authorized personnel.' },
      { label: 'Acceptance record', detail: 'Required inspection and traceable evidence establish what was actually verified.' },
    ] },
    example: { scenario: 'A fictional connection has a paint mark, but no preparation or tightening record.', steps: ['Record the visible mark as an observation.', 'Keep preparation, tool condition and tightening method as unproven.', 'Resolve the missing acceptance evidence under the approved process.'], takeaway: 'A visible mark cannot substitute for the work it is supposed to document.' },
    practice: { prompt: 'A twin ferrule fits. Does that alone permit two conductors in a terminal?', choices: ['Yes, every twin ferrule approves the arrangement.', 'No, the complete arrangement must be permitted by the exact instructions.'], correct: 1, explanation: 'Conductor count, ferrule type, terminal acceptance and tooling must all match. Fit alone proves none of those conditions.' },
  },
  'panel-bonding': {
    coach: 'Return, protective bond and shield each have a job. Similar-looking metal connections do not make those jobs identical.',
    sections: [
      { title: 'Normal current and protection', body: 'A circuit return carries intended operating current. Protective bonding connects specified exposed conductive parts into the designed protective path. A deliberate design bond may relate a return to earth, but that relationship must be established from the design rather than guessed from a 0 V label.' },
      { title: 'Interference control has its own design', body: 'Cable shields help manage interference as part of a system. Termination, connector construction and bonding method depend on the interface and equipment. A shield is not automatically a protective conductor. Paint, hinges and mounting hardware also affect protective paths; visual metal contact is not accepted verification.' },
    ],
    visual: { kind: 'compare', title: 'Three purposes to keep separate', caption: 'Purpose map only; this lesson provides no bonding or shield-connection design.', nodes: [
      { label: 'Circuit return', value: 'Operating path', detail: 'Carries intended circuit current under the specified design.' },
      { label: 'Protective bonding', value: 'Protective path', detail: 'Connects specified conductive parts using engineered provisions and required verification.' },
      { label: 'Cable shield', value: 'Interference control', detail: 'Works with routing, equipment and termination requirements; there is no universal one-end rule.' },
    ] },
    example: { scenario: 'A metal door swings on painted hinges and appears electrically connected.', steps: ['Separate mechanical movement from protective-path performance.', 'Locate the designed bonding provisions in the approved documentation.', 'Require the applicable verification instead of accepting appearance.'], takeaway: 'Purpose and verified construction define the path, not visual similarity.' },
    practice: { prompt: 'Can a general “shield both ends” rule be transferred to every interface?', choices: ['No. Use the applicable interface and system requirements.', 'Yes. Every signal uses the same shield arrangement.'], correct: 0, explanation: 'Signal types and equipment systems differ. Conflicting requirements need responsible engineering resolution.' },
  },
  'panel-protection': {
    coach: 'Follow which device protects which path, then keep normal-load and fault duties separate.',
    sections: [
      { title: 'Distribution has branches', body: 'A one-line summarizes incoming and downstream relationships. It can help identify which protective devices serve which paths, but it does not show every physical connection. Branch relationships are useful for understanding the system; they cannot establish isolation or permission to operate equipment.' },
      { title: 'Coordination is a system question', body: 'Continuous current, interrupting duty and withstand describe different conditions. Trip curves and coordination depend on fault information, equipment and settings together. Delaying one protective device can change fault exposure. This teaching map cannot authorize settings changes, repeated resetting, bypassing or breaker handling.' },
    ],
    visual: { kind: 'chain', component: 'breaker', title: 'Fictional distribution hierarchy', caption: 'Functional hierarchy only; no protection selection or settings.', nodes: [
      { label: 'Incoming path', detail: 'A source feeds the documented distribution system.' },
      { label: 'Upstream protection', detail: 'Its duty and behavior must be coordinated with the complete system.' },
      { label: 'Branch protection', detail: 'Each documented downstream path has its applicable protection arrangement.' },
      { label: 'Loads', detail: 'Normal load behavior does not define available fault current or assembly capability.' },
    ] },
    example: { scenario: 'A branch trips and someone proposes a longer upstream delay to improve continuity.', steps: ['Identify the proposal as a system protection change.', 'Recognize that selectivity and fault exposure must both be considered.', 'Route the decision through the responsible study and engineering process.'], takeaway: 'A protective-device change cannot be evaluated from production continuity alone.' },
    practice: { prompt: 'Is a matching continuous-current marking enough to approve a replacement breaker?', choices: ['Yes, current is its only duty.', 'No. Voltage, fault duty, configuration and approved construction also matter.'], correct: 1, explanation: 'Normal current duty is not interchangeable with interrupting capability or application suitability.' },
  },
  'panel-transformers': {
    coach: 'A transformer changes voltage through magnetic coupling. It does not create extra power.',
    sections: [
      { title: 'An ideal ratio model', body: 'Changing magnetic flux couples transformer windings. In the ideal sinusoidal model, winding voltage ratio follows turns ratio. A lower secondary voltage does not mean free energy: ideal power balance changes the corresponding current relationship, and real devices add losses and limits.' },
      { title: 'A calculation is not a connection plan', body: 'A single-phase apparent-power calculation uses RMS volts multiplied by RMS amperes. Actual suitability also includes duty, inrush, regulation, temperature and protection. Multiple windings and taps need the exact nameplate and approved diagram. Similar appearance cannot establish jumper arrangements or safe downstream conditions.' },
    ],
    visual: { kind: 'compare', component: 'transformer', title: 'Ideal 3:1 voltage example', caption: 'Invented sinusoidal model; no tap or terminal connections are provided.', nodes: [
      { label: 'Primary', value: '90 V RMS', detail: 'The model defines this voltage across the primary winding.' },
      { label: 'Turns ratio', value: '3 : 1', detail: 'The primary has three times the modeled secondary turns.' },
      { label: 'Secondary', value: '30 V RMS', detail: '90/3 = 30 V RMS in the ideal no-loss voltage-ratio calculation.' },
    ] },
    example: { scenario: 'A fictional single-phase load takes 0.5 A RMS at 20 V RMS.', steps: ['Identify the requested quantity as apparent power.', 'Multiply 20 V RMS by 0.5 A RMS.', 'Record 10 VA, without treating that value alone as transformer selection evidence.'], takeaway: 'Ratio and VA explain a model; exact equipment documentation governs actual suitability.' },
    practice: { prompt: 'An ideal 5:1 primary-to-secondary ratio has 100 V RMS on the primary. What is the secondary model value?', choices: ['20 V RMS', '500 V RMS'], correct: 0, explanation: 'The secondary has one fifth the modeled turns, so voltage is 100/5 = 20 V RMS.' },
  },
  'panel-control-devices': {
    coach: 'A relay input, a switching contact and a timer mode describe separate functions.',
    sections: [
      { title: 'Input does not define output duty', body: 'A relay coil or electronic input operates a switching function. Its input rating does not tell you which load its contacts may switch. Contact duty depends on load type, operating conditions and device instructions. Terminal accessories also need documented system compatibility rather than physical-fit assumptions.' },
      { title: 'Read a timer’s defined behavior', body: 'For the ideal on-delay model here, enable must remain true for three uninterrupted seconds before an initially open output closes. Removing enable resets the timer and opens the output immediately. Other devices and timer modes may differ; their timing diagrams, triggers and reset conditions define the actual behavior.' },
    ],
    visual: { kind: 'timeline', component: 'relay', title: 'Defined three-second on-delay', caption: 'Initially reset ideal model. Tap each stage; no actual timer settings are specified.', nodes: [
      { label: '0 s · enable true', value: 'Output open', detail: 'The uninterrupted timing interval starts.' },
      { label: '2 s · still enabled', value: 'Output open', detail: 'Two seconds is short of the defined three-second delay.' },
      { label: '3 s · still enabled', value: 'Output closed', detail: 'The complete uninterrupted delay has elapsed.' },
      { label: 'Enable removed', value: 'Reset', detail: 'The modeled output opens and timing resets immediately.' },
    ] },
    example: { scenario: 'Enable lasts one second, disappears, then returns for two seconds.', steps: ['The first interval never completes the three-second delay.', 'Removal resets the modeled timing; intervals do not accumulate.', 'The second interval is only two seconds, so the output still never closes.'], takeaway: 'Timer names are shorthand; the defined timing and reset behavior determine the answer.' },
    practice: { prompt: 'After enable is removed, does this on-delay model retain two seconds for the next interval?', choices: ['Yes, it always accumulates.', 'No. This defined model resets.'], correct: 1, explanation: 'The specified model requires one uninterrupted three-second interval. Other timer modes must be read from their own diagrams.' },
  },
  'panel-inspection': {
    coach: 'Inspect against requirements, and report what you can actually support.',
    sections: [
      { title: 'Compare expected with observed', body: 'A useful inspection begins with controlled drawings, parts information, equipment instructions and the approved checklist. Record objective discrepancies such as damaged conductors, missing labels, blocked cooling, undocumented entries or incomplete bonding evidence. An inspection finding needs enough context for another person to verify it.' },
      { title: 'Finding is not acceptance', body: 'A fitting that looks sealed may lack enclosure compatibility evidence. A tightening stripe may lack its preparation record. Resolving those findings and completing required verification are different from merely making a visual change. Acceptance, energization and return to service remain decisions under the applicable approved processes.' },
    ],
    visual: { kind: 'document', component: 'terminal', title: 'Fictional inspection comparison', caption: 'Original observations; no real panel or source print is shown.', nodes: [
      { label: 'Expected', value: 'Clear cooling route', detail: 'The controlled plan calls for an unobstructed cooling path.' },
      { label: 'Observed', value: 'New duct in route', detail: 'The recorded obstruction conflicts with the stated plan.' },
      { label: 'Finding', value: 'Unresolved conflict', detail: 'Record identity and context and obtain approved resolution; the observation does not authorize energization.' },
    ] },
    example: { scenario: 'A cabinet entry fitting looks tight but has no compatibility documentation.', steps: ['Record the fitting identity and missing evidence.', 'Avoid claiming the intended enclosure rating is preserved from appearance.', 'Obtain the required compatibility and acceptance evidence through the approved process.'], takeaway: 'A good inspection separates observations, requirements and unresolved conclusions.' },
    practice: { prompt: 'Which report is more useful?', choices: ['“Duct D conflicts with the documented cooling route; review unresolved.”', '“Looks fine; ready to energize.”'], correct: 0, explanation: 'The first statement identifies a checkable discrepancy and its unresolved status. Appearance alone cannot establish acceptance.' },
  },
} satisfies Record<string, TeachingLesson>;
