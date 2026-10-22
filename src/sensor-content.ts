import type { Lesson } from './content.ts';

export const sensorLessons: Lesson[] = [
  {
    id: 'sensor-selection', title: 'Match the sensing job', category: 'SENSORS / PRINCIPLES', symbol: '41', minutes: 5,
    brief: 'Choose a sensing principle from the target and environment, then check the exact model and output behavior.',
    points: [
      'Inductive proximity sensing is commonly used for metal targets; material, geometry, mounting, and model affect usable distance. Capacitive sensing can respond to conductive and nonconductive materials, but deposits, moisture, and surrounding material can affect detection.',
      'Through-beam photoelectric sensing uses a separate emitter and receiver; retroreflective uses a reflector; diffuse uses light returned from the target. Target finish, background, alignment, contamination, and optics matter. No one arrangement is universally reliable in dirt or on every shiny target.',
      'Check supply, output type, switching behavior, environmental limits, mounting, response time, and the application. An indicator may represent power, target detection, output, or fault depending on the model. Similar appearance, a lit LED, or matching connector size is not replacement evidence.',
    ],
    questions: [
      { prompt: 'A target changes from steel to a different metal. Can the old inductive sensing distance be assumed unchanged?', choices: ['Yes, all metals behave identically', 'No; check the exact sensor, target, mounting, and specified performance', 'Yes, if the case is the same color'], correct: 1, explanation: 'Inductive response depends on the model and target conditions. Universal correction factors or assumed distances are insufficient for replacement or design decisions.' },
      { prompt: 'Which photoelectric arrangement uses a separate emitter and receiver facing each other?', choices: ['Diffuse', 'Capacitive proximity', 'Through-beam'], correct: 2, explanation: 'Through-beam sensing uses separate sending and receiving elements. Alignment, optics, target, and environmental conditions still affect suitability.' },
      { prompt: 'A replacement sensor has the same connector shell. What else needs to match?', choices: ['The applicable electrical, functional, mechanical, and environmental requirements', 'Only its label font', 'Nothing; shell size guarantees compatibility'], correct: 0, explanation: 'A connector shell does not establish pin assignment, supply, output type, switching behavior, range, sealing, or approved replacement status.' },
    ],
  },
  {
    id: 'sensor-output-match', title: 'Match source and sink', category: 'SENSORS / DC INTERFACES', symbol: '42', minutes: 5,
    brief: 'Use a conventional DC current-path model to distinguish sourcing and sinking without guessing connector pins.',
    points: [
      'In the conventional DC model used here, an active PNP sourcing output supplies current from the positive supply toward a compatible sinking input. An active NPN sinking output provides a path toward the negative reference for a compatible sourcing input. Verify the actual device diagrams; terminology and configurable interfaces can differ.',
      'A complete permitted current path needs compatible supply, common/reference, output characteristics, input thresholds, and load. Leakage current, voltage drop, and input filtering can affect whether an input changes state; “off” does not always mean an ideal open with zero current.',
      'Connector coding, pin function, cable assignment, sealing, and coupling requirements must match the exact system documentation. Do not use a wire color or shell alone as proof of function. This mission supplies no physical pinout, connector rating, or connection procedure.',
    ],
    questions: [
      { prompt: 'In this mission’s conventional DC model, which input is paired with an active PNP sourcing sensor output?', choices: ['A compatible sinking input', 'Any input regardless of its circuit', 'Only an AC transformer winding'], correct: 0, explanation: 'The sourcing output supplies current toward the compatible sinking input. Actual compatibility still depends on the complete permitted circuit and device characteristics.' },
      { prompt: 'In the same model, an active NPN output provides which function?', choices: ['A guaranteed isolated power source', 'A current path toward the negative reference', 'A universal positive-voltage source'], correct: 1, explanation: 'The NPN sinking output completes a path toward the negative reference in this conventional arrangement. Follow the actual diagrams rather than inferring wiring from the transistor name alone.' },
      { prompt: 'A two-wire sensor is off but a sensitive input remains active. Which issue may be relevant?', choices: ['The input must be physically broken', 'Wire color alone determines the answer', 'Off-state leakage and the input’s specified thresholds and circuit'], correct: 2, explanation: 'Off-state leakage can affect a sensitive input. This is a compatibility question for the documented circuit, not permission to add a resistor or alter wiring without engineering review.' },
    ],
  },
  {
    id: 'io-evidence-chain', title: 'Follow the I/O evidence', category: 'SENSORS / SIGNAL PATHS', symbol: '43', minutes: 5,
    brief: 'Separate the process condition, sensor indication, electrical interface, module state, PLC data, and output action.',
    points: [
      'A target, a sensor indicator, an output signal, an input-module indication, and a PLC tag are separate observations. Confirm what each indication means and whether the records refer to the same channel, state, and timestamp.',
      'A tag can be stale, mapped incorrectly, filtered, simulated, or affected by communications and program logic. A logical output command similarly does not prove power-path continuity, a healthy load, mechanical movement, or process completion.',
      'Safety I/O has application-specific diagnostics, test behavior, and validated connections. An ordinary input or a steady meter value is not a substitute for that design. Test pulses and safety-related faults must be interpreted using exact documentation and approved processes; never force or bridge them to complete a task.',
    ],
    questions: [
      { prompt: 'A sensor indicator changes, but the PLC tag does not. What can be concluded immediately?', choices: ['The cable is definitely open', 'The PLC definitely failed', 'Two observations disagree; interface, supply/common, module, mapping, timing, or indication meaning may explain it'], correct: 2, explanation: 'The mismatch helps locate questions to investigate but does not identify a single failed part. Establish indication meanings, channel identity, and timing before drawing a narrower conclusion.' },
      { prompt: 'A PLC output bit is true. Does that alone prove a valve moved?', choices: ['No; commanded state and actual electrical/mechanical response are different evidence', 'Yes, every output bit proves process completion', 'Yes, if the HMI icon is green'], correct: 0, explanation: 'The output command does not by itself establish the output power path, load operation, pressure, mechanism, or process response.' },
      { prompt: 'A safety input has pulsed diagnostics. Which approach is appropriate?', choices: ['Force a normal PLC bit to stand in for it', 'Use exact module/system diagnostics and the approved safety process', 'Bridge its channels until the LED stays on'], correct: 1, explanation: 'Safety diagnostics and test behavior belong to a validated system. Forcing or bridging the function can defeat fault detection and is not an authorized troubleshooting shortcut.' },
    ],
  },
  {
    id: 'analog-scaling', title: 'Scale the process signal', category: 'SENSORS / ANALOG SIGNALS', symbol: '44', minutes: 5,
    brief: 'Calculate a linear 4–20 mA scale while keeping signal validity separate from the displayed process value.',
    points: [
      'For the valid linear exercise range, value = minimum + ((mA − 4) ÷ 16) × span, where span = maximum − minimum. This assumes the stated configuration and valid in-range data; a real channel needs its exact scaling and diagnostics.',
      'The transmitter spans −20 to 60 °C, an 80 °C span. At 8 mA the calculated temperature is 0 °C; at 16 mA it is 40 °C. Negative lower bounds must be included rather than treating every range as starting at zero.',
      'Live zero allows a valid minimum signal to differ from zero current, but a zero or abnormal current does not uniquely identify an open wire. Power, transmitter, configuration, wiring, input, and diagnostics can matter. Failure signaling and saturation limits are device/configuration-specific. This mission supplies no method for opening, injecting, or measuring a physical loop.',
    ],
    questions: [
      { prompt: 'For the valid linear −20 to 60 °C exercise, what does 12 mA represent?', choices: ['40 °C', '20 °C', '60 °C'], correct: 1, explanation: 'The fraction is (12 − 4) ÷ 16 = 0.5. Add half of the 80 °C span to −20 °C: −20 + 40 = 20 °C.' },
      { prompt: 'What current represents 40 °C in that same valid linear exercise?', choices: ['8 mA', '12 mA', '16 mA'], correct: 2, explanation: 'The fraction is (40 − (−20)) ÷ 80 = 0.75. Current is 4 + 0.75 × 16 = 16 mA. This is a scaling calculation, not a calibration instruction.' },
      { prompt: 'The channel reports 0 mA. Is reporting the calculated temperature as a valid process value sufficient?', choices: ['No; establish signal validity and investigate the channel diagnostics and possible causes', 'Yes; every current is a valid temperature', 'Yes; zero current always proves one specific broken wire'], correct: 0, explanation: 'The linear formula is only part of interpretation. A missing or invalid signal must not be presented as a trustworthy process value, and zero current alone does not establish a unique cause.' },
    ],
  },
  {
    id: 'feedback-signals', title: 'Read feedback in context', category: 'SENSORS / VIBRATION AND POSITION', symbol: '45', minutes: 6,
    brief: 'Distinguish vibration-sensor health clues and encoder counting conventions from proof of a complete measurement system.',
    points: [
      'An IEPE accelerometer uses compatible constant-current excitation and produces a dynamic signal on a DC bias. Bias can help assess the sensor/cable/conditioner path, but acceptable ranges and fault interpretation are model-specific. A plausible bias is not proof of dynamic accuracy; mounting, cable behavior, bandwidth, and the signal conditioner matter.',
      'An incremental quadrature encoder has A/B channels whose phase relationship supports direction sensing. Define pulses as channel cycles or decoded counts before calculating. In this mission, 120 A-channel cycles per revolution at 300 RPM gives 600 Hz on A; counting all A/B edges gives 480 counts per revolution.',
      'An index and an absolute-position report serve different purposes. Absolute-position format, multi-turn behavior, power-loss retention, referencing, and system setup depend on the device and controller. Differential signaling can improve noise immunity but does not eliminate all faults. Exact supply, interface, cable, and system compatibility must be verified before connection decisions.',
    ],
    questions: [
      { prompt: 'An IEPE channel has a bias within its documented expected range. What does that prove?', choices: ['Some useful health evidence, but not complete dynamic accuracy or cable/mounting health', 'That every vibration reading is correct', 'That it can be powered from any voltage source'], correct: 0, explanation: 'Bias is one diagnostic clue under specified conditions. Sensitivity, dynamic response, mounting, cable, and conditioning can still affect the actual measurement.' },
      { prompt: 'The encoder produces 120 A-channel cycles per revolution at 300 RPM. What is its A-channel frequency?', choices: ['2,400 Hz', '600 Hz', '120 Hz'], correct: 1, explanation: 'There are 300 ÷ 60 = 5 revolutions per second. A-channel frequency is 120 × 5 = 600 Hz. Four-edge quadrature decoding changes count rate, not the A-channel cycle frequency.' },
      { prompt: 'Can an “absolute encoder” label alone establish all multi-turn retention and replacement/referencing behavior?', choices: ['Yes, every absolute system is identical', 'Yes, no setup checks are needed', 'No; the exact device and controller documentation must establish those behaviors'], correct: 2, explanation: 'Absolute reporting does not by itself specify every retention, multi-turn, referencing, and compatibility condition. Device and system details remain necessary.' },
    ],
  },
];
