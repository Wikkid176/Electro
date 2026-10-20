import type { Lesson, PracticeReference } from './content.ts';

// Invented evidence records, not excerpts from a drawing or manufacturer manual.
const inspectionCards: PracticeReference[] = [
  { id: 'BUILD-PLAN', title: 'TRAIN-BOX / Approved plan revision D', context: 'Fictional inspection exercise; no installation dimensions or field settings.', content: 'The plan retains a clear cooling path above the virtual power supply. Cable entries require documented compatibility with the enclosure and intended environment. Connection acceptance requires a traceable preparation and tightening record, not just a paint mark.' },
  { id: 'BUILD-LOG', title: 'TRAIN-BOX / Observation record', context: 'Fictional unpowered mock-up; observations do not authorize energization.', content: 'A newly added duct blocks the planned cooling path. An entry fitting has no compatibility documentation. Terminals carry paint stripes, but their preparation and tightening records are missing. These are unresolved inspection findings.' },
];

export const panelLessons: Lesson[] = [
  {
    id: 'panel-layout', title: 'Plan the panel', category: 'PANEL BUILD / LAYOUT', symbol: '25', minutes: 5,
    brief: 'Treat the approved layout as part of an engineered system. Space, cooling, cable routes, and access all affect the build.',
    points: [
      'Match the controlled layout, bill of material, device identity, and revision before assembly. Moving a device can change cooling, access, cable lengths, noise performance, and evaluated construction conditions. Resolve changes through the responsible engineering process.',
      'Heat-producing equipment and sensitive electronics need the locations, clearances, airflow, and environmental conditions specified by the design and equipment instructions. A neat-looking arrangement does not establish adequate cooling.',
      'Power, drive-output, and sensitive signal routes need an intentional routing plan. Separation, crossings, duct capacity, bend limits, edge protection, and door movement depend on the application and instructions. There is no single distance or duct-fill percentage supplied by this lesson.',
    ],
    questions: [
      { prompt: 'A builder wants to move a drive to make the panel look more symmetrical. What is the best next step?', choices: ['Move it if the wires reach', 'Check the approved layout and obtain review of the proposed change', 'Place it directly above the controller every time'], correct: 1, explanation: 'Layout can affect heat, service access, noise, and construction conditions. A visual improvement is not approval for an engineering change.' },
      { prompt: 'A new duct blocks the cooling path specified in the design. Is closing the panel cover enough to accept it?', choices: ['Yes, because the enclosure hides the obstruction', 'Yes, if the controller is still off', 'No; resolve the cooling-path conflict before acceptance'], correct: 2, explanation: 'An unobstructed required cooling path is a functional design condition. A closed cover or unpowered state does not resolve the conflict.' },
      { prompt: 'Which evidence should guide routing a sensitive feedback cable near drive-output wiring?', choices: ['The approved routing plan and applicable equipment instructions', 'A universal distance remembered from another machine', 'Only the shortest route'], correct: 0, explanation: 'Noise control, separation, protection, and cable limits depend on the equipment and application. The shortest route or a borrowed distance does not establish suitability.' },
    ],
  },
  {
    id: 'panel-terminations', title: 'Make the connection count', category: 'PANEL BUILD / TERMINATIONS', symbol: '26', minutes: 5,
    brief: 'A connection must match the conductor, terminal, preparation method, tooling, and tightening requirements.',
    points: [
      'Check the exact terminal instructions for conductor material, size, strand class, permitted end preparation, strip length, and number of conductors. Ferrules and twin ferrules are not universally required or accepted; the entire connection arrangement must be permitted.',
      'Use specified compatible terminals, ferrules or lugs, tools, and dies. Inspect preparation and crimp quality under the approved process. Loose strands, damaged conductors, trapped insulation, or an unapproved extra conductor require resolution.',
      'Follow the specified tightening method and value with suitable maintained tools and records. Under-tightening and over-tightening can both cause defects. A witness stripe records a mark; it does not prove the correct method was used. Existing connections need the approved inspection/maintenance procedure, not an assumed universal re-torque rule.',
    ],
    questions: [
      { prompt: 'Two conductors fit physically into one terminal. What establishes whether that connection is allowed?', choices: ['The terminal and conductor instructions for that exact arrangement', 'Whether the cover closes', 'Adding a twin ferrule in every case'], correct: 0, explanation: 'Physical fit and a twin ferrule do not establish approval. The terminal, conductor count and types, end preparation, and tooling must match permitted conditions.' },
      { prompt: 'Every screw has a paint stripe, but the tightening record is missing. What does the stripe prove?', choices: ['The correct torque was applied', 'Only that a mark is present; the missing acceptance evidence must be resolved', 'That no inspection is needed'], correct: 1, explanation: 'A visible mark cannot establish tool condition, tightening value, conductor preparation, or completed verification. Follow the approved acceptance process to resolve missing evidence.' },
      { prompt: 'An existing connection is being inspected. Which approach is sound?', choices: ['Apply maximum force to every screw', 'Use one remembered percentage for all terminals', 'Follow the approved equipment-specific maintenance and inspection procedure'], correct: 2, explanation: 'Terminal designs and maintenance requirements differ. Uncontrolled re-tightening can damage a connection; this lesson supplies no universal re-torque method or percentage.' },
    ],
  },
  {
    id: 'panel-bonding', title: 'Separate return, bond, and shield', category: 'PANEL BUILD / BONDING', symbol: '27', minutes: 5,
    brief: 'Protective bonding, circuit returns, and cable shields have different purposes even when a design intentionally connects some of them.',
    points: [
      'Protective bonding connects specified exposed conductive parts into the designed protective path. Paint, mounting hardware, moving joints, and component construction can affect that path. Use the engineered bonding provisions and accepted verification process; visual contact alone is insufficient.',
      'A circuit return carries intended circuit current. It is not automatically protective earth. Where a design bonds a return to earth, the location and method need the applicable design and instructions; do not add or remove bonds to cure a symptom by guesswork.',
      'Cable shields control interference as part of an overall system. Termination location, coverage, connector construction, and bonding method depend on the signal, drive, cable, and equipment instructions. Neither “one end always” nor “both ends always” is a universal rule. A shield is not automatically a protective bonding conductor.',
    ],
    questions: [
      { prompt: 'A metal door appears connected through its hinges. What evidence is needed for protective bonding?', choices: ['The hinge color', 'The designed bonding provisions and required verification', 'Only that the door opens smoothly'], correct: 1, explanation: 'Mechanical attachment alone does not establish the required protective path. Review the construction and verify it under the approved process.' },
      { prompt: 'A drawing labels a terminal “0 V.” Can you assume it is the protective-earth terminal?', choices: ['Yes, all returns are protective earth', 'Yes, if its voltage is low', 'No; establish its function and any intentional bond from the design'], correct: 2, explanation: 'A circuit reference or return and protective earth serve different purposes. Their relationship must be established from the applicable design.' },
      { prompt: 'Two equipment manuals specify different shield arrangements for different interfaces. What should you do?', choices: ['Use the applicable interface instructions and resolve system conflicts through engineering', 'Use one-end bonding for every cable', 'Use both-end bonding for every cable'], correct: 0, explanation: 'Shield behavior and suitable termination depend on the interface and system. A rule from one application cannot be transferred to every signal or drive cable.' },
    ],
  },
  {
    id: 'panel-protection', title: 'Read the protection story', category: 'PANEL BUILD / DISTRIBUTION', symbol: '28', minutes: 5,
    brief: 'Follow distribution paths and distinguish breaker ratings, trip functions, and system coordination.',
    points: [
      'An incoming supply may feed several downstream circuits. Use the one-line and circuit documents together to understand which protective devices serve which paths; a one-line does not show every conductor or establish a safe work condition.',
      'Continuous-current capability, interrupting capability, and short-time withstand describe different duties under specified conditions. Device family, voltage, enclosure, accessories, and trip configuration matter. A matching ampere number or physical size does not establish an acceptable replacement.',
      'Trip functions and coordination need a documented engineering study with applicable curves, fault information, and equipment conditions. A delay intended to improve selectivity can affect fault exposure. Never increase a setting, bypass protection, rack a breaker, or reset repeatedly based on this game.',
    ],
    questions: [
      { prompt: 'A one-line shows one incoming path feeding several branch paths. What does that drawing help identify?', choices: ['Every physical terminal position', 'Which distribution and protection paths are related', 'That all branches are de-energized'], correct: 1, explanation: 'A one-line summarizes distribution relationships. It is neither a complete connection drawing nor evidence of isolation.' },
      { prompt: 'Two breakers have the same continuous-current marking. Is that sufficient evidence for substitution?', choices: ['Yes, that is their only important rating', 'Yes, if their handles look alike', 'No; fault duty, voltage, configuration, application, and approved construction also matter'], correct: 2, explanation: 'Continuous load duty differs from interrupting and withstand duties. Replacement suitability requires the applicable documented equipment and system review.' },
      { prompt: 'Someone proposes adding an upstream trip delay so a branch device opens first. Who must resolve that change?', choices: ['The responsible engineering process using the system study and equipment constraints', 'Any player with a high XP score', 'Anyone who can turn the adjustment dial'], correct: 0, explanation: 'Coordination involves device behavior, fault duty, and exposure as well as service continuity. A game exercise cannot authorize protective-setting changes.' },
    ],
  },
  {
    id: 'panel-transformers', title: 'Understand the transformer', category: 'PANEL BUILD / TRANSFORMERS', symbol: '29', minutes: 5,
    brief: 'Use an ideal model to understand transformation, then recognize why actual connections need exact equipment documentation.',
    points: [
      'Transformer action uses changing magnetic flux to couple windings. In an ideal sinusoidal model, winding voltage ratio follows turns ratio. A transformer does not create extra power; real losses and operating limits matter.',
      'Apparent power in a single-phase example is VA = RMS volts × RMS amperes. A steady apparent-power calculation alone does not establish suitability for starting or inrush loads, temperature, regulation, duty, or protection.',
      'Terminal letters, multiple windings, taps, and jumper arrangements must be interpreted using the exact nameplate and approved connection diagram. This mission provides no wiring or tap-change procedure. A transformer does not by itself make downstream conductors safe to touch.',
    ],
    questions: [
      { prompt: 'An ideal transformer has a 4:1 primary-to-secondary turns ratio and 80 V RMS across its primary. What is the modeled secondary voltage?', choices: ['320 V RMS', '20 V RMS', '4 V RMS'], correct: 1, explanation: 'In this ideal model, secondary voltage is 80 ÷ 4 = 20 V RMS. These invented values are calculation practice, not a connection design.' },
      { prompt: 'A fictional single-phase load draws 2 A RMS at 30 V RMS. What is its apparent power?', choices: ['60 VA', '15 VA', '60 W under every waveform and power factor'], correct: 0, explanation: 'Apparent power is 30 × 2 = 60 VA. Real power and actual transformer suitability require additional information; VA is not universally interchangeable with watts.' },
      { prompt: 'A transformer looks like a familiar model, but its tap diagram is unreadable. What is the appropriate decision?', choices: ['Copy the jumpers from memory', 'Assume the case size identifies the taps', 'Hold the connection decision until exact applicable documentation is obtained'], correct: 2, explanation: 'Similar appearance does not establish winding or tap connections. Resolve identity and documentation through the approved process before any connection decision.' },
    ],
  },
  {
    id: 'panel-control-devices', title: 'Match the control device', category: 'PANEL BUILD / RELAYS AND TIMERS', symbol: '30', minutes: 5,
    brief: 'Separate relay input requirements from contact duties, interpret a defined timer mode, and check terminal accessories.',
    points: [
      'A relay input or coil operates its switching function; its input rating does not establish what the output contacts can switch. Check contact duty, load type, operating conditions, isolation, and the exact device instructions separately.',
      'Timer names alone are not enough. Read the timing diagram, supply and trigger conditions, reset behavior, and output definition. For the ideal on-delay example here, an initially open output closes only after the enable stays true for three uninterrupted seconds, and opens immediately when enable is removed.',
      'Terminal blocks, jumpers, end barriers, and accessories form a specified connection system. Physical fit does not prove electrical compatibility, separation, current capacity, or conductor acceptance. Verify the approved parts and assembly instructions.',
    ],
    questions: [
      { prompt: 'A relay coil has the correct input-voltage rating. What remains to be checked before accepting its output for a load?', choices: ['Nothing; coil voltage defines contact duty', 'Only the case color', 'The contact rating and conditions for that load, plus the approved device requirements'], correct: 2, explanation: 'Input requirements and output switching duty are separate. Matching the coil alone does not establish contact suitability or an approved substitution.' },
      { prompt: 'In this mission’s initially reset on-delay model, enable is true for two seconds, then removed before the three-second delay. What happens?', choices: ['The output never closes and the timing resets', 'The output closes permanently', 'The output closes one second after enable disappears'], correct: 0, explanation: 'This defined model requires three uninterrupted seconds of enable. Removal before completion resets timing without closing the output. Actual timer modes must be checked against their own diagrams.' },
      { prompt: 'A jumper fits a terminal block but its approved part compatibility is unknown. What should happen?', choices: ['Accept it because the pitch matches', 'Resolve compatibility using the specified connection-system documentation', 'Trim it until it fits more tightly'], correct: 1, explanation: 'Mechanical fit does not establish current duty, insulation, conductor arrangement, or an approved accessory combination. Use the documented compatible system.' },
    ],
  },
  {
    id: 'panel-inspection', title: 'Catch the build defects', category: 'PANEL BUILD / INSPECTION CHALLENGE', symbol: '31', minutes: 5,
    brief: 'Compare invented plan and observation cards. Find unresolved defects and distinguish an inspection finding from permission to energize.',
    points: [
      'Inspect against controlled drawings, parts records, equipment instructions, and the approved checklist. Record objective findings such as incorrect identity, missing labels, damaged conductors, routing conflicts, incomplete bonding evidence, debris, or undocumented entries.',
      'Preserving an enclosure rating requires the applicable entry components, installation method, and environmental compatibility. Similar-looking fittings, an unused opening, or a simple IP-to-enclosure-type assumption do not establish an acceptable completed assembly.',
      'Separate construction inspection, required verification tests, and authorized commissioning. Resolve findings and obtain the required acceptance before energization. Insulation testing, live testing, phase/rotation checks, and energization sequences require qualified personnel and equipment-specific approved procedures; they are not gameplay steps.',
    ],
    questions: [
      { prompt: 'Compare the TRAIN-BOX plan and observation cards. Which recorded layout condition is unresolved?', choices: ['The power supply has a fictional training name', 'The new duct blocks the planned cooling path', 'The plan has a revision letter'], correct: 1, explanation: 'The observation conflicts with the approved cooling path. Record and resolve that conflict through the responsible process before acceptance.', referenceCards: inspectionCards },
      { prompt: 'The entry fitting has no compatibility documentation. Which inspection decision follows from the cards?', choices: ['Accept it if the hole looks neat', 'Assume any IP marking establishes the required enclosure type', 'Hold acceptance until the fitting and installation compatibility are established'], correct: 2, explanation: 'Entry components and their installed condition affect enclosure protection. Appearance or a presumed rating conversion does not resolve missing compatibility evidence.', referenceCards: inspectionCards },
      { prompt: 'All terminals carry stripes, but preparation and tightening records are missing. Can the fictional inspection release the assembly for power-up?', choices: ['No; resolve the evidence gaps and follow the separate approved acceptance and commissioning process', 'Yes; paint stripes replace verification', 'Yes; this quiz score authorizes energization'], correct: 0, explanation: 'Markings do not replace connection acceptance evidence. Completing this exercise provides learning credit only, not equipment acceptance or authorization to energize.', referenceCards: inspectionCards },
    ],
  },
];
