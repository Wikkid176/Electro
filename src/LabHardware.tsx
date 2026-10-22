import React from 'react';
import Svg, { Circle, Defs, Ellipse, G, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';
import type { Hardware } from './wiring';
import type { MotorState } from './engine';
import { View } from 'react-native';

// Generic, original hardware. No product marks, reference pictures or print geometry.
export function MetalDefs({ id }: { id: string }) {
  return <Defs>
    <LinearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#D8DEE0" /><Stop offset="0.45" stopColor="#87979F" /><Stop offset="0.52" stopColor="#CBD2D4" /><Stop offset="1" stopColor="#52616B" /></LinearGradient>
    <LinearGradient id={`${id}-plastic`} x1="0" y1="0" x2="1" y2="0"><Stop offset="0" stopColor="#58656C" /><Stop offset="0.15" stopColor="#313C42" /><Stop offset="0.8" stopColor="#1B242B" /><Stop offset="1" stopColor="#64727A" /></LinearGradient>
    <LinearGradient id={`${id}-ivory`} x1="0" y1="0" x2="1" y2="0"><Stop offset="0" stopColor="#8C9A9E" /><Stop offset="0.12" stopColor="#E2E3DA" /><Stop offset="0.85" stopColor="#C0C6BF" /><Stop offset="1" stopColor="#76878B" /></LinearGradient>
    <LinearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#ADD3DF" stopOpacity="0.65" /><Stop offset="0.4" stopColor="#566F7E" stopOpacity="0.32" /><Stop offset="1" stopColor="#BBDAE0" stopOpacity="0.55" /></LinearGradient>
  </Defs>;
}
export function Screw({ x, y, selected = false, id }: { x: number; y: number; selected?: boolean; id: string }) {
  return <G><Rect x={x - 18} y={y - 19} width={36} height={38} rx={4} fill="#17212A" stroke={selected ? '#D6FA68' : '#758D9A'} strokeWidth={selected ? 3 : 1} />
    <Rect x={x - 13} y={y - 14} width={26} height={28} rx={3} fill={`url(#${id}-ivory)`} />
    <Circle cx={x} cy={y} r={9} fill={`url(#${id}-steel)`} stroke="#35424A" strokeWidth={2} /><Line x1={x - 5} y1={y + 4} x2={x + 5} y2={y - 4} stroke="#27353E" strokeWidth={3} />
  </G>;
}
export function HardwareShape({ item, id, on = false, operated = false }: { item: Hardware; id: string; on?: boolean; operated?: boolean }) {
  const { x, y, kind } = item;
  const relay = kind === 'relay'; const h = relay ? 204 : kind === 'supply' || kind === 'switch' || kind === 'stop' ? 160 : 174;
  return <G transform={`translate(${x},${y})`}>
    <Rect x={5} y={5} width={140} height={h} rx={8} fill="#060D12" opacity={0.6} />
    <Rect width={140} height={h} rx={7} fill={`url(#${id}-${kind === 'supply' ? 'steel' : 'plastic'})`} stroke="#A2AFB6" strokeWidth={1.3} />
    <Rect x={7} y={6} width={126} height={h - 12} rx={3} fill={kind === 'supply' ? '#C2CBCC' : '#202B33'} stroke="#53636C" />
    <Rect x={12} y={12} width={116} height={22} rx={2} fill="#E1E7DD" />
    <SvgText fontFamily="sans-serif" x={70} y={27} textAnchor="middle" fontSize={10} fontWeight="800" fill="#14212A">{item.label}</SvgText>
    {kind === 'supply' ? <>
      {Array.from({ length: 9 }, (_, i) => <Rect key={i} x={18 + i * 12} y={44} width={5} height={38} rx={2} fill="#4B5D67" />)}
      <Circle cx={25} cy={102} r={5} fill={on ? '#D6FA68' : '#33483A'} stroke="#172A25" /><SvgText fontFamily="sans-serif" x={39} y={106} fontSize={10} fill="#152A31">DC OK</SvgText>
      <SvgText fontFamily="sans-serif" x={70} y={124} textAnchor="middle" fontSize={9} fill="#24343C">+24 V        0 V</SvgText>
    </> : kind === 'relay' ? <>
      <Rect x={13} y={42} width={114} height={141} rx={5} fill={`url(#${id}-glass)`} stroke="#B1CED8" />
      <Rect x={41} y={88} width={58} height={49} rx={4} fill="#25323C" stroke="#CE8545" strokeWidth={3} />
      {Array.from({ length: 10 }, (_, i) => <Line key={i} x1={46 + i * 5} x2={46 + i * 5} y1={92} y2={133} stroke={on ? '#F0BA64' : '#A86C3B'} strokeWidth={2} />)}
      <Path d={`M32 161 L99 ${on ? 160 : 146}`} stroke="#E9DFC1" strokeWidth={5} fill="none" />
      <Circle cx={32} cy={161} r={5} fill="#C4CAC4" /><Circle cx={103} cy={161} r={5} fill="#C4CAC4" />
      <Line x1={70} y1={137} x2={70} y2={on ? 159 : 152} stroke="#D4E6EB" strokeDasharray="3 3" />
      <Path d="M18 49 L29 49 L117 133" stroke="#DDF7FF" opacity={0.35} strokeWidth={3} />
      <Circle cx={116} cy={110} r={5} fill={on ? '#FFA956' : '#4B3B2D'} />
    </> : <>
      <Circle cx={70} cy={85} r={41} fill={`url(#${id}-steel)`} stroke="#121C24" strokeWidth={3} />
      <Circle cx={70} cy={85} r={32} fill={kind === 'lamp' ? on ? '#BFFF5F' : '#25412C' : kind === 'start' ? '#367C5B' : kind === 'stop' ? '#B6403E' : '#17222B'} stroke="#63757D" strokeWidth={2} />
      <Ellipse cx={60} cy={72} rx={17} ry={8} fill="#FFFFFF" opacity={on && kind === 'lamp' ? 0.7 : 0.16} />
      {kind === 'switch' ? <G transform={`rotate(${operated ? 45 : -45},70,85)`}><Rect x={62} y={55} width={16} height={60} rx={5} fill="#080F16" stroke="#7E8C94" /><Line x1={70} y1={58} x2={70} y2={77} stroke="#DDE7E7" strokeWidth={3} /></G> : kind !== 'lamp' ? <SvgText fontFamily="sans-serif" x={70} y={91} textAnchor="middle" fontSize={16} fontWeight="800" fill="#F8FAF4">{kind === 'start' ? 'I' : 'O'}</SvgText> : null}
      <SvgText fontFamily="sans-serif" x={70} y={139} textAnchor="middle" fontSize={10} fill="#DDE7E7">{kind === 'lamp' ? on ? 'ILLUMINATED' : 'DARK' : kind === 'switch' ? operated ? 'ON' : 'OFF' : operated ? 'HELD' : 'REST'}</SvgText>
    </>}
  </G>;
}
export function MotorEquipment({ motor }: { motor: MotorState }) {
  const id = 'motor-hardware';
  return <ViewGraphic label={`Starter equipment: contactor ${motor.running ? 'pulled in' : 'released'}, motor ${motor.running ? 'running' : 'stopped'}, overload ${motor.overload ? 'tripped' : 'ready'}`}>
    <Svg width="100%" height="100%" viewBox="0 0 380 260" accessible={false}>
      <MetalDefs id={id} />
      <Rect x={1} y={1} width={378} height={258} rx={12} fill="#849299" stroke="#CBD4D7" />
      {Array.from({ length: 16 }, (_, i) => <Line key={i} x1={8} y1={15 + i * 16} x2={372} y2={15 + i * 16} stroke="#A1ADB1" opacity={0.45} />)}
      <Rect x={14} y={128} width={349} height={19} fill={`url(#${id}-steel)`} stroke="#4B5E67" />
      <Rect x={23} y={24} width={116} height={184} rx={6} fill={`url(#${id}-ivory)`} stroke="#2D414C" strokeWidth={2} />
      <Rect x={34} y={57} width={94} height={83} rx={4} fill={`url(#${id}-plastic)`} />
      <Rect x={51} y={motor.running ? 83 : 70} width={59} height={30} rx={3} fill={motor.running ? '#66895C' : '#71808A'} stroke="#D8E1DB" />
      <SvgText fontFamily="sans-serif" x={81} y={46} fontSize={11} textAnchor="middle" fill="#14212A">K1 CONTACTOR</SvgText>
      {[48, 81, 114].map(x => <React.Fragment key={x}><Screw x={x} y={23} id={id} /><Screw x={x} y={153} id={id} /><Path d={`M${x} 165 C${x} 235 190 165 233 ${173 + (x - 48) / 3}`} fill="none" stroke="#18252E" strokeWidth={7} /><Path d={`M${x} 165 C${x} 235 190 165 233 ${173 + (x - 48) / 3}`} fill="none" stroke="#9B7453" strokeWidth={3} /></React.Fragment>)}
      <Rect x={34} y={176} width={94} height={38} rx={4} fill="#24313A" /><Circle cx={52} cy={194} r={9} fill={motor.overload ? '#FFBA73' : '#597465'} /><SvgText fontFamily="sans-serif" x={70} y={198} fontSize={9} fill="#F2F5F6">{motor.overload ? 'OL TRIP' : 'OL READY'}</SvgText>
      <Rect x={229} y={121} width={108} height={101} rx={14} fill={`url(#${id}-steel)`} stroke="#304651" strokeWidth={2} />
      {Array.from({ length: 9 }, (_, i) => <Rect key={i} x={239 + i * 10} y={130} width={4} height={80} rx={2} fill="#607780" />)}
      <Ellipse cx={235} cy={172} rx={19} ry={49} fill={`url(#${id}-plastic)`} stroke="#A8BDC6" /><Ellipse cx={337} cy={172} rx={13} ry={43} fill={`url(#${id}-steel)`} stroke="#3B505C" />
      <Rect x={330} y={166} width={30} height={12} fill="#AAB9BF" stroke="#405560" />
      <Rect x={251} y={218} width={67} height={10} fill="#334B57" />
      <SvgText fontFamily="sans-serif" x={281} y={101} fontSize={12} textAnchor="middle" fill="#122B34">M1 / {motor.running ? 'RUNNING' : 'STOPPED'}</SvgText>
      <SvgText fontFamily="sans-serif" x={190} y={246} fontSize={9} textAnchor="middle" fill="#142D36">EQUIPMENT VIEW · SIMPLIFIED MODEL</SvgText>
    </Svg>
  </ViewGraphic>;
}
function ViewGraphic({ label, children }: { label: string; children: React.ReactNode }) { return <View accessibilityRole="image" accessibilityLabel={label} style={{ width: '100%', maxWidth: 600, alignSelf: 'center', aspectRatio: 380 / 260 }}>{children}</View>; }
