import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText, TSpan } from 'react-native-svg';
import type { TeachingLesson } from './teaching/types';

const c = { bg: '#0B1725', panel: '#1B3045', line: '#52738B', ink: '#DFEBF8', lime: '#D6FA68', blue: '#8ECFFF', orange: '#FFBC78' };

function lines(text: string, width = 19) {
  const result: string[] = []; let line = '';
  for (const word of text.split(' ')) {
    if (line && (line + ' ' + word).length > width) { result.push(line); line = word; }
    else line += (line ? ' ' : '') + word;
  }
  if (line) result.push(line);
  return result.slice(0, 3).map((value, index) => index === 2 && result.length > 3 ? value + '…' : value);
}

function Caption({ x, y, text, color = c.ink, size = 15, width = 19 }: { x: number; y: number; text: string; color?: string; size?: number; width?: number }) {
  return <SvgText x={x} y={y} fill={color} fontSize={size} fontWeight="700" textAnchor="middle">
    {lines(text, width).map((line, index) => <TSpan key={index} x={x} dy={index ? size + 4 : 0}>{line}</TSpan>)}
  </SvgText>;
}

export function DeviceGlyph({ x, y, label, active = false, operated = false, scale = 1 }: { x: number; y: number; label: string; active?: boolean; operated?: boolean; scale?: number }) {
  const color = active ? c.lime : c.blue;
  const key = label.toLowerCase();
  let drawing: React.ReactNode;
  if (/capacitor|charge|dc link/.test(key)) drawing = <><Line x1={-34} y1={0} x2={-7} y2={0} /><Line x1={7} y1={0} x2={34} y2={0} /><Line x1={-7} y1={-25} x2={-7} y2={25} /><Line x1={7} y1={-25} x2={7} y2={25} /></>;
  else if (/battery|backup/.test(key)) drawing = <><Rect x={-26} y={-20} width={52} height={40} rx={5} /><Rect x={26} y={-8} width={7} height={16} /><Line x1={-16} y1={0} x2={-3} y2={0} /><Line x1={-9} y1={-7} x2={-9} y2={7} /><Line x1={10} y1={0} x2={20} y2={0} /></>;
  else if (/air|pressure|reservoir/.test(key)) drawing = <><Rect x={-28} y={-10} width={56} height={32} rx={12} /><Circle cx={0} cy={-22} r={12} /><Path d="M 0 -22 L 6 -28 M -18 22 L -18 29 M 18 22 L 18 29" /></>;
  else if (/raised|gravity|lift|suspended/.test(key)) drawing = <><Line x1={-30} y1={-27} x2={30} y2={-27} /><Line x1={0} y1={-27} x2={0} y2={-8} /><Rect x={-23} y={-8} width={46} height={30} rx={3} /><Path d="M 0 27 L 0 42 M -7 35 L 0 42 L 7 35" /></>;
  else if (/motor|axis|rotor|motion/.test(key)) drawing = <><Circle r={25} /><SvgText x={0} y={9} fill={color} strokeWidth={0} textAnchor="middle" fontSize={25} fontWeight="800">M</SvgText><Line x1={25} y1={0} x2={38} y2={0} /><Path d="M -16 29 L -23 35 L 23 35 L 16 29" /></>;
  else if (/contact|relay|switch|stop|start|enable/.test(key)) drawing = <><Line x1={-35} y1={8} x2={-17} y2={8} /><Circle cx={-13} cy={8} r={4} /><Circle cx={20} cy={8} r={4} /><Line x1={24} y1={8} x2={36} y2={8} /><Line x1={-10} y1={5} x2={17} y2={operated ? 8 : -13} /></>;
  else if (/lamp|indicator/.test(key)) drawing = <><Circle r={25} /><Path d="M -17 -17 L 17 17 M 17 -17 L -17 17 M -36 0 H -25 M 25 0 H 36" /></>;
  else if (/coil|field|magnet|turn/.test(key)) drawing = <><Path d="M -34 5 L -24 5 C -24 -26 -12 -26 -12 5 C -12 -26 0 -26 0 5 C 0 -26 12 -26 12 5 C 12 -26 24 -26 24 5 L 34 5" /><Line x1={-24} y1={18} x2={24} y2={18} /></>;
  else if (/source|supply|electrical|primary|incoming/.test(key)) drawing = <><Circle r={28} /><Path d="M 5 -22 L -13 3 L 0 3 L -4 22 L 16 -6 L 3 -6 Z" fill={color} strokeWidth={1} /></>;
  else if (/sensor|feedback|input|target/.test(key)) drawing = <><Rect x={-31} y={-17} width={39} height={34} rx={5} /><Line x1={-43} y1={0} x2={-31} y2={0} /><Path d="M 17 -12 Q 33 0 17 12 M 27 -22 Q 51 0 27 22" /><Circle cx={-10} cy={0} r={6} fill={active ? color : 'none'} /></>;
  else if (/resist|ohm|Ω|load/.test(key)) drawing = <><Path d="M -39 0 L -27 0 L -21 -12 L -9 12 L 3 -12 L 15 12 L 21 0 L 39 0" /></>;
  else if (/return/.test(key)) drawing = <><Path d="M 28 -15 H -12 Q -31 -15 -31 4 Q -31 23 -12 23 H 18 M 17 12 L 29 23 L 17 34" /></>;
  else if (/bond|earth/.test(key)) drawing = <><Path d="M 0 -27 L 0 3 M -29 3 L 29 3 M -20 14 L 20 14 M -10 25 L 10 25" /></>;
  else if (/time|sample|second|[0-9] s/.test(key)) drawing = <><Circle r={26} /><Path d="M 0 -17 L 0 0 L 15 8 M -8 -34 L 8 -34" /></>;
  else drawing = <><Rect x={-27} y={-26} width={54} height={52} rx={8} /><Path d="M -15 -13 L 15 -13 M -15 0 L 8 0 M -15 13 L 17 13" /><Circle cx={29} cy={24} r={11} fill={c.panel} /></>;
  return <G transform={`translate(${x} ${y}) scale(${scale})`} stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none">{drawing}</G>;
}

export function LessonGraphic({ visual, selected, onSelect }: { visual: TeachingLesson['visual']; selected: number; onSelect: (index: number) => void }) {
  const count = visual.nodes.length;
  const current = visual.nodes[selected];
  const node = (index: number, x: number, y: number, width = 190) => {
    const item = visual.nodes[index]; const active = index === selected;
    return <G key={index} id={`graphic-node-${index}`} onPress={() => onSelect(index)}>
      <Rect x={x - width / 2} y={y - 45} width={width} height={98} rx={16} fill={active ? '#2A403B' : c.panel} stroke={active ? c.lime : c.line} strokeWidth={active ? 3 : 1.5} />
      <Circle cx={x - width / 2 + 19} cy={y - 24} r={10} fill={active ? c.lime : c.line} />
      <SvgText x={x - width / 2 + 19} y={y - 20} fill={c.bg} textAnchor="middle" fontSize={12} fontWeight="800">{index + 1}</SvgText>
      <DeviceGlyph x={x - width / 2 + 35} y={y + 15} label={item.label} active={active} scale={0.55} />
      <Caption x={x + 20} y={y - 14} text={item.label} size={13} width={15} />
      {!!item.value && <Caption x={x + 15} y={y + 37} text={item.value} color={active ? c.lime : c.blue} size={12} width={20} />}
    </G>;
  };
  let scene: React.ReactNode;
  if (visual.kind === 'energy') {
    const positions = [[105, 70], [375, 70], [105, 273], [375, 273]];
    scene = <>
      <G stroke={c.line} strokeWidth={3}>{positions.slice(0, count).map(([x, y], i) => <Line key={i} x1={240} y1={170} x2={x} y2={y} stroke={selected === i ? c.lime : c.line} strokeDasharray="7 6" />)}</G>
      <Rect x={205} y={120} width={70} height={106} rx={9} fill="#2B4559" stroke={c.blue} strokeWidth={2} />
      <Rect x={218} y={134} width={42} height={22} rx={3} fill="#101E2C" /><Circle cx={253} cy={173} r={5} fill={c.lime} />
      {[188, 196, 204].map(y => <Line key={y} x1={217} y1={y} x2={260} y2={y} stroke={c.line} strokeWidth={3} />)}
      {positions.slice(0, count).map(([x, y], i) => node(i, x, y, 178))}
    </>;
  } else if (visual.kind === 'scale') {
    scene = <>
      <Path d="M 45 35 L 45 260 L 450 260" stroke={c.line} strokeWidth={2} fill="none" />
      {[0, 0.5, 1].map(level => <Line key={level} x1={45} y1={260 - 205 * level} x2={450} y2={260 - 205 * level} stroke={c.line} strokeWidth={1} strokeDasharray="4 6" />)}
      {visual.nodes.map((item, i) => { const x = 115 + i * 135; const height = 205 * (item.level ?? 0); return <G key={i} onPress={() => onSelect(i)}>
        <Rect x={x - 33} y={55} width={66} height={205} rx={8} fill={c.panel} />
        <Rect x={x - 33} y={260 - Math.max(3, height)} width={66} height={Math.max(3, height)} rx={6} fill={i === selected ? c.lime : c.blue} />
        <Circle cx={x} cy={260 - height} r={6} fill={c.orange} />
        <Caption x={x} y={30} text={item.value ?? ''} color={i === selected ? c.lime : c.ink} size={15} width={13} />
        <Caption x={x} y={290} text={item.label} size={15} width={14} />
      </G>; })}
    </>;
  } else if (visual.kind === 'meter') {
    scene = <>
      <Rect x={127} y={23} width={226} height={290} rx={29} fill="#34526A" stroke={c.orange} strokeWidth={6} />
      <Rect x={148} y={45} width={184} height={72} rx={8} fill="#C8E1CB" />
      <SvgText x={240} y={92} fontSize={34} fill="#153829" fontWeight="800" textAnchor="middle">{current.value}</SvgText>
      <Circle cx={240} cy={200} r={52} fill={c.bg} stroke={c.line} strokeWidth={5} />
      <G transform={`rotate(${-65 + selected * 55} 240 200)`}><Rect x={234} y={156} width={12} height={45} rx={5} fill={c.lime} /></G>
      {[-50, 0, 50].map((angle, i) => <G key={i} transform={`rotate(${angle} 240 200)`}><Line x1={240} y1={137} x2={240} y2={129} stroke={c.ink} strokeWidth={3} /></G>)}
      <Circle cx={203} cy={281} r={11} fill="#07101B" stroke={c.ink} strokeWidth={2} /><Circle cx={274} cy={281} r={11} fill="#07101B" stroke="#E48C8C" strokeWidth={2} />
      <Caption x={240} y={335} text={current.label} size={13} width={40} />
    </>;
  } else if (visual.kind === 'document') {
    scene = <>
      {visual.nodes.map((item, i) => { const x = count === 4 ? 16 + i * 114 : 52 + i * 136; return <G key={i} onPress={() => onSelect(i)}>
        <Path d={`M ${x} 45 H ${x + 77} L ${x + 106} 74 V 250 H ${x} Z`} fill={i === selected ? '#28413D' : c.panel} stroke={i === selected ? c.lime : c.line} strokeWidth={2.5} />
        <Path d={`M ${x + 77} 45 V 74 H ${x + 106}`} stroke={c.line} fill="none" />
        <Rect x={x + 13} y={94} width={78} height={24} rx={4} fill={i === selected ? c.lime : c.line} />
        <SvgText x={x + 52} y={111} textAnchor="middle" fill={c.bg} fontSize={12} fontWeight="800">CARD {i + 1}</SvgText>
        {[139, 154, 169].map((y, j) => <Line key={y} x1={x + 14} y1={y} x2={x + 89 - j * 9} y2={y} stroke={c.line} strokeWidth={3} />)}
        <Caption x={x + 53} y={202} text={item.value ?? item.label} size={12} width={12} color={i === selected ? c.lime : c.ink} />
        <Caption x={x + 53} y={280} text={item.label} size={13} width={15} />
      </G>; })}
      <Circle cx={420} cy={235} r={27} stroke={c.blue} strokeWidth={6} fill="#0B1725C0" /><Line x1={439} y1={254} x2={462} y2={277} stroke={c.blue} strokeWidth={9} strokeLinecap="round" />
    </>;
  } else if (visual.kind === 'timeline') {
    scene = <>
      <Line x1={48} y1={160} x2={435} y2={160} stroke={c.line} strokeWidth={5} />
      {visual.nodes.map((item, i) => { const x = 60 + i * (360 / Math.max(1, count - 1)); return <G key={i} onPress={() => onSelect(i)}>
        <Circle cx={x} cy={160} r={i === selected ? 14 : 10} fill={i === selected ? c.lime : c.blue} />
        <Line x1={x} y1={160} x2={x} y2={i % 2 ? 221 : 98} stroke={c.line} strokeWidth={2} />
        <DeviceGlyph x={x} y={i % 2 ? 252 : 65} label={item.label} active={i === selected} scale={0.6} />
        <Caption x={x} y={i % 2 ? 300 : 25} text={item.label} size={11} width={13} />
        <Caption x={x} y={i % 2 ? 205 : 118} text={item.value ?? ''} size={11} width={12} color={c.orange} />
      </G>; })}
    </>;
  } else {
    const positions = count === 3 ? [[120, 75], [365, 172], [120, 268]] : [[120, 75], [365, 75], [365, 268], [120, 268]];
    scene = <>
      {positions.slice(0, count - (visual.kind === 'loop' ? 0 : 1)).map(([x, y], i) => { const [nx, ny] = positions[(i + 1) % count]; return <G key={i}>
        <Line x1={x} y1={y} x2={nx} y2={ny} stroke={i === selected ? c.lime : c.line} strokeWidth={3} strokeDasharray={visual.kind === 'compare' ? '5 7' : undefined} />
        <Circle cx={(x + nx) / 2} cy={(y + ny) / 2} r={5} fill={c.blue} />
      </G>; })}
      {positions.slice(0, count).map(([x, y], i) => node(i, x, y))}
      {visual.kind === 'loop' && <G><Circle cx={240} cy={172} r={29} fill={c.bg} stroke={c.line} /><Path d="M 226 176 A 17 17 0 1 1 251 184 M 251 184 L 252 171 M 251 184 L 238 185" fill="none" stroke={c.lime} strokeWidth={3} /></G>}
    </>;
  }
  return <View testID="lesson-graphic" accessibilityRole="image" accessibilityLabel={`${visual.title}. Selected: ${current.label}. ${current.detail}`} style={s.board}>
    <Svg width="100%" height={270} viewBox="0 0 480 350" accessible={false}>
      <Rect width={480} height={350} rx={20} fill={c.bg} />
      {[40, 100, 160, 220, 280, 340, 400, 460].map(x => <Line key={x} x1={x} y1={0} x2={x} y2={350} stroke="#14273A" strokeWidth={1} />)}
      {scene}
    </Svg>
  </View>;
}

const s = StyleSheet.create({ board: { borderRadius: 16, borderWidth: 1, borderColor: '#36546A', overflow: 'hidden', backgroundColor: c.bg } });
