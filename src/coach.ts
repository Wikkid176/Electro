export type CoachMood = 'welcome' | 'think' | 'encourage' | 'celebrate';
export const coachAtlasSize = { width: 1294, height: 1216 };
export const coachFrames: Record<CoachMood, { x: number; y: number; width: number; height: number }> = {
  welcome: { x: 0, y: 0, width: 647, height: 608 },
  think: { x: 647, y: 0, width: 647, height: 608 },
  encourage: { x: 0, y: 608, width: 647, height: 608 },
  celebrate: { x: 647, y: 608, width: 647, height: 608 },
};
export function coachHint(category: string): string {
  const label = category.toUpperCase();
  if (/SAFETY|FOUNDATIONS/.test(label)) return 'Separate what you observe from what you can prove. Look for the answer that respects the task-specific safe-work process and the limits of an indication.';
  if (/METER|MEASUREMENT/.test(label)) return 'Check the quantity, reference, instrument function, and model assumptions. A displayed number is evidence to interpret, not a complete diagnosis.';
  if (/REFERENCE|STANDARD/.test(label)) return 'Start with the question, then match the exact scope, model, and applicable document revision. A familiar-looking source is only a lead.';
  if (/SCHEMATIC|DRAWING/.test(label)) return 'Read the legend and follow the documented path, including its return. Ask whether a reference represents a conductor connection or a device relationship.';
  if (/PANEL/.test(label)) return 'Compare the observation with the controlled design and exact component requirements. Appearance alone cannot establish compatibility or acceptance.';
  if (/MOTION|MOTOR/.test(label)) return 'Keep a command, an indication, and physical motion separate. Think about the load and stored energy before concluding what a state means.';
  if (/SENSOR|I\/O/.test(label)) return 'Follow the evidence from the process to the sensor, interface, and controller. Check signal validity and units before trusting the process value.';
  if (/TROUBLESHOOT/.test(label)) return 'Name the assumption your theory depends on. Choose the conclusion supported by the evidence, and leave unproven causes open.';
  return 'Read the conditions carefully, check the units, and explain why your choice fits. A useful answer includes its assumptions.';
}
