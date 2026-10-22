import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { CoachPortrait } from './Coach';
import { HardwareShape, MetalDefs, Screw } from './LabHardware';
import { WIRING_KEY, newWiringBook, restoreWiringBook, serializeWiringBook, simulateWiring, wiringBenches, wiringReducer, type Bench, type BenchId, type WiringAction, type WiringState } from './wiring';
const paint = { red: '#E87968', blue: '#7DBBFF', black: '#29313B' };
function Action({ title, onPress, disabled = false, secondary = false }: { title: string; onPress: () => void; disabled?: boolean; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, secondary && s.secondary, disabled && { opacity: 0.45 }, pressed && { opacity: 0.7 }]}><Text style={[s.buttonText, secondary && { color: '#F3F6FA' }]}>{title}</Text></Pressable>;
}
function Panel({ bench, state, dispatch }: { bench: Bench; state: WiringState; dispatch: (action: WiringAction) => void }) {
  const [width, setWidth] = useState(320);
  const result = simulateWiring(bench, state);
  const id = `wiring-${bench.id}`;
  return <View onLayout={event => setWidth(event.nativeEvent.layout.width)} style={{ width: '100%', maxWidth: 540, alignSelf: 'center', aspectRatio: 380 / 550 }} testID="wiring-panel">
    <Svg width="100%" height="100%" viewBox="0 0 380 550" accessible={false}>
      <MetalDefs id={id} />
      <Rect x={1} y={1} width={378} height={548} rx={12} fill={`url(#${id}-steel)`} stroke="#D0DADD" strokeWidth={2} />
      {Array.from({ length: 27 }, (_, i) => <Line key={i} x1={8} y1={15 + i * 20} x2={372} y2={15 + i * 20} stroke="#DFE4E4" opacity={0.14} />)}
      {[45, 285].map(y => <React.Fragment key={y}><Rect x={12} y={y} width={356} height={19} fill={`url(#${id}-steel)`} stroke="#495E68" /><Line x1={15} y1={y + 5} x2={365} y2={y + 5} stroke="#E4EBED" strokeWidth={2} /></React.Fragment>)}
      {[230, 510].map(y => <Gutter key={y} y={y} />)}
      <SvgText fontFamily="sans-serif" x={190} y={26} fontSize={12} fontWeight="800" textAnchor="middle" fill="#152C35">ELL / 24 V WIRING BENCH</SvgText>
      {bench.hardware.map((item, i) => <HardwareShape key={i} item={item} id={id} on={item.kind === 'supply' ? state.powered : item.kind === 'relay' ? result.coil : result.lamp} operated={item.kind === 'switch' ? state.switchOn : item.kind === 'start' ? state.start : state.stop} />)}
      {state.wires.map((wire, i) => {
        const a = bench.terminals.find(t => t.id === wire.a)!; const b = bench.terminals.find(t => t.id === wire.b)!;
        const y = a.y === b.y ? a.y + 44 + (i % 4) * 9 : (a.y + b.y) / 2 + (i % 4) * 8;
        const path = `M${a.x} ${a.y} C${a.x} ${y} ${b.x} ${y} ${b.x} ${b.y}`;
        return <React.Fragment key={i}><Path d={path} stroke="#0B131B" strokeOpacity={0.6} strokeWidth={10} fill="none" /><Path d={path} stroke={paint[wire.color]} strokeWidth={6} fill="none" /><Path d={path} stroke="#FFFFFF" strokeOpacity={0.23} strokeWidth={1.3} fill="none" /></React.Fragment>;
      })}
      {bench.terminals.map(t => <React.Fragment key={t.id}><Screw x={t.x} y={t.y} id={id} selected={state.selected === t.id} /><Rect x={t.x - 26} y={t.y + 22} width={52} height={16} rx={2} fill="#10202A" /><SvgText fontFamily="sans-serif" x={t.x} y={t.y + 33} textAnchor="middle" fill="#F6F8EF" fontSize={10} fontWeight="800">{t.label}</SvgText></React.Fragment>)}
      <Circle cx={22} cy={530} r={4} fill={state.powered ? '#E8FA78' : '#273C43'} /><SvgText fontFamily="sans-serif" x={34} y={534} fill="#152C35" fontSize={10} fontWeight="800">{state.powered ? 'POWER ON · WIRING LOCKED' : 'POWER OFF · BUILD MODE'}</SvgText>
    </Svg>
    {bench.terminals.map(t => <Pressable key={t.id} accessibilityRole="button" accessibilityLabel={`Terminal ${t.label}`} accessibilityState={{ selected: state.selected === t.id, disabled: state.powered }} aria-pressed={state.selected === t.id} disabled={state.powered} onPress={() => dispatch({ type: 'terminal', id: t.id })} style={{ position: 'absolute', left: width * t.x / 380 - 24, top: width * t.y / 380 - 24, width: 48, height: 48, borderRadius: 24 }} />)}
  </View>;
}
function Gutter({ y }: { y: number }) { return <><Rect x={14} y={y} width={352} height={26} rx={3} fill="#4C616C" stroke="#ADC0C8" />{Array.from({ length: 25 }, (_, i) => <Rect key={i} x={20 + i * 14} y={y + 3} width={4} height={20} fill="#233844" />)}</>; }
export function WiringLab() {
  const [id, setId] = useState<BenchId>('lamp');
  const [book, setBook] = useState(newWiringBook);
  const [ready, setReady] = useState(false); const [storageError, setStorageError] = useState('');
  const [plan, setPlan] = useState(false); const [terminalList, setTerminalList] = useState(false); const [confirmClear, setConfirmClear] = useState(false);
  const writable = useRef(false); const writes = useRef(Promise.resolve());
  useEffect(() => {
    let live = true;
    AsyncStorage.getItem(WIRING_KEY).then(raw => { if (!live) return; const restored = restoreWiringBook(raw); if (restored) { setBook(restored); writable.current = true; } else setStorageError('Saved wiring could not be read and has been preserved. You can practice, but these changes will not be saved.'); }).catch(() => { if (live) setStorageError('Wiring storage is unavailable. You can still practice this session.'); }).finally(() => { if (live) setReady(true); });
    return () => { live = false; };
  }, []);
  const saved = ready ? serializeWiringBook(book) : '';
  useEffect(() => { if (!ready || !writable.current) return; writes.current = writes.current.then(() => AsyncStorage.setItem(WIRING_KEY, saved)).catch(() => setStorageError('Wiring could not be saved. Keep the app open to finish this build.')); }, [saved, ready]);
  const bench = wiringBenches.find(b => b.id === id)!; const state = book[id]; const output = simulateWiring(bench, state);
  function dispatch(action: WiringAction) { setBook(previous => ({ ...previous, [id]: wiringReducer(bench, previous[id], action) })); }
  function selectBench(next: BenchId) {
    if (next === id) return;
    setBook(previous => ({ ...previous, [id]: { ...previous[id], feedback: 'Bench power is off. Your wires are kept; run the test sequence when ready.', powered: false, coil: false, switchOn: false, start: false, stop: false, selected: null, step: 0 } }));
    setId(next); setPlan(false); setConfirmClear(false);
  }
  const name = (terminal: string) => bench.terminals.find(t => t.id === terminal)!.label;
  if (!ready) return <Text style={s.body}>Opening your wiring bench…</Text>;
  return <>
    <Text style={s.eyebrow}>INTERACTIVE PRACTICE / 05</Text><Text accessibilityRole="header" style={s.title}>The wiring bench</Text>
    <Text style={s.body}>Fit the wires. Predict the response. Bring your circuit to life.</Text>
    <View style={s.row}>{wiringBenches.map((b, i) => <Pressable key={b.id} accessibilityRole="button" accessibilityLabel={`Build ${i + 1}: ${b.title}`} accessibilityState={{ selected: id === b.id }} aria-pressed={id === b.id} onPress={() => selectBench(b.id)} style={[s.build, id === b.id && s.selected]}><Text style={s.eyebrow}>BUILD {i + 1}{book[b.id].passed ? ' · PROVED' : ''}</Text><Text style={s.white}>{b.title}</Text></Pressable>)}</View>
    <View style={s.card}><Text accessibilityRole="header" style={s.heading}>{bench.title}</Text><Text style={s.body}>{bench.brief}</Text><Text style={s.body}>{bench.learn}</Text><Text style={s.small}>Ideal 24 V DC components; no real equipment is connected. This bench does not calculate current, wire size, protection or safety integrity. A virtual power-off state is not an isolation procedure.</Text></View>
    {!!storageError && <Text accessibilityLiveRegion="polite" style={s.warning}>{storageError}</Text>}
    <View style={[s.card, { padding: 10 }]}><Panel bench={bench} state={state} dispatch={dispatch} />
      <Text accessibilityLiveRegion="polite" style={s.status}>{state.powered ? 'BENCH POWER ON · WIRES LOCKED' : 'BENCH POWER OFF · FIT OR REMOVE WIRES'}</Text>
      <Text accessibilityLabel={`Circuit output: ${bench.id === 'holding' ? `coil ${output.coil ? 'ON' : 'OFF'}` : `lamp ${output.lamp ? 'ON' : 'OFF'}${bench.id === 'relay' ? `, coil ${output.coil ? 'ON' : 'OFF'}` : ''}`}`} style={s.white}>{bench.id !== 'lamp' ? `K1 coil: ${output.coil ? 'ON' : 'OFF'} · Contact: ${output.coil ? 'CLOSED' : 'OPEN'}` : 'S1: ' + (state.switchOn ? 'CLOSED' : 'OPEN')}{bench.id !== 'holding' ? ` · H1: ${output.lamp ? 'ON' : 'OFF'}` : ''}</Text>
      <Action title={state.powered ? 'Turn bench power OFF' : 'Turn bench power ON'} onPress={() => dispatch({ type: 'control', action: state.powered ? 'power-off' : 'power-on' })} />
      {bench.id !== 'holding' ? <Action title={state.switchOn ? 'Switch S1 OFF' : 'Switch S1 ON'} disabled={!state.powered} secondary onPress={() => dispatch({ type: 'control', action: state.switchOn ? 'switch-off' : 'switch-on' })} /> : <View style={s.row}><Action title={state.start ? 'Release START' : 'Press START'} disabled={!state.powered} secondary onPress={() => dispatch({ type: 'control', action: state.start ? 'start-release' : 'start-press' })} /><Action title={state.stop ? 'Release STOP' : 'Press STOP'} disabled={!state.powered} secondary onPress={() => dispatch({ type: 'control', action: state.stop ? 'stop-release' : 'stop-press' })} /></View>}
      {bench.id === 'holding' && <Text style={s.small}>START and STOP stay pressed until you tap Release. The separate buttons make press and release states observable.</Text>}
    </View>
    <View accessibilityLiveRegion="polite" style={s.coach}><CoachPortrait mood={state.step === bench.steps.length ? 'celebrate' : 'think'} size={70} /><View style={{ flex: 1, gap: 8 }}><Text style={s.white}>Click’s bench notes</Text><Text testID="wiring-feedback" style={s.body}>{state.feedback}</Text></View></View>
    <View style={s.card}><Text style={s.eyebrow}>WIRE TOOLS</Text><Text style={s.body}>{state.selected ? `Selected: ${name(state.selected)}. Tap the destination or cancel.` : 'Tap two screw terminals on the panel to fit one wire. You can also use the terminal list below.'}</Text>
      <View style={s.row}>{(['red', 'blue', 'black'] as const).map(color => <Pressable key={color} accessibilityRole="button" accessibilityLabel={`${color} wire`} accessibilityState={{ selected: state.color === color, disabled: state.powered }} aria-pressed={state.color === color} disabled={state.powered} onPress={() => dispatch({ type: 'color', color })} style={[s.swatch, state.color === color && s.selected]}><View style={{ width: 28, height: 6, backgroundColor: paint[color], borderColor: '#9BB0BC', borderWidth: 1, borderRadius: 3 }} /><Text style={s.white}>{color}</Text></Pressable>)}</View>
      <Text style={s.small}>Color does not affect the model. No protective-earth connections are modeled.</Text>
      {state.selected && <Action title="Cancel connection" secondary onPress={() => dispatch({ type: 'cancel' })} />}
      <View style={s.row}><Action title="Undo last wire" disabled={state.powered || !state.wires.length} secondary onPress={() => dispatch({ type: 'undo' })} /><Action title="Check wiring" secondary onPress={() => dispatch({ type: 'check' })} /><Action title="Ask Click for a wiring hint" secondary onPress={() => dispatch({ type: 'hint' })} /></View>
      <Action title={terminalList ? 'Hide terminal list' : 'Show terminal list'} secondary onPress={() => setTerminalList(!terminalList)} />
      {terminalList && bench.terminals.map(t => <Action key={t.id} title={`Connect at ${t.label}`} disabled={state.powered} secondary onPress={() => dispatch({ type: 'terminal', id: t.id })} />)}
      <Text style={s.eyebrow}>{state.wires.length} WIRES FITTED</Text>
      {state.wires.map((w, i) => <View key={i} style={s.wireRow}><Text style={[s.body, { flex: 1 }]}>W{i + 1} · {name(w.a)} → {name(w.b)} · {w.color}</Text><Action title={`Remove wire ${i + 1}`} disabled={state.powered} secondary onPress={() => dispatch({ type: 'remove', index: i })} /></View>)}
      <Action title="Clear this build" disabled={state.powered || !state.wires.length} secondary onPress={() => setConfirmClear(!confirmClear)} />
      {confirmClear && <><Text style={s.body}>Remove all wires from this build? Completed-build badges are kept.</Text><Action title="Confirm clear wires" onPress={() => { dispatch({ type: 'clear' }); setConfirmClear(false); }} /><Action title="Keep my wires" secondary onPress={() => setConfirmClear(false)} /></>}
    </View>
    <View style={s.card}><Text style={s.eyebrow}>CONNECTION PLAN</Text><Text style={s.body}>Try the build first, or open the plan for guided practice. You may join the same electrical node using an equivalent branch arrangement.</Text><Action title={plan ? 'Hide connection plan' : 'Show connection plan'} secondary onPress={() => setPlan(!plan)} />{plan && bench.connections.map(([a, b], i) => <Text key={i} style={s.white}>{i + 1}. {name(a)} → {name(b)}</Text>)}</View>
    <View style={s.card}><Text style={s.eyebrow}>PROVE IT / {state.step} OF {bench.steps.length} TESTS</Text>{bench.steps.map((step, i) => <Text key={i} style={[s.body, i === state.step && s.white]}>{i < state.step ? '✓' : i === state.step ? '→' : '○'} {step.label}</Text>)}<Text style={s.small}>{state.passed ? 'Build badge earned. ' : ''}Wiring and badges save on this device. Power always returns OFF when you reopen the lab. Practice does not add course XP; the optional beta record counts the lab visit only.</Text></View>
  </>;
}
const s = StyleSheet.create({
  title: { color: '#F3F6FA', fontSize: 34, lineHeight: 41, fontWeight: '800' }, heading: { color: '#F3F6FA', fontSize: 23, lineHeight: 30, fontWeight: '700' },
  eyebrow: { color: '#D6FA68', fontSize: 10, lineHeight: 18, letterSpacing: 1.2, fontWeight: '800' }, body: { color: '#B4C3D3', fontSize: 15, lineHeight: 24 }, small: { color: '#B4C3D3', fontSize: 12, lineHeight: 19 }, white: { color: '#F3F6FA', fontSize: 14, lineHeight: 22, fontWeight: '700' },
  card: { backgroundColor: '#142131', borderColor: '#34485A', borderWidth: 1, borderRadius: 16, padding: 18, gap: 16 }, row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, build: { flexGrow: 1, flexBasis: 150, borderColor: '#52657B', borderWidth: 1, backgroundColor: '#1E2E40', borderRadius: 10, padding: 14, gap: 6, minHeight: 64 },
  selected: { borderColor: '#D6FA68', backgroundColor: '#243A2E' }, button: { backgroundColor: '#D6FA68', borderRadius: 10, minHeight: 48, padding: 14, justifyContent: 'center', alignItems: 'center', flexShrink: 1 }, secondary: { backgroundColor: '#1E2E40', borderColor: '#52657B', borderWidth: 1 }, buttonText: { color: '#0B1420', fontSize: 14, lineHeight: 21, fontWeight: '800', textAlign: 'center' },
  swatch: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, minHeight: 48, borderWidth: 1, borderColor: '#52657B', borderRadius: 8 }, wireRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 }, status: { color: '#D6FA68', textAlign: 'center', fontSize: 11, fontWeight: '800', lineHeight: 19 }, coach: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, backgroundColor: '#192B30', borderLeftWidth: 3, borderColor: '#D6FA68', borderRadius: 10 }, warning: { color: '#FFBA73', fontSize: 14, lineHeight: 22 },
});
