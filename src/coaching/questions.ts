export type HintPair = readonly [string, string];
export type MissionHints = readonly [HintPair, HintPair, HintPair];

// The first nudge identifies the relevant evidence. The second explains a way
// to reason about this particular case without selecting an answer for the user.
export const questionHints = {
  safety: [
    ['The lamp tells you about one indication. Ask whether a failed lamp could give the same appearance while another part remained supplied.', 'Separate the observed facts—stopped conveyor and dark lamp—from the much broader claim that every hazardous source is controlled. What evidence is missing?'],
    ['Think beyond the motor command. Which kind of energy can remain inside a charged, pressurized or raised part?', 'Stopping changes motion or control state. It need not remove the energy already stored in a capacitor, pressure reservoir or elevated load. Compare the choices using that distinction.'],
    ['The question is about authorization for an actual electrical task, not familiarity with a game or one piece of protective equipment.', 'Ask what establishes the person’s task-specific skills, employer authorization and approved work process. A quiz result or a glove alone cannot establish all three.'],
  ],
  'energy-sources': [
    ['The question names two supplies but says only one was disconnected. Follow the backup supply as its own energy path.', 'Draw two boxes in your mind: main feed and battery. Changing the first box does not state anything about the second box’s connection or the circuits it supplies.'],
    ['The load is raised. Consider a force that still exists when a motor produces no torque.', 'A stationary load can still have potential energy because of its height. Quietness tells you it is not moving now; it does not describe restraint or future movement.'],
    ['The display and capacitor energy are different facts. A screen can lose power without reporting the remaining charge.', 'Ask whether the observation includes any approved verification of the capacitor condition. A generic waiting time and a dark display do not fill that evidence gap.'],
  ],
  'loto-roles': [
    ['The equipment already has a service-control arrangement. Think about the operator’s responsibility to preserve it and communicate.', 'An operator’s desire to resume production does not transfer control of another person’s protection. Look for the action that respects the existing arrangement and the designated team.'],
    ['A learning achievement changes course progress. Does the scenario say anything changed in employer qualification or authorization?', 'Separate educational knowledge from formal task permissions. Completing every mission supplies no evidence that the employer has designated the learner for a particular field task.'],
    ['STOP is a control command. Compare that with physically interrupting and controlling each source of hazardous energy.', 'A stopped-state bit can be true while power circuits remain supplied. Button color and PLC state do not change the distinction between operational control and energy isolation.'],
  ],
  verification: [
    ['An unsuccessful START tests machine response. The electrical task asks a different question at a particular work location.', 'Imagine a failed control circuit preventing all starts while an independent supply remains present. That counterexample shows why “does not run” cannot settle the electrical question.'],
    ['Consider a tester that failed during the assessment. What would a check afterward reveal about confidence in the earlier result?', 'The instrument is part of the evidence chain. A later operating check helps detect a failure that otherwise could make a non-response look like a valid assessment.'],
    ['The tool or result is inconsistent with expectations. Treat that inconsistency as missing confidence, rather than choose a convenient number.', 'A failed operating check weakens the assessment itself. Ask which response preserves uncertainty for qualified investigation instead of declaring the smallest reading safe.'],
  ],
  'shared-protection': [
    ['The second technician is a new person entering the job. Ask what establishes that person’s protection under the group arrangement.', 'A group program must account for each authorized worker. Someone else’s existing lock is not, by itself, a complete record of the new technician’s required protection.'],
    ['The equipment remains under service through the handover. What must not disappear while the people change?', 'Compare a continuous protection arrangement with a temporary gap. A shift boundary is an administrative event, not a reason for the hazard-control boundary to lapse.'],
    ['The remaining lock represents an unresolved personnel and protection issue. Production urgency does not resolve it.', 'The question does not grant authority to remove that lock. Look for the route that keeps protection in place while the employer’s documented exceptional process handles the situation.'],
  ],
  'electrical-hazards': [
    ['Voltage-rated gloves address a particular electrical protection purpose. Ask whether that alone covers the effects of an arc.', 'Shock involves body current; an arc can release heat and other damaging effects. One protective item cannot establish the complete task assessment for two different mechanisms.'],
    ['The protective device changed after the label was prepared. Ask whether the assessment and present configuration still match.', 'A label is supported by system information. If that information changes, its applicability needs review; the old label’s continued physical presence does not prove it is still valid.'],
    ['The presentation is old, while the decision concerns an actual current task. Distinguish background learning from governing instructions.', 'Historical examples can explain ideas. Before choosing controls, the responsible team still needs applicable current requirements, equipment information and the approved workplace process.'],
  ],
  fundamentals: [
    ['Current is the unknown. Start with I = V/R and keep volts and ohms attached to the numbers.', 'Place 24 above 120 in the division. A result below one ampere is plausible because the resistance is numerically larger; multiplying those numbers answers a different question.'],
    ['Follow the one intended path through the series switch. What happens to that path when its contact separates?', 'An interrupted current path and zero voltage everywhere are different claims. The open switch affects continuity of the modeled path without proving every other point has lost its supply.'],
    ['Hold voltage constant in I = V/R. Only the denominator changes.', 'Try a comparison: the same voltage divided by a larger positive resistance gives a smaller quotient. You can predict the direction without inventing a new source voltage.'],
  ],
  'electrical-units': [
    ['The prefix milli is one thousandth. Convert the current to amperes before comparing the choices.', 'Write 35 mA as 35 × 0.001 A. Moving from milliamperes to amperes makes the numerical value smaller while the physical current stays the same.'],
    ['Watts describe a rate of energy transfer. Match the quantity, not a familiar electrical number.', 'Compare the unit families: ohms describe resistance and hertz describes cycles per second. The remaining quantity concerns how quickly energy is transferred.'],
    ['Kilo means one thousand. The resistor value needs expansion, not division by a thousand.', 'Write 2.2 × 1,000 Ω before doing the arithmetic. The prefix changes the unit scale; it does not change what resistance is being described.'],
  ],
  'circuit-paths': [
    ['There is one path, so add the two resistances before applying Ohm’s law.', 'Use total resistance 60 Ω + 120 Ω, then divide the 18 V source by that total. Do not treat the series elements as independent parallel branches.'],
    ['Each parallel branch has the same 30 V. Work out the branch currents separately before adding them.', 'Use I₁ = 30/150 and I₂ = 30/300. Their sum is the source current; adding resistances directly would describe a series network instead.'],
    ['The branches share source nodes but are separate paths. Follow the branch that did not open.', 'An open in one route need not cut the source off from the other route. Ask what the diagram says about that intact branch, without extending the conclusion to safe isolation.'],
  ],
  'electrical-power': [
    ['The conditions specify steady DC, so electrical input power uses P = V × I.', 'Multiply the 18 V potential difference by the 0.2 A current and express the result in watts. Dividing those numbers would describe a resistance calculation.'],
    ['Use P = I²R while keeping resistance unchanged. The current term is squared.', 'Substitute 2I for I: the multiplier appears twice, as (2I) × (2I). This makes the power change different from a simple doubling.'],
    ['The question says AC RMS values. Distinguish apparent power from real power before comparing watts.', 'Volts times amperes gives VA for this AC comparison. Real input power depends on power factor, and mechanical output also depends on losses. Which choice keeps those quantities separate?'],
  ],
  'meter-setup': [
    ['The dial says voltage but the selected input says current. Both parts of the configuration must suit the quantity.', 'A current input can present a low-resistance path. The simulation should recognize that conflict rather than assume the dial changes the electrical characteristics of the selected input.'],
    ['Think of the meter, leads, probes and accessories as one system with combined limits.', 'A suitable case marking does not repair a damaged lead or upgrade an accessory rating. Ask which choice checks the whole arrangement rather than one conspicuous feature.'],
    ['An ohmmeter supplies a test signal of its own. Consider what an external powered source does to that test condition.', 'Resistance mode assumes the appropriate de-energized condition. Extra external energy is not something the model can interpret as an ordinary resistance value, so the configuration must stay blocked.'],
  ],
  'meter-readings': [
    ['Use the stated resistance mode and open-path fixture. Do not read the letters OL as a number zero.', 'An open path has no finite resistance in this model. The instrument’s out-of-range indication represents that condition, whereas a zero-ohm path would be a very different circuit.'],
    ['Compare the magnitude before and after: eighteen remains eighteen. Focus on what the minus sign refers to.', 'A DC reading is relative to its defined reference. Reversing that orientation changes the sign; the observation alone does not establish a failed source or a wiring defect.'],
    ['A tone is a threshold result from a particular instrument. Ask how much more the broader claims require.', 'Meeting a low-resistance threshold does not identify every path or prove behavior under load. Stay with the limited claim supported by the tone itself.'],
  ],
  'measurement-evidence': [
    ['This is a supplied resistive-model record. Rearrange V = IR to make resistance the subject.', 'Use R = V/I with the recorded 2 V drop and 0.4 A current. Check the units: volts divided by amperes gives ohms, not watts.'],
    ['The clamp encloses both directions of current. Think about their combined magnetic effect.', 'Equal outgoing and returning currents can oppose one another in the combined indication. A near-zero sum is not a measurement saying each individual conductor carries zero current.'],
    ['A feature name does not remove the instrument’s waveform or time limits. Think about an event too short to capture.', 'True-RMS processing has specified signal limits, and Min/Max has capture behavior. Match those limits to the waveform and event rather than treat either feature as unlimited diagnosis.'],
  ],
  motor: [
    ['START is momentary. Look for the associated contact that can maintain the modeled path after that momentary action ends.', 'The coil operates an auxiliary contact. Once operated, that contact can maintain the permitted control path while the stop and protective conditions remain healthy.'],
    ['The overload contact is in series with the coil’s control path. Follow continuity after that contact opens.', 'The holding contact maintains a path only while the series conditions permit it. It cannot preserve coil energy across an opened protective contact in this model.'],
    ['A trip has already removed the holding state. Clearing the trip changes a condition, not the history of the start command.', 'Compare “permitted to start” with “commanded to start.” The reset restores the former; it does not recreate the momentary command that originally established holding.'],
  ],
  schematics: [
    ['A functional drawing and a location drawing answer different questions. Which question does a schematic prioritize?', 'Related symbols can be placed for logical clarity rather than physical proximity. A layout is needed when the question concerns where the devices actually sit.'],
    ['Normal refers to the contact’s specified reference condition, not the most common machine operating mode.', 'Find the defined unactuated or reference state in the drawing convention. An operating machine can have the contact in a different state without changing the printed symbol.'],
    ['The repeated tag suggests a device relationship. The drawing convention tells you how that relationship is documented.', 'Trace the tag and cross-reference between coil and contacts. Do not infer that all their terminals are electrically joined just because the symbols belong to one device.'],
  ],
  'drawing-navigation': [
    ['The question asks why the indicator operates. Choose the document organized around functional relationships.', 'A layout helps locate the lamp and a parts list identifies components. To understand the switching logic, you need the view that describes circuit function.'],
    ['The reference names a printed sheet identifier. A viewer page is only a position in the PDF file.', 'Covers and indexes can shift viewer numbering. Follow the drawing set’s own sheet/address convention rather than substitute a file position with no matching reference.'],
    ['The controlled revision is the authority to establish, not whichever copy is already in your hand.', 'Record the conflict and obtain the applicable approved set. Familiarity or visible paper age is not evidence that a superseded copy remains the right source.'],
  ],
  'drawing-language': [
    ['The drawing set has a language key. Use that source before guessing from a symbol seen on another machine.', 'Conventions for contacts, crossing lines and reference marks can vary. The set’s own legend lets you interpret this symbol in its intended context.'],
    ['Separate a device identity, a wire identifier and an individual connection-point label.', 'A pin designation addresses a particular connection point on the defined interface. Its digits do not, by themselves, define a wire’s voltage or identify the entire device.'],
    ['A documented color is a design cue. Ask whether that cue measures the present condition of the conductor.', 'A color callout cannot detect incorrect installation, alternate feeds or remaining energy. Keep the documentation meaning separate from the evidence required for safe work.'],
  ],
  'drawing-references': [
    ['The reference connects a contact to the coil that operates it. Ask whether that is a device relationship or a conductor continuation.', 'The coil and contact can act together while belonging to separate electrical paths. The cross-reference locates the associated function; it does not draw a wire between terminals.'],
    ['Follow the destination address and matching conductor identity under the set’s convention.', 'Use the target sheet/grid or line and its continuation identifier together. Matching a similar-looking number without the defined reference is not enough to establish the same path.'],
    ['A missing target means the reference cannot currently be verified. Preserve the inconsistency rather than invent the missing device.', 'The responsible documentation and engineering process needs the discrepancy. Guessing a replacement reference would hide the unresolved relationship instead of explaining it.'],
  ],
  'complete-circuit-path': [
    ['The learner reached the load but has not yet returned to the source reference. Follow the rest of the loop.', 'A complete intended current path includes both outward and returning portions. Finding the lamp is not the same as accounting for every element needed by its circuit.'],
    ['The printed contact is a reference-state symbol. Compare documentation with live operating evidence.', 'A contact may be operated by its coil after the drawing’s normal condition. A static sheet cannot report whether the installed contacts currently match the symbol.'],
    ['The label gives a circuit reference or return function. Protective earth has a separate protective purpose.', 'Some designs intentionally relate return and earth, but the relationship needs explicit design evidence. The number zero alone cannot establish the protective function.'],
  ],
  'drawing-evidence': [
    ['The label and parts list disagree. Record that configuration question before selecting a component or changing wiring.', 'A mismatch is useful evidence, but it does not yet establish which record is applicable or which component is acceptable. Use authorized review to resolve both.'],
    ['An auxiliary status reports one related condition. Consider a failure that could make it differ from the main path.', 'A reported state is not independent proof of every contact, load and hazardous-energy condition. Keep your conclusion within what that particular indication can establish.'],
    ['An approved physical change and its controlled documentation need to remain traceable to each other.', 'The person using the drawing next needs the approved actual configuration, not an unexplained discrepancy. Follow the change-control process rather than silently keeping an obsolete record.'],
  ],
  'standards-scope': [
    ['Classify the subject as the electrical equipment of industrial machinery, then compare each source’s scope.', 'A relevant machinery reference is a starting point. Applicability and the project context still need review; a parts catalog cannot answer a machinery construction requirement.'],
    ['This question concerns how electrical work is performed, rather than only where a component sits.', 'Match safety-related work practices to a source with that scope and the applicable workplace program. A dimensional drawing and a panel layout describe different subjects.'],
    ['One satisfied requirement covers one part of the evidence. Consider installation, machine and workplace obligations separately.', 'A control panel and a complete machine are different scopes. Meeting one requirement cannot establish that all other applicable construction and work-practice requirements have also been met.'],
  ],
  'edition-evidence': [
    ['Publication date and governing applicability are different facts. Ask which edition the project or jurisdiction actually requires.', 'A newly published source is not automatically adopted for existing equipment. Scope, adoption and project basis must establish the rule that governs this situation.'],
    ['An index entry is an address, not the complete requirement. Follow it to the controlling material.', 'Definitions, conditions, exceptions and referenced information can change an apparent rule. A heading alone leaves those qualifications out of the evidence.'],
    ['The sources appear to conflict. Speed or convenience does not resolve their authority or applicability.', 'Record the exact conflict and have the responsible authority establish the approved technical interpretation. Neither source should be discarded solely because the other looks easier to apply.'],
  ],
  'ratings-context': [
    ['A component rating and an assembly rating are attached to different evaluated objects.', 'A single component’s higher marking does not automatically upgrade the assembled panel. Ask which conclusion incorrectly transfers a component capability to the whole construction.'],
    ['The comparison states that the system condition exceeds the applicable equipment capability. That is an unresolved suitability issue.', 'The normal load current does not cancel a fault-duty mismatch. A responsible engineering resolution is needed before accepting the equipment for that condition.'],
    ['Conductors, short-circuit protection and overload protection perform different duties under different conditions.', 'A remembered percentage leaves out equipment instructions, circuit conditions and the applicable requirements for each duty. Look for an answer that refuses the one-number shortcut.'],
  ],
  'reference-hunt': [
    ['There are two independent matching requirements here: exact model A and the controlled revision C.', 'Check the model first, then the approved revision. A correct revision for the wrong model is no more applicable than a superseded revision for the right model.'],
    ['A second learner needs enough information to locate the same source and check the same finding.', 'Look for document identity, revision, section and applicable model together with the conclusion. A memory or an unnamed online manual cannot provide that evidence trail.'],
    ['The matching alert label appears on different models. Labels can be reused without preserving the same meaning.', 'The controlled model A source governs this exercise. Do not transfer model B’s interpretation solely because the short alarm text looks familiar.'],
  ],
} satisfies Record<string, MissionHints>;
