import React, { useState } from 'react';
import { Platform, Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { useBeta } from './BetaProvider';
import { cohorts, studyExport, studySummary, type Cohort } from './beta';
import { release } from './build';

function Action({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) { return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={[s.button, disabled && { opacity: .4 }]}><Text style={s.buttonText}>{label}</Text></Pressable>; }
export function BetaHub({ scores }: { scores: Record<string, number> }) {
  const study = useBeta();
  const [code, setCode] = useState('');
  const [cohort, setCohort] = useState<Cohort>(cohorts[4]);
  const [consent, setConsent] = useState(false);
  const [note, setNote] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Bug / something broke');
  const [status, setStatus] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const summary = study.data ? studySummary(study.data) : null;
  async function exportResults() {
    if (!study.data) return;
    try {
      const text = JSON.stringify(studyExport(study.data, Platform.OS), null, 2);
      if (Platform.OS === 'web') {
        const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
        const link = document.createElement('a'); link.href = url; link.download = `ell-beta-${study.data.participant.code}.json`; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
        setStatus('Results downloaded. Send the file to your study organizer using the agreed contact.');
      } else {
        const result = await Share.share({ title: 'ElectroLessonLab beta results', message: text });
        setStatus(result.action === Share.dismissedAction ? 'Sharing canceled. Your results remain on this device.' : 'Share sheet completed. Check your chosen app to confirm delivery to your organizer.');
      }
    } catch { setStatus('Export could not open. Keep this app open and ask your organizer for help.'); }
  }
  return <>
    <Text style={s.label}>HUMAN TESTING / {release.label}</Text><Text accessibilityRole="header" style={s.title}>Beta testing</Text>
    <Text style={s.body}>Try the missions and labs. Tell us what is clear, confusing, or broken. This is conceptual training; use no real electrical equipment during the study.</Text>
    <View style={s.card}><Text accessibilityRole="header" style={s.heading}>Before you begin</Text><Text style={s.body}>1. Use the tester code and group your organizer gives you. No name, email, birth date, or employer is needed.{"\n\n"}2. Recording is optional. It saves quiz attempts, hints used, workshop answers, visited labs, and estimated foreground training time on this device.{"\n\n"}3. Nothing is uploaded automatically. At the end, review and export your record, then send it to your organizer yourself. A hosting provider or distribution service may keep its own access logs.{"\n\n"}4. You can pause recording or delete the beta record. Training scores are stored separately. Clearing app/browser data removes local records. Teens should take part with the organizer’s appropriate parent/guardian arrangements and supervision.</Text></View>
    {!!study.error && <Text accessibilityRole="alert" style={s.warning}>{study.error}</Text>}
    {!study.data ? <View style={s.card}>
      <Text style={s.heading}>Start your test record</Text>
      <Text style={s.body}>Use your own device or a fresh browser profile. Existing course scores are recorded as a baseline; they do not become first-attempt study results.</Text>
      <Text style={s.label}>TESTER CODE</Text><TextInput accessibilityLabel="Tester code" value={code} onChangeText={text => setCode(text.toUpperCase())} placeholder="Example: A01" placeholderTextColor="#A6B4C6" autoCapitalize="characters" autoCorrect={false} maxLength={16} style={s.input} />
      <Text style={s.label}>STUDY GROUP</Text><View accessibilityRole="radiogroup" accessibilityLabel="Study group" style={{ gap: 10 }}>{cohorts.map(item => <Pressable key={item} accessibilityRole="radio" aria-checked={cohort === item} accessibilityState={{ checked: cohort === item }} onPress={() => setCohort(item)} style={[s.option, cohort === item && s.selected]}><Text style={s.body}>{item}</Text></Pressable>)}</View>
      <Pressable accessibilityRole="checkbox" aria-checked={consent} accessibilityState={{ checked: consent }} onPress={() => setConsent(value => !value)} style={[s.option, consent && s.selected]}><Text style={s.body}>{consent ? '✓ ' : '□ '}I choose to record my test on this device and understand that sharing is my choice.</Text></Pressable>
      <Action label="Start beta recording" disabled={!study.ready || !consent || !!study.error} onPress={() => { try { study.begin(code.trim(), cohort, scores); setStatus('Recording started. Open Learn to begin with the safety mission.'); } catch (error) { setStatus(error instanceof Error ? error.message : 'Recording could not start.'); } }} />
    </View> : <>
      <View style={s.card}><Text style={s.heading}>Your test record</Text><Text style={s.body}>{study.data.participant.code} · {study.data.participant.cohort}{"\n"}Recording {study.data.recording ? 'on' : 'paused'} · {release.label}</Text><Text style={s.body}>{summary!.completedFirstAttempts} / 47 complete first attempts{"\n"}{summary!.firstPassCorrect} / {summary!.firstPassQuestions} recorded first-pass answers correct{"\n"}{summary!.foregroundTrainingMinutes} estimated foreground minutes{"\n"}{summary!.visitedLabs} / 4 labs visited · {study.data.feedback.length} feedback notes</Text>
        {summary!.baselineHasProgress && <Text style={s.warning}>This device already had course progress when recording began. Tell your organizer; these results are not a fresh learning baseline.</Text>}
        <Text style={s.body}>Time includes idle time while training is visible and repeat attempts. Background time and this Beta tab are excluded. Closing abruptly can lose the last few seconds. Paused or unfinished answers remain partial records.</Text>
        <Action label={study.data.recording ? 'Pause beta recording' : 'Resume beta recording'} onPress={study.toggleRecording} />
      </View>
      <View style={s.card}><Text accessibilityRole="header" style={s.heading}>Leave feedback</Text><Text style={s.body}>Describe what happened and what you expected. Include the mission or lab name. Avoid names, employer information, and real equipment documents.</Text>
        <View accessibilityRole="radiogroup" accessibilityLabel="Feedback category" style={{ gap: 8 }}>{['Bug / something broke', 'Confusing explanation', 'Electrical content concern', 'Suggestion'].map(item => <Pressable key={item} accessibilityRole="radio" aria-checked={category === item} accessibilityState={{ checked: category === item }} onPress={() => setCategory(item)} style={[s.option, category === item && s.selected]}><Text style={s.body}>{item}</Text></Pressable>)}</View>
        <TextInput accessibilityLabel="Mission or lab for feedback" placeholder="Mission or lab name" placeholderTextColor="#A6B4C6" maxLength={120} value={location} onChangeText={setLocation} style={s.input} />
        <TextInput accessibilityLabel="Beta feedback" multiline placeholder="What happened? What did you expect?" placeholderTextColor="#A6B4C6" maxLength={2000} value={note} onChangeText={setNote} style={[s.input, { minHeight: 120, textAlignVertical: 'top' }]} />
        <Action label="Save feedback on this device" disabled={!note.trim()} onPress={() => { try { study.feedback(category, location.trim(), note); setNote(''); setStatus('Feedback saved locally. Export your record to share it with your organizer.'); } catch (error) { setStatus(error instanceof Error ? error.message : 'Feedback could not be saved.'); } }} />
      </View>
      <View style={s.card}><Text style={s.heading}>Review and share</Text><Text style={s.body}>Your export contains your tester code, group, recorded attempts, timing, and feedback. Send it only to the study organizer. Nothing is sent by this button without your action.</Text>{study.data.feedback.map((item, index) => <View key={`${item.at}-${index}`} style={{ gap: 4 }}><Text style={s.label}>{item.category} · {item.location || 'General'}</Text><Text selectable style={s.body}>{item.note}</Text></View>)}
        <Action label={Platform.OS === 'web' ? 'Download beta results' : 'Share beta results'} onPress={() => { void exportResults(); }} />
        {!confirmClear ? <Action label="Delete beta record" onPress={() => setConfirmClear(true)} /> : <><Text style={s.warning}>Delete this device’s beta record and feedback? Export it first if you want to keep a copy. Course scores will remain.</Text><Action label="Confirm delete beta record" onPress={() => { study.clear(); setConfirmClear(false); setStatus('Beta record deleted. Course scores remain on this device.'); }} /><Action label="Keep beta record" onPress={() => setConfirmClear(false)} /></>}
      </View>
    </>}
    {!!status && <Text accessibilityRole="status" accessibilityLiveRegion="polite" style={s.body}>{status}</Text>}
    <View style={s.card}><Text style={s.heading}>Suggested first session</Text><Text style={s.body}>Start with safety. Complete three missions, try each practice lab, deliberately leave and resume one unfinished mission, then return here to leave feedback. Take breaks whenever needed. Full-course testers can continue across several sessions on the same device. Follow the organizer’s test plan.</Text></View>
  </>;
}
const s = StyleSheet.create({
  title: { color: '#F3F6FA', fontSize: 34, lineHeight: 41, fontWeight: '800' }, heading: { color: '#F3F6FA', fontSize: 22, lineHeight: 29, fontWeight: '700' },
  body: { color: '#A6B4C6', fontSize: 15, lineHeight: 24 }, label: { color: '#D6FA68', fontSize: 11, lineHeight: 18, fontWeight: '800' },
  card: { backgroundColor: '#142131', borderWidth: 1, borderColor: '#29394B', borderRadius: 16, padding: 20, gap: 16 },
  input: { borderWidth: 1, borderColor: '#52667D', backgroundColor: '#0B1420', borderRadius: 9, padding: 14, color: '#F3F6FA', fontSize: 16, lineHeight: 24, minHeight: 50 },
  button: { padding: 16, minHeight: 52, justifyContent: 'center', alignItems: 'center', backgroundColor: '#D6FA68', borderRadius: 10 }, buttonText: { color: '#0B1420', fontSize: 15, lineHeight: 22, fontWeight: '800', textAlign: 'center' },
  option: { padding: 14, minHeight: 48, borderWidth: 1, borderColor: '#44566D', borderRadius: 10, backgroundColor: '#1E2E40' }, selected: { borderColor: '#D6FA68', backgroundColor: '#243A2E' }, warning: { color: '#FFBA73', fontSize: 14, lineHeight: 22 },
});
