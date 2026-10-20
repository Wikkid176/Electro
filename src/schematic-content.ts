import type { Lesson } from './content.ts';

// Independent teaching scenarios. No source print content or identifiers belong here.
export const schematicLessons: Lesson[] = [
  {
    id: 'drawing-navigation', title: 'Find the right drawing', category: 'PRINT READING / NAVIGATION', symbol: '16', minutes: 4,
    brief: 'A fictional work order mentions an indicator lamp. Start with the document index rather than guessing which page contains its circuit.',
    points: [
      'Confirm the equipment identity, document number, revision, and approval status. Use the current controlled drawing set; the newest-looking file or a familiar paper copy is not automatically authoritative.',
      'An index directs you to a sheet by its purpose. A schematic explains function, a layout helps locate components, and a parts list identifies specified components. They answer different questions.',
      'A PDF viewer page number may differ from the drawing sheet identifier or grid reference. Follow the identifiers printed on the drawing and check the document’s navigation conventions.',
    ],
    questions: [
      { prompt: 'You need to understand why a fictional indicator turns on. Which drawing is the best starting point?', choices: ['A panel paint specification', 'The indicator’s control schematic, found through the index', 'Any page with a similar-looking lamp'], correct: 1, explanation: 'The schematic describes the functional circuit. The index helps locate the relevant sheet; a layout or appearance match does not establish the circuit relationships.' },
      { prompt: 'A PDF viewer says page 9, but a reference points to sheet LIGHT. Which identifier should guide the search?', choices: ['The drawing’s sheet identifier and index', 'The viewer page number alone', 'The largest number on the screen'], correct: 0, explanation: 'File page order and engineering sheet identifiers can differ. Use the drawing index and the stated sheet/grid conventions.' },
      { prompt: 'A paper copy conflicts with the controlled drawing revision. What is the sound next step?', choices: ['Assume handwriting always overrides engineering', 'Modify the machine to match the older copy', 'Resolve the document status through the approved process before relying on it'], correct: 2, explanation: 'A revision conflict needs resolution through the responsible document or engineering process. Familiarity with a copy does not establish that it matches the equipment.' },
    ],
  },
  {
    id: 'drawing-language', title: 'Read the drawing’s language', category: 'PRINT READING / CONVENTIONS', symbol: '17', minutes: 5,
    brief: 'Symbols, tags, wire labels, and connector pins tell related stories. Learn which question each one can answer.',
    points: [
      'Use the supplied legend to interpret symbol style, device tags, connection dots, crossing lines, and reference notation. Naming rules and symbol conventions can differ between drawing sets.',
      'A device tag identifies an item; a wire identifier describes a documented conductor or network; a terminal or pin label identifies a connection point. Similar-looking numbers do not make those meanings interchangeable.',
      'Wire size and color callouts are documentation cues, not proof of voltage, isolation, or safe contact. Normally open and normally closed refer to the specified normal condition; determine operating state from the device conditions and drawing notes.',
    ],
    questions: [
      { prompt: 'A symbol looks unfamiliar in a fictional drawing set. What should you consult first?', choices: ['The number of nearby wires', 'A color guess', 'That drawing set’s legend and notes'], correct: 2, explanation: 'The legend establishes the conventions used by that set. A naming pattern or symbol from another project may not apply.' },
      { prompt: 'What does a connector pin label primarily identify?', choices: ['A particular connection point', 'The entire machine’s operating state', 'The current drawing revision'], correct: 0, explanation: 'A pin label identifies a connection point within its connector context. It is distinct from the device tag, wire identifier, and document revision.' },
      { prompt: 'A conductor’s documented color suggests a particular supply. Does that prove it is safe to touch?', choices: ['Yes, if the main switch is open', 'No; documentation cues do not replace approved energy control and verification', 'Yes, if its tag is easy to read'], correct: 1, explanation: 'Color and labels help interpret documentation. They cannot establish the actual energy state, eliminate wiring errors, or replace the required safe-work process.' },
    ],
  },
  {
    id: 'drawing-references', title: 'Follow the reference', category: 'PRINT READING / CROSS-REFERENCES', symbol: '18', minutes: 5,
    brief: 'A fictional relay coil appears on one sheet and its contact on another. Follow the relationship without inventing a wire between them.',
    points: [
      'An off-sheet conductor reference can identify where the same electrical path continues. Check its target sheet, grid or line, matching identifier, and the drawing convention.',
      'A coil-to-contact reference identifies an associated device function. It does not mean the coil and contact terminals are electrically connected to each other.',
      'A tag’s digits or letters may suggest a location only when the drawing’s naming rules define that meaning. Resolve missing or inconsistent reference targets through the responsible engineering process.',
    ],
    questions: [
      { prompt: 'A fictional contact refers to its operating coil on sheet COIL, grid B2. What is the reference primarily showing?', choices: ['A device relationship, not a wire joining coil and contact terminals', 'A required jumper between every terminal', 'The lamp’s physical cabinet position'], correct: 0, explanation: 'The reference associates a relay contact with its operating coil. The control circuit and switched circuit can remain electrically separate.' },
      { prompt: 'What should you match when following an off-sheet conductor continuation?', choices: ['Only the background color', 'The closest drawing thumbnail', 'The stated target and matching conductor/reference information'], correct: 2, explanation: 'The sheet or grid target and matching conductor/reference information establish the documented continuation. Proximity on the page does not.' },
      { prompt: 'A cross-reference points to a missing device. What should you do?', choices: ['Invent the missing connection', 'Flag the inconsistency and obtain an approved resolution', 'Bypass the device in the field'], correct: 1, explanation: 'An unresolved reference is a documentation problem to investigate. It is not permission to infer a connection or modify equipment.' },
    ],
  },
  {
    id: 'complete-circuit-path', title: 'Trace the whole loop', category: 'PRINT READING / CIRCUIT PATHS', symbol: '19', minutes: 5,
    brief: 'Trace a fictional lamp circuit through its supply, protection, switching contact, load, and return. Then investigate the contact’s separate command circuit.',
    points: [
      'A functional trace accounts for the source and the return, not just the component that appears faulty. Protection, switching conditions, connectors, and alternate supplies can all matter.',
      'For an ideal normally open relay contact, energizing its operating coil changes the contact condition. A static drawing normally shows the specified reference state, not a live measurement of the machine.',
      'Keep electrical continuity, device association, and physical location distinct. A control return or neutral is not automatically the protective-earth conductor. The approved drawing conventions define the intended relationships.',
    ],
    questions: [
      { prompt: 'A learner traces the fictional supply through a contact to a lamp, then stops. What part of the loop is missing?', choices: ['The page border', 'The return path', 'The font name'], correct: 1, explanation: 'A complete circuit trace includes the return as well as the supply path. Identifying the load alone does not explain the complete circuit.' },
      { prompt: 'A contact is drawn normally open. Does the printed symbol prove that the installed contact is open right now?', choices: ['Yes, for every operating condition', 'Yes, if the lamp is dark', 'No; operating state depends on the actual device conditions'], correct: 2, explanation: 'The drawing shows the stated reference condition. Device actuation, coil state, faults, and verification determine the actual operating condition.' },
      { prompt: 'The fictional circuit uses a node labeled 0 V as its return. What can you assume about protective earth?', choices: ['No protective-earth connection may be inferred without the documented relationship', 'Every 0 V terminal is automatically protective earth', 'Return conductors never carry current'], correct: 0, explanation: 'A circuit reference or return is not automatically a protective conductor. Any bonding relationship must be established by the applicable design documentation.' },
    ],
  },
  {
    id: 'drawing-evidence', title: 'Check the drawing’s story', category: 'PRINT READING / EVIDENCE', symbol: '20', minutes: 5,
    brief: 'A fictional drawing, a component label, and an operating symptom do not quite agree. Use that mismatch as a question to investigate, not a shortcut to a repair.',
    points: [
      'Use layouts to locate devices and parts documentation to identify specified components. A matching tag or catalog entry does not alone establish that a replacement is suitable or that the installed wiring is correct.',
      'Compare expected circuit behavior with approved observations and current documentation. A status bit, pilot light, or auxiliary contact represents limited information; it is not independent proof of machine safety.',
      'Record discrepancies and route changes through authorized engineering and document-control processes. Do not redraw history, change wiring, or bypass a protective function simply to make the evidence agree.',
    ],
    questions: [
      { prompt: 'A fictional component label differs from the current parts list. What is the best response?', choices: ['Replace it with any part that fits', 'Ignore it because the machine once worked', 'Record the discrepancy and obtain an approved technical resolution'], correct: 2, explanation: 'The mismatch needs review in its equipment and revision context. Mechanical fit or past operation does not establish a component’s suitability.' },
      { prompt: 'An auxiliary status says a device changed state. What does that alone establish?', choices: ['A limited status indication that must be interpreted in context', 'That every hazardous energy source is isolated', 'That protective functions may be bypassed'], correct: 0, explanation: 'A status indication is one piece of evidence. It does not prove all physical conditions, establish isolation, or authorize a bypass.' },
      { prompt: 'An authorized change is needed after a discrepancy is resolved. What should happen to the documents?', choices: ['Leave the old drawing unchanged forever', 'Use the approved change and document-control process', 'Delete the revision history'], correct: 1, explanation: 'Controlled documentation should reflect approved changes through the responsible process. Informal edits alone do not establish an approved, current drawing.' },
    ],
  },
];
