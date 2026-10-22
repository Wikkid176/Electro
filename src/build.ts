export const release = { version: '0.5.1', label: '0.5.1-beta.5', studySchema: 1 } as const;
// Cosmetic icon update: the beta4 training and measurement rules are unchanged.
export const isCompatibleStudyBuild = (build: string): boolean => [release.label, '0.5.0-beta.4'].includes(build);
