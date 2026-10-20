import type { ComponentId } from './components.ts';

// Source rectangles select images at render time. The generated PNG is retained
// unchanged; framing compensates for the atlas's nonuniform transparent gutters.
export const componentAtlasSize = { width: 1121, height: 1403 };
export type ArtFrame = { x: number; y: number; width: number; height: number };
const frame = (column: number, y: number, height: number): ArtFrame => ({ x: column * componentAtlasSize.width / 4, y, width: componentAtlasSize.width / 4, height });
export const componentArt: Record<ComponentId, { states: [ArtFrame, ArtFrame]; defect?: ArtFrame }> = {
  breaker: { states: [frame(0, 0, 275), frame(1, 0, 275)], defect: frame(3, 1040, 275) },
  contactor: { states: [frame(2, 0, 275), frame(3, 0, 275)] },
  relay: { states: [frame(0, 275, 253), frame(1, 275, 253)] },
  terminal: { states: [frame(2, 275, 253), frame(3, 275, 253)], defect: frame(0, 1060, 253) },
  transformer: { states: [frame(0, 528, 249), frame(1, 528, 249)] },
  motor: { states: [frame(2, 528, 249), frame(3, 528, 249)], defect: frame(1, 1066, 249) },
  drive: { states: [frame(0, 777, 275), frame(1, 777, 275)], defect: frame(2, 1046, 275) },
  sensor: { states: [frame(2, 777, 275), frame(3, 777, 275)] },
};
export function componentArtFrame(id: ComponentId, active: boolean, defect: boolean): ArtFrame {
  const art = componentArt[id];
  return defect && art.defect ? art.defect : art.states[Number(active)];
}
