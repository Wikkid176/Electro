import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import deepPack from './training/deep_lessons.json';
import casePack from './training/work_orders.json';

const palette = { text: '#F3F6FA', muted: '#B4C2D3', line: '#35495F', panel: '#142131', lime: '#D6FA68', blue: '#9BC7FF' };

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}
function Action({ title, onPress, subdued = false }: { title: string; onPress: () => void; subdued?: boolean }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.action, subdued && styles.actionSecondary, pressed && { opacity: 0.78 }]}>
    <Text style={[styles.actionLabel, subdued && { color: palette.text }]}>{title}</Text>
  </Pressable>;
}
function TextLines({ items }: { items: string[] }) {
  return <View style={styles.lines}>{items.map((item, index) => <View key={index} style={styles.line}><Text style={styles.bullet}>•</Text><Text style={[styles.body, styles.grow]}>{item}</Text></View>)}</View>;
}

export function AdvancedTraining({ onNavigate, onExit }: { onNavigate: () => void; onExit: () => void }) {
  const [mode, setMode] = useState<'lessons' | 'cases'>('lessons');
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [showDebrief, setShowDebrief] = useState(false);
  const lesson = deepPack.lessons.find(item => item.id === lessonId);
  const workOrder = casePack.cases.find(item => item.id === caseId);
  function openLesson(id: string) { setLessonId(id); setCaseId(null); setAnswers({}); setRevealed({}); onNavigate(); }
  function openCase(id: string) { setCaseId(id); setLessonId(null); setShowDebrief(false); onNavigate(); }
  function returnToCatalog() { setCaseId(null); setLessonId(null); onNavigate(); }

  return <View testID="advanced-training" style={styles.root}>
    <Action title="← Back to main training" onPress={onExit} subdued />
    <Text style={styles.eyebrow}>ADVANCED TRAINING · DEEP DIVE</Text>
    <Text accessibilityRole="header" style={styles.title}>Learn the why behind the wiring.</Text>
    <Text style={styles.body}>21 in-depth industrial electrical lessons and 12 fictional maintenance work orders. All material works offline and does not change your original lesson scores or XP.</Text>
    <Card><Text style={styles.warningHeading}>SAFETY BOUNDARY</Text><Text style={styles.body}>Conceptual simulation only. This app does not qualify or authorize electrical work or equipment servicing. Follow employer procedures and qualified supervision. Never translate a fictional meter reading or work order into permission for energized work.</Text></Card>
    {(lesson || workOrder) ? <Action title="← All advanced training" onPress={returnToCatalog} subdued /> : <>
      <View style={styles.switcher}><View style={styles.grow}><Action title={`Deep Lessons (${deepPack.lessons.length})`} onPress={() => setMode('lessons')} subdued={mode !== 'lessons'} /></View><View style={styles.grow}><Action title={`Work Orders (${casePack.cases.length})`} onPress={() => setMode('cases')} subdued={mode !== 'cases'} /></View></View>
      {mode === 'lessons' ? deepPack.lessons.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`Open deep lesson: ${item.title}`} onPress={() => openLesson(item.id)} style={({ pressed }) => [styles.catalogItem, pressed && { opacity: 0.8 }]}>
        <Text style={styles.eyebrow}>{item.track} · {item.level.toUpperCase()} · {item.estimatedMinutes} MIN</Text><Text style={styles.itemTitle}>{item.title}</Text><Text style={styles.itemLink}>Explore lesson →</Text>
      </Pressable>) : casePack.cases.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`Open work order: ${item.title}`} onPress={() => openCase(item.id)} style={({ pressed }) => [styles.catalogItem, pressed && { opacity: 0.8 }]}>
        <Text style={styles.eyebrow}>{item.id} · {item.tier.toUpperCase()}</Text><Text style={styles.itemTitle}>{item.title}</Text><Text style={styles.itemLink}>Review fictional fault →</Text>
      </Pressable>)}
    </>}
    {lesson && <>
      <Text style={styles.eyebrow}>{lesson.track} · {lesson.level.toUpperCase()} · {lesson.estimatedMinutes} MIN</Text>
      <Text accessibilityRole="header" style={styles.title}>{lesson.title}</Text>
      <Card><Text style={styles.heading}>Learning objectives</Text><TextLines items={lesson.objectives} /></Card>
      {lesson.sections.map((section, index) => <Card key={index}><Text style={styles.eyebrow}>CONCEPT {index + 1} OF {lesson.sections.length}</Text><Text style={styles.heading}>{section.heading}</Text><Text style={styles.body}>{section.body}</Text></Card>)}
      <Card><Text style={styles.eyebrow}>WORKED EXAMPLE</Text><Text style={styles.heading}>Reason through the situation</Text><Text style={styles.body}>{lesson.workedExample.problem}</Text><Text style={styles.subheading}>Worked solution</Text><Text style={styles.body}>{lesson.workedExample.solution}</Text><Text style={styles.subheading}>What this teaches</Text><Text style={styles.body}>{lesson.workedExample.interpretation}</Text></Card>
      <Card><Text style={styles.eyebrow}>COMMON MISCONCEPTION</Text><Text style={styles.quote}>{lesson.commonMisconception.claim}</Text><Text style={styles.body}>{lesson.commonMisconception.correction}</Text></Card>
      <Text style={styles.heading}>Check your understanding</Text>
      <Text style={styles.body}>These checks are ungraded. Select an answer to reveal the reasoning.</Text>
      {lesson.knowledgeChecks.map((question, index) => <Card key={index}>
        <Text style={styles.eyebrow}>CHECK {index + 1} OF {lesson.knowledgeChecks.length}</Text>
        <Text style={styles.heading}>{question.question}</Text>
        {question.choices.map((choice, choiceIndex) => <Pressable key={choiceIndex} accessibilityRole="radio" accessibilityState={{ checked: answers[index] === choiceIndex }} onPress={() => { setAnswers(previous => ({ ...previous, [index]: choiceIndex })); setRevealed(previous => ({ ...previous, [index]: false })); }}
          style={[styles.choice, answers[index] === choiceIndex && styles.choiceSelected]}><Text style={styles.body}>{String.fromCharCode(65 + choiceIndex)}. {choice}</Text></Pressable>)}
        {answers[index] !== undefined && <Action title="Check reasoning" subdued onPress={() => setRevealed(previous => ({ ...previous, [index]: true }))} />}
        {revealed[index] && <View accessibilityLiveRegion="polite" style={styles.feedback}><Text style={styles.subheading}>{answers[index] === question.correctIndex ? 'Correct reasoning' : 'Review the principle'}</Text><Text style={styles.body}>{question.explanation}</Text></View>}
      </Card>)}
      <Card><Text style={styles.eyebrow}>VIRTUAL PRACTICE CONCEPT</Text><Text style={styles.heading}>{lesson.virtualExercise.prompt}</Text><Text style={styles.body}>Expected reasoning: {lesson.virtualExercise.expectedReasoning}</Text><Text style={styles.body}>Safety boundary: {lesson.virtualExercise.safetyGate}</Text><Text style={styles.small}>Exercise specification; not yet a playable simulation.</Text></Card>
      <Text style={styles.small}>References for further instructor review: {lesson.referenceIds.join(', ')}</Text>
      <Text style={styles.small}>{lesson.trainingNotice}</Text>
      <Action title="← Back to all lessons" onPress={returnToCatalog} subdued />
    </>}
    {workOrder && <>
      <Text style={styles.eyebrow}>{workOrder.id} · {workOrder.tier.toUpperCase()} · FICTIONAL WORK ORDER</Text>
      <Text accessibilityRole="header" style={styles.title}>{workOrder.title}</Text>
      <Card><Text style={styles.heading}>Reported problem</Text><Text style={styles.body}>{workOrder.symptom}</Text></Card>
      <Card><Text style={styles.heading}>Recorded virtual observations</Text><TextLines items={workOrder.observations} /></Card>
      <Card><Text style={styles.heading}>Candidate causes</Text><Text style={styles.body}>Do not replace components based solely on a symptom. Compare each candidate with available evidence.</Text><TextLines items={workOrder.candidateCauses} /></Card>
      <Card><Text style={styles.heading}>Evidence to investigate</Text><TextLines items={workOrder.discriminatingVirtualEvidence} /></Card>
      <Card><Text style={styles.warningHeading}>Safety boundary</Text><Text style={styles.body}>{workOrder.safetyBoundary}</Text></Card>
      <Action title={showDebrief ? 'Hide diagnostic debrief' : 'Show diagnostic debrief'} onPress={() => setShowDebrief(!showDebrief)} />
      {showDebrief && <Card><Text style={styles.heading}>Diagnostic reasoning</Text><Text style={styles.body}>{workOrder.debrief}</Text><Text style={styles.small}>Related advanced lessons: {workOrder.relatedLessons.join(', ')}</Text><Text style={styles.small}>This is a structured case study, not a live fault simulator or a field repair procedure.</Text></Card>}
      <Action title="← Back to all work orders" onPress={returnToCatalog} subdued />
    </>}
  </View>;
}

const styles = StyleSheet.create({
  root: { gap: 16 },
  card: { backgroundColor: palette.panel, borderWidth: 1, borderColor: palette.line, borderRadius: 16, padding: 18, gap: 13 },
  eyebrow: { color: palette.blue, fontSize: 11, fontWeight: '800', letterSpacing: 1.1, lineHeight: 18 },
  title: { fontSize: 29, lineHeight: 37, color: palette.text, fontWeight: '800' },
  heading: { color: palette.text, fontSize: 19, lineHeight: 26, fontWeight: '800' },
  subheading: { color: palette.lime, fontWeight: '700', fontSize: 16, lineHeight: 24 },
  warningHeading: { color: '#FFBA73', fontSize: 14, letterSpacing: 1, fontWeight: '800' },
  body: { color: palette.muted, fontSize: 16, lineHeight: 26 },
  small: { color: palette.muted, fontSize: 13, lineHeight: 20 },
  quote: { color: palette.text, fontSize: 18, lineHeight: 27, fontStyle: 'italic' },
  lines: { gap: 8 }, line: { flexDirection: 'row', gap: 10 }, bullet: { color: palette.lime, fontSize: 18 }, grow: { flex: 1 },
  switcher: { flexDirection: 'row', gap: 8 },
  action: { padding: 14, minHeight: 48, borderRadius: 12, backgroundColor: palette.lime, justifyContent: 'center', alignItems: 'center' },
  actionSecondary: { backgroundColor: palette.panel, borderWidth: 1, borderColor: palette.line },
  actionLabel: { color: '#0B1420', fontSize: 14, fontWeight: '800', textAlign: 'center' },
  catalogItem: { padding: 16, borderRadius: 13, backgroundColor: palette.panel, borderWidth: 1, borderColor: palette.line, gap: 8 },
  itemTitle: { color: palette.text, fontSize: 18, lineHeight: 26, fontWeight: '800' }, itemLink: { color: palette.lime, fontWeight: '700' },
  choice: { borderWidth: 1, borderColor: palette.line, borderRadius: 11, padding: 13 },
  choiceSelected: { borderColor: palette.lime, backgroundColor: '#263C3A' },
  feedback: { backgroundColor: '#0D1C2A', padding: 14, borderRadius: 11, gap: 7 },
});
