import type { Lesson, PracticeReference } from './content.ts';

const practiceManuals: PracticeReference[] = [
  { id: 'CARD-A', title: 'TRAIN-CTRL-A / Manual revision C', context: 'Fictional controlled register: current for training model A.', content: 'Section 4.2: F-TRAIN indicates a missing enable condition in this simulator. Investigate the fictional command-path documentation. This sample provides no field settings or repair instructions.' },
  { id: 'CARD-B', title: 'TRAIN-CTRL-B / Manual revision C', context: 'Different fictional model: B, not A.', content: 'Section 4.2: F-TRAIN indicates a sensor mismatch in training model B. Similar error labels do not make manuals interchangeable.' },
  { id: 'CARD-C', title: 'TRAIN-CTRL-A / Manual revision A', context: 'Fictional controlled register: superseded; not the approved exercise reference.', content: 'An older manual for model A. Its presence in a folder does not establish that it applies to the current exercise configuration.' },
];

export const standardsLessons: Lesson[] = [
  {
    id: 'standards-scope', title: 'Choose the right source', category: 'REFERENCE SKILLS / SCOPE', symbol: '21', minutes: 5,
    brief: 'Before searching for a rule, identify the question. Machine construction, installation, panel requirements, and safe work practices are related but different topics.',
    points: [
      'NFPA 79 addresses electrical equipment of industrial machinery within its scope. NFPA 70, commonly called the NEC, addresses electrical installations within its scope; the boundary between installation and machine requirements needs project-specific review.',
      'NFPA 70E concerns electrical safety-related work practices. UL 508A concerns industrial control panels within its scope. These references are not interchangeable, and a single document does not establish complete machine or workplace compliance.',
      'Manufacturer instructions, applicable regulations, project requirements, and other standards can also matter. A destination country or a label alone does not determine every requirement. Identify applicability with the responsible engineering or safety authority.',
    ],
    questions: [
      { prompt: 'Which reference is a starting point for researching electrical equipment of industrial machinery within its scope?', choices: ['A paint color catalog', 'NFPA 79, together with the applicable project context', 'A random machine’s spare-parts list'], correct: 1, explanation: 'NFPA 79 is a relevant starting reference for industrial machinery electrical equipment. Applicability, edition, and other requirements must still be established for the actual project.' },
      { prompt: 'A question concerns electrical safety-related work practices. Which reference family is directly relevant?', choices: ['NFPA 70E and the applicable workplace requirements', 'Only a component dimensional drawing', 'Only a panel layout'], correct: 0, explanation: 'NFPA 70E addresses electrical safety-related work practices. Applicable regulations and the employer’s approved program also matter; a drawing alone is not a safe-work procedure.' },
      { prompt: 'A panel meets a requirement in one reference. What can you conclude about the complete machine?', choices: ['Every installation and workplace requirement is satisfied', 'No further context matters', 'That one result does not establish complete machine compliance'], correct: 2, explanation: 'Different requirements address different scopes. Panel, machine, installation, product instructions, and workplace obligations must be evaluated in their applicable contexts.' },
    ],
  },
  {
    id: 'edition-evidence', title: 'Check the edition and authority', category: 'REFERENCE SKILLS / APPLICABILITY', symbol: '22', minutes: 5,
    brief: 'A search result, a handbook, and an adopted standard may give different answers. Establish which source actually governs the question.',
    points: [
      'Record the document identity, edition or revision, applicable jurisdiction or project basis, and relevant scope. The most recently published edition is not automatically the edition adopted or required for an existing project.',
      'Use a contents page or index to locate a topic, then read the controlling text, definitions, conditions, exceptions, and referenced material. A heading, screenshot, or remembered percentage can omit decisive limitations.',
      'Distinguish primary requirements and manufacturer instructions from explanatory guides, examples, and search summaries. Conflicts need resolution through the responsible authority; do not simply choose the newest, easiest, or apparently strictest statement.',
    ],
    questions: [
      { prompt: 'A new standards edition is published. Does that alone prove it governs an existing installation?', choices: ['Yes, regardless of adoption or project requirements', 'Only if a search engine ranks it first', 'No; adoption, scope, and project applicability must be established'], correct: 2, explanation: 'Publication and applicability are different matters. The responsible team must establish the governing requirements for the actual jurisdiction, equipment, and project.' },
      { prompt: 'You find a useful topic in an index. What is the next step?', choices: ['Read the relevant text and its definitions, conditions, exceptions, and references', 'Treat the index entry as the complete rule', 'Apply the first number visible in a screenshot'], correct: 0, explanation: 'An index is a navigation tool. The controlling text and associated context determine what the requirement actually means and whether it applies.' },
      { prompt: 'A manufacturer instruction and a project guide appear to conflict. What is the sound response?', choices: ['Choose whichever is faster', 'Escalate for an approved applicability and technical resolution', 'Assume the guide overrides every instruction'], correct: 1, explanation: 'A conflict requires qualified review of scope, authority, equipment details, and applicable requirements. An unexplained choice is not a defensible resolution.' },
    ],
  },
  {
    id: 'ratings-context', title: 'Keep ratings in context', category: 'REFERENCE SKILLS / RATINGS', symbol: '23', minutes: 5,
    brief: 'A load-current value, an interrupting rating, and an assembly short-circuit current rating answer different questions.',
    points: [
      'Short-circuit current rating concerns the specified equipment or assembly under stated conditions. A high rating on one disconnect or protective device does not automatically become the rating of the complete panel or machine.',
      'Available fault current must be considered against the applicable equipment ratings and conditions. A protective device’s interrupting rating and an assembly’s rating are distinct. One favorable comparison does not establish complete installation suitability.',
      'Motor conductors, short-circuit protection, and overload protection involve different decisions and may use different reference inputs. Applicable rules, exceptions, component instructions, and operating conditions must be checked; this lesson supplies no sizing table, setting, or substitution approval.',
    ],
    questions: [
      { prompt: 'One component carries a higher short-circuit rating than the panel’s marked assembly rating. Which assumption is unsafe?', choices: ['Assuming the component’s rating automatically upgrades the whole panel', 'Checking the assembly documentation', 'Obtaining a qualified review before a substitution'], correct: 0, explanation: 'An assembly rating depends on the relevant equipment, construction, components, and evaluated conditions. One component’s marking does not automatically establish a higher assembly rating.' },
      { prompt: 'A fictional review finds available fault current above the equipment’s applicable rating. What should happen?', choices: ['Ignore it because normal load current is low', 'Assume a physically fitting fuse solves everything', 'Stop acceptance and obtain a qualified engineering resolution'], correct: 2, explanation: 'A normal operating-current value does not resolve a fault-duty mismatch. The responsible engineering process must address the applicable equipment and protection requirements.' },
      { prompt: 'Can one remembered percentage determine every motor conductor, protective device, and overload setting?', choices: ['Yes, for every motor and installation', 'No; the decision, applicable rules, reference inputs, and conditions differ', 'Yes, if the motor fits in the same space'], correct: 1, explanation: 'These are distinct engineering decisions. The appropriate source and conditions must be established for each; this app does not select real conductor sizes or protective settings.' },
    ],
  },
  {
    id: 'reference-hunt', title: 'Find it and cite it', category: 'REFERENCE SKILLS / LOOKUP PRACTICE', symbol: '24', minutes: 5,
    brief: 'Use original fictional practice documents to choose an applicable source, interpret its answer, and record enough information for someone else to check it.',
    points: [
      'Define the question and identify the exact model or variant, configuration, and approved document revision. A similar catalog number or a familiar error label may lead to the wrong instructions.',
      'Keep a useful citation: document identity, edition or revision, section or page, and the conditions that make the information applicable. Include units where values are involved; a bare number is not a complete answer.',
      'Check the finding before acting. A well-supported lookup is more valuable than an unsupported quick answer. The cards in this mission are invented training samples, not standards text or manufacturer guidance.',
    ],
    questions: [
      { prompt: 'The exercise uses TRAIN-CTRL-A, and its controlled register requires manual revision C. Which practice card applies?', choices: ['CARD-C: model A, revision A', 'CARD-B: model B, revision C', 'CARD-A: model A, revision C'], correct: 2, explanation: 'CARD-A matches both the exact training model and the exercise’s approved revision. A matching revision with the wrong model, or the right model with a superseded revision, is insufficient.', referenceCards: practiceManuals },
      { prompt: 'Which record lets another learner verify the fictional F-TRAIN finding?', choices: ['TRAIN-CTRL-A manual, revision C, section 4.2; model A; missing enable condition', 'I remember something about a sensor', 'A manual found online, no model or revision recorded'], correct: 0, explanation: 'The first record identifies the document, revision, section, applicable model, and finding. Those details make the result checkable within this fictional exercise.', referenceCards: practiceManuals },
      { prompt: 'The approved record for this exercise says “missing enable condition,” while a model B manual says “sensor mismatch.” What should you conclude?', choices: ['The newest-looking cover always wins', 'The different model’s answer cannot be transferred just because the error label matches', 'Both answers authorize replacing the same real component'], correct: 1, explanation: 'Identical labels can mean different things on different models. Use the applicable source and resolve uncertainty through the responsible process; the fictional cards provide no real-world repair authorization.', referenceCards: practiceManuals },
    ],
  },
];
