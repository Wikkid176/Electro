import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { initialTrace, selectTraceNode, traceChallenges, traceSheets, type TraceSheetId } from './tracing';

export function TraceLab({ onNavigate }: { onNavigate: () => void }) {
  const [sheetId, setSheetId] = useState<TraceSheetId>('LIGHT');
  const [trace, setTrace] = useState(initialTrace);
  const sheet = traceSheets.find(item => item.id === sheetId)!;
  const challenge = traceChallenges[trace.step];
  const complete = trace.step === traceChallenges.length;

  return <>
    <Text style={s.label}>INTERACTIVE PRACTICE / 03</Text>
    <Text accessibilityRole="header" style={s.title}>Trace the signal</Text>
    <Text style={s.body}>An original, fictional drawing exercise. Follow an indicator path, investigate its relay reference, and find the return.</Text>
    <View style={s.notice}><Text style={s.label}>FICTIONAL PACKAGE / TRAIN-LAMP / REV B</Text><Text style={s.body}>These symbol tiles form a teaching map, not an installation drawing or safety design. Highlighting marks your answers, not voltage or operating state. No physical machine is connected.</Text></View>
    <View accessibilityLiveRegion="polite" style={s.card}>
      <Text accessibilityLabel={`Trace progress: ${trace.step} of ${traceChallenges.length}`} style={s.label}>{trace.step} / {traceChallenges.length} TARGETS FOUND</Text>
      <Text accessibilityRole="header" style={s.heading}>{complete ? 'Trace complete' : `Challenge ${trace.step + 1}`}</Text>
      <Text style={s.prompt}>{complete ? 'You distinguished the load path, the relay association, the command path, and the return.' : challenge.prompt}</Text>
      {!!trace.feedback && <View style={[s.feedback, trace.correct === false && { borderColor: '#FFBA73' }]}><Text style={s.feedbackTitle}>{trace.correct ? 'Target found' : 'Check the drawing'}</Text><Text style={s.body}>{trace.feedback}</Text></View>}
      <Text style={s.small}>Practice does not add XP. Mission quizzes save your best scores.</Text>
    </View>
    <View style={s.card}>
      <Text style={s.label}>SHEET INDEX / EXERCISE CONVENTIONS</Text>
      <View accessibilityRole="tablist" accessibilityLabel="Fictional drawing sheets" style={s.row}>{traceSheets.map(item => <Pressable key={item.id} accessibilityRole="tab" accessibilityLabel={`${item.id} sheet`} aria-selected={item.id === sheetId} accessibilityState={{ selected: item.id === sheetId }} onPress={() => setSheetId(item.id)} style={[s.sheetTab, item.id === sheetId && s.selected]}><Text style={s.tag}>{item.id}</Text><Text style={s.small}>{item.title}</Text></Pressable>)}</View>
      <Text style={s.body}>Tags and A/B locations are defined only for this exercise. The LIGHT sheet contains a switched indicator path. COIL contains a separate relay command path.</Text>
    </View>
    <View style={s.card}>
      <Text accessibilityRole="header" style={s.heading}>{sheet.id} / {sheet.title}</Text>
      <Text style={s.small}>TOP TO BOTTOM: DOCUMENTED PATH ORDER</Text>
      {sheet.nodes.map((node, index) => {
        const visited = trace.visited.includes(node.id);
        const target = node.reference && traceSheets.find(item => item.id === node.reference!.sheet)?.nodes.find(item => item.id === node.reference!.node);
        return <React.Fragment key={node.id}>
          {index > 0 && <View style={s.connector}><Text style={s.connectorText}>↓</Text></View>}
          <Pressable accessibilityRole="button" accessibilityLabel={`${node.tag}, ${sheet.id} ${node.location}`} accessibilityState={{ disabled: complete }} disabled={complete} onPress={() => { setTrace(previous => selectTraceNode(previous, sheetId, node.id)); onNavigate(); }} style={({ pressed }) => [s.node, visited && s.selected, pressed && { opacity: 0.7 }]}>
            <View style={s.nodeTop}><Text style={s.symbol}>{node.symbol}</Text><Text style={s.small}>{sheet.id} / {node.location}{visited ? ' · FOUND' : ''}</Text></View>
            <Text style={s.tag}>{node.tag}</Text><Text style={s.body}>{node.name}</Text>
            {target && node.reference && <Text style={s.reference}>DEVICE ASSOCIATION → {node.reference.sheet} / {target.location} ({target.tag}){"\n"}Relationship only; no conductor connection.</Text>}
          </Pressable>
        </React.Fragment>;
      })}
      <Text style={s.body}>An arrow here orders the tiles within one path. A device-association reference links a coil and contact conceptually, without electrically joining their terminals. The 0 V return is not automatically protective earth.</Text>
    </View>
    <Pressable accessibilityRole="button" onPress={() => { setTrace(initialTrace); setSheetId('LIGHT'); onNavigate(); }} style={s.restart}><Text style={s.restartText}>Restart tracing practice</Text></Pressable>
  </>;
}

const s = StyleSheet.create({
  label: { color: '#D6FA68', fontSize: 10, lineHeight: 17, letterSpacing: 1.4, fontWeight: '800' },
  title: { color: '#F3F6FA', fontSize: 34, lineHeight: 41, letterSpacing: -1, fontWeight: '800' },
  body: { color: '#A6B4C6', fontSize: 15, lineHeight: 24 }, small: { color: '#A6B4C6', fontSize: 10, lineHeight: 17, letterSpacing: 0.5 },
  notice: { backgroundColor: '#192B30', borderLeftWidth: 3, borderColor: '#D6FA68', padding: 20, borderRadius: 10, gap: 12 },
  card: { backgroundColor: '#142131', borderWidth: 1, borderColor: '#29394B', padding: 22, borderRadius: 16, gap: 16 },
  heading: { color: '#F3F6FA', fontSize: 22, lineHeight: 29, fontWeight: '700' }, prompt: { color: '#F3F6FA', fontSize: 17, lineHeight: 26 },
  feedback: { borderLeftWidth: 3, borderColor: '#D6FA68', padding: 14, gap: 8, backgroundColor: '#192B30', borderRadius: 6 },
  feedbackTitle: { color: '#F3F6FA', fontSize: 15, fontWeight: '700' }, row: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  sheetTab: { flexGrow: 1, minHeight: 64, borderWidth: 1, borderColor: '#44566D', padding: 14, borderRadius: 10, gap: 5 },
  selected: { borderColor: '#D6FA68', backgroundColor: '#243A2E' }, tag: { color: '#F3F6FA', fontSize: 16, fontWeight: '800' },
  node: { backgroundColor: '#0F1C2B', padding: 18, borderWidth: 1, borderColor: '#44566D', borderRadius: 12, gap: 9, minHeight: 85 },
  nodeTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' },
  symbol: { color: '#9BC7FF', fontSize: 23, fontWeight: '600' }, reference: { color: '#D6FA68', fontSize: 11, lineHeight: 19 },
  connector: { alignItems: 'center', marginVertical: -10 }, connectorText: { color: '#A6B4C6', fontSize: 20 },
  restart: { backgroundColor: '#D6FA68', borderRadius: 11, padding: 16, minHeight: 52, alignItems: 'center', justifyContent: 'center' },
  restartText: { color: '#0B1420', fontSize: 15, fontWeight: '800', textAlign: 'center' },
});
