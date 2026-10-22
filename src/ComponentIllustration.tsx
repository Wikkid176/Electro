import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { workshopComponents, type ComponentId } from './components';
import { componentArtFrame, componentAtlasSize } from './component-art';

const artwork = require('../assets/component-art-atlas.png');

export function ComponentIllustration({ id, active = false, defect = false, showParts = false, selectedPart, onSelectPart, hideIdentity = false }: {
  id: ComponentId; active?: boolean; defect?: boolean; showParts?: boolean; selectedPart?: string | null;
  onSelectPart?: (part: string) => void; hideIdentity?: boolean;
}) {
  const [width, setWidth] = useState(280);
  const component = workshopComponents.find(item => item.id === id)!;
  const scale = Math.min(width, 360) / 300;
  const height = 270 * scale;
  const frame = componentArtFrame(id, active, defect);
  const fit = Math.min(284 / frame.width, 254 / frame.height);
  const artWidth = frame.width * fit;
  const artHeight = frame.height * fit;
  return <View testID={`illustration-${id}`} onLayout={event => setWidth(event.nativeEvent.layout.width)} style={{ width: '100%', height, overflow: 'hidden' }}>
    <View style={{ position: 'absolute', width: 300, height: 270, top: (height - 270) / 2, left: (width - 300) / 2, transform: [{ scale }] }}>
      <View accessible accessibilityRole="image" accessibilityLabel={hideIdentity ? 'Original component illustration for identification' : `${component.name}, ${component.states[Number(active)]}${defect ? ', inspection finding shown' : ''}`} style={StyleSheet.absoluteFill}>
        <View testID="generated-component-art" style={{ position: 'absolute', left: (300 - artWidth) / 2, top: (270 - artHeight) / 2, width: artWidth, height: artHeight, overflow: 'hidden' }}>
          <Image testID="component-art-image" source={artwork} accessible={false} resizeMode="stretch" style={{ position: 'absolute', width: componentAtlasSize.width * fit, height: componentAtlasSize.height * fit, left: -frame.x * fit, top: -frame.y * fit }} />
        </View>
        {id === 'drive' && <Text style={[s.display, { color: active && !defect ? '#11221C' : '#BACACD' }]}>{active && !defect ? 'RUN' : 'STOP'}</Text>}
        {id === 'terminal' && !defect && <Text style={s.marker}>X·7</Text>}
      </View>
      {showParts && component.parts.map((part, i) => {
        const dx = (part.target?.x ?? part.x) - part.x;
        const dy = (part.target?.y ?? part.y) - part.y;
        const length = Math.hypot(dx, dy);
        return <React.Fragment key={part.id}>
          {length > 0 && <View pointerEvents="none" style={{ position: 'absolute', left: part.x + dx / 2 - length / 2, top: part.y + dy / 2, width: length, height: 1, backgroundColor: '#9BC7FF', transform: [{ rotate: `${Math.atan2(dy, dx)}rad` }] }} />}
          <Pressable accessibilityRole="button" accessibilityLabel={hideIdentity ? `Select area ${i + 1}` : `Diagram part ${i + 1}: ${part.name}`} accessibilityState={{ selected: selectedPart === part.id, disabled: !onSelectPart }} disabled={!onSelectPart} aria-pressed={selectedPart === part.id} aria-disabled={!onSelectPart} hitSlop={14} onPress={() => onSelectPart?.(part.id)} style={[s.pin, { left: part.x - 15, top: part.y - 15 }, selectedPart === part.id && s.selectedPin]}><Text style={s.pinText}>{i + 1}</Text></Pressable>
        </React.Fragment>;
      })}
    </View>
  </View>;
}
const s = StyleSheet.create({
  pin: { position: 'absolute', width: 30, height: 30, borderRadius: 15, backgroundColor: '#D6FA68', borderWidth: 2, borderColor: '#0B1420', alignItems: 'center', justifyContent: 'center' },
  selectedPin: { backgroundColor: '#9BC7FF', borderColor: '#FFFFFF' },
  pinText: { color: '#0B1420', fontWeight: '900', fontSize: 13 },
  display: { position: 'absolute', left: 128, top: 58, width: 68, fontSize: 13, fontWeight: '800', textAlign: 'center', letterSpacing: 2 },
  marker: { position: 'absolute', left: 147, top: 119, width: 45, fontSize: 12, fontWeight: '800', textAlign: 'center', color: '#172531' },
});
