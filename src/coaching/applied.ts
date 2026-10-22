import type { MissionHints } from './questions.ts';

export const appliedQuestionHints = {
  'panel-layout': [
    ['Moving the drive changes more than the panel’s appearance. Consider heat, routing, access and the approved construction.', 'Wires reaching the new location is only one observation. Compare the proposal with the controlled layout and resolve its functional effects before treating symmetry as an improvement.'],
    ['The cooling route is a documented functional requirement. Ask whether a cover changes the obstruction inside it.', 'An enclosure hiding a blocked route does not restore airflow. Acceptance needs resolution of the actual conflict, not a change in what is visible from outside.'],
    ['Feedback signals and drive outputs have different noise and routing concerns. The exact equipment and plan define their relationship.', 'A borrowed clearance or shortest path may ignore the cable’s limits and the system’s interference design. Use the sources that describe this particular arrangement.'],
  ],
  'panel-terminations': [
    ['Mechanical fit does not establish conductor-count or preparation approval. Find the terminal’s permitted arrangement.', 'Check conductor type and quantity, end treatment and compatible tooling together. An accessory such as a twin ferrule does not independently approve every combination that fits.'],
    ['A paint stripe is visible evidence of a mark. What does it actually tell you about the missing work record?', 'The stripe cannot report the preparation, tool condition or tightening method used. Keep those acceptance questions open until the required evidence is resolved.'],
    ['The connection is existing equipment, not a blank invitation to tighten every screw.', 'Maintenance requirements differ between terminal designs. Additional force can damage a connection, so an equipment-specific inspection process is more reliable than a universal habit.'],
  ],
  'panel-bonding': [
    ['A hinge provides mechanical support. Ask what establishes its role in the designed protective path.', 'Paint, joints and construction can affect electrical continuity. Smooth door movement does not verify protective bonding; the designed provisions and required checks answer that question.'],
    ['A 0 V label describes a circuit reference. Protective earth describes a protective function.', 'An intentional relationship between return and earth must be documented. A low numeric reference cannot, on its own, establish that this terminal performs a protective role.'],
    ['The manuals describe different interfaces. Consider why a general one-end or both-end rule might not transfer between them.', 'Shield behavior depends on signal, cable, connectors, equipment and system design. Use applicable instructions and resolve conflicts rather than choose a universal termination slogan.'],
  ],
  'panel-protection': [
    ['A one-line simplifies the distribution hierarchy. Look for the question about which paths and devices relate.', 'Its simplified structure does not contain every physical terminal, nor does a drawing measure present isolation. Stay with the distribution relationship it actually communicates.'],
    ['The matching marking concerns continuous current. What other duties and conditions could still differ?', 'Fault interruption, voltage, configuration and approved construction are separate compatibility questions. Similar handles and matching normal-current numbers cannot settle those duties.'],
    ['A longer trip delay can change fault exposure as well as selectivity. This is a system change, not just a dial adjustment.', 'The responsible process needs the system study and equipment constraints to assess the tradeoff. Neither access to the dial nor game progress establishes authority to choose settings.'],
  ],
  'panel-transformers': [
    ['The turns ratio is primary to secondary. Apply that same ratio to the ideal winding voltages.', 'Write Vsecondary = Vprimary × Nsecondary/Nprimary. The secondary has fewer turns in this example, so a voltage increase would contradict the stated ratio.'],
    ['The question requests apparent power, using RMS voltage and RMS current for a single-phase load.', 'Multiply the stated RMS volts and amperes and use VA. Do not relabel the result watts without the additional information needed to establish real power.'],
    ['The missing tap diagram is required identity-specific information. Familiar case size is not a connection record.', 'Multiple windings and taps can differ between similar-looking models. Hold the decision until the exact applicable documentation resolves the arrangement instead of copying remembered jumpers.'],
  ],
  'panel-control-devices': [
    ['The coil is the input. The load is switched by the output contacts, whose duty is a separate requirement.', 'A correct input voltage says the relay can be operated under that condition. It does not establish contact suitability for the load type, switching conditions or approved construction.'],
    ['The defined delay needs three uninterrupted seconds. The scenario removes enable after only two.', 'Follow the stated reset rule when enable disappears. Do not carry the missing second into a period after the triggering condition has already been removed.'],
    ['The jumper’s pitch matching is mechanical evidence. The question leaves its permitted electrical combination unknown.', 'Current duty, insulation and accessory compatibility belong to the specified terminal system. A part fitting between positions does not establish those requirements.'],
  ],
  'panel-inspection': [
    ['Compare the required cooling path in the plan with the actual duct observation, rather than focus on training labels.', 'Find an objective conflict between an expected condition and a recorded condition. A revision letter identifies a document; it is not itself a build defect.'],
    ['The missing fact is entry-fitting compatibility. Neatness or an isolated marking does not supply that evidence.', 'Enclosure suitability depends on the applicable fitting and installation combination. Keep acceptance open until that documented combination is established.'],
    ['The stripes do not fill the missing preparation and tightening records. Also separate inspection from commissioning authority.', 'A visible mark is not proof of the underlying connection work. Ask which choice resolves the evidence gaps while leaving power-up to its separate approved process.'],
  ],
  'diagnostic-plan': [
    ['The recipe change gives context, but it is not yet a proven cause. Build a usable symptom record first.', 'Record expected versus actual behavior, mode, time, alarms and recent changes. Those facts let later evidence test a theory; replacing a nearby sensor does not establish the theory.'],
    ['The proposed action would defeat a guard function. A diagnostic goal does not authorize that change.', 'The safe response is to stop that proposed action and select an approved diagnostic process within the task boundary. A person watching the hazard area is not equivalent protection.'],
    ['A testable hypothesis must predict something you could observe and explain what different results would mean.', 'Compare a specific prediction with random part replacement. Only the prediction gives evidence a clear role in supporting or weakening the proposed cause.'],
  ],
  'fault-boundaries': [
    ['Use both cards: first their assumptions, then the recorded values along source → A → B → C.', 'Under the one-open, fixed-reference and intact-return assumptions, find the neighboring pair where the recorded source-side condition changes. Report a region rather than a replacement part.'],
    ['The original case explicitly excludes alternate supplies. The new circuit does not meet that condition.', 'An inference is conditional on its model. An extra source or path can change which points remain supplied, so the same recorded pattern need not imply the same region.'],
    ['A bounded region tells you where the modeled missing connection lies. It does not tell you the physical failure mechanism.', 'Keep fault location, root cause and safe-work status as separate claims. The supplied records support only the conclusion permitted by the stated model.'],
  ],
  'intermittent-evidence': [
    ['Four channels changed together. Look for a dependency that several channels could share.', 'Supply, return, module, communication and common process state can create grouped symptoms. Treat them as hypotheses to compare before assuming four independent sensor failures.'],
    ['Compare the five-millisecond duration with the one-second sample spacing. An event can happen between recorded points.', 'A normal sample describes its capture instant, not every instant until the next sample. Check timing and capture behavior before using the trend to exclude a brief disturbance.'],
    ['Repeated timing is a useful pattern, but several mechanisms could produce it during acceleration.', 'The correlation can guide which supply, feedback, routing or mechanical evidence to review. It cannot uniquely select an encoder replacement or a shield change.'],
  ],
  'root-cause-record': [
    ['Replacing the damaged cable treats the failed item. The repeated rubbing location points to a possible damage mechanism too.', 'Ask which proposal addresses the supported routing/support cause through approved design review, rather than leave the damaging condition ready to affect the next cable.'],
    ['The earlier fault interval was a shift. Compare that with the much shorter observation after the repair.', 'Ten good minutes is a real but limited result. Its duration does not cover the historical pattern, so a permanent-resolution claim would be stronger than the evidence.'],
    ['A future technician needs to reconstruct the reasoning and know which questions remain unresolved.', 'The useful report connects symptoms, evidence, approved actions and verification conditions. A price or a one-word result does not let another person check the claimed resolution.'],
  ],
  'motor-nameplate': [
    ['Use synchronous field speed = 120 × frequency/poles. The pole count belongs in the denominator.', 'Substitute the given 40 Hz and four poles into that expression. This calculates field speed; an actual induction rotor under load can run at a different speed.'],
    ['The question gives both rotating-field speed and rotor speed during normal induction motoring. Compare those two speeds.', 'The rotor’s lag relative to the rotating field is a normal induction concept under these conditions. The speed difference alone does not establish a wiring defect or ground fault.'],
    ['The connection diagrams differ, even though the motors look alike. Which source is specific to the motor actually being used?', 'Appearance and memory cannot resolve winding differences. The exact device documentation and applicable approved design need to establish the permitted connection.'],
  ],
  'starter-drive-choice': [
    ['A conventional soft starter manages the starting voltage behavior. Separate that from continuous running-frequency control.', 'Compare its purpose with a VFD’s controllable output frequency. The fact that both use electronics does not give them identical running-speed functions.'],
    ['The mechanical load still needs enough accelerating torque. Lower starting voltage does not erase that requirement.', 'Acceleration depends on available torque versus load demand and the allowed thermal duty. A gentler electrical start can still fail to accelerate an unsuitable load.'],
    ['One duty concerns excessive motor load over time, while the other concerns a different fault condition.', 'Compare overload behavior with short-circuit behavior rather than treat protection labels as interchangeable. Each needs its applicable device and system context.'],
  ],
  'drive-energy-path': [
    ['Follow the common power-conversion blocks from the incoming side toward the motor, not the feedback-information path.', 'The model includes an incoming conversion stage, stored energy in a DC link and an inverter output stage. Put those energy functions in their source-to-load order.'],
    ['A dark display is an observation about the display. It does not report the condition of every energy store or source.', 'The question gives no completed stored-energy verification. Keep that uncertainty visible even though the incoming supply has been removed.'],
    ['PWM output is not an unchanged utility sine wave. A meter’s response depends on its signal-handling limits.', 'Waveform, filtering, bandwidth and the approved measurement method determine what a reading means. A familiar voltage display alone cannot make every instrument appropriate.'],
  ],
  'drive-fault-evidence': [
    ['The timing is deceleration, when energy can move from a mechanical load toward the drive. That suggests a mechanism to investigate.', 'A plausible returned-energy explanation remains a hypothesis. The exact event, drive and system information must support it before any hardware or ramp change is selected.'],
    ['The PLC bit is a request. Follow the later stages that still stand between a request and actual movement.', 'The drive may need enables, a usable reference and suitable state before the power path and load can respond. A true request does not isolate the missing condition.'],
    ['Reset changes an indication. Ask whether the scenario contains evidence that the underlying condition was removed.', 'Repeated faults make the event history valuable. Preserving that evidence and using an approved investigation is more informative than repeatedly clearing the same symptom.'],
  ],
  'servo-feedback-safety': [
    ['Following error compares command and reported motion. The collision gives mechanical context, not a tuning instruction.', 'Binding, damage, feedback and configuration can all affect the mismatch. The alarm alone does not prove feedback is healthy or that increasing gain will resolve the cause.'],
    ['STO concerns torque production within its defined system. Compare that with electrical isolation and restraint of a gravity load.', 'Removing torque capability does not necessarily remove stored electrical energy or external mechanical forces. Ask which conclusion preserves those separate hazard-control questions.'],
    ['A servo’s commutation and feedback relationship is system-specific. A generic phase-swap rule can disrupt that relationship.', 'The proposed direction change needs the approved exact-system engineering process. Random phase combinations are not a controlled way to resolve command, feedback and motor compatibility.'],
  ],
  'sensor-selection': [
    ['The target material changed, which can change an inductive sensor’s response even when the sensor itself stays the same.', 'Usable distance depends on the model, material, geometry and mounting. A familiar case or the broad category “metal” does not establish the previous performance.'],
    ['Picture the light path. Which arrangement has the sender on one side and a separate receiving unit on the other?', 'Distinguish that two-unit arrangement from a reflector returning light to one unit and from a target returning light directly. The optical layout is the clue.'],
    ['Connector shell size is only a mechanical similarity. List the functions and conditions that could still differ.', 'Supply, pin functions, output type, switching behavior, mounting and environmental performance all need the applicable match. An outer shape cannot guarantee the whole replacement.'],
  ],
  'sensor-output-match': [
    ['The PNP output supplies current in the stated DC model. Follow where a compatible input must let that current go.', 'The complete path needs complementary functions. Match a sourcing output with the receiving input function defined by the actual compatible circuit, not an arbitrary input label.'],
    ['Focus on the NPN output’s active current-path function in this conventional model.', 'Its transistor output provides the defined return-side path rather than an isolated supply. Keep that functional description separate from any physical connector pin assignment.'],
    ['Off does not always mean an ideal zero-current open for an electronic sensor. Compare small leakage with a sensitive input’s threshold.', 'The input can respond to a current the output still permits while nominally off. That is a documented compatibility question, not immediate proof of a broken input.'],
  ],
  'io-evidence-chain': [
    ['The sensor light and PLC tag are two different observations. First establish what the light means and whether timing and channel identity match.', 'The disagreement leaves interface, supply/reference, module, mapping and communications questions open. No single failed component follows uniquely from these two facts.'],
    ['A logical output is a command; the valve’s physical movement is a later result in the chain.', 'Power delivery, load behavior, pressure and mechanics can all stand between those facts. A true bit or green icon does not independently observe the valve moving.'],
    ['The diagnostic pulses belong to the specific validated safety system, not an ordinary steady input assumption.', 'Use the exact module and system interpretation within the approved process. Replacing the function with a forced ordinary bit would remove the diagnostic context instead of explaining it.'],
  ],
  'analog-scaling': [
    ['Find the fraction of the valid 4–20 mA span, then add that fraction of the −20 to 60 °C engineering span to the minimum.', 'The signal fraction is (12−4)/16. The temperature span is 60−(−20). Keep the negative lower bound when combining those two quantities.'],
    ['This asks for current from temperature, so reverse the scaling process rather than reuse the midpoint.', 'First find (40−(−20))/(60−(−20)). Multiply that fraction by the 16 mA signal span, then add the 4 mA live-zero offset.'],
    ['The formula was defined for valid in-range data. Compare zero current with the lower valid signal limit before converting.', 'An abnormal signal may involve supply, transmitter, wiring, input or configuration. Establish validity and diagnostics instead of presenting an extrapolated number as a trustworthy temperature.'],
  ],
  'feedback-signals': [
    ['Bias is one DC health clue. The question asks whether it establishes the entire dynamic measurement system.', 'A plausible bias cannot independently verify mounting, sensitivity, bandwidth or every cable behavior. Distinguish useful partial evidence from complete dynamic accuracy.'],
    ['The question asks for A-channel cycles per second, not the rate after four-edge decoding.', 'Convert 300 RPM to revolutions per second, then multiply by 120 A cycles per revolution. Only use a four-edge multiplier when the requested quantity is decoded counts.'],
    ['The word absolute describes a reporting capability, not every retention and referencing detail.', 'Multi-turn behavior, power-loss handling, format and controller setup can differ. Exact system documentation must establish those functions before replacement or referencing decisions.'],
  ],
  plc: [
    ['Use the simplified cyclic sequence in which the program evaluates a representation of acquired inputs.', 'The output update follows the logic evaluation that determines it. Arrange acquisition, decision and update in that causal order rather than start with the physical motor.'],
    ['The bit represents a logical condition. Ask what independent evidence would be needed for an actual safe-entry decision.', 'A normal controller status can be stale, incomplete or unrelated to the required safety function. A screen color cannot transform that status into a complete safe-work verification.'],
    ['The output command and the field device’s response are different stages of the system.', 'A missing response can involve output delivery, power, connections, load or mechanics. The command alone establishes none of those stages as healthy.'],
  ],
  diagnosis: [
    ['The active overload flag is relevant evidence about a protective condition, not immediate proof of a failed motor.', 'A protection response can have several causes and needs the authorized process. Recognize the unmet condition without treating it as permission to defeat protection or replace a part at random.'],
    ['A useful theory predicts evidence that could support or weaken it. Look for that connection between claim and observation.', 'The prediction should be specific enough that a different observed result would matter. Assuming everything failed or ignoring the documentation gives no informative comparison.'],
    ['The scenario explicitly says the next action exceeds your authorization. The task boundary is already known.', 'Learning progress does not extend a person’s field permissions. The useful action preserves the boundary and involves the people qualified and authorized for that next task.'],
  ],
} satisfies Record<string, MissionHints>;
