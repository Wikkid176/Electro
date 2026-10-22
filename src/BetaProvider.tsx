import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BETA_KEY, heartbeatSeconds, newStudy, restoreStudy, type Cohort, type StudyData } from './beta';
import { lessons } from './content';
import { componentChallenges } from './components';
import { isCompatibleStudyBuild } from './build';

function useStudy() {
  const [data, setData] = useState<StudyData | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const current = useRef<StudyData | null>(null);
  const writable = useRef(false);
  const writes = useRef(Promise.resolve());
  const scope = useRef('Beta');
  const attemptId = useRef<string | null>(null);
  const lastTick = useRef(Date.now());
  const foreground = useRef(AppState.currentState === 'active');
  const serial = useRef(0);
  const id = () => `${Date.now().toString(36)}-${++serial.current}`;
  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(BETA_KEY).then(raw => {
      if (!mounted) return;
      const saved = restoreStudy(raw);
      if (raw !== null && !saved) {
        setError('The saved beta record could not be read. It has been preserved. Ask your organizer for help before recording a new study.');
        return;
      }
      current.current = saved; setData(saved); writable.current = true;
      if (saved && !isCompatibleStudyBuild(saved.build)) setError('Your earlier beta record is preserved and paused. Export it, then delete the beta record before starting a new study for these expanded lessons. Course scores remain.');
    }).catch(() => { if (mounted) setError('Beta storage is unavailable. You can still use the training app.'); })
      .finally(() => { if (mounted) setReady(true); });
    return () => { mounted = false; };
  }, []);
  const save = useCallback((next: StudyData | null) => {
    if (!writable.current) return;
    current.current = next; setData(next);
    writes.current = writes.current.then(() => next ? AsyncStorage.setItem(BETA_KEY, JSON.stringify(next)) : AsyncStorage.removeItem(BETA_KEY)).catch(() => setError('The beta record could not be saved. Keep this app open and export your results now.'));
  }, []);
  const mutate = useCallback((update: (value: StudyData) => StudyData) => {
    if (!current.current || !writable.current) return;
    try { save(update(current.current)); } catch (reason) { setError(reason instanceof Error ? reason.message : 'The beta record could not be updated.'); }
  }, [save]);
  const flush = useCallback(() => {
    const now = Date.now();
    const seconds = heartbeatSeconds(lastTick.current, now, foreground.current);
    lastTick.current = now;
    if (!current.current?.recording || scope.current === 'Beta' || seconds === 0) return;
    mutate(value => ({ ...value, trainingSeconds: value.trainingSeconds + seconds, attempts: value.attempts.map(attempt => attempt.id === attemptId.current && scope.current === `mission:${attempt.lessonId}` && !attempt.finishedAt ? { ...attempt, seconds: attempt.seconds + seconds } : attempt) }));
  }, [mutate]);
  useEffect(() => {
    const timer = setInterval(flush, 5000);
    const listener = AppState.addEventListener('change', state => { flush(); foreground.current = state === 'active'; });
    return () => { clearInterval(timer); listener.remove(); };
  }, [flush]);
  const setScope = useCallback((next: string) => { flush(); scope.current = next; }, [flush]);
  const begin = useCallback((code: string, cohort: Cohort, scores: Record<string, number>) => {
    if (current.current) return;
    if (!writable.current) throw new Error('Beta storage is unavailable. Recording has not started.');
    save(newStudy(code, cohort, scores)); lastTick.current = Date.now();
  }, [save]);
  const toggleRecording = useCallback(() => {
    if (current.current && !isCompatibleStudyBuild(current.current.build)) return;
    flush(); mutate(value => ({ ...value, recording: !value.recording }));
  }, [flush, mutate]);
  const startMission = useCallback((lessonId: string, resume = false) => {
    flush();
    if (!current.current?.recording) return;
    const previous = resume ? [...current.current.attempts].reverse().find(attempt => attempt.lessonId === lessonId && !attempt.finishedAt) : null;
    if (previous) { attemptId.current = previous.id; return; }
    const nextId = id();
    mutate(value => {
      if (value.attempts.length >= 150) throw new Error('The beta log is full. Export it and ask your organizer to start a new record.');
      attemptId.current = nextId;
      return { ...value, attempts: [...value.attempts, { id: nextId, lessonId, startedAt: new Date().toISOString(), finishedAt: null, score: null, seconds: 0, hintIndexes: [], answers: [] }] };
    });
  }, [flush, mutate]);
  const answer = useCallback((lessonId: string, index: number, choice: number, hintUsed: boolean) => {
    if (!current.current?.recording) return;
    const question = lessons.find(lesson => lesson.id === lessonId)?.questions[index];
    if (!question || choice < 0 || choice >= question.choices.length) return;
    mutate(value => ({ ...value, attempts: value.attempts.map(attempt => attempt.id === attemptId.current && attempt.lessonId === lessonId && !attempt.finishedAt && !attempt.answers.some(answer => answer.index === index) ? { ...attempt, answers: [...attempt.answers, { index, choice, correct: choice === question.correct, hintUsed: hintUsed || attempt.hintIndexes.includes(index) }] } : attempt) }));
  }, [mutate]);
  const hint = useCallback((lessonId: string, index: number) => {
    if (!current.current?.recording) return;
    mutate(value => ({ ...value, attempts: value.attempts.map(attempt => attempt.id === attemptId.current && attempt.lessonId === lessonId && !attempt.hintIndexes.includes(index) ? { ...attempt, hintIndexes: [...attempt.hintIndexes, index] } : attempt) }));
  }, [mutate]);
  const finish = useCallback((lessonId: string, score: number) => {
    flush();
    if (!current.current?.recording) return;
    mutate(value => ({ ...value, attempts: value.attempts.map(attempt => attempt.id === attemptId.current && attempt.lessonId === lessonId && !attempt.finishedAt ? { ...attempt, score, finishedAt: new Date().toISOString() } : attempt) }));
  }, [flush, mutate]);
  const visitLab = useCallback((lab: string) => {
    if (current.current?.recording && !current.current.labsVisited.includes(lab)) mutate(value => ({ ...value, labsVisited: [...value.labsVisited, lab] }));
  }, [mutate]);
  const startWorkshop = useCallback(() => {
    if (!current.current?.recording) return null;
    const nextId = id();
    mutate(value => {
      if (value.workshops.length >= 50) throw new Error('The workshop log is full. Export the beta record before starting a new one.');
      return { ...value, workshops: [...value.workshops, { id: nextId, answers: [] }] };
    });
    return nextId;
  }, [mutate]);
  const componentAnswer = useCallback((runId: string, index: number, choice: string) => {
    if (!current.current?.recording) return;
    const question = componentChallenges[index];
    if (!question || !question.choices.some(answer => answer.id === choice)) return;
    mutate(value => ({ ...value, workshops: value.workshops.map(run => run.id === runId && !run.answers.some(answer => answer.index === index) ? { ...run, answers: [...run.answers, { index, choice, correct: choice === question.answer }] } : run) }));
  }, [mutate]);
  const feedback = useCallback((category: string, location: string, note: string) => {
    if (!current.current) throw new Error('Start a beta record before adding feedback.');
    if (!isCompatibleStudyBuild(current.current.build)) throw new Error('Export the earlier record and start a new study before adding feedback for this version.');
    if (current.current.feedback.length >= 100) throw new Error('The feedback log is full. Export it before adding more.');
    mutate(value => ({ ...value, feedback: [...value.feedback, { at: new Date().toISOString(), category, location, note: note.trim().slice(0, 2000) }] }));
  }, [mutate]);
  const clear = useCallback(() => { save(null); attemptId.current = null; setError(''); }, [save]);
  return { data, ready, error, begin, setScope, toggleRecording, startMission, answer, hint, finish, visitLab, startWorkshop, componentAnswer, feedback, clear };
}
const Context = createContext<ReturnType<typeof useStudy> | null>(null);
export function BetaProvider({ children }: { children: React.ReactNode }) { const study = useStudy(); return <Context.Provider value={study}>{children}</Context.Provider>; }
export function useBeta() { const value = useContext(Context); if (!value) throw new Error('BetaProvider is required'); return value; }
