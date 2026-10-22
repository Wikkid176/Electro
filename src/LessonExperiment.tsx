import React, { useReducer, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { DeviceGlyph } from './LessonGraphic';
import { analogTemperature, dcValues, experiments, networkValues, samplingPoints, timerStep } from './lesson-experiments';
import { initialMotor, motorReducer } from './engine';
import { CoachNote } from './Coach';

const ink = '#DCE9F8', blue = '#8ECFFF', lime = '#D6FA68', orange = '#FFBC78';
function Control({ title, onPress, selected = false, disabled = false }: { title: string; onPress: () => void; selected?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ selected, disabled }} aria-pressed={selected} disabled={disabled} onPress={onPress} style={[s.control, selected && s.selected, disabled && { opacity: 0.4 }]}><Text style={s.controlText}>{title}</Text></Pressable>;
}
function Label({ x, y, children, color = ink }: { x: number; y: number; children: React.ReactNode; color?: string }) {
  return <SvgText x={x} y={y} textAnchor="middle" fill={color} fontSize={17} fontWeight="700">{children}</SvgText>;
}
const fmt = (value: number) => Number(value.toFixed(3)).toString();

export function LessonExperiment({ lessonId }: { lessonId: string }) {
  const kind = experiments[lessonId];
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(120);
  const [parallel, setParallel] = useState(false);
  const [open, setOpen] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [current, setCurrent] = useState(12);
  const [fine, setFine] = useState(false);
  const [motor, motorAction] = useReducer(motorReducer, initialMotor);
  const [timer, timerAction] = useReducer(timerStep, { enabled: false, elapsed: 0 });
  if (!kind) return null;
  let graphic: React.ReactNode, controls: React.ReactNode, result: string, reasoning: string;
  if (kind === 'energy') {
    graphic = <>
      <Rect x={150} y={45} width={180} height={140} rx={16} fill="#233C52" stroke={blue} strokeWidth={3} />
      <Circle cx={192} cy={83} r={11} fill={stopped ? '#5E7182' : lime} />
      <DeviceGlyph x={240} y={134} label="motor" active={!stopped} />
      <DeviceGlyph x={65} y={90} label="supply" active /><DeviceGlyph x={413} y={90} label="capacitor" active />
      <Path d="M 95 90 H 150 M 330 90 H 375" stroke={orange} strokeWidth={4} fill="none" />
      <Label x={66} y={160} color={orange}>SUPPLY</Label><Label x={410} y={160} color={orange}>STORED</Label>
      <Label x={240} y={223}>{stopped ? 'Motion command removed' : 'Motion command present'}</Label>
    </>;
    controls = <><Control title="Press STOP in the model" selected={stopped} onPress={() => setStopped(true)} /><Control title="Reset experiment" onPress={() => setStopped(false)} /></>;
    result = stopped ? 'Motion stops. Supply and stored energy are still present in this model.' : 'Running state: compare the command with the other energy paths.';
    reasoning = 'Watch which part changes when you press STOP. The control changes the motor state; it does not operate the separate supply or stored-energy paths shown in orange.';
  } else if (kind === 'ohms' || kind === 'network') {
    const network = networkValues(parallel, open);
    const dc = dcValues(voltage, resistance);
    const v = kind === 'network' ? 12 : voltage;
    const amps = kind === 'network' ? network.current : dc.current;
    const wire = amps ? lime : '#62788C';
    graphic = <>
      <Path d="M 85 60 H 135 M 348 60 H 393 V 192 H 85 V 60" fill="none" stroke={wire} strokeWidth={4} />
      <Path d="M 135 60 H 348" fill="none" stroke={kind === 'network' && open ? '#62788C' : wire} strokeWidth={4} />
      <Circle cx={85} cy={128} r={30} fill="#0B1725" stroke={blue} strokeWidth={3} /><Label x={85} y={135}>{v} V</Label>
      <Rect x={160} y={43} width={94} height={34} rx={4} fill="#233C52" stroke={orange} strokeWidth={3} />
      <Label x={207} y={33} color={orange}>{kind === 'network' ? 'R1 · 60 Ω' : `${resistance} Ω`}</Label>
      {kind === 'network' && (parallel ? <><Path d="M 135 60 V 125 H 348 V 60" stroke={lime} strokeWidth={4} fill="none" /><Rect x={185} y={108} width={94} height={34} rx={4} fill="#233C52" stroke={orange} strokeWidth={3} /><Label x={232} y={164} color={orange}>R2 · 60 Ω</Label></> : <><Rect x={282} y={43} width={80} height={34} rx={4} fill="#233C52" stroke={orange} strokeWidth={3} /><Label x={322} y={33} color={orange}>R2 · 60 Ω</Label></>)}
      {kind === 'network' && open && <><Rect x={145} y={51} width={14} height={18} fill="#0B1725" /><Path d="M 145 60 L 158 43" stroke={orange} strokeWidth={3} /></>}
      <Path d="M 280 180 L 260 192 L 280 204" stroke={wire} strokeWidth={3} fill="none" />
      <Label x={248} y={235} color={lime}>{fmt(amps)} A total</Label>
    </>;
    if (kind === 'ohms') {
      controls = <><Control title={`Source: ${voltage} V`} onPress={() => setVoltage(v => v === 12 ? 24 : 12)} /><Control title={`Resistor: ${resistance} Ω`} onPress={() => setResistance(r => r === 120 ? 240 : 120)} /></>;
      result = `I = ${voltage} ÷ ${resistance} = ${fmt(dc.current)} A · P = ${fmt(dc.power)} W`;
      reasoning = 'Predict first, then change one value. At fixed resistance, doubling voltage doubles current. At fixed voltage, doubling resistance halves current. The current returns around the complete path; it is not consumed by the resistor.';
    } else {
      controls = <><Control title={parallel ? 'Topology: parallel' : 'Topology: series'} onPress={() => setParallel(p => !p)} /><Control title={open ? 'Path: one open' : 'Path: complete'} selected={open} onPress={() => setOpen(o => !o)} /></>;
      result = `Source ${fmt(network.current)} A · R1 ${fmt(network.branchOne)} A · R2 ${fmt(network.branchTwo)} A`;
      reasoning = parallel ? 'Both 60 Ω branches share the same 12 V. Opening R1 removes its current, while the intact R2 branch can still take current.' : 'The resistors share one path. Their resistances add, and opening that one path removes modeled steady current through both. This is a current result, not a claim about voltage everywhere.';
    }
  } else if (kind === 'starter') {
    graphic = <>
      <Path d="M 45 85 H 435" stroke={motor.running ? lime : blue} strokeWidth={4} />
      <DeviceGlyph x={115} y={78} label="holding contact" active={motor.running} operated={motor.running} /><DeviceGlyph x={247} y={78} label="coil" active={motor.running} /><DeviceGlyph x={385} y={78} label="motor" active={motor.running} />
      <Label x={115} y={148}>Holding</Label><Label x={247} y={148}>Coil</Label><Label x={385} y={148}>{motor.running ? 'RUN' : 'STOP'}</Label>
      <Rect x={85} y={185} width={310} height={42} rx={12} fill={motor.overload ? '#5C323B' : '#253D35'} />
      <Label x={240} y={212} color={motor.overload ? orange : lime}>{motor.overload ? 'Overload condition active' : 'Overload condition clear'}</Label>
    </>;
    controls = <><Control title="Model START" onPress={() => motorAction('start')} /><Control title="Model STOP" onPress={() => motorAction('stop')} /><Control title="Trip overload" onPress={() => motorAction('trip')} /><Control title="Reset overload" onPress={() => motorAction('reset')} /></>;
    result = motor.running ? 'Coil energized; the holding state maintains the model after the momentary start action.' : 'Coil de-energized. A fresh permitted START is needed to run.';
    reasoning = 'Try START → trip → reset. The trip drops the coil and loses holding. Reset clears the condition but does not recreate the earlier START command. Press START again to see the difference.';
  } else if (kind === 'timer') {
    const output = timer.enabled && timer.elapsed >= 3;
    graphic = <>
      <Label x={82} y={58}>ENABLE</Label><Label x={82} y={153}>OUTPUT</Label>
      <Path d={`M 150 ${timer.enabled ? 38 : 78} H 435`} stroke={blue} strokeWidth={4} fill="none" />
      <Path d={output ? 'M 150 173 H 360 V 133 H 435' : 'M 150 173 H 435'} stroke={output ? lime : '#657B8D'} strokeWidth={4} fill="none" />
      {[0, 1, 2, 3, 4].map(t => <G key={t}><Line x1={150 + t * 70} y1={192} x2={150 + t * 70} y2={201} stroke={blue} /><Label x={150 + t * 70} y={226}>{t}s</Label></G>)}
      <Line x1={150 + timer.elapsed * 70} y1={20} x2={150 + timer.elapsed * 70} y2={190} stroke={orange} strokeWidth={3} strokeDasharray="5 5" />
    </>;
    controls = <><Control title={timer.enabled ? 'Enable: ON' : 'Enable: OFF'} selected={timer.enabled} onPress={() => timerAction('toggle')} /><Control title="Advance 1 second" disabled={!timer.enabled || timer.elapsed >= 4} onPress={() => timerAction('tick')} /></>;
    result = `${timer.elapsed} uninterrupted seconds · Output ${output ? 'closed' : 'open'}`;
    reasoning = 'Enable starts a new interval. Advance to three seconds, then remove enable. This on-delay output resets immediately; two short intervals do not accumulate into one completed delay.';
  } else if (kind === 'analog') {
    const temperature = analogTemperature(current);
    const fraction = temperature === null ? 0 : (current - 4) / 16;
    graphic = <>
      <Rect x={100} y={32} width={220} height={70} rx={14} fill="#243F53" stroke={blue} strokeWidth={3} />
      <Label x={210} y={77} color={blue}>{current} mA</Label>
      <Path d="M 326 67 H 373" stroke={blue} strokeWidth={3} /><Path d="M 363 58 L 374 67 L 363 76" stroke={blue} strokeWidth={3} fill="none" />
      <Rect x={382} y={38} width={30} height={145} rx={15} fill="#20334A" stroke={orange} strokeWidth={3} />
      <Rect x={389} y={175 - 125 * fraction} width={16} height={9 + 125 * fraction} rx={8} fill={temperature === null ? '#6B7C8D' : orange} /><Circle cx={397} cy={197} r={22} fill={temperature === null ? '#6B7C8D' : orange} />
      <Label x={190} y={153} color={temperature === null ? orange : lime}>{temperature === null ? 'Signal invalid' : `${fmt(temperature)} °C`}</Label>
      <Label x={190} y={198}>Range −10 to 50 °C</Label>
      <Label x={235} y={241}>Offset + fraction × span</Label>
    </>;
    controls = <>{[0, 4, 8, 12, 16, 20].map(mA => <Control key={mA} title={`Set ${mA} mA`} selected={current === mA} onPress={() => setCurrent(mA)} />)}</>;
    result = temperature === null ? '0 mA is outside this valid scale. Check validity before presenting a temperature.' : `−10 + ((${current} − 4) ÷ 16) × 60 = ${fmt(temperature)} °C`;
    reasoning = 'Move across the valid signal range and watch the temperature. Then choose 0 mA: the display reports invalid rather than treating an extrapolated calculation as a trustworthy process value.';
  } else {
    const points = samplingPoints(fine);
    graphic = <>
      <Path d="M 40 45 H 140 V 174 H 240 V 45 H 440" fill="none" stroke={orange} strokeWidth={3} />
      <Path d="M 40 20 V 205 H 440" fill="none" stroke={blue} strokeWidth={2} />
      {points.map(point => <G key={point.time}><Circle cx={40 + point.time * 20} cy={point.event ? 174 : 45} r={point.event ? 7 : 5} fill={point.event ? lime : blue} /><Line x1={40 + point.time * 20} x2={40 + point.time * 20} y1={point.event ? 174 : 45} y2={205} stroke="#345167" strokeDasharray="3 6" /></G>)}
      {[0, 5, 10, 15, 20].map(t => <Label key={t} x={40 + t * 20} y={232}>{t}ms</Label>)}
    </>;
    controls = <><Control title={fine ? 'Sampling: every 2 ms' : 'Sampling: every 20 ms'} selected={fine} onPress={() => setFine(f => !f)} /></>;
    result = `${points.filter(point => point.event).length} samples capture the event · ${points.length} samples total`;
    reasoning = 'The orange event exists between 5 and 10 ms. Blue and green dots are the recorded samples. Compare the two sample intervals: normal samples at each end do not establish what happened in between.';
  }
  return <View testID={`lesson-experiment-${kind}`} style={s.card}>
    <Text style={s.eyebrow}>TRY IT · CHANGE ONE THING</Text><Text accessibilityRole="header" style={s.heading}>Predict. Tap. Discover.</Text>
    <View accessibilityRole="image" accessibilityLabel={result} style={s.drawing}><Svg width="100%" height={210} viewBox="0 0 480 260" accessible={false}>{graphic}</Svg></View>
    <View style={s.controls}>{controls}</View>
    <Text accessibilityLiveRegion="polite" testID="experiment-result" style={s.result}>{result}</Text>
    <CoachNote message={reasoning} />
  </View>;
}

const s = StyleSheet.create({
  card: { gap: 16, backgroundColor: '#142131', borderWidth: 1, borderColor: '#3C5F71', borderRadius: 18, padding: 18 },
  eyebrow: { color: blue, fontSize: 11, lineHeight: 18, letterSpacing: 1.4, fontWeight: '800' }, heading: { color: ink, fontSize: 23, lineHeight: 31, fontWeight: '800' },
  drawing: { backgroundColor: '#0B1725', borderRadius: 14, overflow: 'hidden' }, controls: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  control: { padding: 13, minHeight: 48, borderWidth: 1, borderColor: '#638299', borderRadius: 11, backgroundColor: '#1B3045', justifyContent: 'center' },
  selected: { borderColor: lime, backgroundColor: '#2B413C' }, controlText: { color: ink, fontSize: 14, lineHeight: 21, fontWeight: '700' }, result: { color: lime, fontSize: 17, lineHeight: 27, fontWeight: '700' },
});
