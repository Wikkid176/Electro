import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { lessons } from '../src/content.ts';
import { componentChallenges, workshopComponents } from '../src/components.ts';
import { profiles, planProfile, modelVersion, lessonWords, referenceWords, probabilities } from '../tests/beta/model.ts';

const results = await Promise.all(profiles.map(async profile => JSON.parse(await readFile(`beta-results/individual/${profile.id}.json`, 'utf8'))));
const runner = JSON.parse(await readFile('beta-results/playwright-beta.json', 'utf8'));
const validation = JSON.parse(await readFile('beta-results/validation.json', 'utf8').catch(() => 'null'));
if (runner.stats.unexpected || runner.stats.skipped || runner.stats.expected !== profiles.length) throw new Error('All 12 journeys must pass before reporting a successful beta.');
for (const result of results) {
  if (result.modelVersion !== modelVersion || result.completed !== lessons.length || result.actual.length !== lessons.length || result.errors.length || result.consoleErrors.length) throw new Error(`Incomplete or stale result: ${result.profile.id}`);
  if (result.actual.reduce((sum: number, item: { score: number }) => sum + item.score, 0) !== result.correct) throw new Error('Incorrect total');
  const plan = planProfile(profiles.find(profile => profile.id === result.profile.id)!);
  assert.deepEqual(result.profile, plan.profile);
  assert.deepEqual(result.components, plan.components);
  assert.equal(result.estimatedMinutes, plan.estimatedMinutes);
  for (const lesson of lessons) {
    const actual = result.actual.find((item: { lessonId: string }) => item.lessonId === lesson.id);
    const decisions = plan.questions.filter(question => question.lessonId === lesson.id);
    assert.deepEqual(actual.answers, decisions.map(question => question.answer));
    assert.equal(actual.score, actual.answers.filter((answer: number, index: number) => answer === lesson.questions[index].correct).length);
  }
  // Keep the denominator and reproducible plan under different keys in raw data.
  result.answerPlan = plan.questions;
  await writeFile(`beta-results/individual/${result.profile.id}.json`, JSON.stringify(result, null, 2) + '\n');
}
const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
const median = (values: number[]) => { const sorted = [...values].sort((a, b) => a - b); return (sorted[Math.floor((sorted.length - 1) / 2)] + sorted[Math.ceil((sorted.length - 1) / 2)]) / 2; };
function aggregate(name: string, rows: typeof results) {
  const sum = (key: string) => rows.reduce((value: number, row: Record<string, number>) => value + row[key], 0);
  return { group: name, users: rows.length, completedJourneys: rows.length, correct: sum('correct'), questions: sum('questions'), accuracyPercent: sum('correct') / sum('questions') * 100, componentCorrect: sum('componentCorrect'), componentQuestions: sum('componentQuestions'), componentAccuracyPercent: sum('componentCorrect') / sum('componentQuestions') * 100, meanMastered: mean(rows.map(row => row.mastered)), meanXp: mean(rows.map(row => row.xp)), meanMinutes: mean(rows.map(row => row.estimatedMinutes)), medianMinutes: median(rows.map(row => row.estimatedMinutes)), minMinutes: Math.min(...rows.map(row => row.estimatedMinutes)), maxMinutes: Math.max(...rows.map(row => row.estimatedMinutes)), labTasksPassed: sum('labTasksPassed'), interruptionsRecovered: sum('interruptionsRecovered') };
}
const groups = [...new Set(profiles.map(profile => profile.group))].map(group => aggregate(group, results.filter(result => result.profile.group === group)));
const overall = aggregate('All profiles', results);
const round = (value: number) => Math.round(value * 10) / 10;
const pct = (value: number) => `${value.toFixed(1)}%`;
const duration = (value: number) => { const minutes = Math.round(value); return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`; };
const groupRows = [...groups, overall].map(group => `| ${group.group} | ${group.users} | ${duration(group.meanMinutes)} | ${duration(group.minMinutes)}–${duration(group.maxMinutes)} | ${group.correct}/${group.questions} (${pct(group.accuracyPercent)}) | ${group.componentCorrect}/${group.componentQuestions} (${pct(group.componentAccuracyPercent)}) | ${group.meanMastered.toFixed(1)}/47 |`).join('\n');
const individualRows = results.map(result => `| ${result.profile.id} | ${result.profile.age} | ${result.profile.group} | ${duration(result.estimatedMinutes)} | ${result.correct}/141 (${pct(result.correct / 141 * 100)}) | ${result.mastered}/47 | ${result.componentCorrect}/12 | ${result.xp} |`).join('\n');
const parameterRows = profiles.map(profile => `| ${profile.id} | ${profile.wpm} | ${profile.decisionSeconds} | ${profile.probabilityOffset >= 0 ? '+' : ''}${profile.probabilityOffset} | ${pct(profile.hintRate * 100)} | ${profile.labMinutes} | ${profile.width}×${profile.height} / ${profile.keyboard ? 'keyboard' : 'pointer'} | ${profile.interrupt ? 'Yes' : 'No'} |`).join('\n');
const probabilityRows = Object.entries(probabilities).map(([topic, [novice, professional]]) => `| ${topic} | ${pct(novice * 100)} | ${pct(professional * 100)} |`).join('\n');
const files = ['App.tsx', 'src/session.ts', 'src/MeterLab.tsx', 'src/TraceLab.tsx', 'src/content.ts', 'src/coach.ts', 'src/components.ts', 'tests/beta/model.ts', 'tests/beta/journeys.spec.ts', 'tests/browser/beta-regressions.spec.ts', 'playwright.beta.config.ts', 'package-lock.json'];
const sourceHashes = Object.fromEntries(await Promise.all(files.map(async file => [file, createHash('sha256').update(await readFile(file)).digest('hex')])));
const datasetHashes = {
  curriculum: createHash('sha256').update(JSON.stringify(lessons)).digest('hex'),
  workshop: createHash('sha256').update(JSON.stringify({ componentChallenges, workshopComponents })).digest('hex'),
};
await mkdir('beta-results', { recursive: true });
await writeFile('beta-results/summary.json', JSON.stringify({ modelVersion, generatedAt: new Date().toISOString(), kind: 'Seeded synthetic journeys; not human beta or efficacy evidence', sourceHashes, datasetHashes, lessonWords, referenceWords, groups, overall, individuals: results.map(result => ({ id: result.profile.id, age: result.profile.age, group: result.profile.group, correct: result.correct, questions: result.questions, mastered: result.mastered, componentCorrect: result.componentCorrect, xp: result.xp, estimatedMinutes: round(result.estimatedMinutes), automationSeconds: result.automationSeconds, time: result.time })) }, null, 2) + '\n');
const csv = (rows: unknown[][]) => rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n') + '\n';
await writeFile('beta-results/individual-metrics.csv', csv([['profile', 'age', 'group', 'modeled_study_minutes', 'first_pass_correct', 'questions', 'accuracy_percent', 'mastered_missions', 'completed_missions', 'component_correct', 'component_questions', 'xp', 'automation_seconds'], ...results.map(result => [result.profile.id, result.profile.age, result.profile.group, round(result.estimatedMinutes), result.correct, 141, round(result.correct / 141 * 100), result.mastered, 47, result.componentCorrect, 12, result.xp, result.automationSeconds])]));
await writeFile('beta-results/group-metrics.csv', csv([['group', 'users', 'modeled_mean_minutes', 'modeled_median_minutes', 'modeled_min_minutes', 'modeled_max_minutes', 'correct', 'questions', 'accuracy_percent', 'component_correct', 'component_questions', 'component_accuracy_percent', 'mean_mastered', 'mean_xp'], ...[...groups, overall].map(group => [group.group, group.users, round(group.meanMinutes), round(group.medianMinutes), round(group.minMinutes), round(group.maxMinutes), group.correct, group.questions, round(group.accuracyPercent), group.componentCorrect, group.componentQuestions, round(group.componentAccuracyPercent), round(group.meanMastered), round(group.meanXp)])]));
const report = `# ELECTRO simulated beta report

October 19, 2026 · ${modelVersion} · 12 profiles, as confirmed by the user

**This is an automated synthetic beta, not a study with real people.** Browser interactions and app scores were checked against deliberately generated answer plans. The accuracy differences and study times below come from unvalidated assumptions about prior knowledge, reading pace and decision time. They do not establish what any age group will learn or how real users will perform.

## Scope and results

All 12 isolated browser journeys passed: **564 mission completions, 1,692 graded mission answers, 144 component answers, 48 practical navigation/state tasks and four mid-course reload/resume checks**. Saved scores and XP matched each answer plan after reload. No uncaught page errors or browser console errors occurred in these journeys. No horizontal overflow was detected at the tested quiz states across 320, 390 and 1,280 pixel viewport widths. Four profiles activated controls with keyboard focus and Enter; eight used pointer activation. This does not replace a screen-reader audit, native touch testing or visual review on physical phones.

“Completion” here means one attempt at all 47 missions plus a practice pass through all four labs. It does not mean mastering all missions. Mastery requires 3/3 in a mission; repeat attempts to achieve full mastery are excluded from the time estimates. Scripted 12/12 completion is an automation result, not a prediction of human retention or dropout.

## Group metrics

First-pass quiz and workshop performance is simulated. Times include the four labs and represent active study, without breaks.

| Group | Profiles | Mean estimated study time | Profile time range | Quiz correct | Workshop correct | Mean first-pass mastered |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
${groupRows}

The overall averages weight each profile equally (5/2/2/3), rather than weighting the four groups equally. Overall median estimated time: **${duration(overall.medianMinutes)}**. Overall mean XP: **${Math.round(overall.meanXp)} / 3,525**. Each profile completed 47 missions and four lab tasks. The two teens were assumed to have no formal electrical training because their prior knowledge was unspecified.

## Individual metrics

| Profile | Age | Group | Estimated active study | Quiz correct | Missions mastered | Workshop | XP |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: |
${individualRows}

## Bugs reproduced and fixed

Three pre-fix phone checks failed, then passed after changes:

1. **Unfinished quizzes were lost on reload.** A mid-mission refresh returned to the home page with no answer checkpoint. Added one validated local checkpoint, explicit Resume/Discard actions, checked-answer/feedback and hint restoration, and completion cleanup. Partial answers do not award XP. Completed scores use their existing separate storage key. Invalid, stale or impossible checkpoints are rejected; question changes invalidate the checkpoint. Starting a different mission replaces the previous checkpoint, as explained on screen.
2. **Selected control states were missing from the browser accessibility tree.** Root navigation tabs lacked aria-selected and mission radios lacked aria-checked. Added explicit states, a mission answer group, meter pressed states and drawing-sheet selection states, while keeping native accessibility state. This is a programmatic accessibility correction; speech output on real assistive technology still needs testing.
3. **A mastered path still recommended mission one as the next new task.** With all 47 scores at 3/3, the home page offered Start mission 01. It now shows Learning path mastered and a Review mastered missions action leading to Progress.

Regression coverage also checks an unchecked selected answer with an open hint, checkpoint discard without score loss, checkpoint-only read failure while completed scores still save, and malformed/stale checkpoint rejection. Complete verification totals and build outcomes are recorded in [validation.json](validation.json).

${validation ? `Final verification: **${validation.unit.passed} model/content tests, ${validation.runners.regression.expected} phone/desktop browser cases and ${validation.runners.beta.expected} synthetic journeys passed (${validation.uniquePassingChecks} distinct checks)**. The strengthened discard assertion also passed a focused phone/desktop rerun. TypeScript checks and web, Android and iOS JavaScript exports succeeded. Native signed packages and physical-device tests are still pending.` : 'Final build and regression verification has not yet been recorded.'}

Review the corrected phone screens: [unfinished mission with Resume/Discard](screenshots/phone-resume.png) and [fully mastered learning path](screenshots/phone-mastered.png).

## Model and reproducibility

Source and model hashes are in [summary.json](summary.json). Raw individual answer plans/results are in individual/; [individual-metrics.csv](individual-metrics.csv) and [group-metrics.csv](group-metrics.csv) open in a spreadsheet. [playwright-beta.json](playwright-beta.json) records runner outcomes and automation wall time. Automation wall time is not study time.

The answer model uses a deterministic 32-bit LCG seeded separately for each profile: seed = (1664525 × seed + 1013904223) modulo 2^32. Each question draws correctness against the probability below plus the individual offset, then a distractor and optional-hint draw. A failed draw selects a uniformly sampled incorrect choice. This uses the answer key; it does not represent independent electrical reasoning. Hints do not increase the modeled success probability. There is no modeled learning gain, fatigue, or dependence between answers. Professional profiles have higher probabilities only because that prior-knowledge assumption was explicitly chosen. Age is never used in the formulas.

| Topic | Assumed novice probability | Assumed professional probability |
| --- | ---: | ---: |
${probabilityRows}

Workshop probabilities before the individual offset: novice identification 70%, novice visible-defect identification 62%, professional 92%. These numbers are illustrative scenario settings, not validated pass rates. Differences between the three novice age groups are random-seed and pace/input differences, not age findings. No real subgroup ranking is supported by this small synthetic sample.

| Profile | Technical reading words/min | Decision seconds/question | Probability offset | Hint probability | Lab minutes | Viewport / input | Mid-course reload |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
${parameterRows}

Active study minutes = (${lessonWords.toLocaleString('en-US')} lesson/question/answer/feedback words + ${referenceWords} reference-card words + selected hint words + one extra feedback reread per wrong answer) / reading words per minute + 141 × decision seconds / 60 + 47 × navigation seconds / 60 + 8 seconds reflection per used hint + lab allowance + one minute recovery for profiles with an interruption. Reference cards are counted once per unique card ID within each lesson. Lab allowances include reading, exploration and the 12 workshop rounds. Navigation input assumes 4–9 seconds per mission; routine tapping time is included in decision/lab allowances. The app's displayed mission estimates total ${lessons.reduce((sum, lesson) => sum + lesson.minutes, 0)} minutes, independently of this model.

Reading, decisions and lab allowances have not been calibrated with humans. As a simple sensitivity check, changing every time input by ±20% changes the overall estimated mean from **${duration(overall.meanMinutes * .8)} to ${duration(overall.meanMinutes * 1.2)}**. This is not a confidence interval. Breaks, optional component exploration beyond the lab allowance, remediation, and physical-equipment work are excluded.

## What this beta establishes

The current browser build can complete these scripted paths, score mixed correct/incorrect answers, preserve local records, recover four interrupted missions, render component art, and run the practical models. It does not establish educational effectiveness, electrical competence, real-user satisfaction, accessibility certification or native-device reliability. The assumed professional score advantage cannot be claimed as a measured finding.

The next useful validation is a real supervised pilot using these same 5/2/2/3 cohorts, recording active study time, first-attempt answers, hints, abandonment, delayed retention and task comprehension. All teens' activities should remain conceptual and supervised. Qualified electrical reviewers and real Android/iOS testing remain release prerequisites.

## Rerun

From the repository root with the README cloud cache variables set:

\`\`\`sh
ELECTRO_TEST_PORT=8091 npm run test:beta
npm run report:beta
\`\`\`

Do not edit app or model sources during a run. The report generator refuses a failed or incomplete runner result. Review the transparent assumptions before interpreting any simulated score or time.
`;
await writeFile('beta-results/REPORT.md', report);
console.log(JSON.stringify({ groups, overall }, null, 2));
