import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { initialMeter, readMeterAtProbes, type ProbePoint, type MeterFixture, type MeterMode, type MeterState } from './meter';
import { MeterEquipment } from './MeterEquipment';

const modes: { value: MeterMode; label: string }[] = [
  { value: 'dc-volts', label: 'DC voltage' },
  { value: 'resistance', label: 'Resistance (Ω)' },
  { value: 'continuity', label: 'Continuity' },
];
const fixtures: { value: MeterFixture; label: string; status: string }[] = [
  { value: 'dc-source', label: '18 V DC source', status: 'ENERGIZED VIRTUAL SOURCE' },
  { value: 'resistor', label: '220 Ω resistor', status: 'ISOLATED VIRTUAL COMPONENT' },
  { value: 'link', label: 'Low-resistance link', status: 'ISOLATED VIRTUAL COMPONENT' },
  { value: 'open', label: 'Open path', status: 'ISOLATED VIRTUAL COMPONENT' },
];

function Choice({ title, selected, onPress }: { title: string; selected: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" aria-pressed={selected} accessibilityState={{ selected }} onPress={onPress}
    style={({ pressed }) => [s.choice, selected && s.chosen, pressed && { opacity: 0.7 }]}>
    <Text style={[s.choiceText, selected && { color: '#D6FA68' }]}>{title}</Text>
  </Pressable>;
}

export function MeterLab() {
  const [meter, setMeter] = useState<MeterState>(initialMeter);
  const [red, setRed] = useState<ProbePoint>('A');
  const [black, setBlack] = useState<ProbePoint>('B');
  const reading = readMeterAtProbes(meter, red, black);
  function place(lead: 'red' | 'black', point: ProbePoint) {
    if (lead === 'red') setRed(point); else setBlack(point);
    update({ reversed: (lead === 'red' ? point : red) === 'B' && (lead === 'black' ? point : black) === 'A' });
  }
  const fixture = fixtures.find(item => item.value === meter.fixture)!;
  function update(patch: Partial<MeterState>) { setMeter(state => ({ ...state, ...patch })); }
  return <>
    <Text style={s.label}>INTERACTIVE PRACTICE / 02</Text>
    <Text accessibilityRole="header" style={s.title}>The meter bench</Text>
    <Text style={s.intro}>Choose a fixture and a meter function. Predict the display, then explain what it tells you.</Text>
    <View style={s.notice}><Text style={s.orange}>SIMULATION ONLY</Text><Text style={s.body}>No physical equipment is connected. This model does not perform isolation, prove electrical safety, or authorize field testing.</Text></View>
    <View style={s.card}>
      <Text style={s.label}>1 / CHOOSE THE VIRTUAL FIXTURE</Text>
      <View style={s.options}>{fixtures.map(item => <Choice key={item.value} title={item.label} selected={meter.fixture === item.value} onPress={() => update({ fixture: item.value })} />)}</View>
      <Text style={meter.fixture === 'dc-source' ? s.orange : s.label}>{fixture.status}</Text>
      <Text style={s.body}>{meter.fixture === 'dc-source' ? 'The model presents an ideal 18 V DC source at the virtual terminals.' : 'The model defines this fixture as already isolated, with no stored energy or parallel paths. Real equipment requires an approved verification process.'}</Text>
    </View>
    <View style={s.card}>
      <Text style={s.label}>2 / CHOOSE THE FUNCTION</Text>
      <View style={s.options}>{modes.map(item => <Choice key={item.value} title={item.label} selected={meter.mode === item.value} onPress={() => update({ mode: item.value })} />)}</View>
      <Text style={s.label}>3 / CHECK THE VIRTUAL INPUT</Text>
      <View style={s.options}>
        <Choice title="V/Ω input" selected={meter.input === 'voltage-resistance'} onPress={() => update({ input: 'voltage-resistance' })} />
        <Choice title="A input" selected={meter.input === 'current'} onPress={() => update({ input: 'current' })} />
      </View>
      <Text style={s.body}>COM is fixed as the reference. The A option demonstrates an input mismatch; current measurement is not included in this bench.</Text>
      <Choice title={meter.reversed ? 'Reference: reversed' : 'Reference: normal'} selected={meter.reversed} onPress={() => { setRed(meter.reversed ? 'A' : 'B'); setBlack(meter.reversed ? 'B' : 'A'); update({ reversed: !meter.reversed }); }} />
    </View>
    <View style={s.card}><Text style={s.label}>4 / PLACE THE PROBES</Text><MeterEquipment meter={meter} display={reading.display} red={red} black={black} place={place} /></View>
    <View accessibilityLiveRegion="polite" style={[s.displayCard, reading.kind === 'blocked' && { borderColor: '#FFBA73' }]}>
      <Text style={s.displayLabel}>{reading.kind === 'blocked' ? 'READING BLOCKED' : 'SIMULATED DISPLAY'}</Text>
      <Text accessibilityLabel={`Simulated display: ${reading.display}`} style={[s.reading, reading.kind === 'blocked' && { color: '#FFBA73' }]}>{reading.display}</Text>
      <Text style={s.body}>{reading.explanation}</Text>
    </View>
    <View style={s.card}><Text style={s.label}>TRY THESE CHALLENGES</Text>
      <Text style={s.body}>1. Select the DC source and DC voltage. Reverse the reference. What changes?{"\n\n"}2. Select resistance while the source is selected. Why is the reading blocked?{"\n\n"}3. Choose the isolated resistor, then the open path. Compare resistance readings.{"\n\n"}4. Choose continuity. Compare the resistor and the low-resistance link. Does “no tone” always mean an open path?</Text>
      <Text style={s.body}>The model’s tone threshold is below 30 Ω. That is an example setting, not a universal meter specification. Tones are indicated visually; no sound is played.</Text>
    </View>
  </>;
}

const s = StyleSheet.create({
  title: { color: '#F3F6FA', fontSize: 34, fontWeight: '800', lineHeight: 41, letterSpacing: -1 },
  label: { color: '#D6FA68', fontSize: 10, letterSpacing: 1.5, fontWeight: '800', lineHeight: 17 },
  intro: { color: '#A6B4C6', fontSize: 16, lineHeight: 26 },
  body: { color: '#A6B4C6', fontSize: 15, lineHeight: 24 },
  notice: { padding: 20, gap: 10, borderRadius: 12, backgroundColor: '#302820' },
  orange: { color: '#FFBA73', fontSize: 10, letterSpacing: 1.3, fontWeight: '800', lineHeight: 17 },
  card: { backgroundColor: '#142131', padding: 22, borderWidth: 1, borderColor: '#29394B', borderRadius: 16, gap: 18 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  choice: { paddingHorizontal: 16, paddingVertical: 14, minHeight: 48, justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#44566D', backgroundColor: '#1E2E40' },
  chosen: { backgroundColor: '#243A2E', borderColor: '#D6FA68' },
  choiceText: { color: '#F3F6FA', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  displayCard: { backgroundColor: '#142131', padding: 25, borderWidth: 1, borderColor: '#D6FA68', borderRadius: 16, gap: 20 },
  displayLabel: { color: '#A6B4C6', fontSize: 10, letterSpacing: 1.5, fontWeight: '700' },
  reading: { color: '#D6FA68', fontSize: 31, lineHeight: 42, fontWeight: '800', fontVariant: ['tabular-nums'] },
});
