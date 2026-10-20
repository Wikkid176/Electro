import type { Lesson } from './content.ts';

// Original fictional scenarios informed by privately reviewed safety topics.
// No source drawings, device identifiers, procedures, or images are reproduced.
export const safetyLessons: Lesson[] = [
  {
    id: 'energy-sources', title: 'Find the hidden energy', category: 'SAFETY / ENERGY SOURCES', symbol: '02', minutes: 5,
    brief: 'A fictional packaging cell has a main electrical feed, battery backup, compressed air, and a raised load. One switch cannot tell the whole story.',
    points: [
      'Use current equipment documentation and the approved task-specific procedure to identify every hazardous energy source. Separate supplies and battery-backed circuits may remain energized when the main disconnect is open.',
      'Stored energy can remain in capacitors, pressurized systems, springs, elevated loads, and moving parts. A display going dark or a pressure indicator changing is not, by itself, proof that every hazard is controlled.',
      'Some energy can return or accumulate again. The approved procedure must address how isolation and stored-energy control are maintained throughout the work. If the equipment and documentation disagree, stop and escalate.',
    ],
    questions: [
      { prompt: 'The cell’s main feed is disconnected, but a backup battery is still connected. Which conclusion is sound?', choices: ['All control circuits must be dead', 'The backup supply is a separate source to account for', 'Battery power cannot create a hazard'], correct: 1, explanation: 'A backup source can continue supplying part of a system. The authorized team must identify and control every relevant source using the equipment-specific procedure.' },
      { prompt: 'A raised load is motionless and its motor is off. What hazard may remain?', choices: ['Gravity can still cause the load to move', 'None, because the motor is quiet', 'Only the display brightness'], correct: 0, explanation: 'An elevated load stores potential energy. A stopped motor does not establish that the load is secured; the approved procedure must address hazardous movement.' },
      { prompt: 'A drive display turns dark after shutdown. What does that prove about its capacitors?', choices: ['They are fully discharged', 'Their wait time is identical for every drive', 'The display alone does not establish their energy state'], correct: 2, explanation: 'An indicator is not verification of stored-energy control. Equipment instructions and the qualified person’s approved verification process determine whether the condition is safe for the task.' },
    ],
  },
  {
    id: 'loto-roles', title: 'Know your role', category: 'SAFETY / LOCKOUT BASICS', symbol: '03', minutes: 5,
    brief: 'A production operator and an authorized service technician meet before a planned shutdown. Good energy control starts with clear responsibilities.',
    points: [
      'An authorized employee is trained and designated by the employer to perform the applicable energy-control work. An affected employee operates or works around equipment involved in that work and must understand the purpose of the controls.',
      'Electrical qualification and lockout authorization concern different responsibilities. Neither is granted by a game score, job title alone, or watching another person perform a task.',
      'Normal stopping, physical energy isolation, personal protection under the lockout program, stored-energy control, and verification have different purposes. Notify affected personnel and follow the current approved procedure; a START/STOP circuit is not an energy-isolating device.',
    ],
    questions: [
      { prompt: 'An operator finds equipment locked out for service. What is the appropriate response?', choices: ['Leave the controls and locks alone and coordinate with the authorized team', 'Try START to see if production can resume', 'Borrow the service technician’s key'], correct: 0, explanation: 'Affected personnel must respect energy-control measures and coordinate through the approved process. They must not try to restart locked-out equipment.' },
      { prompt: 'A learner masters every ELECTRO mission. What new work authorization does that provide?', choices: ['Permission to remove any lock', 'Qualification for energized electrical testing', 'None; employer training, qualification, and authorization still apply'], correct: 2, explanation: 'This app supports conceptual learning. Task-specific training, demonstrated competency, and employer authorization remain separate requirements.' },
      { prompt: 'A team presses STOP before servicing a machine. Has STOP physically isolated every energy source?', choices: ['Yes, if it is a red button', 'No; normal controls and energy-isolating devices serve different purposes', 'Yes, if the PLC shows stopped'], correct: 1, explanation: 'A normal control command does not physically isolate hazardous energy. The authorized team must apply the approved equipment-specific energy-control process.' },
    ],
  },
  {
    id: 'verification', title: 'Prove before you trust', category: 'SAFETY / VERIFICATION', symbol: '04', minutes: 5,
    brief: 'The fictional cell will not start. Is that enough evidence to say every exposed conductor is de-energized?',
    points: [
      'An unsuccessful start attempt can help check a control outcome, but it cannot establish absence of voltage at the intended electrical work location. A failed control circuit could prevent starting while hazardous voltage remains.',
      'Qualified personnel use the approved absence-of-voltage process with suitable test equipment. The familiar live–dead–live concept checks the tester’s operation before and after the circuit assessment so a failed tester is not mistaken for a safe circuit.',
      'Verification must match the task, relevant sources, and point of work. This lesson does not specify test connections, instrument settings, discharge times, or PPE; those require current equipment instructions and an approved electrical safe-work procedure.',
    ],
    questions: [
      { prompt: 'The cell does not respond to START after lockout. What is still unresolved for electrical work?', choices: ['Whether the paint is dry', 'Whether the operator likes the controls', 'Whether hazardous voltage is absent at the point of work'], correct: 2, explanation: 'A no-start result is not an electrical absence-of-voltage test. Qualified personnel must complete the verification required for the particular electrical task.' },
      { prompt: 'Why check the tester’s operation again after an absence-of-voltage assessment?', choices: ['To skip the first check next time', 'To detect a tester failure that could make the earlier result unreliable', 'To authorize everyone nearby to work'], correct: 1, explanation: 'A malfunctioning tester can show a misleading result. The before-and-after checks support confidence in the assessment; they do not replace the rest of the approved process.' },
      { prompt: 'A tester gives an unexpected result or fails its operating check. What is the sound decision?', choices: ['Treat the condition as unresolved and stop for qualified investigation', 'Assume the smallest reading means safe', 'Ignore the failure if the machine cannot start'], correct: 0, explanation: 'An unexplained or unreliable result does not establish a safe work condition. Stop and have qualified, authorized personnel resolve it under the approved procedure.' },
    ],
  },
  {
    id: 'shared-protection', title: 'Protect the whole crew', category: 'SAFETY / TEAM LOCKOUT', symbol: '05', minutes: 5,
    brief: 'Two service technicians share a job, a shift handover is approaching, and production wants the machine back. Protecting people takes coordination.',
    points: [
      'Group energy control must preserve each authorized worker’s personal protection under the employer’s approved program. One person saying “I locked it” is not enough to establish everyone else’s protection.',
      'A shift or personnel change needs a planned transfer that maintains effective protection without a gap. Coordinate contractors and affected employees through the applicable employer procedures.',
      'Do not remove someone else’s lock on your own. An absent worker’s lock requires the employer’s documented exceptional-removal process. Temporary testing and return to service also require controlled procedures; energy control must be re-established and verified before servicing resumes.',
    ],
    questions: [
      { prompt: 'One technician has locked out the fictional cell. A second technician joins the job. What must the second technician establish?', choices: ['That the first technician is in a hurry', 'That sharing a key is convenient', 'Their own required protection under the approved group procedure'], correct: 2, explanation: 'The group process must account for each authorized worker. Another person’s lock or verbal assurance alone does not establish a joining worker’s required protection.' },
      { prompt: 'During a shift handover, what outcome must the transfer preserve?', choices: ['Continuous effective energy-control protection', 'A brief unprotected gap to save time', 'Automatic machine restart'], correct: 0, explanation: 'A planned handover maintains effective protection as personnel change. The exact transfer method comes from the employer’s approved procedure.' },
      { prompt: 'A worker has left and their lock remains. Production asks you to remove it. What should you do?', choices: ['Cut it off because the shift ended', 'Leave it in place and escalate through the documented employer process', 'Use a spare key without telling anyone'], correct: 1, explanation: 'Never improvise another worker’s lock removal. A documented employer-controlled exceptional process must address the required safeguards; this app does not authorize removal.' },
    ],
  },
  {
    id: 'electrical-hazards', title: 'Respect the electrical hazard', category: 'SAFETY / SHOCK & ARC FLASH', symbol: '06', minutes: 5,
    brief: 'Shock and arc flash are different hazards. A glove, a label, or a familiar cabinet is not a complete safety plan.',
    points: [
      'Electric shock involves current through the body. An arc flash can expose people to intense heat and other effects, including pressure and flying material. Protection against one hazard does not automatically control the other.',
      'The qualified team uses the current task assessment, applicable standards, equipment condition, and valid labeling to determine safe-work controls, boundaries, and the complete required PPE. Protective clothing does not eliminate the underlying hazard or justify unnecessary energized work.',
      'Old slide tables and another panel’s label are not a current PPE selection method. Missing or questionable information, changes to protective devices, and conflicting instructions must be resolved before proceeding. Choose the approved de-energized work process whenever required.',
    ],
    questions: [
      { prompt: 'A worker has voltage-rated gloves. Does that alone establish complete arc-flash protection?', choices: ['No; shock and arc-flash controls must both be assessed for the task', 'Yes, for every panel', 'Yes, if the worker has experience'], correct: 0, explanation: 'Voltage protection is not a complete arc-flash protection system. The qualified team must determine all required controls and PPE for the specific task.' },
      { prompt: 'The cabinet’s protective device was changed after its hazard label was prepared. What should happen?', choices: ['Assume the old label is always valid', 'Copy the neighboring cabinet’s label', 'Have the information reviewed through the approved safety process before relying on it'], correct: 2, explanation: 'Changes can affect hazard information. Qualified personnel must resolve whether the assessment and labeling remain applicable; proximity to another cabinet is not evidence.' },
      { prompt: 'A team finds PPE guidance in an old presentation. What is its appropriate use?', choices: ['Treat every old table as a current rule', 'Use it as background and obtain current approved requirements for the actual task', 'Use it instead of the employer’s procedure'], correct: 1, explanation: 'Historical material can introduce concepts, but task decisions require current, applicable requirements and approved procedures. This app does not certify compliance or select field PPE.' },
    ],
  },
];
