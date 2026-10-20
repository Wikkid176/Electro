import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Lesson } from './content';
import { CoachNote } from './Coach';
import { ComponentIllustration } from './ComponentIllustration';
import { workshopComponents } from './components';
import { teachingLessons } from './teaching';
import { lessonPages, type TeachingLesson } from './teaching/types';

const colors = { text: '#F3F6FA', muted: '#B4C2D3', line: '#35495F', panel: '#142131', lime: '#D6FA68', blue: '#9BC7FF' };

function Action({ title, onPress, secondary = false, disabled = false }: {
  title: string; onPress: () => void; secondary?: boolean; disabled?: boolean;
}) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [s.action, secondary && s.secondary, disabled && { opacity: 0.45 }, pressed && { opacity: 0.8 }]}>
    <Text style={[s.actionText, secondary && { color: colors.text }]}>{title}</Text>
  </Pressable>;
}

function LessonVisual({ visual }: { visual: TeachingLesson['visual'] }) {
  const [selected, setSelected] = useState(0);
  const [part, setPart] = useState<string | null>(null);
  const current = visual.nodes[selected];
  const component = workshopComponents.find(item => item.id === visual.component);
  const partInfo = component?.parts.find(item => item.id === part);
  const connected = ['chain', 'loop', 'timeline'].includes(visual.kind);
  return <View testID={`lesson-visual-${visual.kind}`} style={s.card}>
    <Text style={s.eyebrow}>VISUAL EXPLANATION · TAP TO EXPLORE</Text>
    <Text accessibilityRole="header" style={s.heading}>{visual.title}</Text>
    <Text style={s.body}>{visual.caption}</Text>
    {component && <View style={s.artCard}>
      <ComponentIllustration id={component.id} showParts selectedPart={part} onSelectPart={setPart} />
      <Text style={s.caption}>{component.name} · Original teaching illustration. Tap a numbered part.</Text>
      {partInfo && <View accessibilityLiveRegion="polite" style={s.detail}><Text style={s.subheading}>{partInfo.name}</Text><Text style={s.body}>{partInfo.description}</Text></View>}
    </View>}
    {visual.kind === 'meter' && <View accessible accessibilityRole="image" accessibilityLabel={`Virtual display: ${current.value}. ${current.label}.`} style={s.meterCase}>
      <Text style={s.meterLabel}>VIRTUAL INSTRUMENT</Text><Text style={s.digits}>{current.value}</Text>
      <View style={s.dial}><View style={s.dialPointer} /></View>
      <Text style={s.caption}>Conceptual display · No physical connections</Text>
    </View>}
    <View style={[s.nodes, ['energy', 'compare'].includes(visual.kind) && s.grid, visual.kind === 'loop' && s.loop]}>
      {visual.nodes.map((node, index) => <React.Fragment key={node.label}>
        {connected && index > 0 && <Text accessible={false} style={s.connector}>{visual.kind === 'timeline' ? '•' : '↓'}</Text>}
        <Pressable accessibilityRole="button" accessibilityLabel={`Explore ${node.label}`} accessibilityState={{ selected: selected === index }} aria-pressed={selected === index} onPress={() => setSelected(index)}
          style={({ pressed }) => [s.node, ['energy', 'compare'].includes(visual.kind) && s.gridNode, visual.kind === 'document' && s.paper,
            selected === index && s.selectedNode, pressed && { opacity: 0.8 }]}>
          <View style={s.nodeTitle}><Text style={s.nodeNumber}>{visual.kind === 'document' ? '▤' : index + 1}</Text><Text style={[s.nodeLabel, { flex: 1 }]}>{node.label}</Text>{selected === index && <Text style={s.selectedMark}>✓</Text>}</View>
          {!!node.value && <Text style={s.nodeValue}>{node.value}</Text>}
          {visual.kind === 'scale' && <View style={s.barTrack}><View style={[s.barFill, { width: `${(node.level ?? 0) * 100}%` }]} /></View>}
        </Pressable>
      </React.Fragment>)}
      {visual.kind === 'loop' && <Text style={s.caption}>↶ Follow the complete documented relationship, including its return or feedback.</Text>}
    </View>
    <View accessibilityLiveRegion="polite" style={s.detail}><Text style={s.subheading}>{current.label}</Text><Text style={s.body}>{current.detail}</Text></View>
  </View>;
}

export function LessonReader({ lesson, page, onPage, onQuiz, reviewing = false }: {
  lesson: Lesson; page: number; onPage: (page: number) => void; onQuiz: () => void; reviewing?: boolean;
}) {
  const teaching = teachingLessons[lesson.id];
  const [practiceChoice, setPracticeChoice] = useState<number | null>(null);
  const [practiceChecked, setPracticeChecked] = useState(false);
  const correct = practiceChoice === teaching.practice.correct;
  return <View testID="lesson-reader" style={s.reader}>
    <Text style={s.eyebrow}>{reviewing ? 'LESSON REVIEW' : 'COACH-LED LESSON'} · {page + 1} OF {lessonPages.length}</Text>
    <View accessibilityLabel={`Lesson progress: ${page + 1} of ${lessonPages.length}`} style={s.steps}>
      {lessonPages.map((title, index) => <View key={title} style={s.step}>
        <View style={[s.stepTrack, index <= page && { backgroundColor: colors.lime }]} />
        <Text style={[s.stepText, index === page && { color: colors.lime, fontWeight: '800' }]}>{title}</Text>
      </View>)}
    </View>
    {page === 0 && <>
      <CoachNote mood="welcome" message={teaching.coach} />
      <Text style={s.intro}>{lesson.brief}</Text>
      {teaching.sections.map(section => <View key={section.title} style={s.card}>
        <Text accessibilityRole="header" style={s.heading}>{section.title}</Text><Text style={s.body}>{section.body}</Text>
      </View>)}
      <Action title="Continue to visual →" onPress={() => onPage(1)} />
    </>}
    {page === 1 && <>
      <LessonVisual key={lesson.id} visual={teaching.visual} />
      <View style={s.card}><Text style={s.eyebrow}>WORKED EXAMPLE</Text><Text accessibilityRole="header" style={s.heading}>Let’s work through it</Text><Text style={s.body}>{teaching.example.scenario}</Text>
        {teaching.example.steps.map((step, index) => <View key={step} style={s.exampleStep}><Text style={s.number}>{index + 1}</Text><Text style={[s.body, { flex: 1 }]}>{step}</Text></View>)}
      </View>
      <CoachNote mood="think" message={teaching.example.takeaway} />
      <Action title="Continue to practice →" onPress={() => onPage(2)} />
    </>}
    {page === 2 && <>
      <CoachNote message="Try this one with me. This practice is ungraded: read the explanation, then continue when you’re ready." />
      <View style={s.card}><Text style={s.eyebrow}>GUIDED PRACTICE · NO XP</Text><Text accessibilityRole="header" style={s.heading}>{teaching.practice.prompt}</Text>
        <View accessibilityRole="radiogroup" accessibilityLabel="Guided practice answers" style={{ gap: 12 }}>
          {teaching.practice.choices.map((choice, index) => <Pressable key={choice} accessibilityRole="radio" accessibilityLabel={choice} aria-checked={practiceChoice === index} accessibilityState={{ checked: practiceChoice === index }} onPress={() => { setPracticeChoice(index); setPracticeChecked(false); }} style={[s.choice, practiceChoice === index && s.selectedNode]}>
            <Text style={s.nodeNumber}>{String.fromCharCode(65 + index)}</Text><Text style={[s.body, { flex: 1 }]}>{choice}</Text>
          </Pressable>)}
        </View>
        <Action title="Check practice" disabled={practiceChoice === null} onPress={() => setPracticeChecked(true)} secondary />
      </View>
      {practiceChecked && <View accessibilityLiveRegion="polite" style={s.feedback}><CoachNote mood={correct ? 'encourage' : 'think'} message={correct ? 'You’ve got the idea. Here’s the reasoning.' : 'Let’s unpack that. This is the place to learn before the quiz.'} /><Text style={s.body}>{teaching.practice.explanation}</Text></View>}
      <Action title="Continue to recap →" disabled={!practiceChecked} onPress={() => onPage(3)} />
    </>}
    {page === 3 && <>
      <CoachNote mood="encourage" message="You’ve read the explanation, explored the visual and tried an example. Review these key ideas before your three-question quiz." />
      <View style={s.card}><Text accessibilityRole="header" style={s.heading}>Your lesson recap</Text>{lesson.points.map((point, index) => <View key={point} style={s.exampleStep}><Text style={s.number}>{index + 1}</Text><Text style={[s.body, { flex: 1 }]}>{point}</Text></View>)}</View>
      <Text style={s.body}>The quiz is separate from practice. It awards up to 75 XP based on your best score. You can review this lesson during the quiz without losing your answers.</Text>
      <Action title={reviewing ? 'Return to quiz →' : 'Start quiz →'} onPress={onQuiz} />
    </>}
    {page > 0 && <Action title="← Previous lesson page" secondary onPress={() => onPage(page - 1)} />}
    {reviewing && page < 3 && <Action title="Return to quiz →" secondary onPress={onQuiz} />}
  </View>;
}

const s = StyleSheet.create({
  reader: { gap: 20 }, card: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, padding: 20, borderRadius: 18, gap: 16 },
  eyebrow: { fontSize: 11, lineHeight: 17, letterSpacing: 1.3, color: colors.blue, fontWeight: '800' },
  heading: { color: colors.text, fontSize: 23, lineHeight: 31, fontWeight: '800' }, subheading: { color: colors.lime, fontSize: 17, lineHeight: 25, fontWeight: '700' },
  intro: { color: colors.text, fontSize: 19, lineHeight: 29 }, body: { color: colors.muted, fontSize: 16, lineHeight: 27 }, caption: { color: colors.muted, fontSize: 13, lineHeight: 21 },
  steps: { flexDirection: 'row', gap: 8 }, step: { flex: 1, gap: 7 }, stepTrack: { height: 5, borderRadius: 3, backgroundColor: colors.line }, stepText: { color: colors.muted, fontSize: 12, lineHeight: 19 },
  action: { minHeight: 52, padding: 16, borderRadius: 12, backgroundColor: colors.lime, justifyContent: 'center', alignItems: 'center' }, secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.line }, actionText: { color: '#0B1420', fontSize: 16, lineHeight: 23, fontWeight: '800', textAlign: 'center' },
  nodes: { gap: 8 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, gridNode: { flexGrow: 1, flexBasis: 210 },
  node: { minHeight: 64, padding: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: '#1C2C40', borderRadius: 12, gap: 9 }, selectedNode: { borderColor: colors.lime, backgroundColor: '#263C3A' },
  nodeTitle: { flexDirection: 'row', gap: 10, alignItems: 'center' }, nodeNumber: { color: colors.blue, fontSize: 15, fontWeight: '800', minWidth: 18 }, nodeLabel: { color: colors.text, fontSize: 16, fontWeight: '700', lineHeight: 24 }, nodeValue: { color: colors.lime, fontSize: 20, lineHeight: 29, fontWeight: '800' }, selectedMark: { color: colors.lime, fontSize: 17 },
  detail: { padding: 16, borderRadius: 12, backgroundColor: '#0D1C2A', borderLeftWidth: 3, borderColor: colors.blue, gap: 8 },
  connector: { color: colors.blue, fontSize: 22, lineHeight: 24, textAlign: 'center' }, loop: { borderLeftWidth: 2, borderBottomWidth: 2, borderColor: '#506B89', borderRadius: 12, paddingLeft: 12, paddingBottom: 12 }, paper: { borderLeftWidth: 5, borderLeftColor: colors.blue },
  barTrack: { height: 13, backgroundColor: '#0B1420', borderRadius: 5, overflow: 'hidden' }, barFill: { height: '100%', backgroundColor: colors.blue, borderRadius: 5 },
  meterCase: { backgroundColor: '#263E50', padding: 20, borderRadius: 24, borderWidth: 3, borderColor: '#607D89', alignItems: 'center', gap: 18 }, meterLabel: { color: colors.text, letterSpacing: 2, fontSize: 11, fontWeight: '700' }, digits: { backgroundColor: '#C4DDC5', color: '#143528', width: '100%', padding: 16, borderRadius: 8, fontSize: 35, fontWeight: '800', textAlign: 'center' }, dial: { height: 60, width: 60, borderRadius: 30, borderWidth: 4, borderColor: '#839AA6', backgroundColor: '#122331', alignItems: 'center', paddingTop: 5 }, dialPointer: { height: 23, width: 5, backgroundColor: colors.lime, borderRadius: 4 },
  artCard: { borderRadius: 14, backgroundColor: '#0E1A28', padding: 8, gap: 12 }, exampleStep: { flexDirection: 'row', gap: 13, alignItems: 'flex-start' }, number: { color: colors.lime, fontSize: 18, lineHeight: 27, fontWeight: '800', width: 22 },
  choice: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderWidth: 1, borderColor: colors.line, borderRadius: 12, backgroundColor: '#1C2C40' }, feedback: { gap: 16, padding: 14, borderWidth: 1, borderColor: '#43605D', borderRadius: 14 },
});
