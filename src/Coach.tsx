import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { brand } from './brand';
import { coachAtlasSize, coachFrames, type CoachMood } from './coach';

const artwork = require('../assets/relay-coach-atlas.png');
export function CoachPortrait({ mood = 'welcome', size = 96 }: { mood?: CoachMood; size?: number }) {
  const frame = coachFrames[mood];
  const scale = size / frame.width;
  const height = frame.height * scale;
  return <View testID={`coach-${mood}`} accessible={false} importantForAccessibility="no-hide-descendants" aria-hidden style={{ width: size, height, overflow: 'hidden', flexShrink: 0 }}>
    <Image testID="coach-art-image" accessible={false} source={artwork} resizeMode="stretch" style={{ position: 'absolute', left: -frame.x * scale, top: -frame.y * scale, width: coachAtlasSize.width * scale, height: coachAtlasSize.height * scale }} />
  </View>;
}
export function CoachNote({ mood = 'think', message }: { mood?: CoachMood; message: string }) {
  return <View accessibilityLiveRegion="polite" style={s.note}>
    <CoachPortrait mood={mood} size={88} />
    <View style={{ flex: 1, minWidth: 0, gap: 6 }}><Text style={s.label}>{brand.coachLabel.toUpperCase()}</Text><Text style={s.body}>{message}</Text></View>
  </View>;
}
const s = StyleSheet.create({
  note: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#43605D', backgroundColor: '#192B30', alignItems: 'center' },
  label: { color: '#D6FA68', fontSize: 10, lineHeight: 17, fontWeight: '800', letterSpacing: 1.1 },
  body: { color: '#C3D0DD', fontSize: 14, lineHeight: 22 },
});
