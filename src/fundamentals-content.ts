import type { Lesson } from './content.ts';

// Independently written examples. Private source documents are never app assets.
export const fundamentalsLessons: Lesson[] = [
  {
    id: 'electrical-units', title: 'Make the units count', category: 'FUNDAMENTALS / UNITS', symbol: '08', minutes: 4,
    brief: 'A number without its unit is only part of the message. Learn to distinguish volts, amperes, ohms, watts, and their prefixes.',
    points: [
      'Voltage is expressed in volts, current in amperes, resistance in ohms, and power in watts. Power is a rate of energy transfer, not the total energy used over time.',
      'Milli means one thousandth; kilo means one thousand. For example, 35 mA is 0.035 A, and 2.2 kΩ is 2,200 Ω. Convert units before inserting values into a formula.',
      'DC and AC describe different signal behavior. A voltage function must match the signal and the instrument specification. A DC polarity sign describes the potential difference relative to the reference terminal; it does not alone diagnose a wiring fault.',
    ],
    questions: [
      { prompt: 'A sensor draws 35 mA. What is that in amperes?', choices: ['35,000 A', '0.035 A', '3.5 A'], correct: 1, explanation: 'One milliampere is 0.001 A. Therefore 35 mA is 35 × 0.001 = 0.035 A.' },
      { prompt: 'Which quantity is measured in watts?', choices: ['Power', 'Resistance', 'Frequency'], correct: 0, explanation: 'Watts measure power, the rate of energy transfer. Resistance is measured in ohms and frequency in hertz.' },
      { prompt: 'The specified value of a resistor is 2.2 kΩ. Which value is equivalent?', choices: ['0.0022 Ω', '22 Ω', '2,200 Ω'], correct: 2, explanation: 'The prefix kilo means 1,000. Multiplying 2.2 by 1,000 gives 2,200 ohms.' },
    ],
  },
  {
    id: 'circuit-paths', title: 'Build the circuit story', category: 'FUNDAMENTALS / CIRCUIT PATHS', symbol: '09', minutes: 5,
    brief: 'Compare ideal DC resistor networks. Follow the paths before deciding what a calculation or reading means.',
    points: [
      'In a single series path, the same current passes through each resistor. The resistances add, and the individual voltage drops sum to the source voltage in the ideal steady-state model.',
      'Parallel branches share the voltage between their common nodes. Their currents add at the source. Adding a positive, finite parallel resistance reduces the equivalent resistance.',
      'An open interrupts its intended path; it does not make every point de-energized. A short changes the circuit and may cause dangerous fault current. Never create a short to investigate a real fault.',
    ],
    questions: [
      { prompt: 'An ideal 18 V source feeds 60 Ω and 120 Ω in series. What is the current?', choices: ['3 A', '0.3 A', '0.1 A'], correct: 2, explanation: 'The resistances add to 180 Ω. Using I = V/R gives 18/180 = 0.1 A through both resistors.' },
      { prompt: 'Ideal 150 Ω and 300 Ω branches are connected in parallel across 30 V. What is the total current?', choices: ['0.3 A', '0.067 A', '450 A'], correct: 0, explanation: 'The branch currents are 30/150 = 0.2 A and 30/300 = 0.1 A. Their sum is 0.3 A.' },
      { prompt: 'One branch of an ideal parallel circuit opens. What can happen to another intact branch?', choices: ['It must become isolated from every source', 'It can remain supplied by the source', 'Its resistance must become zero'], correct: 1, explanation: 'An open in one branch need not interrupt another branch. A stopped load or broken path does not establish an electrically safe work condition.' },
    ],
  },
  {
    id: 'electrical-power', title: 'Put power in perspective', category: 'FUNDAMENTALS / POWER', symbol: '10', minutes: 5,
    brief: 'Calculate power in DC loads, and learn why the same shortcut does not describe every AC machine.',
    points: [
      'For a steady DC load, electrical input power is P = V × I. For an ideal resistor, the equivalent forms are P = I²R and P = V²/R.',
      'At constant resistance, doubling the current makes resistive power four times as large. Unexpected connection resistance can dissipate heat when load current flows.',
      'In AC systems, apparent power in volt-amperes and real power in watts are distinct. Power factor matters, and a motor’s electrical input is also distinct from its mechanical output. Do not apply an ideal DC resistor model to every load.',
    ],
    questions: [
      { prompt: 'A steady DC load takes 0.2 A at 18 V. What is its electrical input power?', choices: ['90 W', '3.6 W', '0.011 W'], correct: 1, explanation: 'For this steady DC example, P = V × I = 18 × 0.2 = 3.6 watts.' },
      { prompt: 'Current through an unchanged ideal resistor doubles. What happens to its power dissipation?', choices: ['It halves', 'It stays the same', 'It becomes four times as large'], correct: 2, explanation: 'P = I²R. At constant R, replacing I with 2I gives (2I)²R = 4I²R.' },
      { prompt: 'Why is multiplying AC RMS volts by RMS amperes not always the real power in watts?', choices: ['The result is apparent power; power factor must be considered', 'Watts and ohms are the same unit', 'AC equipment never consumes power'], correct: 0, explanation: 'For a single-phase AC load, the product of RMS voltage and RMS current is apparent power in VA. Real input power also depends on power factor; it is not automatically the mechanical output of a motor.' },
    ],
  },
  {
    id: 'meter-setup', title: 'Choose before you measure', category: 'METER USE / SETUP', symbol: '11', minutes: 5,
    brief: 'Before asking what a meter reads, ask whether its function, inputs, condition, and ratings suit the intended task.',
    points: [
      'Voltage, resistance, and direct current measurement use different instrument configurations. A current input can present a low-resistance path; using it across a voltage source can cause a dangerous short circuit.',
      'The measurement category, voltage rating, function limits, leads, probes, and accessories must suit the application together. A large voltage number alone is not enough. Damaged equipment must be removed from use under the applicable procedure.',
      'Resistance and continuity functions supply their own test signal. Relevant hazardous energy must be controlled and the component condition established before such tests. Real connections, circuit changes, and field testing require qualified personnel and approved procedures; the virtual bench is only a conceptual model.',
    ],
    questions: [
      { prompt: 'A learner selects a voltage function but leaves the virtual input on A. What should the simulator do?', choices: ['Block the reading and identify the input mismatch', 'Assume the dial makes every input safe', 'Treat the input as a normal voltage connection'], correct: 0, explanation: 'The function and input must both be appropriate. A current input across a voltage source can form a dangerous low-resistance path; this app blocks that configuration.' },
      { prompt: 'Which statement about measurement ratings is sound?', choices: ['Any meter showing enough digits is suitable', 'Only the meter case rating matters', 'The complete instrument, lead, probe, and accessory setup must suit the task'], correct: 2, explanation: 'Suitability depends on the entire measurement setup and its manufacturer limits, not only the display, voltage number, or meter body.' },
      { prompt: 'Why does the virtual bench block resistance mode on its powered source?', choices: ['Resistance has no units', 'Resistance testing requires an appropriately de-energized test condition', 'The source voltage must be increased first'], correct: 1, explanation: 'An ohmmeter supplies its own test signal. External energy makes this an inappropriate test condition and can damage equipment or create a hazard. The model does not replace real isolation and verification.' },
    ],
  },
  {
    id: 'meter-readings', title: 'Decode the display', category: 'METER USE / INTERPRETATION', symbol: '12', minutes: 5,
    brief: 'OL, a minus sign, and a continuity tone each tell a different story. Interpret the function and circuit context before drawing a conclusion.',
    points: [
      'In resistance mode, OL commonly means the measured resistance exceeds the selected range, including an open path. It does not mean zero ohms. In other modes the display meaning may differ; consult the instrument manual.',
      'A negative DC voltage indicates polarity relative to the reference connection. A continuity tone reflects an instrument-specific low-resistance threshold, not proof that a component is correct or an installation is safe.',
      'Parallel paths, range limits, signal type, and instrument behavior can produce misleading results. A low voltage reading, including one affected by a different input impedance, is not by itself proof of a safe work condition.',
    ],
    questions: [
      { prompt: 'The virtual isolated open path displays OL in resistance mode. What does it mean in this model?', choices: ['Zero ohms', 'A complete short', 'The open path exceeds the resistance range'], correct: 2, explanation: 'The virtual open path has no finite resistance reading. OL is not zero; actual instrument displays must be interpreted using their function, range, and manual.' },
      { prompt: 'Reversing the virtual reference polarity changes +18 V to −18 V. What changed?', choices: ['The displayed polarity relative to the reference', 'The source necessarily failed', 'The voltage became resistance'], correct: 0, explanation: 'For an ideal DC source, reversing the reference orientation reverses the sign while preserving the voltage magnitude. The sign alone does not establish a wiring fault.' },
      { prompt: 'An isolated component gives a continuity tone. What can you conclude from the tone alone?', choices: ['The whole machine is safe to enter', 'The measured path meets that instrument’s tone condition', 'Every parallel path has been excluded'], correct: 1, explanation: 'Continuity is a threshold indication. It does not identify the path by itself, validate the component under load, or verify the absence of hazardous energy.' },
    ],
  },
  {
    id: 'measurement-evidence', title: 'Collect better evidence', category: 'METER USE / TROUBLESHOOTING', symbol: '13', minutes: 5,
    brief: 'Read measurement records rather than probing real equipment. Compare operating conditions and look for evidence that tests a hypothesis.',
    points: [
      'A circuit can look normal with little load current, then lose voltage when the load operates. In an ideal resistive model, a voltage drop across a connection grows with current and connection resistance. A recorded drop is evidence to investigate, not permission to bypass a device.',
      'A clamp responds to the combined magnetic effect of the conductors within it. Opposing currents can cancel, so a near-zero combined reading does not prove that each conductor carries no current. AC and DC capability depends on the clamp design.',
      'Min/Max and recording features can reveal changes within their capture limits. True-RMS capability can help with non-sinusoidal signals within instrument specifications; bandwidth and waveform limits still matter. No single feature guarantees a complete diagnosis.',
    ],
    questions: [
      { prompt: 'A record shows a connector dropping 2 V while carrying 0.4 A. What resistance does the ideal model imply?', choices: ['5 Ω', '0.2 Ω', '0.8 Ω'], correct: 0, explanation: 'For this ideal resistive example, R = V/I = 2/0.4 = 5 Ω. Real interpretation still requires context and authorized investigation.' },
      { prompt: 'A clamp encloses equal outgoing and returning currents and indicates near zero. What does that establish?', choices: ['Every conductor is current-free', 'The combined magnetic effects can cancel', 'The circuit is safe for resistance testing'], correct: 1, explanation: 'A combined clamp reading can conceal substantial current in individual conductors. It is not an absence-of-voltage or hazardous-energy verification.' },
      { prompt: 'A meter has true-RMS and Min/Max features. Which limitation still matters?', choices: ['Its display color determines accuracy', 'No limitations remain', 'Its specified waveform, bandwidth, and event-capture limits'], correct: 2, explanation: 'Measurement features operate within instrument specifications. A narrow event or unusual waveform may still be outside what that instrument can reliably capture.' },
    ],
  },
];
