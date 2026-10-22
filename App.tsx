import React, { useEffect, useReducer, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lessons, type Lesson } from './src/content';
import { MeterLab } from './src/MeterLab';
import { TraceLab } from './src/TraceLab';
import { ComponentLab } from './src/ComponentLab';
import { CoachNote, CoachPortrait } from './src/Coach';
import { coachHint } from './src/coach';
import { brand } from './src/brand';
import { lessonFingerprint, restoreSession, SESSION_KEY, type MissionSession } from './src/session';
import { BetaProvider, useBeta } from './src/BetaProvider';
import { BetaHub } from './src/BetaHub';
import { release } from './src/build';
import { LessonReader } from './src/LessonReader';
import { estimatedLessonMinutes } from './src/teaching';
import { completeLesson, initialMotor, initialProgress, motorReducer, restoreProgress, totalXp, XP_PER_ANSWER, type Progress } from './src/engine';

const STORAGE_KEY = 'electro.progress.v1';
const availableXp = lessons.reduce((sum, lesson) => sum + lesson.questions.length * XP_PER_ANSWER, 0);
const colors = { bg: '#0B1420', panel: '#142131', line: '#29394B', text: '#F3F6FA', muted: '#A6B4C6', lime: '#D6FA68', orange: '#FFBA73', blue: '#9BC7FF' };
type Tab = 'Learn' | 'Lab' | 'Progress' | 'Beta';

function Button({ title, onPress, secondary = false, disabled = false }: { title: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [s.button, secondary && s.secondaryButton, disabled && s.disabled, pressed && s.pressed]}>
    <Text style={[s.buttonText, secondary && { color: colors.text }]}>{title}</Text>
  </Pressable>;
}

function Label({ children }: { children: React.ReactNode }) { return <Text style={s.label}>{children}</Text>; }
function Meter({ value }: { value: number }) { return <View style={s.meter}><View style={[s.meterFill, { width: `${Math.min(100, Math.max(0, value * 100))}%` }]} /></View>; }

function ElectroApp() {
  const beta = useBeta();
  const [tab, setTab] = useState<Tab>('Learn');
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [loaded, setLoaded] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [active, setActive] = useState<Lesson | null>(null);
  const [phase, setPhase] = useState<'brief' | 'quiz' | 'result'>('brief');
  const [lessonPage, setLessonPage] = useState(0);
  const [reviewing, setReviewing] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selection, setSelection] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [earned, setEarned] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintExpanded, setHintExpanded] = useState(false);
  const [savedSession, setSavedSession] = useState<MissionSession | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const writes = useRef(Promise.resolve());
  const wide = useWindowDimensions().width >= 760;
  const xp = totalXp(progress);
  const mastered = lessons.filter(l => progress.scores[l.id] === l.questions.length).length;
  const allMastered = mastered === lessons.length;
  const nextLesson = lessons.find(l => progress.scores[l.id] !== l.questions.length) ?? lessons[0];
  const level = xp >= 350 ? 'Control thinker' : xp >= 150 ? 'Circuit explorer' : 'First spark';

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([AsyncStorage.getItem(STORAGE_KEY), AsyncStorage.getItem(SESSION_KEY)]).then(([savedProgress, session]) => {
      if (!mounted) return;
      if (savedProgress.status === 'fulfilled') {
        setProgress(restoreProgress(savedProgress.value, Object.fromEntries(lessons.map(l => [l.id, l.questions.length]))));
        setStorageReady(true);
      } else setStorageError('Saved progress could not be loaded. You can practice, but progress will stay in this session.');
      if (session.status === 'fulfilled') {
        setSavedSession(restoreSession(session.value, lessons));
        setSessionReady(true);
      } else setStorageError(message => message || 'The unfinished mission could not be loaded. Completed scores are still available.');
      setLoaded(true);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!loaded || !storageReady) return;
    writes.current = writes.current.then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress))).catch(() => {
      setStorageError('Progress could not be saved on this device. Your current session is still available.');
    });
  }, [progress, loaded, storageReady]);

  useEffect(() => {
    if (!loaded || !sessionReady || !active) return;
    if (phase === 'result') {
      setSavedSession(null);
      writes.current = writes.current.then(() => AsyncStorage.removeItem(SESSION_KEY)).catch(() => {
        setStorageError('The unfinished mission could not be cleared on this device.');
      });
      return;
    }
    const session: MissionSession = { version: 1, lessonId: active.id, fingerprint: lessonFingerprint(active), phase, lessonPage, questionIndex, selection, checked, score, hintVisible, hintExpanded };
    setSavedSession(session);
    writes.current = writes.current.then(() => AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session))).catch(() => {
      setStorageError('The unfinished mission could not be saved. Keep this session open to continue.');
    });
  }, [loaded, sessionReady, active, phase, lessonPage, questionIndex, selection, checked, score, hintVisible, hintExpanded]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (active) { setActive(null); return true; }
      if (tab !== 'Learn') { setTab('Learn'); return true; }
      return false;
    });
    return () => subscription.remove();
  }, [active, tab]);

  useEffect(() => { scroll.current?.scrollTo({ y: 0, animated: false }); }, [tab, active, phase, questionIndex, lessonPage, reviewing]);
  useEffect(() => { beta.setScope(active && phase !== 'result' ? `mission:${active.id}` : tab); }, [active, phase, tab, beta.setScope]);

  function openLesson(lesson: Lesson) {
    beta.startMission(lesson.id);
    setActive(lesson); setLessonPage(0); setReviewing(false); setPhase('brief'); setScore(0); setQuestionIndex(0); setSelection(null); setChecked(false); setEarned(0); setHintVisible(false); setHintExpanded(false);
  }

  function resumeMission() {
    if (!savedSession) return;
    const lesson = lessons.find(item => item.id === savedSession.lessonId);
    if (!lesson) return;
    beta.startMission(lesson.id, true);
    setActive(lesson); setLessonPage(savedSession.lessonPage ?? 0); setReviewing(false); setPhase(savedSession.phase); setQuestionIndex(savedSession.questionIndex);
    setSelection(savedSession.selection); setChecked(savedSession.checked); setScore(savedSession.score);
    setHintVisible(savedSession.hintVisible); setHintExpanded(savedSession.hintExpanded ?? false); setEarned(0);
  }

  function discardMission() {
    setSavedSession(null);
    writes.current = writes.current.then(() => AsyncStorage.removeItem(SESSION_KEY)).catch(() => {
      setStorageError('The unfinished mission could not be cleared on this device.');
    });
  }

  function nextQuestion() {
    if (!active || !checked) return;
    setHintVisible(false); setHintExpanded(false);
    if (questionIndex + 1 === active.questions.length) {
      beta.finish(active.id, score);
      const updated = completeLesson(progress, active.id, score, active.questions.length);
      setEarned(totalXp(updated) - xp); setProgress(updated); setPhase('result');
    } else {
      setQuestionIndex(questionIndex + 1); setSelection(null); setChecked(false);
    }
  }

  return <SafeAreaView style={s.safe} edges={['top', 'left', 'right', 'bottom']}>
    <StatusBar style="light" />
    <View style={s.header}>
      <View style={s.brand}><View style={s.logo}><Text style={s.bolt}>ϟ</Text></View><View><Text style={s.wordmark}>{brand.shortName}</Text><Text style={s.brandSub}>{brand.name}</Text></View></View>
      <View style={s.xpPill}><Text style={s.xpText}>ϟ {xp} XP</Text></View>
    </View>
    {!loaded || !beta.ready ? <View style={s.loading}><ActivityIndicator color={colors.lime} /><Text style={s.body}>Loading your training…</Text></View> : <>
      <ScrollView ref={scroll} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.content}>
          <Pressable accessibilityRole="button" accessibilityLabel={`Beta ${release.label}. Open tester tools`} onPress={() => { setActive(null); setTab('Beta'); }} style={s.back}><Text style={s.link}>BETA {release.label} · Tester tools & feedback</Text></Pressable>
          {!!storageError && <Text accessibilityRole="alert" style={s.warning}>{storageError}</Text>}
          {!!beta.error && tab !== 'Beta' && <Text accessibilityRole="alert" style={s.warning}>{beta.error}</Text>}
          {active ? <>
            <Pressable accessibilityRole="button" onPress={() => setActive(null)} style={s.back}><Text style={s.link}>← Back to training</Text></Pressable>
            <Label>{active.category} / MISSION {active.symbol}</Label>
            <Text accessibilityRole="header" style={s.title}>{active.title}</Text>
            {(phase === 'brief' || (phase === 'quiz' && reviewing)) && <LessonReader key={`${active.id}:${reviewing ? 'review' : 'learn'}`} lesson={active} page={lessonPage} onPage={setLessonPage} reviewing={reviewing} onQuiz={() => { setReviewing(false); setPhase('quiz'); }} />}
            {phase === 'quiz' && !reviewing && (() => {
              const question = active.questions[questionIndex];
              return <>
                <View style={s.split}><Text style={s.body}>Question {questionIndex + 1} of {active.questions.length}</Text><Text style={s.green}>{score} correct</Text></View>
                <Button title="Review lesson" secondary onPress={() => { setLessonPage(0); setReviewing(true); }} />
                <Meter value={questionIndex / active.questions.length} />
                <View style={s.questionCard}><Text accessibilityRole="header" style={s.question}>{question.prompt}</Text>
                  {!!question.referenceCards?.length && <View style={s.card}><Label>REFERENCE CARDS</Label><Text style={s.small}>Compare the model, revision, conditions and finding on each card.</Text>{question.referenceCards.map(reference => <View key={reference.id} style={{ gap: 8 }}><Text style={s.recordTitle}>{reference.id}: {reference.title}</Text><Text style={s.small}>{reference.context}</Text><Text style={s.body}>{reference.content}</Text></View>)}</View>}
                  <View accessibilityRole="radiogroup" accessibilityLabel="Mission answers" style={{ gap: 14 }}>{question.choices.map((choice, i) => <Pressable key={choice} accessibilityRole="radio" aria-checked={selection === i} accessibilityState={{ checked: selection === i, selected: selection === i, disabled: checked }} disabled={checked} onPress={() => setSelection(i)}
                    style={({ pressed }) => [s.choice, selection === i && s.selectedChoice, checked && i === question.correct && s.correctChoice, checked && selection === i && i !== question.correct && s.incorrectChoice, pressed && s.pressed]}>
                    <Text style={[s.choiceLetter, selection === i && { color: colors.lime }]}>{String.fromCharCode(65 + i)}</Text><Text style={[s.body, s.flex, { color: colors.text }]}>{choice}</Text>
                    {checked && i === question.correct && <Text style={s.green}>✓</Text>}
                  </Pressable>)}</View>
                </View>
                {checked && <View accessibilityLiveRegion="polite" style={s.callout}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}><CoachPortrait mood={selection === question.correct ? 'encourage' : 'think'} size={74} /><View style={{ flex: 1 }}><Label>{brand.coachLabel.toUpperCase()}</Label><Text style={s.calloutTitle}>{selection === question.correct ? 'Correct. Good thinking.' : 'Keep learning. Here’s why.'}</Text></View></View><Text style={s.body}>{question.explanation}</Text></View>}
                {!checked && <><Button title={hintVisible ? 'Hide coach hint' : 'Coach hint'} secondary onPress={() => { if (!hintVisible) beta.hint(active.id, questionIndex); else setHintExpanded(false); setHintVisible(value => !value); }} />{hintVisible && <><CoachNote message={coachHint(active.id, questionIndex)} /><Button title={hintExpanded ? 'Hide extra help' : 'Work through this hint'} secondary onPress={() => setHintExpanded(value => !value)} />{hintExpanded && <CoachNote message={coachHint(active.id, questionIndex, 1)} />}</>}</>}
                {checked ? <Button title={questionIndex + 1 === active.questions.length ? 'Finish mission →' : 'Next question →'} onPress={nextQuestion} /> : <Button title="Check answer" disabled={selection === null} onPress={() => {
                  if (selection === null || checked) return;
                  beta.answer(active.id, questionIndex, selection, hintVisible);
                  setChecked(true); if (selection === question.correct) setScore(value => value + 1);
                }} />}
              </>;
            })()}
            {phase === 'result' && <View style={s.result}>
              <View style={{ alignItems: 'center' }}><CoachPortrait mood={score === active.questions.length ? 'celebrate' : 'encourage'} size={160} /></View>
              <Label>{score === active.questions.length ? 'MISSION MASTERED' : 'MISSION COMPLETE'}</Label>
              <Text style={s.title}>{score} / {active.questions.length} correct</Text>
              <Text style={s.reward}>+{earned} XP</Text>
              <Text style={[s.body, s.center]}>{score === active.questions.length ? 'Strong work. Take the next step on your learning path.' : 'Every attempt builds understanding. Review the notes and try again to improve your best score.'}</Text>
              {earned === 0 && <Text style={[s.body, s.center]}>XP is based on your best score. Repeating the same result does not add more XP.</Text>}
              <Button title="Continue training →" onPress={() => setActive(null)} />
              <Button title="Review and retry" secondary onPress={() => openLesson(active)} />
            </View>}
          </> : tab === 'Learn' ? <>
            {savedSession && <View style={s.callout}><Label>YOUR UNFINISHED MISSION</Label><Text style={s.cardTitle}>{lessons.find(lesson => lesson.id === savedSession.lessonId)?.title}</Text><Text style={s.body}>{savedSession.phase === 'brief' ? `Lesson page ${(savedSession.lessonPage ?? 0) + 1} of 4 ready to continue.` : `Question ${savedSession.questionIndex + 1} of 3 · ${savedSession.score} correct so far.`} Starting another mission replaces this checkpoint.</Text><Button title="Resume mission" onPress={resumeMission} /><Button title="Discard saved mission" secondary onPress={discardMission} /></View>}
            <View style={s.split}><Label>YOUR NEXT SHIFT STARTS HERE</Label><Text style={s.small}>VOL. 01 / INDUSTRIAL</Text></View>
            <View style={[s.hero, wide && s.heroWide]}>
              <View style={s.heroCopy}><View style={s.badge}><Text style={s.badgeText}>LEARN BY DOING</Text></View>
                <Text accessibilityRole="header" style={[s.heroTitle, wide && { fontSize: 52, lineHeight: 58 }]}>Build skills.{"\n"}Make connections.</Text>
                {wide ? <Text style={s.intro}>Learn with Coach Click. Explore visual examples, practice the idea, then take the quiz.</Text> : <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}><CoachPortrait size={104} /><View style={{ flex: 1, gap: 5 }}><Label>MEET {brand.coach.toUpperCase()}, YOUR COACH</Label><Text style={s.body}>Real lessons. Visual examples. Guided practice before every quiz.</Text></View></View>}
                <Button title={allMastered ? 'Review mastered missions' : `Start mission ${nextLesson.symbol} →`} onPress={() => allMastered ? setTab('Progress') : openLesson(nextLesson)} />
                <Text style={s.heroFoot}>{allMastered ? 'LEARNING PATH MASTERED' : `${estimatedLessonMinutes(nextLesson)} MIN · ${nextLesson.title.toUpperCase()}`}</Text>
              </View>
              {wide && <View style={s.heroArt}><CoachPortrait size={270} /><Text style={s.artCaption}>MEET {brand.coach.toUpperCase()}, YOUR COACH.</Text></View>}
            </View>
            <View style={s.statsRow}><View style={s.stat}><Text style={s.statValue}>{mastered}<Text style={s.statUnit}> / {lessons.length}</Text></Text><Text style={s.small}>MASTERED</Text></View><View style={s.stat}><Text style={s.statValue}>{xp}</Text><Text style={s.small}>TOTAL XP</Text></View><View style={s.stat}><Text style={[s.statValue, { fontSize: 18 }]}>{level}</Text><Text style={s.small}>LEARNING LEVEL</Text></View></View>
            <View style={s.sectionHeading}><Text accessibilityRole="header" style={s.heading}>Your learning path</Text><Text style={s.small}>{lessons.length} MISSIONS</Text></View>
            <Text style={s.body}>Build safety and energy-control awareness, then explore the electrical system.</Text>
            <View style={[s.lessonGrid, wide && { flexDirection: 'row' }]}>{lessons.map(lesson => {
              const best = progress.scores[lesson.id];
              const done = best === lesson.questions.length;
              return <Pressable key={lesson.id} accessibilityRole="button" accessibilityLabel={`${lesson.title}, ${estimatedLessonMinutes(lesson)} minutes${best !== undefined ? `, best score ${best} of 3` : ''}`} onPress={() => openLesson(lesson)} style={({ pressed }) => [s.lessonCard, wide && { width: '48.8%' }, pressed && s.pressed]}>
                <View style={s.lessonTop}><View style={[s.numberBox, done && { backgroundColor: colors.lime }]}><Text style={[s.number, done && { color: colors.bg }]}>{done ? '✓' : lesson.symbol}</Text></View><Text style={[s.small, { flex: 1, textAlign: 'right', paddingLeft: 12 }]}>~{estimatedLessonMinutes(lesson)} MIN · LESSON + QUIZ · 75 XP</Text></View>
                <Label>{lesson.category}</Label><Text style={s.cardTitle}>{lesson.title}</Text>
                <View style={s.split}><Text style={s.small}>{best === undefined ? 'Ready when you are' : done ? 'Mastered · play again' : `Best: ${best}/3 · try again`}</Text><Text style={s.arrow}>↗</Text></View>
              </Pressable>;
            })}</View>
            <Pressable accessibilityRole="button" onPress={() => setTab('Lab')} style={s.labTeaser}><View style={s.flex}><Label>THE CONTROL ROOM</Label><Text style={s.cardTitle}>What happens if…?</Text><Text style={s.body}>Explore motor controls, meters, drawing traces, and the component workshop.</Text></View><Text style={s.arrow}>→</Text></Pressable>
          </> : tab === 'Lab' ? <PracticeLab onNavigate={() => scroll.current?.scrollTo({ y: 0, animated: false })} /> : tab === 'Beta' ? <BetaHub scores={progress.scores} /> : <>
            <Label>EVERY CONNECTION COUNTS</Label><Text accessibilityRole="header" style={s.title}>Your progress</Text><Text style={s.intro}>A little practice. A stronger foundation.</Text>
            <View style={s.card}><View style={s.split}><Text style={s.cardTitle}>{level}</Text><Text style={s.reward}>{xp} XP</Text></View><Meter value={xp / availableXp} /><Text style={s.body}>{mastered} of {lessons.length} missions mastered · {Object.keys(progress.scores).length} completed</Text><Text style={s.small}>{availableXp} XP AVAILABLE · BEST SCORES COUNT</Text></View>
            <Text style={s.heading}>Mission record</Text>
            {lessons.map(lesson => <Pressable key={lesson.id} accessibilityRole="button" onPress={() => openLesson(lesson)} style={s.record}><View style={s.flex}><Text style={s.recordTitle}>{lesson.title}</Text><Text style={s.small}>{progress.scores[lesson.id] === undefined ? 'NOT ATTEMPTED' : `${progress.scores[lesson.id]} / 3 CORRECT · BEST ATTEMPT`}</Text></View><Text style={s.green}>{(progress.scores[lesson.id] ?? 0) * 25} XP</Text></Pressable>)}
            <View style={s.callout}><Text style={s.calloutTitle}>Your learning stays with this device.</Text><Text style={s.body}>Progress is saved locally. It does not sync between devices and can be lost if app or browser data is cleared. Learning levels are game milestones, not trade qualifications.</Text></View>
          </>}
          <View style={s.footer}><Text style={s.footerBrand}>{brand.name} / LEARN. THINK. CONNECT.</Text><Text style={s.footerText}>Conceptual training only. Follow site procedures and learn with qualified supervision. This app does not authorize electrical work.</Text></View>
        </View>
      </ScrollView>
      <View accessibilityRole="tablist" style={s.nav}>{(['Learn', 'Lab', 'Progress', 'Beta'] as Tab[]).map((item, i) => <Pressable key={item} accessibilityRole="tab" accessibilityLabel={item} aria-selected={!active && tab === item} accessibilityState={{ selected: !active && tab === item }} onPress={() => { setTab(item); setActive(null); }} style={({ pressed }) => [s.navItem, pressed && s.pressed]}><Text style={[s.navIcon, tab === item && s.navActive]}>{['▤', '⌘', '◴', '☆'][i]}</Text><Text style={[s.navText, tab === item && s.navActive]}>{item}</Text></Pressable>)}</View>
    </>}
  </SafeAreaView>;
}

function PracticeLab({ onNavigate }: { onNavigate: () => void }) {
  const beta = useBeta();
  const [lab, setLab] = useState<'motor' | 'meter' | 'trace' | 'components'>('motor');
  useEffect(() => { beta.visitLab(lab); }, [lab, beta.visitLab]);
  const labs = [{ id: 'motor', name: 'Motor controls' }, { id: 'meter', name: 'Meter bench' }, { id: 'trace', name: 'Trace prints' }, { id: 'components', name: 'Components' }] as const;
  return <>
    <View accessibilityRole="tablist" accessibilityLabel="Practice labs" style={[s.controlRow, { flexWrap: 'wrap' }]}>
      {labs.map(item => <Pressable key={item.id} accessibilityRole="tab" accessibilityLabel={item.name} accessibilityState={{ selected: lab === item.id }} aria-selected={lab === item.id} onPress={() => { setLab(item.id); onNavigate(); }} style={[s.secondaryButton, { flexGrow: 1, flexBasis: 125, padding: 15, borderRadius: 10, minHeight: 48, justifyContent: 'center' }, lab === item.id && { borderColor: colors.lime }]}><Text style={[s.buttonText, { color: lab === item.id ? colors.lime : colors.muted }]}>{item.name}</Text></Pressable>)}
    </View>
    {lab === 'motor' ? <MotorLab /> : lab === 'meter' ? <MeterLab /> : lab === 'trace' ? <TraceLab onNavigate={onNavigate} /> : <ComponentLab onNavigate={onNavigate} />}
  </>;
}

function MotorLab() {
  const [motor, dispatch] = useReducer(motorReducer, initialMotor);
  const [message, setMessage] = useState('Press START to energize the simulated coil.');
  function act(action: Parameters<typeof motorReducer>[1]) {
    dispatch(action);
    const messages = {
      start: motor.emergency || motor.overload ? 'START is blocked. Every series permissive must be healthy.' : 'The coil is energized. The auxiliary contact holds the circuit after the momentary START command.',
      stop: 'STOP opens the control path. The coil drops out and the holding state is lost.',
      emergency: 'The simulated emergency stop opens the permissive path and drops the coil. This control action is not energy isolation.',
      release: 'The simulated emergency stop is released. Releasing it does not restart the motor.',
      trip: 'The overload contact opens. The coil drops out. In real equipment, the cause must be investigated by authorized personnel.',
      reset: 'The simulated overload is reset. A new START command is still required. Real reset procedures depend on the equipment and site rules.',
    };
    setMessage(messages[action]);
  }
  return <>
    <Label>INTERACTIVE PRACTICE / 01</Label><Text accessibilityRole="header" style={s.title}>The control room</Text><Text style={s.intro}>One circuit. A few switches. Make the connection between a command and a response.</Text>
    <View style={s.labNotice}><Text style={s.orange}>SIMULATION ONLY</Text><Text style={s.body}>A simplified logic model, not a wiring diagram or validated safety design. All controls below affect this simulation only.</Text></View>
    <View style={s.card}>
      <View style={s.split}><Label>THREE-WIRE STARTER MODEL</Label><View style={[s.status, motor.running && { borderColor: colors.lime }]}><Text style={motor.running ? s.green : s.body}>{motor.running ? '● RUNNING' : '○ STOPPED'}</Text></View></View>
      <View style={s.flow}>{[
        { name: 'E-STOP', closed: !motor.emergency }, { name: 'OVERLOAD', closed: !motor.overload }, { name: 'COIL', closed: motor.running },
      ].map((node, i) => <React.Fragment key={node.name}>{i > 0 && <View style={[s.wire, motor.running && { backgroundColor: colors.lime }]} />}<View style={s.node}><View style={[s.contact, node.closed && s.closedContact]}><Text style={[s.contactText, node.closed && { color: colors.lime }]}>{node.closed ? '—' : '/'}</Text></View><Text style={s.nodeName}>{node.name}</Text><Text style={s.small}>{i === 2 ? motor.running ? 'ON' : 'OFF' : node.closed ? 'CLOSED' : 'OPEN'}</Text></View></React.Fragment> )}</View>
      <View style={s.holdRow}><View style={[s.indicator, motor.running && { backgroundColor: colors.lime }]} /><Text style={[s.body, s.flex]}>Auxiliary holding contact: {motor.running ? 'closed' : 'open'}</Text></View>
      <View style={s.controlRow}><View style={s.flex}><Button title="START" onPress={() => act('start')} /></View><View style={s.flex}><Button title="STOP" secondary onPress={() => act('stop')} /></View></View>
      <Button title={motor.emergency ? 'Release simulated E-stop' : 'Activate simulated E-stop'} secondary onPress={() => act(motor.emergency ? 'release' : 'emergency')} />
      <Button title={motor.overload ? 'Reset simulated overload' : 'Trip simulated overload'} secondary onPress={() => act(motor.overload ? 'reset' : 'trip')} />
    </View>
    <View accessibilityLiveRegion="polite" style={s.callout}><Text style={s.calloutTitle}>What changed?</Text><Text style={s.body}>{message}</Text></View>
    <View style={s.card}><Label>TRY THIS SEQUENCE</Label><Text style={s.body}>1. Press START and observe the holding contact.{"\n\n"}2. Trip the simulated overload. Try START again.{"\n\n"}3. Reset the simulated overload. Does the coil restart?{"\n\n"}4. Press START again. Explain why a new command was needed.</Text></View>
  </>;
}

export default function App() { return <SafeAreaProvider><BetaProvider><ElectroApp /></BetaProvider></SafeAreaProvider>; }

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg }, flex: { flex: 1 }, center: { textAlign: 'center' },
  header: { paddingHorizontal: 22, paddingVertical: 17, borderBottomWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 }, logo: { width: 38, height: 42, backgroundColor: colors.lime, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, bolt: { fontSize: 38, fontWeight: '900', color: colors.bg, marginTop: -3 },
  wordmark: { fontSize: 21, fontWeight: '900', letterSpacing: 3, color: colors.text }, brandSub: { color: colors.muted, fontSize: 8, letterSpacing: 1.4, marginTop: 3 }, xpPill: { borderColor: colors.line, borderWidth: 1, borderRadius: 30, paddingHorizontal: 13, paddingVertical: 9 }, xpText: { color: colors.lime, fontWeight: '800', fontSize: 14 },
  scroll: { padding: 22, paddingBottom: 12 }, content: { width: '100%', maxWidth: 1000, alignSelf: 'center', gap: 20 }, loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  label: { color: colors.lime, fontSize: 10, letterSpacing: 1.7, fontWeight: '800', lineHeight: 17 }, small: { color: colors.muted, fontSize: 10, letterSpacing: 0.6, lineHeight: 16 }, body: { color: colors.muted, fontSize: 15, lineHeight: 24 }, intro: { color: colors.muted, fontSize: 16, lineHeight: 26, maxWidth: 620 },
  title: { color: colors.text, fontSize: 34, lineHeight: 41, fontWeight: '800', letterSpacing: -1 }, heading: { color: colors.text, fontSize: 23, fontWeight: '700', letterSpacing: -0.5 }, cardTitle: { color: colors.text, fontSize: 22, fontWeight: '700', marginVertical: 8 },
  split: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  hero: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, padding: 25, borderRadius: 22, overflow: 'hidden', gap: 20 }, heroWide: { flexDirection: 'row', padding: 36 }, heroCopy: { flex: 1, gap: 19 }, badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#263B32', borderRadius: 5 }, badgeText: { fontSize: 10, letterSpacing: 1.5, fontWeight: '800', color: colors.lime }, heroTitle: { color: colors.text, fontSize: 38, fontWeight: '800', letterSpacing: -1.5, lineHeight: 45 }, heroFoot: { color: colors.muted, fontSize: 10, letterSpacing: 1 },
  heroArt: { width: 260, justifyContent: 'center', alignItems: 'center', gap: 24 }, orbit: { width: 230, height: 230, borderWidth: 1, borderColor: '#3B5144', borderRadius: 115, justifyContent: 'center', alignItems: 'center', transform: [{ rotate: '12deg' }] }, innerOrbit: { width: 178, height: 178, borderWidth: 1, borderColor: '#526647', borderRadius: 89, backgroundColor: '#1E302D', alignItems: 'center', justifyContent: 'center' }, heroBolt: { color: colors.lime, fontSize: 142, fontWeight: '900', marginTop: -12 }, artCaption: { color: colors.muted, fontSize: 9, letterSpacing: 2 },
  button: { backgroundColor: colors.lime, paddingHorizontal: 22, paddingVertical: 16, minHeight: 52, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, buttonText: { color: colors.bg, fontSize: 15, fontWeight: '800', textAlign: 'center' }, secondaryButton: { backgroundColor: '#1E2E40', borderWidth: 1, borderColor: '#44566D' }, disabled: { opacity: 0.4 }, pressed: { opacity: 0.75 },
  statsRow: { flexDirection: 'row', borderWidth: 1, borderColor: colors.line, borderRadius: 16, paddingVertical: 20, gap: 8 }, stat: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 7 }, statValue: { color: colors.text, fontSize: 25, fontWeight: '800', textAlign: 'center' }, statUnit: { color: colors.muted, fontSize: 16, fontWeight: '400' },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 12 }, lessonGrid: { gap: 16, flexWrap: 'wrap' }, lessonCard: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel, borderRadius: 16, padding: 21, width: '100%' }, lessonTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 21 }, numberBox: { borderRadius: 10, backgroundColor: '#243448', width: 42, height: 42, alignItems: 'center', justifyContent: 'center' }, number: { color: colors.blue, fontSize: 16, fontWeight: '800' }, arrow: { color: colors.lime, fontSize: 25 }, labTeaser: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#1D292A', borderColor: '#3D5142', borderWidth: 1, borderRadius: 16, padding: 24 },
  nav: { flexDirection: 'row', justifyContent: 'center', backgroundColor: colors.bg, borderTopWidth: 1, borderColor: colors.line, paddingVertical: 10 }, navItem: { flex: 1, maxWidth: 230, minHeight: 48, alignItems: 'center', justifyContent: 'center', gap: 5 }, navIcon: { color: colors.muted, fontSize: 22 }, navText: { color: colors.muted, fontSize: 11, fontWeight: '600' }, navActive: { color: colors.lime },
  footer: { borderTopWidth: 1, borderColor: colors.line, paddingVertical: 25, gap: 10, marginTop: 10 }, footerBrand: { color: colors.muted, fontSize: 9, letterSpacing: 1.5 }, footerText: { color: colors.muted, fontSize: 11, lineHeight: 18, maxWidth: 650 },
  card: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 23, gap: 20 }, callout: { backgroundColor: '#192B30', borderLeftWidth: 3, borderColor: colors.lime, padding: 20, gap: 10, borderRadius: 8 }, calloutTitle: { color: colors.text, fontSize: 17, fontWeight: '700' }, noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 }, noteNumber: { color: colors.lime, fontSize: 17, fontWeight: '800', marginTop: 2 }, back: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' }, link: { color: colors.muted, fontSize: 14 },
  meter: { height: 6, borderRadius: 3, backgroundColor: colors.line, overflow: 'hidden' }, meterFill: { height: '100%', backgroundColor: colors.lime, borderRadius: 3 }, green: { color: colors.lime, fontSize: 14, fontWeight: '700' }, orange: { color: colors.orange, fontSize: 10, letterSpacing: 1.4, fontWeight: '800' }, questionCard: { gap: 14 }, question: { color: colors.text, fontSize: 24, fontWeight: '700', lineHeight: 33, marginVertical: 12 }, choice: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 20, borderWidth: 1, borderColor: colors.line, borderRadius: 12, backgroundColor: colors.panel, minHeight: 72 }, choiceLetter: { color: colors.muted, fontSize: 14, fontWeight: '800' }, selectedChoice: { borderColor: colors.lime }, correctChoice: { borderColor: colors.lime, backgroundColor: '#243A2E' }, incorrectChoice: { borderColor: colors.orange, backgroundColor: '#3A2C27' },
  result: { alignItems: 'stretch', gap: 22, paddingVertical: 20 }, resultIcon: { alignSelf: 'center', width: 100, height: 100, borderRadius: 50, backgroundColor: '#293E2F', alignItems: 'center', justifyContent: 'center' }, resultBolt: { color: colors.lime, fontSize: 55 }, reward: { color: colors.lime, fontSize: 28, fontWeight: '800' }, record: { flexDirection: 'row', gap: 15, alignItems: 'center', padding: 20, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 12 }, recordTitle: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 6 }, warning: { color: colors.orange, fontSize: 14, lineHeight: 22, padding: 15, borderWidth: 1, borderColor: colors.orange, borderRadius: 8 },
  labNotice: { backgroundColor: '#302820', padding: 19, borderRadius: 12, gap: 8 }, status: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: colors.line, borderRadius: 20 }, flow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', paddingVertical: 20 }, node: { alignItems: 'center', gap: 8, flexShrink: 1 }, contact: { width: 62, height: 62, backgroundColor: '#0F1C2B', borderWidth: 1, borderColor: colors.line, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, closedContact: { borderColor: '#748E4C', backgroundColor: '#203329' }, contactText: { color: colors.orange, fontSize: 30 }, nodeName: { color: colors.text, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }, wire: { height: 2, flex: 1, maxWidth: 150, backgroundColor: colors.line, marginTop: 30 }, holdRow: { flexDirection: 'row', alignItems: 'center', gap: 10 }, indicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.muted }, controlRow: { flexDirection: 'row', gap: 12 },
});
