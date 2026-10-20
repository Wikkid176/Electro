import type { TeachingLesson } from './types.ts';

export const drawingTeaching = {
  motor: {
    coach: 'A momentary command can start a lasting control state. Follow how the holding path works.',
    sections: [
      { title: 'Command, coil and contact', body: 'A contactor coil operates contacts when its specified input conditions are met. In the simplified three-wire model, a momentary START action initially energizes the coil. An associated auxiliary contact then maintains a control path after START is released. That remembered state is electrical control behavior, not energy isolation.' },
      { title: 'Stopping breaks the holding state', body: 'STOP or the modeled overload interruption removes the coil path. Restoring a healthy condition does not restore the earlier start command. This prevents the model from restarting merely because an overload was reset. Actual protective and safety functions need their approved designs; a contactor’s state alone cannot establish a safe work condition.' },
    ],
    visual: { kind: 'loop', component: 'contactor', title: 'The holding-state story', caption: 'Tap the conceptual states; this is not a wiring or safety circuit.', nodes: [
      { label: 'Start requested', value: 'Command', detail: 'A momentary command can energize the coil when the modeled conditions are healthy.' },
      { label: 'Auxiliary holds', value: 'Memory', detail: 'The associated contact maintains the modeled coil state after the start action ends.' },
      { label: 'Stop or trip', value: 'Drop out', detail: 'The holding state is lost. Clearing the trip still requires a new intentional start.' },
    ] },
    example: { scenario: 'The motor model runs, trips on overload, then has its overload reset.', steps: ['The trip removes the coil path and the holding state.', 'Reset restores a permissive condition, not the previous command.', 'The simulated motor remains stopped until a new START action.'], takeaway: 'Permission to start and a start command are different conditions.' },
    practice: { prompt: 'The model is stopped after a trip. Reset clears the trip. Should it immediately run?', choices: ['Yes, because it ran before.', 'No. A new start command is needed.'], correct: 1, explanation: 'The trip removed the holding state. Resetting a condition must not recreate an earlier start request.' },
  },
  schematics: {
    coach: 'A schematic tells a functional story. It is not a picture of where parts sit in the cabinet.',
    sections: [
      { title: 'Function and location are separate', body: 'A schematic organizes relationships so you can reason about how a circuit works. A layout organizes physical positions. A wiring drawing supplies connection details under its own conventions. Choose the document that answers your question rather than expecting one drawing to serve every purpose.' },
      { title: 'Read the reference state', body: 'Normally open and normally closed describe contacts in the specified normal condition. They do not report the live machine state. A contact symbol and a coil can appear far apart yet belong to one device. Tags, legends and cross-references explain the association; apparent proximity on the sheet does not.' },
    ],
    visual: { kind: 'compare', component: 'relay', title: 'Three views of one fictional device', caption: 'Original teaching labels; no source drawing is reproduced.', nodes: [
      { label: 'Schematic', value: 'What it does', detail: 'The relay’s coil and contact functions can be shown in different functional paths.' },
      { label: 'Layout', value: 'Where it sits', detail: 'A location view identifies the relay’s physical position inside the fictional assembly.' },
      { label: 'Wiring record', value: 'Connection detail', detail: 'A controlled wiring record identifies specific connection points and conductors.' },
    ] },
    example: { scenario: 'A learner wants to understand why a lamp follows a relay, then find that relay physically.', steps: ['Use the schematic to understand the coil/contact relationship.', 'Follow the documented tag to the applicable location view.', 'Keep the functional explanation separate from the physical search.'], takeaway: 'Use each document for the question it can actually answer.' },
    practice: { prompt: 'A normally open contact symbol is printed on a static schematic. Does it prove the contact is open right now?', choices: ['No. It shows the specified reference state.', 'Yes. The sheet measures the machine live.'], correct: 0, explanation: 'A static symbol communicates a convention. Operating conditions and suitable evidence are needed to establish actual state.' },
  },
  'drawing-navigation': {
    coach: 'Start with the identity and index. Finding a page quickly is useful only if it is the right page.',
    sections: [
      { title: 'Find the controlled set', body: 'Match equipment identity, document number, revision and approval status before interpreting a circuit. A file that looks newer may be a draft. A familiar paper copy may be superseded. The controlled register, not the visual age of a document, establishes the approved exercise source.' },
      { title: 'Use the drawing’s own addresses', body: 'A PDF page is a position in a file; a sheet identifier and grid are part of the drawing system. Cover sheets and indexes can make them differ. Use the index to choose a drawing purpose, then follow the printed sheet and reference conventions rather than assuming viewer page numbers are interchangeable.' },
    ],
    visual: { kind: 'document', title: 'A fictional document search', caption: 'Invented navigation cards, not machine print fragments.', nodes: [
      { label: 'Controlled register', value: 'CELL-Q · Rev B', detail: 'The exercise register identifies the applicable approved set.' },
      { label: 'Index entry', value: 'Indicator logic', detail: 'The index sends the functional question to sheet L-03.' },
      { label: 'Viewer location', value: 'PDF page 8', detail: 'Page 8 happens to contain sheet L-03; those addresses are not the same identifier.' },
    ] },
    example: { scenario: 'The work request names an indicator, but a folder contains drafts and approved files.', steps: ['Match the fictional equipment and approved revision in the register.', 'Find the indicator topic in the index.', 'Record the printed sheet identifier when opening the viewer page.'], takeaway: 'Correct navigation starts with authority and identity, not search speed.' },
    practice: { prompt: 'The viewer says page 12 and the sheet says C-05. Which should a drawing cross-reference use under the set’s stated sheet convention?', choices: ['Always page 12.', 'The printed sheet identifier C-05.'], correct: 1, explanation: 'Use the address system defined by the drawing set. Viewer positions can differ after covers or indexes are added.' },
  },
  'drawing-language': {
    coach: 'Tags, wire identifiers and pins are labels for different things. Read their meaning before following their numbers.',
    sections: [
      { title: 'Identify the kind of label', body: 'A device tag identifies an item or function. A wire identifier describes a documented conductor or network. A terminal or pin label identifies a connection point. Similar digits do not make these interchangeable. The legend and naming rules explain how each class is used in a particular set.' },
      { title: 'Symbols carry conventions', body: 'Connection dots, crossing lines, normal contact states and off-sheet references must be read using the set’s conventions. Color and size notes support documentation; they cannot prove isolation or safe contact. If a label is missing or inconsistent, keep the ambiguity visible instead of inventing a connection.' },
    ],
    visual: { kind: 'document', component: 'terminal', title: 'Three original label examples', caption: 'Labels explain categories; they are not a physical pinout.', nodes: [
      { label: 'K-LESSON', value: 'Device tag', detail: 'Identifies the fictional relay device, potentially across multiple symbols.' },
      { label: 'W-LESSON', value: 'Wire ID', detail: 'Identifies a documented conductor or network under the stated convention.' },
      { label: 'X-LESSON:7', value: 'Connection point', detail: 'Identifies a point on a terminal system; its digits do not define a voltage.' },
    ] },
    example: { scenario: 'A tag and a wire happen to share the digit 7.', steps: ['Classify each label using the legend.', 'Look for explicit connection information rather than matching digits.', 'Keep device identity and conductor identity as different facts.'], takeaway: 'A label is useful only with its documented meaning.' },
    practice: { prompt: 'Can a conductor’s color alone establish that it is safe to touch?', choices: ['No. Documentation cues do not establish safe-work conditions.', 'Yes, if the color is familiar.'], correct: 0, explanation: 'Color is not a verification process. Equipment condition, alternate sources and errors can all differ from appearance.' },
  },
  'drawing-references': {
    coach: 'Some references continue a conductor. Others connect ideas about one device. Let’s tell them apart.',
    sections: [
      { title: 'Conductor continuation', body: 'An off-sheet reference may identify where an electrical path continues. Read the target sheet, grid or line and matching identifier under the drawing’s rules. The reference is an address to verify, not permission to join every similarly named symbol.' },
      { title: 'Device association', body: 'A relay coil operates associated contacts, but that mechanical or functional association is not a conductor between their terminals. Tags let drawings separate the command path from a switched load path. If a target is missing or the relationship is inconsistent, resolve the documentation through the responsible engineering process.' },
    ],
    visual: { kind: 'compare', component: 'relay', title: 'Two reference meanings', caption: 'Original conceptual relationship map; no actual machine connections.', nodes: [
      { label: 'Off-sheet conductor', value: 'Path continues', detail: 'A matching documented continuation can carry the same electrical path to another sheet.' },
      { label: 'Coil → associated contact', value: 'Same device', detail: 'The coil operates a contact function. The reference itself does not create an electrical wire.' },
      { label: 'Layout reference', value: 'Location', detail: 'A physical address answers where the item is, rather than how two electrical paths join.' },
    ] },
    example: { scenario: 'A fictional coil on sheet A references a contact on sheet B.', steps: ['Read the legend to identify the reference as a device association.', 'Match the coil and contact tag.', 'Analyze each electrical path separately instead of drawing a wire along the reference.'], takeaway: 'A functional relationship is not automatically electrical continuity.' },
    practice: { prompt: 'What does a coil-to-contact cross-reference establish by itself?', choices: ['A wire connects the coil and contact terminals.', 'The symbols are associated with the documented device.'], correct: 1, explanation: 'The reference identifies the device relationship. Each circuit still needs its own documented connection path.' },
  },
  'complete-circuit-path': {
    coach: 'Follow the whole loop, including its return. Then ask separately what operates the switching device.',
    sections: [
      { title: 'A load is only one part of a path', body: 'In the ideal lamp model, source, protection, switching condition, load and return all matter. Looking only at the lamp misses the rest of the functional story. An intact outward path without the intended return is not the same as a complete loop.' },
      { title: 'Separate command and load paths', body: 'A relay’s operating coil can change the condition of a contact in another path. Trace the lamp loop and the coil command loop as separate circuits connected by a device relationship. A return or neutral is not automatically protective earth, and a drawing is not live evidence of machine state.' },
    ],
    visual: { kind: 'loop', title: 'Fictional indicator loop', caption: 'Functional path only. Select each block to follow the story.', nodes: [
      { label: 'Source and protection', detail: 'The model begins with its stated supply and protective function.' },
      { label: 'Relay contact', detail: 'The permitted path depends on the documented contact condition and its associated coil.' },
      { label: 'Indicator load', detail: 'The lamp is a load within the loop, not the entire circuit.' },
      { label: 'Defined return', detail: 'The return completes this model. It must not be assumed to be protective earth.' },
    ] },
    example: { scenario: 'A drawing shows a lamp and a relay contact. The learner finds a supply but ignores the return.', steps: ['List all modeled path elements, including protection and return.', 'Check the contact’s reference state and operating relationship.', 'Keep the coil’s command circuit separate from the lamp’s conducting path.'], takeaway: 'Complete a functional trace before blaming the most visible load.' },
    practice: { prompt: 'Is a label reading “return” sufficient to identify protective earth?', choices: ['No. The design must establish each conductor’s function.', 'Yes. Those terms always mean the same conductor.'], correct: 0, explanation: 'An intended circuit-current return and a protective path serve different purposes. Their relationship is design-specific.' },
  },
  'drawing-evidence': {
    coach: 'When documents and observations disagree, use the disagreement to form a question, not an improvised repair.',
    sections: [
      { title: 'Three kinds of evidence', body: 'A schematic describes intended function. A component label identifies what appears installed. An operating observation describes a condition at a particular time. Each can be useful and each can be incomplete. A matching tag alone does not establish wiring correctness or replacement suitability.' },
      { title: 'Preserve discrepancies', body: 'If a layout, parts record and installed label do not agree, record the mismatch with its context. Do not quietly rewrite the drawing to match a guess or bypass a function to make a symptom disappear. Authorized engineering and document control resolve approved configuration and any required change.' },
    ],
    visual: { kind: 'document', title: 'A fictional evidence triangle', caption: 'Select the record to see what it supports and what remains unknown.', nodes: [
      { label: 'Approved plan', value: 'Relay type A', detail: 'Defines the fictional intended component, subject to the plan’s applicability.' },
      { label: 'Observed label', value: 'Relay type B', detail: 'Creates a configuration question; appearance alone does not establish approval.' },
      { label: 'Operating report', value: 'Lamp stays dark', detail: 'Describes a symptom, not a unique cause or authority to substitute a part.' },
    ] },
    example: { scenario: 'A relay label differs from the approved parts record, and an indicator fails to operate.', steps: ['Record both the configuration mismatch and the symptom.', 'Avoid claiming the mismatch is already the proven fault mechanism.', 'Obtain an approved applicability and technical resolution before changes.'], takeaway: 'A discrepancy is evidence to investigate, not permission to modify.' },
    practice: { prompt: 'What is the sound response to conflicting drawing and component identities?', choices: ['Change the wiring until the symptom disappears.', 'Record the mismatch and route it through authorized review.'], correct: 1, explanation: 'An approved resolution protects traceability. Quiet changes can hide the actual configuration and create new faults.' },
  },
  'standards-scope': {
    coach: 'Choose a source by the question it addresses. No single cover title answers every machine question.',
    sections: [
      { title: 'Scope comes before lookup', body: 'An installation question, a machine-construction question and a safe-work-practice question are related but different. NFPA 70, NFPA 79 and NFPA 70E address different scopes. UL 508A addresses industrial control panels within its scope. Knowing the distinction helps you find a starting source, not declare overall compliance.' },
      { title: 'Build the applicability picture', body: 'The project, jurisdiction, equipment, governing edition and manufacturer instructions all matter. Boundaries between installation and machine requirements need responsible review. Use the source’s scope and the project basis together; neither a destination country nor one satisfied rule establishes every requirement.' },
    ],
    visual: { kind: 'document', title: 'A reference-selection map', caption: 'Topic summaries only. No standards text or proprietary tables are reproduced.', nodes: [
      { label: 'Installation', value: 'NFPA 70', detail: 'A starting reference for electrical installations within its applicable scope.' },
      { label: 'Industrial machinery', value: 'NFPA 79', detail: 'A starting reference for machinery electrical equipment within its applicable scope.' },
      { label: 'Work practices', value: 'NFPA 70E', detail: 'A reference for electrical safety-related work practices with workplace requirements.' },
      { label: 'Control panels', value: 'UL 508A', detail: 'A reference for industrial control panels within its applicable scope.' },
    ] },
    example: { scenario: 'A team asks whether a machine-related workplace task has appropriate electrical safe-work controls.', steps: ['Classify the question as work practices, not just component construction.', 'Identify the applicable safety-related references and employer program.', 'Have the responsible team establish scope and governing requirements for the actual task.'], takeaway: 'The right starting source is necessary, but it is not a compliance conclusion.' },
    practice: { prompt: 'Does satisfying one panel construction requirement establish complete workplace compliance?', choices: ['No. Other scopes and applicable requirements remain.', 'Yes. One panel rule covers every activity.'], correct: 0, explanation: 'Panel construction, machinery, installation and workplace practices have related but distinct obligations.' },
  },
  'edition-evidence': {
    coach: 'Find out which source governs before trusting the first search result.',
    sections: [
      { title: 'Publication is not adoption', body: 'A new edition can exist without automatically governing an existing project. Record the document identity, edition, scope and applicable jurisdiction or project basis. A current webpage and an approved project requirement can answer different questions. The responsible authority resolves what applies.' },
      { title: 'Read beyond the heading', body: 'An index is a navigation aid. Definitions, exceptions, conditions and referenced material can change how the controlling text applies. Search summaries and guidebooks help explain concepts but are not interchangeable with primary requirements or exact manufacturer instructions. Conflicts need documented resolution, not a vote for the easiest wording.' },
    ],
    visual: { kind: 'document', title: 'The applicability filter', caption: 'Invented review cards, not quotations from a standard.', nodes: [
      { label: 'Identify', value: 'Document + edition', detail: 'Establish exactly which source is being cited.' },
      { label: 'Apply', value: 'Project + scope', detail: 'Check whether it governs this equipment and question.' },
      { label: 'Interpret', value: 'Full conditions', detail: 'Read the controlling text and context, not just its heading.' },
    ] },
    example: { scenario: 'A new handbook summary differs from a project’s listed governing document.', steps: ['Record the identities, editions and apparent difference.', 'Locate the primary applicable requirement and associated conditions.', 'Escalate unresolved applicability or technical conflicts through the project authority.'], takeaway: 'Newer, shorter and easier to find do not mean governing.' },
    practice: { prompt: 'After finding an index heading, what is still necessary?', choices: ['Use the heading as the complete requirement.', 'Read the relevant text, definitions and conditions.'], correct: 1, explanation: 'An index points to information. It does not contain all the conditions that determine applicability.' },
  },
  'ratings-context': {
    coach: 'Two ratings can both use amperes and still describe very different duties.',
    sections: [
      { title: 'Ask what the rating describes', body: 'A continuous-current rating concerns carrying load under specified conditions. Interrupting capability concerns stopping fault current under specified conditions. Assembly short-circuit current rating describes an evaluated assembly duty. Matching a familiar number is not enough when the underlying duties differ.' },
      { title: 'Keep the configuration attached', body: 'Voltage, device type, accessories, protective combinations and assembly conditions can affect a rating’s applicability. Available fault current is a system condition to compare with appropriate equipment capability. Do not substitute load current for fault duty or infer a complete assembly rating from one component’s marking.' },
    ],
    visual: { kind: 'compare', component: 'breaker', title: 'Same unit family, different questions', caption: 'No equipment selection or protection setting is specified.', nodes: [
      { label: 'Load current', value: 'Normal operation', detail: 'Describes current expected under a stated operating condition.' },
      { label: 'Interrupting capability', value: 'Opening a fault', detail: 'Applies to a device’s specified ability to interrupt fault current.' },
      { label: 'Assembly SCCR', value: 'Assembly duty', detail: 'Applies to the assembly in its evaluated configuration; one device marking is not the full answer.' },
    ] },
    example: { scenario: 'Two replacement candidates carry the same continuous-current marking.', steps: ['Recognize which duty that matching marking describes.', 'Identify the remaining voltage, fault-duty and configuration questions.', 'Require the approved equipment/system review before treating either as interchangeable.'], takeaway: 'A rating is a quantity plus a duty plus conditions.' },
    practice: { prompt: 'Can normal load current alone establish the fault duty a panel must withstand?', choices: ['No. Normal operation and fault conditions are different.', 'Yes. They are always the same current.'], correct: 0, explanation: 'A load-current value is not an available-fault-current assessment or an assembly capability rating.' },
  },
  'reference-hunt': {
    coach: 'A useful answer leaves a trail someone else can verify.',
    sections: [
      { title: 'Make a precise lookup question', body: 'State the exact equipment or model, the condition being investigated and the information needed. Match the model, revision and applicability before interpreting a familiar alarm label. The same short label can represent different meanings in different products or revisions.' },
      { title: 'Record the evidence trail', body: 'A checkable finding identifies the source title or number, revision, section, applicable model and conclusion. Include assumptions or uncertainty. A screenshot without identity or a memory of a search result cannot reliably support later review. The cards used here are invented exercises, not instructions for actual equipment.' },
    ],
    visual: { kind: 'document', title: 'Original lookup example', caption: 'A separate fictional example from the scored quiz.', nodes: [
      { label: 'Question', value: 'SIM-PUMP-P · Alert E2', detail: 'The lookup is for training model P, not every product with an E2 label.' },
      { label: 'Approved record', value: 'Model P · Rev D', detail: 'The exercise register identifies the applicable manual revision.' },
      { label: 'Citation', value: 'Section 6.1', detail: 'The fictional finding is “enable condition missing.” Record model, revision and section together.' },
    ] },
    example: { scenario: 'A fictional model P alert is also listed in a model R handbook with a different meaning.', steps: ['Match the exact model and controlled revision first.', 'Use the applicable section and read its stated conditions.', 'Record a traceable citation and avoid transferring the other model’s meaning.'], takeaway: 'A matching alarm label is a search lead, not proof that a source applies.' },
    practice: { prompt: 'Which note is easier to verify later?', choices: ['“I saw it online.”', '“SIM-PUMP-P manual, revision D, section 6.1; training model P; missing enable.”'], correct: 1, explanation: 'The second note identifies the source, location, applicability and finding so another person can check it.' },
  },
  plc: {
    coach: 'A PLC reasons with input data and output commands. Neither is the physical process itself.',
    sections: [
      { title: 'The scan is a useful basic model', body: 'In a simplified cyclic controller, inputs are acquired, logic is evaluated and outputs are updated repeatedly. The program works with representations of conditions. Actual controllers may use asynchronous I/O, tasks and communication behavior beyond this model, so timing and data age still need the exact system context.' },
      { title: 'A true bit is a limited claim', body: 'An input bit may reflect a sensor channel, a mapped value or processed data. An output bit represents a logical command, not proof of power or movement. Safety functions require their validated architecture; ordinary control logic is not a substitute. Never force or bypass a real function to imitate the teaching model.' },
    ],
    visual: { kind: 'chain', title: 'A simplified cyclic controller', caption: 'Functional information flow, not a validated safety design.', nodes: [
      { label: 'Acquire inputs', detail: 'The controller obtains representations of external conditions.' },
      { label: 'Evaluate logic', detail: 'The program uses those values under its defined task behavior.' },
      { label: 'Update outputs', detail: 'Commands change; actual field response still needs separate evidence.' },
      { label: 'Observe process', detail: 'Feedback helps establish whether the intended physical result occurred.' },
    ] },
    example: { scenario: 'A program commands a lamp, but no light is observed.', steps: ['Identify the true output bit as a command.', 'Keep output power, load path and lamp response as separate evidence questions.', 'Use supplied records and approved diagnostics rather than conclude the command proves operation.'], takeaway: 'Software state and physical state are related, not identical.' },
    practice: { prompt: 'A command bit is true. What can you conclude from that bit alone?', choices: ['The program is commanding the output; actual operation is not established.', 'The complete physical process succeeded.'], correct: 0, explanation: 'A command does not prove output delivery, load health or the expected mechanical/process result.' },
  },
  diagnosis: {
    coach: 'Troubleshooting is a sequence of evidence-based questions, not a race to name a failed part.',
    sections: [
      { title: 'Define expected and actual behavior', body: 'A useful symptom includes the operating context, when it occurs and what should have happened instead. Record alarms and recent changes without treating them as proven causes. An alarm reports a condition recognized by a system; it does not necessarily name the component that created it.' },
      { title: 'Test a claim, then verify the result', body: 'A hypothesis predicts what evidence should appear if it is right and what would weaken it. Compare documentation with supplied observations before selecting a cause. Approved changes need verification under relevant conditions and a traceable record. Random replacement can restore operation while leaving the original cause unknown.' },
    ],
    visual: { kind: 'chain', title: 'An evidence-driven diagnostic loop', caption: 'Conceptual reasoning using supplied records only.', nodes: [
      { label: 'Describe', detail: 'Expected behavior, actual behavior and operating context form the question.' },
      { label: 'Predict', detail: 'A hypothesis states which observation would support or weaken it.' },
      { label: 'Compare', detail: 'Use appropriate documented evidence within the approved task boundary.' },
      { label: 'Verify and record', detail: 'An approved correction needs relevant verification and honest limits.' },
    ] },
    example: { scenario: 'A fictional machine stops only after a new operating recipe is selected.', steps: ['Record the repeatable condition and timing.', 'Treat recipe dependence as a lead, not proof that a particular part failed.', 'Form a testable prediction and compare supplied records before proposing a correction.'], takeaway: 'Better questions reduce unsupported conclusions.' },
    practice: { prompt: 'An alarm disappears after reset. Is its underlying cause necessarily removed?', choices: ['Yes, clearing an indication proves a repair.', 'No. Symptom relief and cause removal need separate evidence.'], correct: 1, explanation: 'Reset can clear a reported state without resolving the condition that produced it. Relevant verification is still needed.' },
  },
} satisfies Record<string, TeachingLesson>;
