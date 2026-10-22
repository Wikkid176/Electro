import React, { useReducer, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ComponentIllustration } from './ComponentIllustration';
import { CoachPortrait } from './Coach';
import { useBeta } from './BetaProvider';
import { componentChallenges, componentQuizReducer, initialComponentQuiz, workshopComponents, type ComponentId } from './components';

function Action({ title, onPress, secondary = false, disabled = false }: { title: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.action, secondary && s.secondary, disabled && { opacity: 0.45 }, pressed && { opacity: 0.7 }]}><Text style={[s.actionText, secondary && { color: '#F3F6FA' }]}>{title}</Text></Pressable>;
}

export function ComponentLab({ onNavigate }: { onNavigate: () => void }) {
  const beta = useBeta();
  const workshopRun = useRef<string | null>(null);
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');
  const [componentId, setComponentId] = useState<ComponentId>('contactor');
  const [active, setActive] = useState(false);
  const [partId, setPartId] = useState<string | null>(null);
  const [quiz, dispatch] = useReducer(componentQuizReducer, initialComponentQuiz);
  const component = workshopComponents.find(item => item.id === componentId)!;
  const part = component.parts.find(item => item.id === partId);
  const challenge = componentChallenges[quiz.index];
  const correctChoice = challenge?.choices.find(choice => choice.id === challenge.answer);

  return <>
    <Text style={s.label}>INTERACTIVE PRACTICE / 04</Text>
    <Text accessibilityRole="header" style={s.title}>Component workshop</Text>
    <Text style={s.body}>Get to know the hardware. Inspect its parts, compare a teaching symbol, and test your eye for visible defects.</Text>
    <View accessibilityRole="tablist" accessibilityLabel="Component workshop modes" style={s.row}>
      {(['explore', 'challenge'] as const).map(value => <Pressable key={value} accessibilityRole="tab" accessibilityLabel={value === 'explore' ? 'Explore components' : 'Component challenges'} accessibilityState={{ selected: mode === value }} aria-selected={mode === value} onPress={() => { setMode(value); onNavigate(); }} style={[s.mode, mode === value && s.selected]}><Text style={s.modeText}>{value === 'explore' ? 'Explore' : 'Challenges'}</Text></Pressable>)}
    </View>
    <View style={s.notice}><Text style={s.small}>Tap a component to explore its parts. Change its state to see what moves and what each part does.</Text></View>
    {mode === 'explore' ? <>
      <View accessibilityLabel="Component collection" style={s.collection}>
        {workshopComponents.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`Explore ${item.name}`} accessibilityState={{ selected: item.id === componentId }} aria-pressed={item.id === componentId} onPress={() => { setComponentId(item.id); setActive(false); setPartId(null); }} style={[s.componentButton, item.id === componentId && s.selected]}><Text style={[s.componentText, item.id === componentId && { color: '#D6FA68' }]}>{item.name}</Text></Pressable>)}
      </View>
      <View style={s.card}>
        <Text style={s.label}>DEVICE EXPLORER</Text>
        <Text accessibilityRole="header" style={s.heading}>{component.name}</Text>
        <Text style={s.body}>{component.purpose}</Text>
        <View accessibilityRole="tablist" accessibilityLabel="Illustrated component state" style={s.row}>{component.states.map((label, i) => <Pressable key={label} accessibilityRole="tab" accessibilityLabel={`Show ${label}`} accessibilityState={{ selected: active === Boolean(i) }} aria-selected={active === Boolean(i)} onPress={() => setActive(Boolean(i))} style={[s.mode, active === Boolean(i) && s.selected]}><Text style={s.modeText}>{label}</Text></Pressable>)}</View>
        <ComponentIllustration id={componentId} active={active} showParts selectedPart={partId} onSelectPart={setPartId} />
        <View accessibilityLiveRegion="polite" style={s.detail}><Text accessibilityRole="header" style={s.detailTitle}>{part ? part.name : 'Discover a part'}</Text><Text style={s.body}>{part ? part.description : 'Select any numbered part to learn its function and what the illustration can tell you.'}</Text></View>
        <View accessibilityLiveRegion="polite" style={s.state}><Text style={s.stateTitle}>MODEL STATE: {component.states[Number(active)].toUpperCase()}</Text><Text style={s.body}>{component.stateDescriptions[Number(active)]}</Text></View>
        <View style={s.symbolCard}><Text style={s.label}>FUNCTIONAL TEACHING SYMBOL</Text><Text accessibilityLabel={`${component.name} teaching symbol, ${component.states[Number(active)]}`} style={s.symbol}>{component.symbols[Number(active)]}</Text><Text style={s.small}>{component.symbolDescription}</Text></View>
        <Text style={s.body}>Tap a number on the illustration or select a part below.</Text>
        {component.parts.map((item, i) => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`Inspect ${item.name}`} accessibilityState={{ selected: item.id === partId }} aria-pressed={item.id === partId} onPress={() => setPartId(item.id)} style={[s.part, item.id === partId && s.selected]}><Text style={s.number}>{i + 1}</Text><Text style={s.partName}>{item.name}</Text><Text style={s.number}>＋</Text></Pressable>)}
      </View>
    </> : !challenge ? <View style={s.card}>
      <View style={{ alignItems: 'center' }}><CoachPortrait mood="celebrate" size={126} /></View><Text style={s.label}>PRACTICE RESULT</Text><Text accessibilityRole="header" style={s.heading}>Workshop complete</Text>
      <Text style={s.result}>{quiz.correct} / {componentChallenges.length} correct</Text>
      <Text style={s.body}>You practiced component recognition and visible inspection findings. Review the devices and try again. This practice result does not add course XP or authorize electrical work.</Text>
      <Action title="Restart component challenges" onPress={() => { workshopRun.current = null; dispatch({ type: 'restart' }); onNavigate(); }} />
      <Action title="Return to component explorer" secondary onPress={() => { setMode('explore'); onNavigate(); }} />
    </View> : <View style={s.card}>
      <Text style={s.label}>{challenge.kind === 'identify' ? 'IDENTIFY THE DEVICE' : 'FIND THE VISIBLE DEFECT'} / ROUND {quiz.index + 1} OF {componentChallenges.length}</Text>
      <Text accessibilityLabel={`Component challenge progress: ${quiz.index} of ${componentChallenges.length}`} style={s.small}>{quiz.correct} correct so far · Practice only</Text>
      <Text accessibilityRole="header" style={s.heading}>{challenge.prompt}</Text>
      <ComponentIllustration id={challenge.component} defect={challenge.kind === 'defect'} showParts={challenge.kind === 'defect'} hideIdentity selectedPart={quiz.selection} onSelectPart={quiz.checked ? undefined : id => dispatch({ type: 'select', id })} />
      {challenge.kind === 'defect' && <Text style={s.small}>Numbers mark inspection areas. Select an area on the picture or choose below.</Text>}
      <View accessibilityRole="radiogroup" accessibilityLabel="Component challenge answers" style={{ gap: 10 }}>{challenge.choices.map(choice => <Pressable key={choice.id} accessibilityRole="radio" aria-checked={quiz.selection === choice.id} accessibilityState={{ checked: quiz.selection === choice.id, selected: quiz.selection === choice.id, disabled: quiz.checked }} disabled={quiz.checked} onPress={() => dispatch({ type: 'select', id: choice.id })} style={[s.answer, quiz.selection === choice.id && s.selected, quiz.checked && challenge.answer === choice.id && s.correct]}><Text style={s.partName}>{choice.label}</Text></Pressable>)}</View>
      {quiz.checked && <View accessibilityLiveRegion="polite" style={[s.detail, quiz.selection !== challenge.answer && { borderColor: '#FFBA73' }]}><CoachPortrait mood={quiz.selection === challenge.answer ? 'encourage' : 'think'} size={70} /><Text accessibilityRole="header" style={s.detailTitle}>{quiz.selection === challenge.answer ? 'Good observation.' : 'Look again. Here’s the evidence.'}</Text><Text style={s.stateTitle}>ANSWER: {correctChoice?.label}</Text><Text style={s.body}>{challenge.explanation}</Text></View>}
      <Action title={quiz.checked ? quiz.index === componentChallenges.length - 1 ? 'Finish component challenges' : 'Next component challenge' : 'Check component answer'} disabled={!quiz.checked && quiz.selection === null} onPress={() => { if (quiz.checked) { dispatch({ type: 'next' }); onNavigate(); } else {
        if (quiz.selection !== null) {
          workshopRun.current ??= beta.startWorkshop();
          if (workshopRun.current) beta.componentAnswer(workshopRun.current, quiz.index, quiz.selection);
        }
        dispatch({ type: 'check' });
      } }} />
      <Text style={s.small}>Finding a pictured defect does not prove the condition of a real device. Follow controlled documentation and the approved qualified review process.</Text>
    </View>}
  </>;
}
const s = StyleSheet.create({
  title: { color: '#F3F6FA', fontSize: 34, lineHeight: 41, fontWeight: '800', letterSpacing: -1 },
  heading: { color: '#F3F6FA', fontSize: 24, lineHeight: 32, fontWeight: '700' },
  label: { color: '#D6FA68', fontSize: 10, lineHeight: 18, letterSpacing: 1.3, fontWeight: '800' },
  body: { color: '#A6B4C6', fontSize: 15, lineHeight: 24 }, small: { color: '#A6B4C6', fontSize: 12, lineHeight: 19 },
  row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  mode: { flex: 1, minWidth: 90, minHeight: 48, padding: 12, borderWidth: 1, borderColor: '#44566D', borderRadius: 10, backgroundColor: '#1E2E40', justifyContent: 'center', alignItems: 'center' },
  modeText: { color: '#F3F6FA', fontSize: 14, lineHeight: 21, fontWeight: '700', textAlign: 'center' },
  selected: { borderColor: '#D6FA68', backgroundColor: '#243A2E' },
  notice: { borderLeftWidth: 3, borderColor: '#9BC7FF', backgroundColor: '#192B30', borderRadius: 8, padding: 15 },
  collection: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  componentButton: { minHeight: 50, flexGrow: 1, flexBasis: 125, borderRadius: 10, borderWidth: 1, borderColor: '#44566D', padding: 12, backgroundColor: '#142131', justifyContent: 'center' },
  componentText: { color: '#F3F6FA', fontSize: 13, lineHeight: 20, fontWeight: '700' },
  card: { borderWidth: 1, borderColor: '#29394B', borderRadius: 16, padding: 18, gap: 16, backgroundColor: '#142131' },
  state: { gap: 7, borderRadius: 8, padding: 12, backgroundColor: '#192B30' },
  stateTitle: { color: '#D6FA68', fontSize: 12, lineHeight: 20, fontWeight: '800' },
  symbolCard: { backgroundColor: '#0B1420', borderRadius: 12, padding: 16, gap: 12, borderWidth: 1, borderColor: '#29394B' },
  symbol: { color: '#9BC7FF', fontSize: 24, lineHeight: 37, fontWeight: '700', textAlign: 'center' },
  part: { flexDirection: 'row', alignItems: 'center', minHeight: 52, gap: 12, padding: 13, backgroundColor: '#1E2E40', borderWidth: 1, borderColor: '#44566D', borderRadius: 10 },
  number: { color: '#D6FA68', fontSize: 16, fontWeight: '800' }, partName: { flex: 1, color: '#F3F6FA', fontSize: 15, lineHeight: 23, fontWeight: '600' },
  detail: { borderLeftWidth: 3, borderColor: '#D6FA68', borderRadius: 8, backgroundColor: '#192B30', padding: 16, gap: 10 },
  detailTitle: { color: '#F3F6FA', fontSize: 18, lineHeight: 26, fontWeight: '700' },
  answer: { borderWidth: 1, borderColor: '#44566D', padding: 16, minHeight: 54, borderRadius: 10, backgroundColor: '#1E2E40' },
  correct: { backgroundColor: '#243A2E', borderColor: '#D6FA68' },
  action: { minHeight: 52, backgroundColor: '#D6FA68', borderRadius: 10, padding: 16, justifyContent: 'center', alignItems: 'center' },
  actionText: { color: '#0B1420', fontSize: 15, lineHeight: 22, fontWeight: '800', textAlign: 'center' }, secondary: { backgroundColor: '#1E2E40', borderWidth: 1, borderColor: '#44566D' },
  result: { color: '#D6FA68', fontSize: 30, lineHeight: 40, fontWeight: '800' },
});
